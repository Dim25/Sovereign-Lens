#!/usr/bin/env python3
"""Small, inspectable partner-integration slice.

This intentionally emits portable records before calling any hosted service. Run:
    python3 -m integrations.micro --out /tmp/sovereign-lens-integrations
"""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


@dataclass(frozen=True)
class ReassessmentTask:
    task_id: str
    case_id: str
    due_at: str
    snapshot_hash: str
    operation: str = "verify_and_calibrate"


def temporal_record(task: ReassessmentTask) -> dict:
    """Payload accepted by the optional Temporal workflow or any other runner."""
    return {
        "integration": "temporal",
        "workflow_id": f"sovereign-lens/{task.task_id}",
        "task_queue": "sovereign-lens-reassessment",
        "task": asdict(task),
        "idempotency_key": hashlib.sha256(
            f"{task.case_id}:{task.due_at}:{task.snapshot_hash}".encode()
        ).hexdigest(),
    }


def stash_memory(task: ReassessmentTask) -> dict:
    """Portable memory unit suitable for Stash pages/VFS or a local filesystem."""
    return {
        "integration": "stash",
        "kind": "unresolved_research_question",
        "title": f"Reassess {task.case_id} at {task.due_at}",
        "case_id": task.case_id,
        "snapshot_hash": task.snapshot_hash,
        "source_ids": [],
        "status": "open",
        "memory_is_evidence": False,
        "retrieval_prompt": f"Find prior corrections and unresolved questions for {task.case_id}",
    }


def coframe_contract() -> dict:
    """Fields the presentation layer may vary and analytical fields it must lock."""
    return {
        "integration": "coframe",
        "variant_scope": ["headline", "explanation_order", "information_density", "cta_label"],
        "locked_fields": ["facts", "source_ids", "confidence", "assessment", "disagreement", "snapshot_hash"],
        "success_events": ["sl_evidence_opened", "sl_perspective_compared", "sl_horizon_viewed"],
    }


def write_demo(out: Path) -> list[Path]:
    out.mkdir(parents=True, exist_ok=True)
    task = ReassessmentTask(
        task_id="prediction_campus_operational",
        case_id="uae_us_ai_infrastructure",
        due_at="2026-12-31T09:00:00Z",
        snapshot_hash="08e5442e45ae",
    )
    records = {
        "temporal-workflow.json": temporal_record(task),
        "stash-memory.json": stash_memory(task),
        "coframe-contract.json": coframe_contract(),
    }
    written = []
    for name, record in records.items():
        path = out / name
        envelope = {"generated_at": datetime.now(timezone.utc).isoformat(), **record}
        path.write_text(json.dumps(envelope, indent=2) + "\n", encoding="utf-8")
        written.append(path)
    return written


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    for path in write_demo(args.out):
        print(path)


if __name__ == "__main__":
    main()
