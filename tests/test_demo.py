import tempfile
import unittest

import demo


class DemoTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.NamedTemporaryFile(suffix=".sqlite")
        self.db = demo.connect(self.tmp.name)

    def tearDown(self):
        self.db.close()
        self.tmp.close()

    def test_bitemporal_projection_preserves_superseded_fact(self):
        demo.seed_t0(self.db)
        before = demo.graph_snapshot(self.db, demo.T0)
        self.assertEqual([r["id"] for r in before.exposed], ["campus_capacity_planned"])
        demo.ingest_t1(self.db)
        after = demo.graph_snapshot(self.db, demo.T1)
        self.assertEqual([r["id"] for r in after.exposed], ["campus_capacity_reported_operational"])
        self.assertEqual([r["id"] for r in after.superseded], ["campus_capacity_planned"])

    def test_prediction_resolution_and_lesson_are_append_only_records(self):
        demo.seed_t0(self.db)
        demo.assess(self.db, demo.graph_snapshot(self.db, demo.T0))
        demo.ingest_t1(self.db)
        brier = demo.resolve(self.db, demo.T1)
        prediction = self.db.execute("SELECT * FROM predictions").fetchone()
        lesson = self.db.execute("SELECT * FROM methodology_lessons").fetchone()
        self.assertAlmostEqual(brier, 0.1225)
        self.assertEqual(prediction["status"], "resolved")
        self.assertEqual(lesson["version_before"], "v1")
        self.assertEqual(lesson["version_after"], "v2")


if __name__ == "__main__":
    unittest.main()
