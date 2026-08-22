#!/usr/bin/env python3
"""Offline, three-minute Sovereign Lens long-horizon demo.

The analytical text is a transparent fixture. The temporal projection, prediction
ledger, calibration, and methodology review use the same SQLite code path intended
for the prototype.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
import time
from dataclasses import dataclass
from datetime import date
from pathlib import Path


CASE_ID = "uae_us_ai_infrastructure"
T0 = "2025-05-28"
T1 = "2026-07-01"


@dataclass(frozen=True)
class Snapshot:
    as_of: str
    exposed: tuple[sqlite3.Row, ...]
    superseded: tuple[sqlite3.Row, ...]
    digest: str


SCHEMA = """
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, publisher TEXT NOT NULL,
  url TEXT NOT NULL, published_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS facts (
  id TEXT PRIMARY KEY, case_id TEXT NOT NULL, subject TEXT NOT NULL,
  predicate TEXT NOT NULL, object TEXT NOT NULL, status TEXT NOT NULL,
  valid_from TEXT NOT NULL, valid_to TEXT, recorded_at TEXT NOT NULL,
  superseded_at TEXT, source_id TEXT NOT NULL REFERENCES sources(id)
);
CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY, case_id TEXT NOT NULL, perspective TEXT NOT NULL,
  assessment TEXT NOT NULL, confidence REAL NOT NULL,
  snapshot_hash TEXT NOT NULL, as_of TEXT NOT NULL, methodology_version TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS predictions (
  id TEXT PRIMARY KEY, case_id TEXT NOT NULL, assessment_id TEXT NOT NULL,
  claim TEXT NOT NULL, probability REAL NOT NULL, horizon_date TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL, status TEXT NOT NULL,
  resolved_at TEXT, observed_outcome TEXT, outcome_value INTEGER, brier REAL
);
CREATE TABLE IF NOT EXISTS methodology_lessons (
  id TEXT PRIMARY KEY, prediction_id TEXT NOT NULL, failure_surface TEXT NOT NULL,
  proposed_change TEXT NOT NULL, human_disposition TEXT NOT NULL,
  rationale TEXT NOT NULL, version_before TEXT NOT NULL, version_after TEXT NOT NULL,
  effective_from TEXT NOT NULL
);
"""


def connect(path: str = ":memory:") -> sqlite3.Connection:
    db = sqlite3.connect(path)
    db.row_factory = sqlite3.Row
    db.executescript(SCHEMA)
    return db


def seed_t0(db: sqlite3.Connection) -> None:
    db.execute(
        "INSERT OR IGNORE INTO sources VALUES (?, ?, ?, ?, ?)",
        (
            "uae_acceleration_2025",
            "Statement on the U.S.-UAE AI Acceleration Partnership",
            "UAE Embassy in Washington",
            "https://www.uae-embassy.org/news/statement-ambassador-yousef-al-otaiba-us-uae-ai-acceleration-partnership",
            T0,
        ),
    )
    db.execute(
        "INSERT OR IGNORE INTO facts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            "campus_capacity_planned",
            CASE_ID,
            "UAE-US AI Campus",
            "capacity",
            "200 MW planned in 2026 within a proposed 5 GW campus",
            "announced",
            T0,
            None,
            T0,
            None,
            "uae_acceleration_2025",
        ),
    )
    db.commit()


def ingest_t1(db: sqlite3.Connection) -> None:
    db.execute(
        "INSERT OR IGNORE INTO sources VALUES (?, ?, ?, ?, ?)",
        (
            "uae_progress_2026",
            "Pax Silica and the UAE-US Partnerships Turning AI Ambition into Reality",
            "UAE Embassy in Washington",
            "https://www.uae-embassy.org/news/pax-silica-and-uae-us-partnerships-turning-ai-ambition-reality",
            T1,
        ),
    )
    db.execute(
        "UPDATE facts SET valid_to = ?, superseded_at = ? WHERE id = ?",
        (T1, T1, "campus_capacity_planned"),
    )
    db.execute(
        "INSERT OR IGNORE INTO facts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            "campus_capacity_reported_operational",
            CASE_ID,
            "UAE-US AI Campus",
            "capacity",
            "500 MW reported online in 2026",
            "reported_operational",
            T1,
            None,
            T1,
            None,
            "uae_progress_2026",
        ),
    )
    db.commit()


def graph_snapshot(db: sqlite3.Connection, as_of: str) -> Snapshot:
    rows = tuple(
        db.execute(
            "SELECT * FROM facts WHERE case_id = ? AND recorded_at <= ? ORDER BY id",
            (CASE_ID, as_of),
        )
    )
    exposed = tuple(
        row for row in rows
        if row["valid_from"] <= as_of and (row["valid_to"] is None or as_of < row["valid_to"])
    )
    superseded = tuple(row for row in rows if row not in exposed)
    canonical = [dict(row) for row in exposed + superseded]
    digest = hashlib.sha256(json.dumps(canonical, sort_keys=True).encode()).hexdigest()[:12]
    return Snapshot(as_of, exposed, superseded, digest)


ASSESSMENT_FIXTURES = {
    "capability": (
        "The planned in-country campus could materially expand UAE access to regional AI compute.",
        0.72,
    ),
    "dependency": (
        "Capability may rise while dependency remains: U.S. firms, export approvals, chips, and cloud operations condition access.",
        0.78,
    ),
    "evidence_auditor": (
        "At this snapshot the capacity is announced, not operational; deployment evidence is still missing.",
        0.91,
    ),
}


def assess(db: sqlite3.Connection, snapshot: Snapshot) -> None:
    for perspective, (text, confidence) in ASSESSMENT_FIXTURES.items():
        db.execute(
            "INSERT OR REPLACE INTO assessments VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                f"assessment_{perspective}", CASE_ID, perspective, text, confidence,
                snapshot.digest, snapshot.as_of, "v1",
            ),
        )
    db.execute(
        "INSERT OR REPLACE INTO predictions VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL)",
        (
            "prediction_campus_operational",
            CASE_ID,
            "assessment_capability",
            "At least 200 MW of the UAE-US AI Campus will be reported operational by 2026-12-31.",
            0.65,
            "2026-12-31",
            snapshot.digest,
            "open",
        ),
    )
    db.commit()


def resolve(db: sqlite3.Connection, resolved_at: str) -> float:
    prediction = db.execute(
        "SELECT * FROM predictions WHERE id = ?", ("prediction_campus_operational",)
    ).fetchone()
    outcome = 1
    brier = (prediction["probability"] - outcome) ** 2
    db.execute(
        "UPDATE predictions SET status='resolved', resolved_at=?, observed_outcome=?, outcome_value=?, brier=? WHERE id=?",
        (
            resolved_at,
            "A UAE government source reported 500 MW online; independent operational confirmation remains desirable.",
            outcome,
            brier,
            prediction["id"],
        ),
    )
    db.execute(
        "INSERT OR REPLACE INTO methodology_lessons VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            "lesson_operational_corroboration",
            prediction["id"],
            "source_quality",
            "Require an independent operational signal before promoting reported_operational to verified_operational.",
            "accepted",
            "A participant-government progress report is strong evidence of its claim, but is not independent verification.",
            "v1",
            "v2",
            resolved_at,
        ),
    )
    db.commit()
    return brier


def pause(enabled: bool, seconds: float = 0.75) -> None:
    if enabled:
        time.sleep(seconds)


def show_snapshot(snapshot: Snapshot) -> None:
    print(f"\nGRAPH @ {snapshot.as_of}  snapshot={snapshot.digest}")
    for fact in snapshot.exposed:
        print(f"  CURRENT     [{fact['status']}] {fact['subject']}: {fact['object']}")
    for fact in snapshot.superseded:
        print(f"  SUPERSEDED  [{fact['status']}] {fact['subject']}: {fact['object']}")


def run_demo(db: sqlite3.Connection, paced: bool) -> None:
    print("SOVEREIGN LENS — LONG-HORIZON AGENT DEMO")
    print("Case: Does UAE compute access increase capability, dependency, or both?")
    seed_t0(db)
    before = graph_snapshot(db, T0)
    show_snapshot(before)
    assess(db, before)
    pause(paced)

    print("\nTHREE PERSPECTIVES — identical evidence snapshot")
    for row in db.execute("SELECT * FROM assessments ORDER BY perspective"):
        print(f"  {row['perspective']:16} {row['confidence']:.0%}  {row['assessment']}")
    prediction = db.execute("SELECT * FROM predictions").fetchone()
    print(f"\nPREDICTION LEDGER  {prediction['probability']:.0%}: {prediction['claim']}")
    pause(paced)

    print("\n⏩ Scaled clock advances thirteen months; later evidence arrives…")
    ingest_t1(db)
    after = graph_snapshot(db, T1)
    show_snapshot(after)
    brier = resolve(db, T1)
    pause(paced)

    lesson = db.execute("SELECT * FROM methodology_lessons").fetchone()
    print(f"\nCALIBRATION  resolved; Brier={brier:.4f}")
    print(f"HUMAN REVIEW [{lesson['human_disposition']}] {lesson['proposed_change']}")
    print(f"METHOD       {lesson['version_before']} → {lesson['version_after']} (history preserved)")
    print("\nThe agent does not rewrite what it knew. It learns what to demand next time.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", default=":memory:", help="SQLite path; defaults to an ephemeral demo")
    parser.add_argument("--paced", action="store_true", help="add short pauses for live presentation")
    args = parser.parse_args()
    if args.db != ":memory:":
        Path(args.db).parent.mkdir(parents=True, exist_ok=True)
    run_demo(connect(args.db), args.paced)


if __name__ == "__main__":
    main()
