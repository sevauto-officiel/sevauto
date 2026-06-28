from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
src = root / 'img' / 'logo.png'
if not src.exists():
    raise FileNotFoundError(f"Source logo not found: {src}")

img = Image.open(src).convert('RGBA')
for size, name in [(16, 'favicon-16.png'), (32, 'favicon-32.png'), (64, 'favicon-64.png')]:
    resized = img.resize((size, size), Image.LANCZOS)
    resized.save(root / 'img' / name)

# Save ICO with multiple sizes
sizes = [(16, 16), (32, 32), (64, 64)]
img.resize((64, 64), Image.LANCZOS).save(root / 'img' / 'favicon.ico', format='ICO', sizes=sizes)
print('Created favicon files in img/')
