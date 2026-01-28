
import os
import sys
import unittest
from unittest.mock import MagicMock, patch

# Ensure backend path is in sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

# Mock genai to prevent actual API calls during imports if checks run on import
# But we want to check if Imports work, so we shouldn't mock modules completely.
# However, we don't want to make network calls.

class TestMigration(unittest.TestCase):
    def test_imports_vlm(self):
        """Test that vlm.py imports google.genai correctly"""
        try:
            from backend import vlm
            import google.genai
            self.assertTrue(hasattr(vlm, 'client'))
        except ImportError as e:
            self.fail(f"Import failed: {e}")
        except Exception as e:
            self.fail(f"Loading vlm failed: {e}")

    def test_imports_profile_ai(self):
        """Test that profile_ai.py imports google.genai correctly"""
        try:
            from backend import profile_ai
            import google.genai
            self.assertTrue(hasattr(profile_ai, 'client'))
        except ImportError as e:
            self.fail(f"Import failed: {e}")
        except Exception as e:
            self.fail(f"Loading profile_ai failed: {e}")

if __name__ == '__main__':
    # Set dummy API string if not present, just for import test validity if client checks len
    if not os.environ.get("GEMINI_API_KEY"):
        os.environ["GEMINI_API_KEY"] = "dummy"
    
    unittest.main()
