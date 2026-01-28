#!/usr/bin/env python3
import os
import re
import ast
import subprocess
import sys
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
BACKEND_APP = PROJECT_ROOT / "backend" / "app.py"
SYSTEM_MAP = PROJECT_ROOT / "docs" / "SYSTEM_MAP.md"
BUNDLE_SCRIPT = PROJECT_ROOT / "scripts" / "bundle_context.sh"

def get_fastapi_endpoints(file_path):
    """Parse FastAPI app file to find all @app.route decorated functions."""
    with open(file_path, "r") as f:
        tree = ast.parse(f.read())
    
    endpoints = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            for decorator in node.decorator_list:
                if isinstance(decorator, ast.Call):
                    # Check for app.get, app.post, etc.
                    if isinstance(decorator.func, ast.Attribute) and decorator.func.attr in ["get", "post", "put", "delete", "patch"]:
                         if hasattr(decorator.func.value, "id") and decorator.func.value.id == "app":
                             # Extract path from arguments
                             if decorator.args:
                                 path = decorator.args[0].value
                                 method = decorator.func.attr.upper()
                                 endpoints.append(f"{method} {path}")
    return sorted(endpoints)

def check_system_map(endpoints):
    """Check if endpoints are mentioned in SYSTEM_MAP.md"""
    if not SYSTEM_MAP.exists():
        print(f"❌ SYSTEM_MAP.md not found at {SYSTEM_MAP}")
        return False

    with open(SYSTEM_MAP, "r") as f:
        content = f.read()

    missing = []
    for ep in endpoints:
        # Simple check: is the path present?
        # We split "POST /api/v1/..." just to search for the path part mostly, 
        # but let's just search for the path string to be lenient.
        path = ep.split(" ")[1]
        if path not in content:
            missing.append(ep)
    
    if missing:
        print("\n⚠️  [Documentation Warning] The following endpoints are implemented but NOT found in docs/SYSTEM_MAP.md:")
        for m in missing:
            print(f"   - {m}")
        print("\nAction: Please update SYSTEM_MAP.md to include these features.")
        return False
    
    print("✅ System Map covers all detected endpoints.")
    return True

def bundle_context():
    """Run the bundle script to refresh AI context."""
    print("🔄 Refreshing AI Context Bundle...")
    try:
        subprocess.check_call([str(BUNDLE_SCRIPT)], cwd=PROJECT_ROOT)
        print("✅ Context bundled successfully.")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to bundle context.")
        return False

def main():
    print("🔍 Starting Smart Documentation Enhancement...")
    
    # 1. Scan Backend
    if BACKEND_APP.exists():
        endpoints = get_fastapi_endpoints(BACKEND_APP)
        print(f"📊 Found {len(endpoints)} API endpoints in backend/app.py")
        
        # 2. Check System Map
        docs_ok = check_system_map(endpoints)
        if not docs_ok:
            # We don't fail the build, just warn heavily for now, or could fail if strict.
            # User asked for "smart updates" but without auto-writing descriptions, safe is warn.
            print("⚠️  Proceeding with deployment, but documentation is incomplete.")
    
    # 3. Always Bundle Latest Context
    bundle_ok = bundle_context()
    
    if not bundle_ok:
        sys.exit(1)

    print("✨ Documentation Enhancement Complete.")

if __name__ == "__main__":
    main()
