import argparse
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import urlopen

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--input", type=Path, default=ROOT / "assets/images")
    parser.add_argument("--output", type=Path, default=ROOT / "public/images")
    args = parser.parse_args()
    args.input.mkdir(parents=True, exist_ok=True)
    args.output.mkdir(parents=True, exist_ok=True)

    if args.download:
        sources = json.loads((ROOT / "assets/image-sources.json").read_text())

        def download(source):
            target = args.input / f"{source['name']}.jpg"
            if target.exists():
                return
            with urlopen(source["url"], timeout=45) as response:
                data = response.read()
            from io import BytesIO
            with Image.open(BytesIO(data)) as image:
                image.verify()
            target.write_bytes(data)
            print(f"Downloaded {target.name}", flush=True)

        with ThreadPoolExecutor(max_workers=4) as pool:
            list(pool.map(download, sources))

    sources = sorted(p for p in args.input.iterdir()
                     if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
    if not sources:
        parser.error("No source images found. Add images or run with --download.")
    names = [p.stem.lower() for p in sources]
    if len(names) != len(set(names)):
        parser.error("Source images must have unique names, regardless of extension.")
    total = 0
    for source in sources:
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGBA" if "A" in original.getbands() else "RGB")
            for width in (640, 1200, 1600):
                height = max(1, round(image.height * width / image.width))
                output = args.output / f"{source.stem}-{width}.webp"
                image.resize((width, height), Image.Resampling.LANCZOS).save(
                    output, "WEBP", quality=78, method=6)
                total += output.stat().st_size
        print(f"Converted {source.name}", flush=True)
    print(f"Created {len(sources) * 3} WebP files ({total / 1024:.0f} KB total).")


if __name__ == "__main__":
    main()
