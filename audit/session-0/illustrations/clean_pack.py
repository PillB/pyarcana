"""Clean the owner's illustration pack: remove baked English labels, fix wording to match the page.
Run with the scratch Pillow venv. Input: pack/, output: pack/clean/."""
import json, os
from PIL import Image, ImageDraw, ImageFont
P = os.path.dirname(os.path.abspath(__file__)) + '/pack'
OUT = P + '/clean'; os.makedirs(OUT, exist_ok=True)
D = '/usr/share/fonts/truetype/dejavu/'
meta = json.load(open(P + '/shots.json'))

def bbox_where(im, region, pred):
    x0, y0, x1, y1 = region; px = im.load(); xs, ys = [], []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if pred(px[x, y][:3]): xs.append(x); ys.append(y)
    return (min(xs), min(ys), max(xs) + 1, max(ys) + 1) if xs else None

red = lambda c: c[0] > 170 and c[1] < 90 and c[2] < 100
def dark(bg): return lambda c: sum(abs(a - b) for a, b in zip(c, bg)) > 90

def fill(im, r, pad=3):
    bg = im.getpixel((max(r[0] - pad - 2, 0), r[1]))[:3]
    ImageDraw.Draw(im).rectangle((r[0] - pad, r[1] - pad, r[2] + pad, r[3] + pad), fill=bg)
    return bg

def remove_label(im, box):
    """The red caption above the red box."""
    l, t = box['left'], box['top']
    r = bbox_where(im, (max(l - 10, 0), max(t - 48, 0), min(l + 520, im.width), t - 4), red)
    if r: fill(im, r)
    return r

def replace(im, region, old, new, font, color=None):
    # Background: just inside the region's corner, never outside it (a box border there is red).
    bg = im.getpixel((region[0] + 2, region[1] + 2))[:3]
    r = bbox_where(im, region, dark(bg))
    assert r, (old, region)
    w = r[2] - r[0]
    size = min(range(8, 80), key=lambda s: abs(ImageFont.truetype(font, s).getbbox(old)[2] - ImageFont.truetype(font, s).getbbox(old)[0] - w))
    f = ImageFont.truetype(font, size)
    if color is None:
        # Text colour: the pixel farthest from the background (white on a terminal, black on a page).
        px = im.load(); color = max((px[x, y][:3] for x in range(r[0], r[2]) for y in range(r[1], r[3])), key=lambda c: sum(abs(a - b) for a, b in zip(c, bg)))
    ImageDraw.Draw(im).rectangle((r[0] - 2, r[1] - 2, r[2] + 2, r[3] + 2), fill=bg)
    bb = f.getbbox(new)
    ImageDraw.Draw(im).text((r[0] - bb[0], r[1] - f.getbbox(old)[1]), new, font=f, fill=color)
    return r, size

log = {}
def do(id, edits):
    im = Image.open(f'{P}/{id}.png').convert('RGB')
    log[id] = {'label': remove_label(im, meta[id]['box_px'])}
    for e in edits: log[id][e[2]] = replace(im, *e)
    im.save(f'{OUT}/{id}.png', optimize=True)

B, R, MB, M = D + 'DejaVuSans-Bold.ttf', D + 'DejaVuSans.ttf', D + 'DejaVuSansMono-Bold.ttf', D + 'DejaVuSansMono.ttf'
do('win-app-aliases', [((440, 262, 900, 300), 'Instalador de aplicaciones', 'Instalador de aplicación', B),
                       ((440, 397, 900, 435), 'Instalador de aplicaciones', 'Instalador de aplicación', B)])
do('win-terminal-open', [((140, 238, 1300, 272), 'Copyright (C) Microsoft Corporation. All rights reserved.', 'Copyright (C) Microsoft Corporation. Todos los derechos reservados.', M),
                         ((143, 323, 552, 368), 'PS C:\\Users\\Pablo>', 'PS C:\\Users\\ana>', MB)])
do('mac-terminal-open', [((212, 300, 578, 343), 'pablo@MacBook ~ %', 'ana@MacBook ~ %', MB)])
do('win-git-editor', [((360, 126, 700, 160), 'Git 2.55.0 Setup', 'Git 2.56.0 Setup', B)])
# Sign-up: the label overlaps the redundant second heading; remove both, keep "Create your free account".
im = Image.open(f'{P}/gh-signup-form.png').convert('RGB')
fill(im, (205, 258, 575, 306), pad=0)
log['gh-signup-form'] = {'removed': 'second heading + label'}
im.save(f'{OUT}/gh-signup-form.png', optimize=True)
print(json.dumps(log, default=str, indent=1))
