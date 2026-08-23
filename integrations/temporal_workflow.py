"""Optional Temporal workflow. Install `temporalio` to run; core imports stay clean."""

from __future__ import annotations

from datetime import datetime, timedelta

try:
    from temporalio import activity, workflow
except ImportError as exc:  # pragma: no cover - optional adapter
    raise RuntimeError("Install the optional Temporal SDK: pip install temporalio") from exc


@activity.defn
async def verify_and_calibrate(payload: dict) -> dict:
    # The production activity calls the domain service. This micro slice returns
    # an explicit receipt and never invents an analytical result.
    return {"task_id": payload["task_id"], "status": "due_for_human_verification"}


@workflow.defn
class ReassessmentWorkflow:
    @workflow.run
    async def run(self, payload: dict) -> dict:
        due = datetime.fromisoformat(payload["due_at"].replace("Z", "+00:00"))
        delay = due - workflow.now()
        if delay.total_seconds() > 0:
            await workflow.sleep(delay)
        return await workflow.execute_activity(
            verify_and_calibrate,
            payload,
            start_to_close_timeout=timedelta(minutes=5),
        )
