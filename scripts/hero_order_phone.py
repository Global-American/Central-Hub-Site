"""The Fulfillment hero's bottom right station: a man placing an order.

The artwork has a worker wheeling a box on a hand truck past a tall phone
there. swap_worker takes them out, fills in the pad they stood on, and stands
in their place the man tapping "ORDER PLACED" on a phone from the Fulfill
itSmart card picture (public/card-thumbnails/fulfill-itsmart.png). The
forklift and the boxes on the pad stay as they are.
Used by build-hero-fx.py.
"""

import numpy as np
from PIL import Image

from hero_iso import grow, label_from

# The pads' flat colours in both pictures: the top, its side, and the thin
# line along the top's far edges
TOP, SIDE, RIM = (218, 236, 245), (137, 167, 190), (90, 145, 188)

# The hero's station: the box its pad is in (x0, y0, x1, y1) and a point on
# the old phone, which the worker and his hand truck touch
PAD = (940, 640, 1340, 920)
OLD = (1250, 650)
# The card's station, and a point on the man there (he touches his phone)
CARD_PAD = (880, 520, 1120, 760)
NEW = (992, 650)
# How much larger the pair is drawn than in the card (about the size of the
# worker they replace), and where the man's leading foot goes
SCALE = 1.35
FOOT = (1179, 848)


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
    """Everything joined to the seed that stands on the pad in the box (the
    pad's own far line aside, which runs behind it)."""
    x0, y0, x1, y1 = box
    things = np.zeros(a.shape[:2], bool)
    part = a[y0 - 140 : y1, x0:x1]
    things[y0 - 140 : y1, x0:x1] = (part[..., 3] > 40) & ~flat(part, TOP, 12)
    return label_from(things & ~far_line(a), seed)


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


def lift(card):
    """The man and his phone out of the card picture, cropped to their box,
    and where his leading foot is in that crop."""
    pair = standing_on(card, CARD_PAD, NEW)
    # Round them, only the soft pixels the picture has over nothing: over the
    # pad they are all but the pad's colour
    soft = grow(pair, 1) & ~pair & (card[..., 3] < 250) & ~grow(far_line(card), 1)
    ys, xs = np.where(pair | soft)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    sprite = card[y0:y1, x0:x1].copy()
    sprite[..., 3] = np.where((pair | soft)[y0:y1, x0:x1], sprite[..., 3], 0)
    low = np.where(pair[y1 - 1])[0]
    return sprite, (low.mean() - x0 + 0.5, y1 - y0)


def swap_worker(a, card):
    """The artwork with the order placed: see the top of this file."""
    out = clear(a, grow(standing_on(a, PAD, OLD), 2))
    sprite, foot = lift(card)
    size = (round(sprite.shape[1] * SCALE), round(sprite.shape[0] * SCALE))
    # Scaled with its colours weighted by how solid they are, so the edges
    # do not pick up the colour of what is not there
    big = Image.fromarray(sprite).convert("RGBa").resize(size, Image.LANCZOS).convert("RGBA")
    img = Image.fromarray(out)
    at = (round(FOOT[0] - foot[0] * SCALE), FOOT[1] - size[1])
    img.alpha_composite(big, at)
    print(f"  order phone: x {at[0]}, y {at[1]}, w {size[0]}, h {size[1]}")
    return np.array(img)
