from pathlib import Path
from PIL import Image

PUBLIC_ROOT = Path("public/images")
SOURCE_ROOTS = [PUBLIC_ROOT, Path("dist/images")]
EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_SIZE = (1600, 1600)
QUALITY = 68


def output_path_for(source_root, path):
    relative = path.relative_to(source_root)
    return (PUBLIC_ROOT / relative).with_suffix(".webp")


def optimize(source_root, path):
    output = output_path_for(source_root, path)
    if output.exists():
        return False

    output.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(path) as image:
        image = image.convert("RGB")
        image.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
        image.save(output, "WEBP", quality=QUALITY, method=6, optimize=True)
    return True


created = 0

for source_root in SOURCE_ROOTS:
    if not source_root.exists():
        continue

    for image_path in sorted(source_root.rglob("*")):
        if not image_path.is_file() or image_path.suffix.lower() not in EXTENSIONS:
            continue
        if optimize(source_root, image_path):
            created += 1
            print(f"Created {output_path_for(source_root, image_path)}")

print(f"Optimized {created} new image(s).")
