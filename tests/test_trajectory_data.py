import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class TrajectoryDataTests(unittest.TestCase):
    def setUp(self):
        self.trajectory_set = json.loads(
            (ROOT / "data/cases/uae-us-ai-infrastructure/trajectories.json").read_text()
        )
        manifest = json.loads(
            (ROOT / "data/cases/uae-us-ai-infrastructure/sources.json").read_text()
        )
        self.source_ids = {source["id"] for source in manifest["sources"]}

    def test_case_contains_competing_trajectory_hypotheses(self):
        trajectories = self.trajectory_set["trajectories"]
        self.assertGreaterEqual(len(trajectories), 2)
        self.assertEqual(len({item["id"] for item in trajectories}), len(trajectories))
        for trajectory in trajectories:
            self.assertTrue(trajectory["indicators"])
            self.assertTrue(trajectory["reversal_conditions"])
            self.assertEqual(
                set(trajectory["deltas"]),
                {"capability", "dependency", "control", "optionality", "institutional_learning"},
            )

    def test_all_trajectory_evidence_resolves_to_manifest(self):
        for trajectory in self.trajectory_set["trajectories"]:
            referenced = set(trajectory["supporting_source_ids"])
            referenced.update(trajectory["challenging_source_ids"])
            for indicator in trajectory["indicators"]:
                referenced.update(indicator.get("source_ids", []))
            self.assertFalse(referenced - self.source_ids, trajectory["id"])

    def test_actor_programming_is_explicit(self):
        actor_types = {
            actor_type
            for trajectory in self.trajectory_set["trajectories"]
            for actor_type in trajectory["actor_types"]
        }
        self.assertIn("state", actor_types)
        self.assertIn("ai_agent", actor_types)


if __name__ == "__main__":
    unittest.main()
