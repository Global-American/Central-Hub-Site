"""Cut the Ship itSmart card picture into the layers its animation uses.

The picture (public/card-thumbnails/ship-itsmart.png) is five trucks standing
on round pads about a phone with a map pin on it. Writes
public/card-thumbnails/fx/ (see components/delivery-art.tsx):
  delivery-base.png       the picture without its trucks, pin and signal
                          marks, with what they stood on filled in, and each
                          pad's cyan quarter painted the blue of the rest of
                          its band (the page draws that quarter itself, so it
                          can turn)
  delivery-truck-N.png    each truck on its own, cropped to its box
  delivery-pin.png        the map pin
  delivery-signal-N.png   each of the three signal marks
  delivery-rings.webp     the pads' bright bands, as a mask for the turning
                          quarter
  delivery-lines.webp     the bands and the thin orbit lines round the trucks,
                          with a soft halo, as a mask for the pulse of light
  delivery-screen.webp    the phone's screen, as a mask for the ripple and
                          the gloss on it

Run it again if the picture changes, then copy the numbers it prints into
components/delivery-art.tsx.

It cuts the Freight itSmart card picture too
(public/card-thumbnails/freight-itsmart.png: a truck, a plane on a round pad
and a ship about a phone, each joined to it by a strip of four lines), for
components/freight-art.tsx:
  freight-base.png        the picture without the three of them, with the
                          pad the plane stood on filled in, the strips run on
                          a little way under where each stood, and the pad's
                          cyan quarter painted the blue of the rest of its
                          band (the page draws that quarter itself)
  freight-truck.png, freight-plane.png, freight-ship.png
                          each on its own, cropped to its box
  freight-ring.webp       the pad's bright band, as a mask for the quarter

    python3 -B scripts/build-brand-fx.py      (needs numpy and Pillow)
"""

import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from hero_iso import grow, label_from

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "card-thumbnails")
OUT = os.path.join(ROOT, "fx")

# A point on each truck, in the order the parcels go round: top, right,
# bottom right, bottom left, left
TRUCKS = [(671, 152), (1105, 242), (1128, 730), (350, 786), (365, 411)]
PIN = (860, 420)
# The box each signal mark is in, and the dot its arcs spread from
SIGNALS = [
    ((740, 50, 826, 112), (757, 94)),
    ((1186, 120, 1270, 178), (1197, 165)),
    ((144, 524, 240, 602), (224, 549)),
]
# The picture's flat colours
BAND, CYAN, NAVY = (8, 155, 255), (0, 254, 253), (10, 88, 152)
TEAL = (10, 146, 188)


def channels(a):
    return [a[..., i].astype(int) for i in range(4)]


def white(alpha):
    img = Image.new("RGBA", (alpha.shape[1], alpha.shape[0]), (255, 255, 255, 255))
    img.putalpha(Image.fromarray(np.clip(alpha, 0, 255).astype(np.uint8)))
    return img


def save(img, name, kind, **options):
    """Write the file whole or not at all: the site imports these pictures,
    and a dev server that reads one half written stops with an error."""
    path = os.path.join(OUT, name)
    img.save(path + ".part", kind, **options)
    os.replace(path + ".part", path)


def save_mask(alpha, name):
    save(white(alpha), name, "WEBP", lossless=True, method=6)


def save_png(a, name):
    save(Image.fromarray(a), name, "PNG", optimize=True)


def box_of(mask, pad=0):
    ys, xs = np.where(mask)
    return xs.min() - pad, ys.min() - pad, xs.max() + 1 + pad, ys.max() + 1 + pad


def fill_holes(mask):
    """The mask with everything it encloses."""
    x0, y0, x1, y1 = box_of(mask, 2)
    part = mask[y0:y1, x0:x1]
    out = mask.copy()
    out[y0:y1, x0:x1] = ~label_from(~part, (0, 0))
    return out


def close(mask, r):
    """Seal gaps up to 2r wide."""
    return ~grow(~grow(mask, r), r)


def cut(a, region):
    """The pixels of the picture in region, cropped to their box."""
    x0, y0, x1, y1 = box_of(region)
    sprite = a[y0:y1, x0:x1].copy()
    sprite[..., 3] = np.where(region[y0:y1, x0:x1], sprite[..., 3], 0)
    return sprite, (x0, y0, x1 - x0, y1 - y0)


def fit_front(cols, low, cx, widths):
    """The ellipse whose front edge runs through the lowest pixel of each
    column: its middle row and half sizes, for the best of the half widths
    tried."""
    best = None
    for a in widths:
        s = np.sqrt(np.clip(1 - ((cols + 0.5 - cx) / a) ** 2, 0, 1))
        m = np.stack([np.ones(len(s)), s], 1)
        (cy, b), *_ = np.linalg.lstsq(m, low, rcond=None)
        err = np.abs(m @ np.array([cy, b]) - low).mean()
        if best is None or err < best[0]:
            best = (err, cx, cy, a, b)
    return best[1:]


def find_pad(a, band, seed):
    """The pad a truck stands on: a bright band round a navy middle, both
    ellipses (middle x, middle y, half width, half height). The navy one sits
    higher, so the band is widest at the front, where both edges are in
    view to measure."""
    sx, sy = seed
    near = np.zeros_like(band)
    near[max(0, sy - 260) : sy + 260, max(0, sx - 300) : sx + 300] = True
    best = None
    todo = band & near
    while todo.any():
        y, x = np.argwhere(todo)[0]
        part = label_from(band & near, (x, y))
        if best is None or part.sum() > best.sum():
            best = part
        todo &= ~part
    ys, xs = np.where(best)
    half = (xs.max() + 1 - xs.min()) / 2
    cx = (xs.min() + xs.max() + 1) / 2
    cols = np.arange(xs.min(), xs.max() + 1)
    low = np.array([ys[xs == c].max() + 1 for c in cols])
    outer = fit_front(cols, low, cx, np.arange(half - 2, half + 6, 0.5))

    # The navy middle's front edge: the navy pixels with the band just below
    R, G, B, _ = channels(a)
    navy = (R < 40) & (G > 60) & (G < 110) & (B > 120) & (B < 180)
    edge = navy & np.roll(best, -2, 0)
    ys, xs = np.where(edge)
    cols = np.unique(xs)
    low = np.array([ys[xs == c].max() + 1 for c in cols])
    inner = fit_front(cols, low, cx, np.arange(half * 0.6, half, 0.5))
    return outer, inner


def fill_pad(base, hidden, outer, inner):
    """What a truck hid of its pad: the navy middle and the band round it."""
    ys, xs = np.where(hidden)

    def inside(pad):
        """How far inside the ellipse each pixel is, in pixels (roughly)."""
        cx, cy, a, b = pad
        far = np.hypot((xs + 0.5 - cx) / a, (ys + 0.5 - cy) / b)
        return (1 - far) * b

    on_pad = np.clip(inside(outer) + 0.5, 0, 1)
    on_navy = np.clip(inside(inner) + 0.5, 0, 1)[:, None]
    colour = np.array(BAND) * (1 - on_navy) + np.array(NAVY) * on_navy
    base[ys, xs, :3] = np.round(colour).astype(np.uint8)
    base[ys, xs, 3] = np.round(on_pad * 255).astype(np.uint8)


def fill_phone(a, hidden):
    """What the pin hid of the phone: its two far edges (straight, each with
    a pale rim, meeting in a rounded corner behind the pin) and the screen
    inside them, teal above a line and navy below it."""
    R, G, B, A = channels(a)
    ys, xs = np.where(hidden)
    x0, x1 = xs.min(), xs.max()

    def top_edge(columns):
        """The first row of the phone in each column."""
        return np.array([np.where(A[380:560, x] > 128)[0][0] + 380 for x in columns])

    def rim(columns, deep):
        """The edge's colours going down into the phone from its first row."""
        tops = top_edge(columns)
        return np.array(
            [[a[t + d, x, :3] for x, t in zip(columns, tops)] for d in range(deep)]
        ).mean(axis=1)

    # The two far edges, from the stretches in view either side of the pin,
    # and how their rims are coloured there
    left_x, right_x = np.arange(x0 - 220, x0 - 6), np.arange(x1 + 6, x1 + 80)
    left_m, left_c = np.polyfit(left_x, top_edge(left_x), 1)
    right_m, right_c = np.polyfit(right_x, top_edge(right_x), 1)
    rims = [rim(left_x[-40::4], 4), rim(right_x[:24:4], 6)]

    # Where teal turns to navy across the screen (a straight line)
    teal = (abs(R - TEAL[0]) < 12) & (abs(G - TEAL[1]) < 12) & (abs(B - TEAL[2]) < 12)
    split_x = np.r_[np.arange(x0 - 90, x0 - 20, 6), np.arange(x1 + 20, x1 + 80, 6)]
    split_y = [np.where(teal[430:540, x])[0].max() + 431 for x in split_x]
    split_m, split_c = np.polyfit(split_x, split_y, 1)

    # How deep inside each edge every hidden pixel is, straight down and
    # across the edge, rounding the corner where both are small
    down = [ys + 0.5 - (left_m * xs + left_c), ys + 0.5 - (right_m * xs + right_c)]
    across = [down[0] / np.hypot(1, left_m), down[1] / np.hypot(1, right_m)]
    deep = np.minimum(*across)
    r = 31
    corner = (across[0] < r) & (across[1] < r)
    deep[corner] = r - np.hypot(r - across[0][corner], r - across[1][corner])

    # The screen, with the line between its two colours softened
    mix = np.clip(ys + 0.5 - (split_m * xs + split_c) + 0.5, 0, 1)[:, None]
    colour = np.array(TEAL) * (1 - mix) + np.array(NAVY) * mix
    # ... and over it the rim of whichever edge is nearer
    for side in (0, 1):
        mine = across[side] <= across[1 - side]
        steps = len(rims[side])
        step = np.clip(deep * np.hypot(1, [left_m, right_m][side]), 0, steps - 1.001)
        low = np.floor(step).astype(int)
        shade = rims[side][low] + (rims[side][low + 1] - rims[side][low]) * (step - low)[:, None]
        on_rim = mine & (step < steps - 1.5)
        colour[on_rim] = shade[on_rim]
    a[ys, xs, :3] = np.round(colour).astype(np.uint8)
    a[ys, xs, 3] = np.round(np.clip(deep + 0.5, 0, 1) * 255).astype(np.uint8)


def blue_quarters(base):
    """The cyan quarter of each band, painted the band's blue: its edges
    against the blue, against the navy inside it and against nothing."""
    R, G, B, A = channels(base)
    cyan = (A > 0) & (G > 235) & (B > 235) & (R < 40)
    near = grow(cyan, 2) & (R < 60) & (A > 0)
    share = np.clip((B - NAVY[2]) / (BAND[2] - NAVY[2]), 0, 1)
    wanted = NAVY[1] + share * (BAND[1] - NAVY[1])
    base[..., 1] = np.where(near & (G > wanted), wanted, G).astype(np.uint8)


def main():
    os.makedirs(OUT, exist_ok=True)
    a = np.array(Image.open(os.path.join(ROOT, "ship-itsmart.png")).convert("RGBA"))
    R, G, B, A = channels(a)
    solid = A > 40
    base = a.copy()
    print(f"picture: {a.shape[1]} x {a.shape[0]}")

    # The pads' bright bands (blue, with a cyan quarter) and the orbit lines
    cyan = solid & (G > 235) & (B > 235) & (R < 40)
    band = solid & (R < 40) & (B > 235) & ((abs(G - BAND[1]) < 30) | (G > 235))
    lines = solid & (R < 60) & (G > 150) & (B > 200) & ~band

    # Trucks: everything that is not one of the picture's blues, plus their
    # black tyres, whatever that encloses, the navy badge on the box (it
    # hangs over the box's edge, so nothing encloses it) and the grey-blue
    # pieces of chassis that show under and behind the box
    spread = np.max(a[..., :3], axis=2).astype(int) - np.min(a[..., :3], axis=2)
    body = solid & ((R > 80) | ((np.max(a[..., :3], axis=2) < 80) & (spread < 25)))
    chassis = solid & (R > 45) & (R <= 80) & (B - R > 40) & (B < 200)
    rows, cols = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    print("trucks (x, y, w, h), then their pads (middle x, y, half width, half height)")
    for n, seed in enumerate(TRUCKS, 1):
        truck = fill_holes(close(label_from(body, seed), 2))
        x0, y0, x1, y1 = box_of(truck)
        w = x1 - x0
        badge = np.hypot((cols - (x0 + 0.77 * w)) / (0.105 * w), (rows - (y0 + 0.24 * w)) / (0.07 * w)) < 1
        truck |= badge & (A > 0)
        todo = chassis & grow(truck, 3)
        while todo.any():
            y, x = np.argwhere(todo)[0]
            part = label_from(chassis, (x, y))
            truck |= part
            todo &= ~part
        sprite, box = cut(a, grow(truck, 1))
        save_png(sprite, f"delivery-truck-{n}.png")
        outer, inner = find_pad(a, band, seed)
        fill_pad(base, grow(truck, 2), outer, inner)
        print(f"  {n}: {tuple(int(v) for v in box)}  pad {tuple(round(float(v), 1) for v in outer)}")

    # The pin: its oranges and the hole through it, which the picture paints
    # navy (with a sliver of the phone's rim, painted over here)
    orange = solid & (R > 170) & (G > 70) & (G < 190) & (B < 110)
    pin = label_from(orange, PIN)
    hole = fill_holes(pin) & ~pin
    whole = grow(pin | hole, 1)
    art = a.copy()
    pale = (R > 120) & (B > 150)
    art[hole & (~grow(pin, 1) | pale)] = NAVY + (255,)
    sprite, box = cut(art, whole)
    save_png(sprite, "delivery-pin.png")
    ys, xs = np.where(pin)
    print(f"pin: {tuple(int(v) for v in box)}  tip ({int(xs[ys == ys.max()].mean())}, {ys.max()})")
    hidden = grow(pin | hole, 2)
    fill_phone(base, hidden)

    # Signal marks: every separate piece that lies wholly in its box
    print("signal marks (x, y, w, h), then the dot they spread from")
    for n, (area, dot) in enumerate(SIGNALS, 1):
        x0, y0, x1, y1 = area
        mark = np.zeros_like(solid)
        todo = np.zeros_like(solid)
        todo[y0:y1, x0:x1] = A[y0:y1, x0:x1] > 0
        while todo.any():
            y, x = np.argwhere(todo)[0]
            part = label_from(A > 0, (x, y))
            bx0, by0, bx1, by1 = box_of(part)
            if bx0 >= x0 and by0 >= y0 and bx1 <= x1 and by1 <= y1:
                mark |= part
            todo &= ~part
        sprite, box = cut(a, mark)
        save_png(sprite, f"delivery-signal-{n}.png")
        base[mark] = 0
        lines &= ~mark
        print(f"  {n}: {tuple(int(v) for v in box)}  dot {dot}")

    blue_quarters(base)
    save_png(base, "delivery-base.png")

    # Masks. The bands as they are now in view (the trucks stand in front)
    R, G, B, A = channels(base)
    band = (A > 40) & (R < 40) & (B > 235) & (G > 125) & (G < 185)
    soft = white(band * 255).getchannel("A").filter(ImageFilter.GaussianBlur(0.6))
    save_mask(np.array(soft), "delivery-rings.webp")
    glow = (lines | band) * 255.0
    halo = white(glow).getchannel("A").filter(ImageFilter.GaussianBlur(5))
    save_mask(np.maximum(glow, np.minimum(np.array(halo) * 2.2, 200)), "delivery-lines.webp")

    # The phone's screen: its teal and navy and the lettering on them
    R, G, B, A = channels(base)
    flat = (R < 40) & (G > 70) & (G < 165) & (B > 130) & (B < 205)
    screen = fill_holes(close(label_from(flat & (A > 250), (640, 600)), 3))
    soft = white(screen * 255).getchannel("A").filter(ImageFilter.GaussianBlur(0.6))
    save_mask(np.array(soft), "delivery-screen.webp")
    print(f"screen: {tuple(int(v) for v in box_of(screen))}")


# --- the Freight itSmart card picture ------------------------------------

# A point on the plane's body, on the truck's box and on the ship's hull,
# and one on the band of the pad the plane stands on
PLANE, TRUCK, SHIP = (330, 770), (560, 300), (1200, 800)
RING = (250, 900)
# The truck's three back wheels: the picture has a gap between them and it
TRUCK_WHEELS = (622, 385)
# The bottom edge of the truck's box: a point on it, and how far it rises
# for each pixel across. The strip of lines comes out from under it, between
# two of the truck's wheels: it lies between these two heights where it
# would cross the picture's left edge (it drops one pixel for two across)
TRUCK_EDGE, TRUCK_RISE = (478, 460), 0.577
TRUCK_STRIP = (124, 183)
# The ship's strip is all up and left of here (its own blues are not)
SHIP_STRIP = (1105, 725)
# The band of the plane's pad is not a whole ring: at the back it stops
# short, and is missing between these two columns (the plane hides its end
# on the left, a little way behind the tail)
RING_GAP = (303, 452)
# A box round where each strip meets what stands on it, and the point the
# strip is run on to under it, where it is cut square across
# The plane's strip where it is clear of both the phone and the pad: a column
# it crosses and its first row there, and how far apart its lines are
PLANE_STRIP = (516, 697)
PLANE_LINES = 17
STRIPS = {
    "truck": ((500, 380, 720, 520), (522, 399)),
    "ship": ((900, 620, 1110, 730), (1130, 725)),
    "plane": ((440, 680, 620, 790), (362, 803)),
}


def line_strip(a):
    """The strips of lines to the phone: their glow and the navy between."""
    R, G, B, A = channels(a)
    return (A > 40) & (G - R > 55) & (B > 135) & (R < 115)


def find_ring(a, band, hidden):
    """The pad the plane stands on: its band's outer edge and the navy middle
    inside it, both ellipses (middle x, middle y, half width, half height).
    Like find_pad, but the plane hides parts of the band, so the columns it
    is in the way in are left out, and the middle is measured across and
    from front to back."""
    ys, xs = np.where(band)
    half = (xs.max() + 1 - xs.min()) / 2
    cx = (xs.min() + xs.max() + 1) / 2
    cols = np.unique(xs)
    low = np.array([ys[xs == c].max() + 1 for c in cols])
    seen = np.array([not hidden[y - 4 : y + 4, c].any() for c, y in zip(cols, low)])
    outer = fit_front(cols[seen], low[seen], cx, np.arange(half - 2, half + 6, 0.5))

    # How wide the middle is: the widest gap in the band, of the rows round
    # the pad's own middle that the plane is not in the way in
    spans = []
    for row in range(int(outer[1]) - 30, int(outer[1]) + 30):
        there = np.where(band[row])[0]
        left, right = there[there < cx].max() + 1, there[there > cx].min()
        if not hidden[row, left - 3 : left + 3].any() and not hidden[row, right - 3 : right + 3].any():
            spans.append((right - left, (left + right) / 2))
    wide, mid = max(spans)
    # ... and how deep: from the first navy at the back to the band in front
    R, G, B, A = (v[:, int(mid)] for v in channels(a))
    navy = (A > 250) & (R < 40) & (G > 60) & (G < 110) & (B > 120) & (B < 180)
    back = np.where(navy)[0].min()
    front = ys[(xs == int(mid)) & (ys > outer[1])].min()
    return outer, (mid, (back + front) / 2, wide / 2, (front - back) / 2)


def heading(glow):
    """Which way a strip's lines run: how far down they go for each pixel
    across. Found by sliding the lines along themselves: first a few rows,
    which only fits one way, then further for a finer answer."""

    def best(rows, around, reach):
        tries = range(around - reach, around + reach + 1)
        return max(tries, key=lambda dx: (glow & np.roll(np.roll(glow, rows, 0), dx, 1)).sum())

    near = best(6, 0, 16)
    far = best(30, near * 5, 4)
    return 30 / far


def run_on(base, into, area, stop, within=None):
    """Run a strip of lines on under where something stood, as far as
    `stop`, and cut it off there along the floor's other axis: the strip is
    laid down again a little further along itself, as often as it takes."""
    x0, y0, x1, y1 = area
    R, G, B, A = channels(base)
    here = np.zeros(base.shape[:2], bool)
    here[y0:y1, x0:x1] = True
    strip = line_strip(base) & ~into & here
    if within is not None:
        strip &= within
    drop = heading(strip & (G > 190))
    ys, xs = np.mgrid[0 : base.shape[0], 0 : base.shape[1]]
    # Which side of the cut the strip is on
    side = lambda x, y: (y - stop[1]) + drop * (x - stop[0])
    sy, sx = np.where(strip)
    keep = np.sign(side(xs, ys)) == np.sign(np.median(side(sx, sy)))
    # (its last pixels against what stood on it are blurred into that: they
    # are laid again too)
    strip &= ~grow(into, 3)
    todo = grow(into, 3) & keep & (into | line_strip(base)) & here | (into & keep)
    # A step along the strip that lands on whole pixels both ways
    dx = min(range(8, 34), key=lambda n: abs(n * drop - round(n * drop)))
    dx *= 1 if stop[0] > np.median(sx) else -1
    dy = round(dx * drop)
    for _ in range(40):
        back = np.roll(np.roll(strip, dy, 0), dx, 1) & todo
        if not back.any():
            break
        py, px = np.where(back)
        base[py, px] = base[py - dy, px - dx]
        strip |= back
        todo &= ~back
    return drop


def mend_back(base, blue, hidden, outer, middle):
    """The back of the pad's band where the plane's tail hid it. The band is
    narrower at the back than fill_pad draws it, so what that drew there is
    taken out again, and the band's two edges are run across from the
    columns in view either side of the tail. The band has a gap at the back,
    which stays empty. `blue` is everything the band's colour."""
    rows = np.arange(base.shape[0])[:, None]
    behind = rows < outer[1] - 30
    ys, xs = np.where(hidden & ~middle & behind)
    base[ys, xs, 3] = 0

    # The band there: the first run of its colour down each column, from
    # not far above where fill_pad would have it (the thin lines round the
    # pad are the same colour)
    cols = np.arange(int(outer[0] - outer[2]) + 30, RING_GAP[0] - 12)
    cx, cy, a, b = outer
    reach = np.hypot((cols + 0.5 - cx) / a, (rows + 0.5 - cy) / (b + 30)) < 1
    back = blue[:, cols] & behind & reach
    top = np.where(back.any(axis=0), back.argmax(axis=0), 0)
    low = np.array([t + np.argmin(np.r_[back[t:, i], False]) for i, t in enumerate(top)])
    # (not where the band runs into its front, or the plane is in the way)
    seen = np.array([8 < b - t < 60 and not hidden[t - 4 : b + 4, c].any() for c, t, b in zip(cols, top, low)])
    top = np.interp(cols, cols[seen], top[seen])
    low = np.interp(cols, cols[seen], low[seen])
    under = (cols > cols[seen].min()) & (cols < cols[seen].max()) & ~seen
    for c, t, b in zip(cols[under], top[under], low[under]):
        ys = np.where(hidden[:, c] & ~middle[:, c] & behind[:, 0])[0]
        on = np.clip(ys + 1 - t, 0, 1) * np.clip(b - ys, 0, 1)
        base[ys, c, :3] = BAND
        base[ys, c, 3] = np.round(on * 255).astype(np.uint8)


def ellipse_mask(shape, ellipse, by=4):
    """How much of each pixel is inside the ellipse (middle x, middle y, half
    width, half height): 0 to 1, with soft edges."""
    cx, cy, a, b = ellipse
    x0, y0 = int(cx - a) - 2, int(cy - b) - 2
    w, h = int(2 * a) + 5, int(2 * b) + 5
    img = Image.new("L", (w * by, h * by), 0)
    box = [(cx - a - x0) * by, (cy - b - y0) * by, (cx + a - x0) * by, (cy + b - y0) * by]
    ImageDraw.Draw(img).ellipse(box, fill=255)
    out = np.zeros(shape)
    out[y0 : y0 + h, x0 : x0 + w] = np.array(img.reduce(by)) / 255
    return out


def lay(base, colour, cover):
    """Paint the colour over the picture, as solidly as `cover` says (0-1)."""
    old = base[..., 3:4] / 255
    cover = cover[..., None]
    alpha = cover + old * (1 - cover)
    rgb = (np.array(colour, float) * cover + base[..., :3] * old * (1 - cover)) / np.maximum(alpha, 1e-6)
    base[..., :3] = np.round(rgb).astype(np.uint8)
    base[..., 3] = np.round(alpha[..., 0] * 255).astype(np.uint8)


def tidy_pad(base, a, outer, inner, navy, plane, drop):
    """The plane's pad drawn clean, now the plane is a picture of its own and
    the whole pad is in view. The artwork only draws what shows round the
    plane, so mending it piece by piece leaves it ragged where the plane
    stood: the band stops short at the back, and the lines from the phone
    break off in the middle. Instead the pad is laid afresh: the band as a
    whole ring, the navy middle on it, and the lines from the phone run on
    over both as far as the middle of the pad, where they fade out.

    outer, inner: the band's outer edge and the navy middle (ellipses);
    navy: the middle's colour; drop: how far down the lines go for each
    pixel across."""
    ys, xs = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    # The strip of lines as it is between the phone and the pad: a column of
    # it, to draw it again along its length. Nowhere is all of it in view
    # (the phone is over its top or the pad's band under its foot), so the
    # last of its four lines is the third laid again, a line's step lower.
    R, G, B, A = channels(a)
    cx, cy, ra, rb = outer
    far = np.hypot((xs + 0.5 - cx) / ra, (ys + 0.5 - cy) / rb)
    ref, top = PLANE_STRIP
    column = a[top : top + 43, ref].astype(float)
    fourth = a[top + 43 - PLANE_LINES : top + 43, ref].astype(float)
    column = np.concatenate([column, fourth, np.zeros((2, 4))])

    # Whatever was mended under the plane outside the pad goes, then the pad
    R, G, B, A = channels(base)
    band = (R < 40) & (B > 225) & (abs(G - BAND[1]) < 35)
    base[(plane | (grow(plane, 3) & band)) & (far > 1) & (far < 1.2), 3] = 0
    lay(base, BAND, ellipse_mask(a.shape[:2], outer))
    lay(base, tuple(navy), ellipse_mask(a.shape[:2], inner))

    # The lines: each pixel on the pad takes the strip's colour from where
    # its own line crosses that column, fading to nothing towards the middle
    # of the pad (measured along the lines)
    on_pad = (far < 1.03) & (xs <= ref)
    py, px = np.where(on_pad)
    at = py + drop * (ref - px) - top
    inside = (at >= 0) & (at < len(column) - 1)
    py, px, at = py[inside], px[inside], at[inside]
    low = np.floor(at).astype(int)
    part = (at - low)[:, None]
    colour = column[low] * (1 - part) + column[low + 1] * part
    step = np.hypot(1, drop)
    along = ((px - cx) + (py - cy) * drop) / step  # how far past the middle, in pixels
    fade = np.clip((along + 10) / 70, 0, 1)
    cover = np.zeros(a.shape[:2])
    cover[py, px] = colour[:, 3] / 255 * fade
    paint = np.zeros(a.shape[:2] + (3,))
    paint[py, px] = colour[:, :3]
    old = base[..., 3:4] / 255
    c = cover[..., None]
    alpha = c + old * (1 - c)
    base[..., :3] = np.round((paint * c + base[..., :3] * old * (1 - c)) / np.maximum(alpha, 1e-6)).astype(np.uint8)
    base[..., 3] = np.round(alpha[..., 0] * 255).astype(np.uint8)


def freight():
    a = np.array(Image.open(os.path.join(ROOT, "freight-itsmart.png")).convert("RGBA"))
    R, G, B, A = channels(a)
    solid = A > 40
    ys, xs = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    print(f"freight picture: {a.shape[1]} x {a.shape[0]}")

    # The plane is the only thing its pale grey, with windows, letters and a
    # windscreen let into it (and one of the pad's thin lines drawn across a
    # wing)
    pale = solid & (R > 150) & (abs(R - B) < 45) & (abs(R - G) < 45)
    plane = fill_holes(label_from(close(pale, 2), PLANE))
    plane = grow(close(plane | (grow(plane, 6) & solid & (B - G > 50) & (G < 70)), 2), 1)  # its windscreen
    # The truck and the ship are joined to the phone only by their strips.
    # (The truck is in pieces, with gaps a pixel wide between them: joined
    # corner to corner counts, so label_from is given it a little fattened.)
    strip = line_strip(a)
    below = ys > TRUCK_EDGE[1] - TRUCK_RISE * (xs - TRUCK_EDGE[0]) - 2
    height = ys - xs / 2
    rest = solid & ~(strip & below & (height > TRUCK_STRIP[0]) & (height < TRUCK_STRIP[1]))
    truck = (label_from(grow(rest, 1), TRUCK) | label_from(grow(rest, 1), TRUCK_WHEELS)) & rest
    by_phone = (xs < SHIP_STRIP[0]) & (ys < SHIP_STRIP[1])
    ship = label_from(solid & ~(strip & by_phone), SHIP)

    base = a.copy()
    print("vehicles (x, y, w, h)")
    for name, mask in (("truck", truck), ("plane", plane), ("ship", ship)):
        sprite, box = cut(a, mask)
        save_png(sprite, f"freight-{name}.png")
        base[mask] = 0
        print(f"  {name}: {tuple(int(v) for v in box)}")

    # The pad under the plane: its band (blue, with a cyan quarter) round a
    # navy middle. The picture shades the middle darker round the plane;
    # without the plane that goes too.
    blue = solid & (R < 40) & (B > 225) & ((abs(G - BAND[1]) < 35) | (G > 215)) & ~plane
    band = label_from(blue, RING)
    outer, inner = find_ring(a, band, grow(plane, 3))
    print(f"pad: {tuple(round(float(v), 1) for v in outer)}")
    cx, cy, ra, rb = inner
    middle = np.hypot((xs + 0.5 - cx) / ra, (ys + 0.5 - cy) / rb) < 1 - 2 / rb
    flat = middle & (R < 40) & (G < 110)  # (not the glow of the lines across it)
    navy = np.median(a[flat & ~grow(plane, 14) & (B > 138)][:, :3], axis=0)
    shade = flat & grow(plane, 14) & ~plane & (B < navy[2] - 3)
    hidden = grow(plane, 2)
    fill_pad(base, hidden, outer, inner)
    inside = (base[..., 3] > 0) & middle & (hidden | shade)
    base[inside, :3] = np.round(navy).astype(np.uint8)
    mend_back(base, blue, hidden, outer, middle)

    for name, mask, within in (("truck", truck, None), ("ship", ship, None), ("plane", hidden & middle, middle)):
        drop = run_on(base, mask, *STRIPS[name], within)
        print(f"  {name}'s lines drop {drop:.3f} for each pixel across")
    # (the plane's is the last of them: its pad is then drawn clean)
    tidy_pad(base, a, outer, inner, navy, plane, drop)

    blue_quarters(base)
    save_png(base, "freight-base.png")
    R, G, B, A = channels(base)
    ring = (A > 40) & (R < 40) & (B > 235) & (G > 125) & (G < 185)
    ring &= np.hypot((xs + 0.5 - outer[0]) / outer[2], (ys + 0.5 - outer[1]) / outer[3]) < 1.02
    soft = white(ring * 255).getchannel("A").filter(ImageFilter.GaussianBlur(0.6))
    save_mask(np.array(soft), "freight-ring.webp")


# --- the Return itSmart card picture --------------------------------------

# A point on the side of its truck
RETURN_TRUCK = (527, 639)


def returns():
    """The Return itSmart card picture with the front of its truck's box
    filled in: the artwork leaves it see-through, so that the page shows
    between the box and the cab. Written as return-base.png, which the site
    shows in place of the picture itself (lib/brands.ts)."""
    from hero_delivery import fill_box_front

    a = np.array(Image.open(os.path.join(ROOT, "return-itsmart.png")).convert("RGBA"))
    save_png(fill_box_front(a, RETURN_TRUCK), "return-base.png")


if __name__ == "__main__":
    main()
    freight()
    returns()
