#!/usr/bin/env python3
"""Generate the six promo shots through Alibaba Model Studio without storing a key."""

from __future__ import annotations

import getpass
import argparse
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CREATE_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis"
STATUS_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/{task_id}"


def request_json(url: str, key: str, *, payload: dict | None = None) -> dict:
    headers = {"Authorization": f"Bearer {key}"}
    if payload is not None:
        headers.update({"Content-Type": "application/json", "X-DashScope-Async": "enable"})
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode() if payload is not None else None,
        headers=headers,
        method="POST" if payload is not None else "GET",
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        body = error.read().decode(errors="replace")
        raise RuntimeError(f"Happy Horse API returned HTTP {error.code}: {body[:500]}") from None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--spec", default=str(ROOT / "happyhorse-shots.json"))
    parser.add_argument("--output-dir", default=str(ROOT / "generated"))
    args = parser.parse_args()
    key = os.environ.get("DASHSCOPE_API_KEY") or getpass.getpass("Rotated DASHSCOPE_API_KEY: ")
    if not key:
        raise SystemExit("No API key supplied")

    spec = json.loads(Path(args.spec).read_text())
    visual_language = spec["visual_language"]
    tasks: dict[str, str] = {}

    for shot in spec["shots"]:
        payload = {
            "model": "happyhorse-1.1-t2v",
            "input": {"prompt": f"{shot['prompt']} Visual direction: {visual_language}"},
            "parameters": {
                "resolution": "720P",
                "ratio": "16:9",
                "duration": 5,
                "watermark": False,
                "seed": 25082026 + len(tasks),
            },
        }
        response = request_json(CREATE_URL, key, payload=payload)
        task_id = response.get("output", {}).get("task_id")
        if not task_id:
            raise RuntimeError(f"No task ID returned for {shot['id']}: {response}")
        tasks[shot["id"]] = task_id
        print(f"submitted {shot['id']} ({task_id})", flush=True)

    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)
    pending = dict(tasks)
    while pending:
        for shot_id, task_id in list(pending.items()):
            response = request_json(STATUS_URL.format(task_id=task_id), key)
            output = response.get("output", {})
            status = output.get("task_status", "UNKNOWN")
            print(f"{shot_id}: {status}", flush=True)
            if status == "SUCCEEDED":
                video_url = output["video_url"]
                destination = output_dir / f"{shot_id}.mp4"
                urllib.request.urlretrieve(video_url, destination)
                print(f"saved {destination.name}", flush=True)
                del pending[shot_id]
            elif status in {"FAILED", "CANCELED", "UNKNOWN"}:
                raise RuntimeError(f"{shot_id} ended with {status}: {response}")
        if pending:
            time.sleep(15)

    print("All Happy Horse shots generated.")


if __name__ == "__main__":
    main()
