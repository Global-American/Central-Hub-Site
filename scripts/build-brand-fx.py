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

    python3 -B scripts/build-brand-fx.py      (needs numpy and Pillow)
"""

import os

import numpy as np
from PIL import Image, ImageFilter

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

    # The cyan quarter of each band, painted the band's blue: its edges
    # against the blue, against the navy inside it and against nothing
    R, G, B, A = channels(base)
    cyan = (A > 0) & (G > 235) & (B > 235) & (R < 40)
    near = grow(cyan, 2) & (R < 60) & (A > 0)
    share = np.clip((B - NAVY[2]) / (BAND[2] - NAVY[2]), 0, 1)
    wanted = NAVY[1] + share * (BAND[1] - NAVY[1])
    base[..., 1] = np.where(near & (G > wanted), wanted, G).astype(np.uint8)
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


if __name__ == "__main__":
    main()
