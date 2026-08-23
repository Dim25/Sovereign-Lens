import json
import tempfile
import unittest
from pathlib import Path

from integrations.micro import ReassessmentTask, coframe_contract, stash_memory, temporal_record, write_demo


class IntegrationMicroTests(unittest.TestCase):
    def setUp(self):
        self.task = ReassessmentTask("p1", "case1", "2027-01-01T00:00:00Z", "abc123")

    def test_temporal_task_is_idempotent(self):
        self.assertEqual(temporal_record(self.task)["idempotency_key"], temporal_record(self.task)["idempotency_key"])

    def test_stash_memory_cannot_masquerade_as_evidence(self):
        memory = stash_memory(self.task)
        self.assertFalse(memory["memory_is_evidence"])
        self.assertEqual(memory["review"]["status"], "unreviewed")
        self.assertEqual(memory["retention"]["review_at"], self.task.due_at)

    def test_coframe_locks_analytical_fields(self):
        self.assertIn("source_ids", coframe_contract()["locked_fields"])
        self.assertIn("confidence", coframe_contract()["locked_fields"])

    def test_demo_writes_three_portable_records(self):
        with tempfile.TemporaryDirectory() as directory:
            paths = write_demo(Path(directory))
            self.assertEqual(len(paths), 3)
            self.assertTrue(all(json.loads(path.read_text())["integration"] for path in paths))


if __name__ == "__main__":
    unittest.main()
