"""The Fulfillment hero's bottom right station: a man placing an order.

The artwork has a worker wheeling a box on a hand truck past a tall phone
there, a forklift carrying a box behind him and three boxes in front.
swap_worker changes the station to:
  - a phone of the same size, drawn afresh with the artwork's "it" on it and,
    under that, a trolley and ORDER PLACED, large enough to read
  - the man tapping it, from the Fulfill itSmart card picture
    (public/card-thumbnails/fulfill-itsmart.png)
  - that picture's roller table with two parcels on it, where the three
    boxes stood
  - the brand's "it" badge on the box the forklift carries
Used by build-hero-fx.py.
"""

import json
import os

import numpy as np
from PIL import Image, ImageChops, ImageDraw

from hero_iso import ISO_X, ISO_Y, SS, grow, label_from

FONT = os.path.join(os.path.dirname(__file__), "..", "public", "fonts", "helvetiker_bold.typeface.json")

# The pads' flat colours in both pictures: the top, its side, and the thin
# line along the top's far edges
TOP, SIDE, RIM = (218, 236, 245), (137, 167, 190), (90, 145, 188)

# The hero's station: the box its pad is in (x0, y0, x1, y1), the box all
# that stands on it is in, a point on the old phone (which the worker and his
# hand truck touch) and one on the three boxes
PAD = (940, 640, 1340, 920)
STATION = (940, 500, 1340, 920)
OLD, BOXES = (1250, 650), (1110, 830)

# The phone: the bottom left corner of its face, the face's size, how far it
# drops for each pixel across (it stands along the floor's axis), and the
# step from its face to its back
PHONE = (1195, 736.3)
WIDE, HIGH = 98, 200
DROP = ISO_Y / ISO_X
DEPTH = (11, -6.5)
PHONE_AREA = (1188, 524, 1312, 802)
# Its colours: the case's edge round the screen, the screen above and below
# the line of light across it (and the two paler bands along its foot), and
# the brand's orange in that light and out of it
CASE = (203, 204, 205)
TEAL, NAVY, NAVY_2, NAVY_3 = (9, 145, 188), (10, 88, 152), (18, 94, 156), (27, 100, 159)
ORANGE_LIT, ORANGE = (254, 194, 119), (247, 159, 49)
# The box of the artwork its "it" is in (nothing else on the screen there is
# at all red)
LOGO = (1215, 583, 1286, 702)
# The words, bottom line first: (text, height of its foot up the face), and
# how tall the capitals are; then the trolley's left, foot and size
WORDS = (("PLACED", 10.5), ("ORDER", 30.5))
CAPS = 14
TROLLEY = (35.5, 51, 1.05)

# The man in the card picture: the box he and his phone are in, a point on
# him, and the middle of the hand he taps with. He is drawn larger than
# there, about the size of the worker he replaces, with that hand here on
# the phone's face (across, up)
CARD_MAN = (880, 380, 1120, 760)
MAN, HAND = (992, 650), (1024, 620)
MAN_SCALE = 1.35
TAP = (13, 66)

# The roller table in the card picture: the box it is in, a point on it and
# the foot of its nearest leg; then where that foot goes on the hero's pad,
# and how much larger it is drawn
CARD_TABLE = (900, 190, 1070, 360)
TABLE, TABLE_FOOT = (960, 240), (1014.5, 300)
TABLE_AT = (1140, 870)
TABLE_SCALE = 1.0

# The side of the forklift's box that faces right: its middle, how far it
# rises for each pixel across, and the size of the badge on it
BOX_SIDE = (1053.6, 759.5)
BOX_RISE = -0.573
BADGE = 9.6
BADGE_BLUE = (11, 88, 152)


def flat(a, colour, tol):
    """Opaque pixels of that colour, give or take tol."""
    off = np.abs(a[..., :3].astype(int) - colour).max(axis=2)
    return (off <= tol) & (a[..., 3] > 250)


def far_line(a):
    """The thin line along a pad's far edges where nothing stands in front of
    it: what has nothing just above it and the pad's top just below."""
    bare = a[..., 3] < 40
    top = flat(a, TOP, 12)
    above = np.roll(bare, 1, 0) | np.roll(bare, 2, 0)
    below = np.roll(top, -1, 0) | np.roll(top, -2, 0)
    line = ~bare & ~top & above & below
    # ... and its ends, where they run in behind something: the line's pale
    # blue, right beside it
    r, b = a[..., 0].astype(int), a[..., 2].astype(int)
    pale = ~bare & ~top & (r > 80) & (b > 180) & (b - r > 25)
    return line | (grow(line, 2) & pale)


def standing_on(a, box, seed):
    """Everything in the box joined to the seed that stands on a pad (the
    pad's own far line aside, which runs behind it)."""
    x0, y0, x1, y1 = box
    things = np.zeros(a.shape[:2], bool)
    part = a[y0:y1, x0:x1]
    things[y0:y1, x0:x1] = (part[..., 3] > 40) & ~flat(part, TOP, 12)
    return label_from(things & ~far_line(a), seed)


# --- taking the old things off the pad -----------------------------------


def pad_edges(a, box):
    """Where the pad's top starts and ends in each column of the box, to a
    fraction of a pixel: its far edge (wrong wherever something stands in
    front of it) and its near edge (nothing does)."""
    x0, y0, x1, y1 = box
    part = a[y0:y1, x0:x1].astype(float)
    top = flat(a[y0:y1, x0:x1], TOP, 3)
    far = np.full(x1 - x0, np.nan)
    near = np.full(x1 - x0, np.nan)
    for i in np.where(top.any(axis=0))[0]:
        rows = np.where(top[:, i])[0]
        t, b = rows.min(), rows.max()
        # The rows next to it are part top, part rim (far) or side (near)
        share = (part[t - 1, i, 0] - RIM[0]) / (TOP[0] - RIM[0])
        far[i] = y0 + t - np.clip(share, 0, 1) * (part[t - 1, i, 3] > 250)
        share = (part[b + 1, i, 0] - SIDE[0]) / (TOP[0] - SIDE[0])
        near[i] = y0 + b + 1 + np.clip(share, 0, 1)
    return far, near


def clear(a, gone):
    """Take what is in gone off the pad: the top where it stood, with the far
    edge it hid drawn back in, and nothing beyond that edge.

    The pad's top is the same shape upside down, so the far edge is its near
    edge flipped: far + near comes to the same sum in every column. That sum
    drifts by a pixel or two across the pad, so it is taken from the columns
    in view on either side of the gap and run between them."""
    x0, y0, x1, y1 = PAD
    far, near = pad_edges(a, PAD)
    cols = np.where(gone.any(axis=0))[0]
    left, right = cols.min() - x0, cols.max() - x0
    total = far + near
    sums = [np.nanmedian(total[left - 9 : left - 1]), np.nanmedian(total[right + 2 : right + 10])]
    edge = np.interp(np.arange(x1 - x0), [left, right], sums) - near

    ys, xs = np.where(gone)
    keep = ys + 1 < near[xs - x0]  # never touch the pad's side
    ys, xs = ys[keep], xs[keep]
    e = edge[xs - x0]
    on_top = np.clip(ys + 1 - e, 0, 1)
    on_rim = np.clip(ys + 2 - e, 0, 1) - on_top
    cover = on_top + on_rim
    colour = (np.outer(on_top, TOP) + np.outer(on_rim, RIM)) / np.maximum(cover, 1e-6)[:, None]
    out = a.copy()
    out[ys, xs, :3] = np.round(colour).astype(np.uint8)
    out[ys, xs, 3] = np.round(cover * 255).astype(np.uint8)
    return out


# --- drawing on an upright face ------------------------------------------


class Face:
    """An oversized layer over a box of the artwork, for drawing on something
    that stands upright: points are given as pixels across its face and up
    it from `origin`, and each pixel across is `drop` lower."""

    def __init__(self, box, origin, drop):
        self.x0, self.y0 = box[:2]
        self.origin, self.drop = origin, drop
        self.size = ((box[2] - box[0]) * SS, (box[3] - box[1]) * SS)

    def pt(self, a, b, back=0):
        """A point on the face (or `back` of the way to the phone's back)."""
        x = self.origin[0] + a + back * DEPTH[0]
        y = self.origin[1] + a * self.drop - b + back * DEPTH[1]
        return ((x - self.x0) * SS, (y - self.y0) * SS)

    def shape(self, points, back=0):
        """A mask of the polygon through those points."""
        img = Image.new("L", self.size, 0)
        ImageDraw.Draw(img).polygon([self.pt(a, b, back) for a, b in points], fill=255)
        return img

    def strokes(self, lines, width, dots=()):
        """A mask of lines of that width, with round ends, and of dots (a, b,
        radius)."""
        img = Image.new("L", self.size, 0)
        d = ImageDraw.Draw(img)
        for line in lines:
            d.line([self.pt(a, b) for a, b in line], fill=255, width=round(width * SS), joint="curve")
            dots = tuple(dots) + tuple((a, b, width / 2) for a, b in (line[0], line[-1]))
        for a, b, r in dots:
            ring = [(a + r * np.cos(t), b + r * np.sin(t)) for t in np.linspace(0, 2 * np.pi, 24, endpoint=False)]
            d.polygon([self.pt(*p) for p in ring], fill=255)
        return img


def rounded(a0, b0, a1, b1, r):
    """The points round a box with rounded corners."""
    pts = []
    for (ca, cb), start in (((a1 - r, b1 - r), 0), ((a0 + r, b1 - r), 90), ((a0 + r, b0 + r), 180), ((a1 - r, b0 + r), 270)):
        for t in np.radians(np.arange(start, start + 91, 10)):
            pts.append((ca + r * np.cos(t), cb + r * np.sin(t)))
    return pts


def outlines(char, font):
    """A letter's outlines, in the font's own units."""
    words = font["glyphs"][char]["o"].split()
    paths, i = [], 0
    while i < len(words):
        kind = words[i]
        n = {"m": 2, "l": 2, "q": 4, "b": 6}[kind]
        v = [float(w) for w in words[i + 1 : i + 1 + n]]
        i += 1 + n
        if kind == "m":
            paths.append([(v[0], v[1])])
            continue
        path = paths[-1]
        (px, py), (x, y) = path[-1], v[:2]
        for t in np.linspace(0, 1, 9)[1:] if kind != "l" else [1]:
            if kind == "q":  # a curve to (x, y), bent towards one point
                w = ((1 - t) ** 2, 2 * t * (1 - t), t * t)
                ctl = [v[2:4]]
            elif kind == "b":  # ... or towards two
                w = ((1 - t) ** 3, 3 * t * (1 - t) ** 2, 3 * t * t * (1 - t), t**3)
                ctl = [v[2:4], v[4:6]]
            else:
                w, ctl = (0, 1), []
            xs = [px] + [c[0] for c in ctl] + [x]
            ys = [py] + [c[1] for c in ctl] + [y]
            path.append((sum(k * q for k, q in zip(w, xs)), sum(k * q for k, q in zip(w, ys))))
    return paths


def lettering(face, text, middle, foot, caps, room):
    """A mask of the text in the site's bold type, its capitals `caps` tall,
    centred on `middle` and standing on `foot` (squeezed to fit in `room`)."""
    with open(FONT) as f:
        font = json.load(f)
    size = caps / 1013  # the capitals are 1013 of the font's units tall
    gap = 0.07 * caps
    wide = sum(font["glyphs"][ch]["ha"] * size for ch in text) + gap * (len(text) - 1)
    squeeze = min(1, room / wide)
    at = middle - wide * squeeze / 2
    mask = Image.new("1", face.size, 0)
    for ch in text:
        for path in outlines(ch, font):
            # Each outline turns what is inside it over: on, or off again
            # for the hole in an O
            one = Image.new("1", face.size, 0)
            pts = [face.pt(at + x * size * squeeze, foot + y * size) for x, y in path]
            ImageDraw.Draw(one).polygon(pts, fill=1)
            mask = ImageChops.logical_xor(mask, one)
        at += (font["glyphs"][ch]["ha"] * size + gap) * squeeze
    return mask.convert("L")


def trolley(face, left, foot, k):
    """A mask of a shopping trolley, drawn in lines."""

    def at(points):
        return [(left + x * k, foot + y * k) for x, y in points]

    lines = [
        at([(0, 26), (5, 26), (9.5, 8.5), (25, 8.5)]),  # handle and chassis
        at([(6.2, 21.5), (28, 21.5), (25.2, 12.5), (8.6, 12.5)]),  # basket
        at([(13.5, 21), (14.2, 13)]),
        at([(20.5, 21), (20, 13)]),
    ]
    wheels = [(left + x * k, foot + 3.2 * k, 2.5 * k) for x in (11.5, 23)]
    return face.strokes(lines, 1.9 * k, wheels)


def paste(layer, colour, mask):
    layer.paste(Image.new("RGBA", layer.size, colour + (255,)), (0, 0), mask)


def draw_phone(img, art):
    """The phone, standing where the artwork's own stood and shaped and
    coloured like it, with the order on its screen."""
    f = Face(PHONE_AREA, PHONE, DROP)
    case = rounded(0, 0, WIDE, HIGH, 12)
    # Its body: the face's shape, swept back to the phone's back. It is lit
    # from the top right: the strip along its top darkens to the left, and
    # the one down its right side darkens to its foot
    body = Image.new("L", f.size, 0)
    for back in np.linspace(0, 1, 40):
        body = ImageChops.lighter(body, f.shape(case, back))
    ys, xs = np.mgrid[0 : f.size[1], 0 : f.size[0]]
    xs, ys = f.x0 + (xs + 0.5) / SS, f.y0 + (ys + 0.5) / SS
    side = xs > PHONE[0] + WIDE - 1
    grey = np.where(side, 219 - 0.36 * (ys - (PHONE[1] - HIGH + WIDE * DROP - 5)), 163 + 0.68 * (xs - PHONE[0] - 18))
    grey = np.clip(grey, 150, 219)
    shade = np.stack([grey, grey + 1, grey + 3, np.full_like(grey, 255)], axis=2)
    layer = Image.new("RGBA", f.size, (0, 0, 0, 0))
    layer.paste(Image.fromarray(shade.astype(np.uint8)), (0, 0), body)
    paste(layer, CASE, f.shape(case))

    # The screen: teal where the light falls across it, navy below, in two
    # paler bands along its foot
    screen = Image.new("RGBA", f.size, TEAL + (255,))
    light = lambda a: 74.7 + (a - 5) * 0.845  # the foot of the light, up the face
    for colour, high in ((NAVY, (light(0), light(WIDE))), (NAVY_2, (36, 37)), (NAVY_3, (8.5, 8.5))):
        paste(screen, colour, f.shape([(0, -5), (WIDE, -5), (WIDE, high[1]), (0, high[0])]))
    # ... and on it, under where the "it" goes, the trolley and the words
    middle, room = (2.8 + 95.6) / 2, 84
    paste(screen, ORANGE, trolley(f, *TROLLEY))
    for text, foot in WORDS:
        paste(screen, ORANGE, lettering(f, text, middle, foot, CAPS, room))
    layer.paste(screen, (0, 0), f.shape(rounded(2.8, 3.3, 95.6, HIGH - 2.5, 9.5)))
    # (scaled down by plain averaging: flat colours meet in clean edges)
    small = np.array(layer.reduce(SS)).astype(float)

    # The artwork's own "it", in the place it had: it is the only red on the
    # old screen, so how red a pixel is says how much of it is "it"
    x0, y0, x1, y1 = LOGO
    red = art[y0:y1, x0:x1, 0].astype(float)
    part = np.clip((red - 30) / 210, 0, 1)[..., None]
    ys, xs = np.mgrid[y0:y1, x0:x1]
    a = xs + 0.5 - PHONE[0]
    b = PHONE[1] + a * DROP - (ys + 0.5)
    part[(b > HIGH - 12) | (a > WIDE - 8)] = 0  # (the case round the screen is not)
    lit = np.clip(b - light(a) + 0.5, 0, 1)[..., None]
    colour = np.array(ORANGE_LIT) * lit + np.array(ORANGE) * (1 - lit)
    mine = small[y0 - f.y0 : y1 - f.y0, x0 - f.x0 : x1 - f.x0]
    mine[..., :3] = mine[..., :3] * (1 - part) + colour * part
    img.alpha_composite(Image.fromarray(np.round(small).astype(np.uint8)), PHONE_AREA[:2])


def draw_badge(img):
    """The brand's "it" in its blue roundel on the forklift's box, as on the
    artwork's other parcels."""
    r = BADGE
    area = tuple(int(v) for v in (BOX_SIDE[0] - r - 3, BOX_SIDE[1] - r - 9, BOX_SIDE[0] + r + 3, BOX_SIDE[1] + r + 9))
    f = Face(area, BOX_SIDE, BOX_RISE)
    # The box's side is seen at a slant: a step across it looks ISO_X long
    k, across = r / 6, ISO_X
    disc = [(r * across * np.cos(t), r * np.sin(t)) for t in np.linspace(0, 2 * np.pi, 60, endpoint=False)]
    layer = Image.new("RGBA", f.size, (0, 0, 0, 0))
    paste(layer, BADGE_BLUE, f.shape(disc))
    at = lambda points: [(x * k * across, y * k) for x, y in points]
    lines = [
        at([(-2.6, 1.4), (-2.6, -2.4)]),  # the i
        at([(-0.2, 3.6), (-0.2, -1.4), (0.8, -2.4), (3, -2.4)]),  # the t
        at([(-1.2, 1.5), (2.6, 1.5)]),  # ... and its bar
    ]
    dot = at([(-2.6, 3.2)])[0] + (0.8 * k,)
    paste(layer, ORANGE, f.strokes(lines, 1.05 * k, [dot]))
    img.alpha_composite(layer.reduce(SS), area[:2])


# --- lifting things out of the card picture ------------------------------


def outlined(card, what):
    """The dark line the card picture draws along the top of a parcel that
    has nothing behind it: bluish pixels next to nothing, over card."""
    r, b = card[..., 0].astype(int), card[..., 2].astype(int)
    bare = card[..., 3] < 40
    board = what & (r > 190) & (r - b > 40)
    line = what & grow(bare, 1) & (b - r > 15) & np.roll(board, -1, 0)
    # ... and the same line's dark blue anywhere else along its edge
    return line | (what & grow(~what, 1) & (r < 125) & (b - r > 40))


def lift(card, what, on_pad=False):
    """What is in the mask, out of the card picture: cropped to its box, and
    that box's corner. on_pad is for something that will stand wholly on a
    pad, though it has nothing behind it in the card picture: its edges
    there are darkened for that, so they are left behind."""
    # Round it, only the soft pixels the picture has over nothing: over the
    # pad they are all but the pad's colour
    soft = grow(what, 1) & ~what & (card[..., 3] < 250) & ~grow(far_line(card), 1)
    if on_pad:
        what = what & ~outlined(card, what) & (card[..., 3] > 250)
        soft = np.zeros_like(what)
    ys, xs = np.where(what | soft)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    sprite = card[y0:y1, x0:x1].copy()
    sprite[..., 3] = np.where((what | soft)[y0:y1, x0:x1], sprite[..., 3], 0)
    return sprite, (x0, y0)


def stand(img, sprite, corner, scale, point, at):
    """Put a lifted thing in the artwork, `scale` times its size, so that
    `point` of the card picture comes to `at`."""
    size = (round(sprite.shape[1] * scale), round(sprite.shape[0] * scale))
    part = Image.fromarray(sprite)
    if scale != 1:
        # Scaled with its colours weighted by how solid they are, so the
        # edges do not pick up the colour of what is not there
        part = part.convert("RGBa").resize(size, Image.LANCZOS).convert("RGBA")
    x = round(at[0] - (point[0] - corner[0]) * scale)
    y = round(at[1] - (point[1] - corner[1]) * scale)
    img.alpha_composite(part, (x, y))
    return x, y, size[0], size[1]


def the_man(card):
    """The man without his phone: all of the pair left of the phone's edge,
    and the hand and sleeve that reach across it."""
    pair = standing_on(card, CARD_MAN, MAN)
    ys, xs = np.mgrid[0 : card.shape[0], 0 : card.shape[1]]
    # How far over the phone's left edge his arm comes in each row: nothing
    # above his fingertips, his hand, then his sleeve slanting back
    reach = np.where(ys < 615, 0, np.where(ys < 625, 1027.5, 1025.5 - (ys - 627) * 0.615))
    # ... and what is his there: skin and sleeve are red, the screen is not,
    # and the phone's edge is grey
    r, g, b = (card[..., i].astype(int) for i in range(3))
    his = (r > 120) & ~((abs(r - g) < 14) & (abs(g - b) < 14))
    return pair & ((xs < 1017.5) | ((xs < reach) & his))


def swap_worker(a, card):
    """The artwork with the order placed: see the top of this file."""
    out = clear(a, grow(standing_on(a, STATION, OLD), 2))
    out[grow(standing_on(a, STATION, BOXES), 2)] = TOP + (255,)
    img = Image.fromarray(out)
    # Farthest first
    draw_phone(img, a)
    draw_badge(img)
    tap = (PHONE[0] + TAP[0], PHONE[1] + TAP[0] * DROP - TAP[1])
    box = stand(img, *lift(card, the_man(card)), MAN_SCALE, HAND, tap)
    print(f"  man: x {box[0]}, y {box[1]}, w {box[2]}, h {box[3]}")
    table = standing_on(card, CARD_TABLE, TABLE)
    box = stand(img, *lift(card, table, on_pad=True), TABLE_SCALE, TABLE_FOOT, TABLE_AT)
    print(f"  table: x {box[0]}, y {box[1]}, w {box[2]}, h {box[3]}")
    return np.array(img)
