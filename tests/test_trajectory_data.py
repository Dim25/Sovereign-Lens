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

    def test_classical_horizon_blocks_are_primary_and_ai_is_one_element(self):
        block_types = {
            block["type"]
            for trajectory in self.trajectory_set["trajectories"]
            for block in trajectory["horizon_blocks"]
        }
        self.assertTrue({"capital", "talent", "compute", "institutions", "law_policy"} <= block_types)
        self.assertIn("ai_agents", block_types)
        self.assertGreater(len(block_types - {"ai_agents"}), 1)

    def test_every_horizon_block_names_its_programmers(self):
        for trajectory in self.trajectory_set["trajectories"]:
            for block in trajectory["horizon_blocks"]:
                self.assertTrue(block["programming_action"])
                self.assertTrue(block["actor_types"])


if __name__ == "__main__":
    unittest.main()
