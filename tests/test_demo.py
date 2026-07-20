from pathlib import Path
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]


class TrialDemoTests(unittest.TestCase):
    def test_demo_assets_are_loaded(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn('<link rel="stylesheet" href="trial-demo.css">', html)
        self.assertIn('<script src="trial-demo.js"></script>', html)

    def test_trial_restrictions_are_explicit(self):
        script = (ROOT / "trial-demo.js").read_text(encoding="utf-8")
        self.assertIn('new Set(["tab3", "tab4"])', script)
        self.assertIn("EXPORT_PATTERN", script)
        self.assertIn('input[type="file"]', script)
        self.assertIn("VivaTEQ Public Trial Demo", script)

    def test_manifest_is_validated(self):
        manifest = json.loads((ROOT / "standards.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["status"], "validated")
        self.assertEqual(manifest["schema_version"], 1)

    def test_no_old_brand_or_old_demo_url(self):
        combined = "\n".join(
            path.read_text(encoding="utf-8")
            for path in [ROOT / "index.html", ROOT / "trial-demo.js", ROOT / "README.md"]
        )
        self.assertNotIn("VivATA", combined)
        self.assertNotIn("vivata-pte-ltd", combined.lower())
        self.assertIn("VivaTEQ", combined)


if __name__ == "__main__":
    unittest.main()
