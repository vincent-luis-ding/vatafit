"""Pack the VitaMap Android project for upload to GitHub.

Run: python tools/make_zip.py
Excludes local preview screenshots and this packing script's own output.
"""
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT.parent / "vatafit-android-upload.zip"

SKIP_SUFFIX = {".png"}          # preview screenshots live in tools/
KEEP_PNG = {"icon-src.png", "ic_launcher.png", "icon.png"}

count = 0
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for p in sorted(ROOT.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(ROOT)
        if rel.parts[0] == "tools" and p.name.startswith("preview-"):
            continue
        if p.suffix in SKIP_SUFFIX and p.name not in KEEP_PNG:
            continue
        if rel.parts[0] == "tools" and p.name == "fix_ids.py":
            continue
        z.write(p, str(rel).replace("\\", "/"))
        count += 1

print(f"{OUT}  {OUT.stat().st_size} bytes  {count} files")
for name in sorted(zipfile.ZipFile(OUT).namelist()):
    print("  " + name)
