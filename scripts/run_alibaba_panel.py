#!/usr/bin/env python3
"""Run one evidence package through Qwen, GLM, and DeepSeek on Model Studio.

Credentials are read only from DASHSCOPE_API_KEY. The script writes attributed
JSON records and never prints or persists the key.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CASE = ROOT / "web/src/data/uae-us-ai-infrastructure.fixture.json"
DEFAULT_OUTPUT = ROOT / "data/model_runs/alibaba-uae-us-panel.json"
DEFAULT_BASE_URL = "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1"
MODELS = ("qwen3.8-max", "glm-5.2", "deepseek-v4-pro")

SYSTEM = """You are one perspective in an evidence-first geopolitical AI evaluation.
Separate observable claims from interpretation. Do not infer national intent from provider
identity. Return JSON only with these keys: assessment (string), confidence (number 0..1),
drivers (array of strings), counterarguments (array of strings), assumptions (array of strings),
missing_evidence (array of strings), capability_delta (up|down|mixed|unclear),
dependency_delta (up|down|mixed|unclear), optionality_delta (up|down|mixed|unclear)."""


def evidence_package(case: dict) -> dict:
    as_of = case["meta"]["t1"]
    return {
        "case_id": case["meta"]["case_id"],
        "as_of": as_of,
        "question": "How does this trajectory change UAE AI capability, dependency, control, and optionality?",
        "nodes": case["nodes"],
        "edges": [edge for edge in case["edges"] if edge["valid_from"] <= as_of],
        "facts": [fact for fact in case["facts"] if fact["recorded_at"] <= as_of],
        "sources": case["sources"],
    }


def call_model(base_url: str, key: str, model: str, package: dict) -> dict:
    body = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": json.dumps(package, ensure_ascii=False)},
        ],
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }).encode("utf-8")
    request = urllib.request.Request(
        f"{base_url.rstrip('/')}/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=180) as response:
        payload = json.load(response)
    content = payload["choices"][0]["message"]["content"]
    assessment = json.loads(content)
    return {
        "requested_model": model,
        "returned_model": payload.get("model", model),
        "provider": "Alibaba Cloud Model Studio",
        "region": "ap-southeast-1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "assessment": assessment,
        "usage": payload.get("usage"),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--case", type=Path, default=DEFAULT_CASE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--base-url", default=os.getenv("DASHSCOPE_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--model", action="append", choices=MODELS, help="repeat to run a subset")
    args = parser.parse_args()

    key = os.getenv("DASHSCOPE_API_KEY")
    if not key:
        print("DASHSCOPE_API_KEY is not set; no provider calls were made.", file=sys.stderr)
        return 2

    case = json.loads(args.case.read_text(encoding="utf-8"))
    package = evidence_package(case)
    results = []
    for model in args.model or MODELS:
        print(f"Running {model}...", file=sys.stderr)
        try:
            results.append(call_model(args.base_url, key, model, package))
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, KeyError, json.JSONDecodeError) as exc:
            print(f"{model} failed: {exc}", file=sys.stderr)
            return 1

    record = {
        "schema_version": 1,
        "case_id": package["case_id"],
        "as_of": package["as_of"],
        "question": package["question"],
        "endpoint_host": args.base_url.split("//", 1)[-1].split("/", 1)[0],
        "prompt_version": "alibaba-panel-v1",
        "runs": results,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(results)} attributed runs to {args.output}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
