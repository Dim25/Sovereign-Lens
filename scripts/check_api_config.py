#!/usr/bin/env python3
"""Report provider readiness without printing credential values or making API calls."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config" / "providers.json"


def load_dotenv(path: Path) -> None:
    """Load simple KEY=VALUE entries without adding a runtime dependency."""
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true", help="require expanded providers too")
    parser.add_argument("--env-file", type=Path, default=ROOT / ".env")
    args = parser.parse_args()
    load_dotenv(args.env_file)
    config = json.loads(CONFIG.read_text(encoding="utf-8"))["providers"]

    missing: list[str] = []
    print("Provider     Role              Credential  Model")
    for name, provider in config.items():
        key_env = provider["api_key_env"]
        ready = bool(os.getenv(key_env))
        model = os.getenv(provider["model_env"]) or provider["default_model"]
        required = provider["required_for_mvp"] or args.all
        marker = "ready" if ready else ("MISSING" if required else "optional")
        print(f"{name:<12} {provider['role']:<17} {marker:<11} {model}")
        if required and not ready:
            missing.append(key_env)

    if missing:
        print("\nMissing required environment variables: " + ", ".join(missing))
        return 1
    print("\nAll requested provider credentials are configured.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
