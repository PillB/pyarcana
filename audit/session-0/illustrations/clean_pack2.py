"""Second pass: the six images first judged unusable, fixed where the defect was fixable."""
import textwrap
from PIL import Image, ImageDraw, ImageFont
exec(open('clean_pack.py').read().split("log = {}")[0])  # reuse helpers (bbox_where, fill, replace, red, dark, meta, P, OUT, D)
B, R, M = D + 'DejaVuSans-Bold.ttf', D + 'DejaVuSans.ttf', D + 'DejaVuSansMono.ttf'

def unred(im, region, bg):
    """Repaint only the red label pixels (keeps the text they sat on)."""
    px = im.load(); x0, y0, x1, y1 = region
    for y in range(y0, y1):
        for x in range(x0, x1):
            if red(px[x, y][:3]): px[x, y] = bg

def size_for(text, width, font):
    return min(range(8, 90), key=lambda s: abs(ImageFont.truetype(font, s).getlength(text) - width))

# --- git-win-download: label off, heading redrawn, versions to the verified 2.56.0(2) of 2026-10-05.
im = Image.open(f'{P}/git-win-download.png').convert('RGB'); d = ImageDraw.Draw(im)
other = bbox_where(im, (140, 555, 760, 595), dark((255, 255, 255)))
hsize = size_for('Other Git for Windows downloads', other[2] - other[0], B)
d.rectangle((130, 328, 720, 384), fill=(255, 255, 255))
f = ImageFont.truetype(B, hsize); d.text((other[0] - f.getbbox('W')[0], 333 - f.getbbox('W')[1]), 'Windows', font=f, fill=(31, 35, 40))
replace(im, (142, 262, 700, 292), 'Latest version: 2.55.0', 'Latest version: 2.56.0', B)
replace(im, (142, 408, 1360, 446), 'Click here to download the latest (2.55.0(5)) x64 version of Git for Windows.', 'Click here to download the latest (2.56.0(2)) x64 version of Git for Windows.', B)
replace(im, (142, 465, 1200, 492), 'This is the most recent maintained build. It was released on 2026-08-20.', 'This is the most recent maintained build. It was released on 2026-10-05.', R)
im.save(f'{OUT}/git-win-download.png', optimize=True)

# --- py-release-files: drop the summary block that boxes the install manager; keep the Files table,
# label the Windows row as python.org's table does, and fix the macOS row whose words collided.
im = Image.open(f'{P}/py-release-files.png').convert('RGB')
W, H = im.size
# Header (title, release date) to y=285, a fresh "Files" heading, then the table from y=540; -195 maps old y to new.
top = im.crop((0, 0, W, 285)); table = im.crop((0, 540, W, H))
new = Image.new('RGB', (W, 345 + H - 540), (255, 255, 255)); new.paste(top, (0, 0)); new.paste(table, (0, 345))
blank = im.crop((0, 900, W, 910))                     # an empty strip of the card, borders included
for y in range(285, 345, 10): new.paste(blank, (0, y))
d = ImageDraw.Draw(new)
f = ImageFont.truetype(B, 30); d.text((120, 292), 'Files', font=f, fill=(31, 35, 40))
row = bbox_where(new, (110, 417, 400, 443), dark((255, 255, 255)))  # 'Gzipped source tarball' as size reference
sz = size_for('Gzipped source tarball', row[2] - row[0], R); fr = ImageFont.truetype(R, sz)
d.rectangle((110, 548, 700, 600), fill=(255, 255, 255))
d.text((120, 552), 'macOS 64-bit universal2', font=fr, fill=(31, 35, 40))
d.text((120, 576), 'installer', font=fr, fill=(31, 35, 40))
d.text((420, 563), 'macOS', font=fr, fill=(31, 35, 40))
d.rectangle((110, 629, 1000, 665), fill=(255, 255, 255))
d.text((120, 635), 'Windows installer (64-bit)', font=fr, fill=(31, 35, 40))
d.text((420, 635), 'Windows', font=fr, fill=(31, 35, 40))
new.save(f'{OUT}/py-release-files.png', optimize=True)

# --- mac-clt-prompt: the title ran past the dialog; rewrap it inside, take the label off.
im = Image.open(f'{P}/mac-clt-prompt.png').convert('RGB'); d = ImageDraw.Draw(im)
dlg = im.getpixel((470, 360))[:3]; term = im.getpixel((1300, 420))[:3]
px = im.load()
for y in range(540, 578):
    for x in range(915, 1112):
        c = px[x, y][:3]
        if c[0] > c[1] + 25 and c[0] > c[2] + 25 and not (925 <= x <= 1105 and 576 <= y): px[x, y] = dlg
d.rectangle((1138, 378, 1143, 470), fill=dlg)
edge = im.getpixel((1145, 560))[:3]
d.rectangle((1146, 378, 1152, 470), fill=term)
d.line((1145, 378, 1145, 470), fill=edge)
d.rectangle((1146, 375, 1320, 470), fill=term)
d.rectangle((500, 375, 1140, 500), fill=dlg)
f = ImageFont.truetype(B, 22)
title = 'The “git” command requires the command line developer tools. Would you like to install the tools now?'
lines, cur = [], ''
for w in title.split():
    t = (cur + ' ' + w).strip()
    if f.getlength(t) > 600: lines.append(cur); cur = w
    else: cur = t
lines.append(cur)
for i, l in enumerate(lines): d.text((510, 382 + i * 32), l, font=f, fill=(29, 29, 31))
replace(im, (205, 160, 700, 192), 'pablo@MacBook ~ % git --version', 'ana@MacBook ~ % git --version', M)
im.save(f'{OUT}/mac-clt-prompt.png', optimize=True)

# --- win-vscode-tasks: the label sat on the "Register Code…" row; redraw that row.
im = Image.open(f'{P}/win-vscode-tasks.png').convert('RGB'); d = ImageDraw.Draw(im)
ref = bbox_where(im, (470, 388, 1240, 418), dark((255, 255, 255)))
fr = ImageFont.truetype(R, size_for('Add “Open with Code” action to Windows Explorer file context menu', ref[2] - ref[0], R))
box = im.crop((428, 602, 462, 638))                       # the checked box of "Add to PATH"
d.rectangle((410, 528, 1045, 572), fill=(255, 255, 255))
im.paste(box, (428, 530))
d.text((475, 532), 'Register Code as an editor for supported file types', font=fr, fill=(31, 35, 40))
im.save(f'{OUT}/win-vscode-tasks.png', optimize=True)

# --- labels only
for id in ['win-py-installer-done', 'gh-device-code']:
    im = Image.open(f'{P}/{id}.png').convert('RGB')
    b = meta[id]['box_px']; r = bbox_where(im, (b['left'] - 10, b['top'] - 48, b['left'] + 520, b['top'] - 4), red)
    if r: fill(im, r)
    im.save(f'{OUT}/{id}.png', optimize=True)
print('ok')
