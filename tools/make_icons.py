"""Generate all Android launcher icon densities from tools/icon-src.png.

Run: python tools/make_icons.py
Android legacy launcher icons: mdpi 48, hdpi 72, xhdpi 96, xxhdpi 144, xxxhdpi 192.
The source has a warm background, so the icon is square-masked with a rounded
corner radius that matches the source art (not a transparent cutout).
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "icon-src.png"
RES = ROOT / "app" / "src" / "main" / "res"

DENSITIES = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
BG = (244, 246, 243)

src = Image.open(SRC).convert("RGBA")
side = min(src.size)
src = src.crop(((src.width - side) // 2, (src.height - side) // 2,
                (src.width + side) // 2, (src.height + side) // 2))

def rounded(img: Image.Image, radius_ratio: float = 0.22) -> Image.Image:
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    r = int(w * radius_ratio)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=r, fill=255)
    out = Image.new("RGBA", (w, h), BG + (255,))
    out.paste(img, (0, 0), mask)
    return out

written = []
for name, size in DENSITIES.items():
    img = src.resize((size, size), Image.LANCZOS)
    img = rounded(img, 0.22 if name != "mdpi" else 0.18)
    out_dir = RES / f"mipmap-{name}"
    out_dir.mkdir(parents=True, exist_ok=True)
    p = out_dir / "ic_launcher.png"
    img.save(p, "PNG", optimize=True)
    written.append((str(p.relative_to(ROOT)), size, p.stat().st_size))

for w in written:
    print(f"{w[0]}  {w[1]}x{w[1]}  {w[2]} bytes")

# 512 store / about-screen asset kept inside the offline bundle
assets = ROOT / "app" / "src" / "main" / "assets"
assets.mkdir(parents=True, exist_ok=True)
big = rounded(src.resize((512, 512), Image.LANCZOS), 0.22)
big.save(assets / "icon.png", "PNG", optimize=True)
print("app/src/main/assets/icon.png  512x512")
