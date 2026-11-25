"""The warehouse on the top left pad of the Fulfillment hero picture.

The artwork has the warehouse along the pad's top right edge and a yard in
front of it: stacks of boxes, a robot arm, a table of parcels and a grey
forklift. swap_yard clears the pad and leaves on it:
  - the warehouse alone, along the pad's top left edge. That is the
    drawing's mirror image, except for the lettering on its side, which
    would read backwards: the lettering is lifted off first and put back
    leaning the other way. The two slopes of its roof change colours, so it
    is still lit from the left like the rest of the picture
  - an orange forklift from the Fulfill itSmart card picture
    (public/card-thumbnails/fulfill-itsmart.png), taking its load in at the
    warehouse's door
Used by build-hero-fx.py.
"""

import numpy as np
from PIL import Image

import hero_order_phone as order
from hero_iso import ISO_X, ISO_Y, grow, label_from

# The pad: the box it is in, and the box all that stands on it is in
PAD = (148, 190, 520, 425)
STATION = (148, 140, 520, 425)
# The columns nothing stands in at either end of the pad, which are left as
# they are, and how many of them the pad's rounded corners bend its edges in
KEPT, CORNER = 10, 8
# The pad is 359 columns wide, from 154: column x goes to MIRROR - x
MIRROR = 666

# --- the warehouse in the artwork ----------------------------------------

# The columns it is in (its roof reaches a little past its walls)
COLUMNS = (272, 503)
# Its flat colours: the walls, and the roof's slope towards the light and
# the one away from it
WALL = (146, 173, 194)
ROOF_LIT, ROOF_SHADE = (219, 235, 249), (207, 220, 235)
# The wall with the door in it. Its left edge: the column that is part wall
# and part pad, the first row of the wall there, and where the edge is at
# that row and how far it leans left for each row down
EDGE, EDGE_TOP = 274, 224
EDGE_AT, EDGE_LEAN = (274.82, 228), 0.0197
# The foot of that wall, y = FOOT[0] * x + FOOT[1]: the yard's table and the
# parcels on it stand in front of it up to the column HIDDEN
FOOT = (0.613, 102.144)
HIDDEN = 304
# ... with the last of the three windows left of the door, which are the
# same as the three right of it: the box the left ones are in, and about how
# far along the wall the right ones are
WINDOWS = (278, 232, 303, 284)
WINDOW_STEP = (90, 55)
# The other wall ends at this column: right of it there is pad again from
# this row down
END, END_PAD = 499, 282
# The lettering on that wall: the columns it is in, how far above the wall's
# foot it reaches, how much it climbs for each pixel across, and its inks
LETTERS_X = (408, 498)
LETTERS_UP = (8, 50)
LETTERS_CLIMB = 0.58
NAVY, ORANGE = (6, 74, 144), (254, 167, 48)

# --- the forklift in the card picture ------------------------------------

# The card picture has two of them, the same drawing: the one on the right
# has a pallet of boxes in front of its load, and the one on the left has
# one in front of its roof. So the forklift is the right one from this
# column on, and left of it the left one, which is this far from it
FORKLIFT = (1301, 705)  # a point on the right one's body
FORKLIFT_SPLIT = 1250
FORKLIFT_TWIN = (-558, 74)
# The foot of the wheel nearest its forks, how much smaller the forklift is
# drawn than there, and where that wheel stands on the pad: how far out
# from the warehouse's door, and how far to the left of the door's middle
WHEEL = (1238, 716)
FORKLIFT_SCALE = 0.75
FORKLIFT_OUT, FORKLIFT_LEFT = 32, 16
# The middle of the foot of the door, in the artwork as it came
DOOR = (338, 309.3)


def share(pixels, of, towards):
    """How far each pixel's colour is from `of` to `towards` (0 to 1)."""
    step = np.array(towards, float) - np.array(of, float)
    part = ((pixels[..., :3].astype(float) - of) * step).sum(axis=-1) / (step**2).sum()
    return np.clip(part, 0, 1)


def is_colour(a, colour, slack=2):
    return np.abs(a[..., :3].astype(int) - np.array(colour)).max(axis=-1) <= slack


# --- the pad --------------------------------------------------------------


def bare_pad(a):
    """The artwork with everything taken off the pad: its top drawn all the
    way to its far edge, with the thin line along that edge, and nothing
    beyond.

    The pad's top is the same shape upside down, so its far edge is its near
    edge flipped: far + near comes to the same in every column, but for a
    drift of a pixel or two across the pad. The near edge is in view all the
    way along; the sum is taken from the columns the far edge is in view in
    too, and a line is run through them."""
    x0, y0, x1, y1 = PAD
    far, near = order.pad_edges(a, PAD)
    there = np.where(~np.isnan(near))[0]
    first, last = there.min(), there.max()
    seen = np.zeros(x1 - x0, bool)
    for i in range(first + CORNER, last - CORNER + 1):
        seen[i] = not np.isnan(far[i]) and a[int(far[i]) - 3, x0 + i, 3] == 0
    cols, total = np.where(seen)[0], (far + near)[seen]
    for _ in range(3):  # (less the odd column where something stands in the way)
        line = np.polyfit(cols, total, 1)
        fits = np.abs(np.polyval(line, cols) - total) < 1
        cols, total = cols[fits], total[fits]
    ys, xs = np.mgrid[STATION[1] : y1, first + KEPT : last - KEPT + 1]
    edge = np.polyval(line, xs) - near[xs]
    on_pad = ys + 1 < near[xs]  # never touch the pad's side
    ys, xs, edge = ys[on_pad], xs[on_pad] + x0, edge[on_pad]
    on_top = np.clip(ys + 1 - edge, 0, 1)
    on_rim = np.clip(ys + 2 - edge, 0, 1) - on_top
    cover = on_top + on_rim
    colour = (np.outer(on_top, order.TOP) + np.outer(on_rim, order.RIM)) / np.maximum(cover, 1e-6)[:, None]
    out = a.copy()
    out[ys, xs, :3] = np.round(colour).astype(np.uint8)
    out[ys, xs, 3] = np.round(cover * 255).astype(np.uint8)
    return out


# --- the warehouse --------------------------------------------------------


def foot(x):
    """The foot of the door's wall in column x."""
    return FOOT[0] * (x + 0.5) + FOOT[1]


def find_warehouse(a):
    """The rows the warehouse is in, in each of its columns: from the first
    row there is anything in down to where the pad's top begins (or nothing
    does: the roof's ends stand clear of the pad). Returns the mask and, by
    column, the row after its last."""
    mask = np.zeros(a.shape[:2], bool)
    ends = {}
    pad = is_colour(a, order.TOP) & (a[..., 3] == 255)
    for x in range(*COLUMNS):
        rows = np.where(a[STATION[1] : STATION[3], x, 3] > 0)[0]
        if not len(rows):
            continue
        top = y = STATION[1] + rows[0]
        if EDGE <= x <= HIDDEN:
            # Behind the yard's table its foot is not in view: it is where
            # the wall's line says
            y = int(foot(x)) + 2
        else:
            while a[y, x, 3] > 0 and not pad[y, x]:
                y += 1
            if x > END:
                y = min(y, END_PAD)
        mask[top:y, x] = True
        ends[x] = y
    return mask, ends


def hidden(a, mask):
    """What of the warehouse the table and its parcels are in front of: card
    and the table's purple, and a pixel or two round them."""
    r, g, b = (a[..., i].astype(int) for i in range(3))
    card = (r > 180) & (r - b > 40)
    purple = (r < 110) & (g < r) & (b > r)
    yard = np.zeros_like(mask)
    yard[STATION[1] :, : HIDDEN + 3] = True
    return mask & grow((card | purple) & yard, 2) & yard


def window_step(a, seen):
    """How far the windows right of the door are from the ones left of it:
    wherever the left ones' part in view matches best."""
    x0, y0, x1, y1 = WINDOWS
    mine = a[y0:y1, x0:x1, :3].astype(int)
    best = None
    for dx in range(WINDOW_STEP[0] - 4, WINDOW_STEP[0] + 5):
        for dy in range(WINDOW_STEP[1] - 4, WINDOW_STEP[1] + 5):
            other = a[y0 + dy : y1 + dy, x0 + dx : x1 + dx, :3].astype(int)
            off = np.abs(mine - other).sum(axis=2)[seen[y0:y1, x0:x1]].mean()
            if best is None or off < best[0]:
                best = (off, dx, dy)
    return best[1:]


def mend_wall(a, out, gone):
    """The wall where the table stood in front of it: its own colour, down
    to its foot and out to its left edge, and the rest of its last window."""
    dx, dy = window_step(a, out[..., 3] > 0)
    ys, xs = np.where(gone)
    out[ys, xs, :3] = WALL
    # The window: wherever the same place by the other three is window (or
    # window running into wall), and not the door's frame beside them
    twin = a[ys + dy, xs + dx].astype(int)
    glass = (twin[:, 0] >= 95) & (twin[:, 2] - twin[:, 0] > 55) & (twin[:, 2] > 180) & (twin[:, 3] == 255)
    out[ys[glass], xs[glass], :3] = twin[glass, :3]
    edge = EDGE_AT[0] - (ys - EDGE_AT[1]) * EDGE_LEAN
    cover = np.clip(foot(xs) - ys, 0, 1) * np.clip(xs + 1 - edge, 0, 1)
    out[ys, xs, 3] = np.round(cover * 255).astype(np.uint8)


def off_the_pad(a, out, ends, gone):
    """The warehouse's pixels along its foot are part wall and part pad.
    They are made the wall's colour, as solid as their share of it, so that
    it can stand anywhere."""
    top = np.array(order.TOP)

    def unmix(y, x, colour):
        if gone[y, x] or out[y, x, 3] < 255:
            return
        if ((np.array(colour, int) - top) ** 2).sum() < 400:
            return  # (the roof is all but the pad's colour: leave it be)
        part = share(a[y, x], top, colour)
        out[y, x, :3] = colour
        out[y, x, 3] = round(float(part) * 255)

    for x, end in ends.items():
        if x <= HIDDEN or x > END:
            continue
        for y in (end - 1, end - 2):
            unmix(y, x, a[end - 4, x, :3] if x < END else WALL)
    for y in range(EDGE_TOP + 1, ends[EDGE]):
        unmix(y, EDGE, WALL)
    for y in range(END_PAD, ends[END]):
        unmix(y, END, WALL)


def lettering(a, ends):
    """The lettering on its own: where it is (its inks, and a pixel or two
    round them), and for each pixel there how much navy or orange ink it
    takes to get from the wall's colour to the picture's."""
    r, g, b = (a[..., i].astype(int) for i in range(3))
    rows, cols = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    floor = np.zeros(a.shape[1])
    for x, end in ends.items():
        floor[x] = end
    band = (cols >= LETTERS_X[0]) & (cols < LETTERS_X[1])
    band &= (rows > floor[cols] - LETTERS_UP[1]) & (rows < floor[cols] - LETTERS_UP[0])
    ink = ((r < 125) & (b - r > 55)) | ((r > 190) & (b < 170))
    hole = grow(ink & band, 2) & band
    layer = np.zeros(a.shape, np.uint8)
    for colour in (NAVY, ORANGE):
        part = share(a, WALL, colour)
        mine = hole & (part > 0.08) & (part * 255 > layer[..., 3])
        layer[mine, :3] = colour
        layer[mine, 3] = np.round(part[mine] * 255)
    return hole, layer


def lift_warehouse(a):
    """The warehouse on its own, turned to stand along the pad's other far
    edge: a picture the size of the artwork."""
    mask, ends = find_warehouse(a)
    gone = hidden(a, mask)
    out = np.where(mask[..., None], a, 0).astype(np.uint8)
    out[gone] = 0
    mend_wall(a, out, gone)
    off_the_pad(a, out, ends, gone)
    hole, letters = lettering(a, ends)
    out[hole, :3] = WALL
    # The roof, lit from the other side once it is turned over: its two
    # slopes change colours, and so does each pixel along the ridge between
    # them, which is part one and part the other
    lit, shade = np.array(ROOF_LIT, float), np.array(ROOF_SHADE, float)
    rgb = out[..., :3].astype(float)
    part = share(out, lit, shade)[..., None]
    roof = (np.abs(rgb - (lit + part * (shade - lit))).max(axis=2) <= 1.5) & (out[..., 3] > 0)
    out[roof, :3] = np.round(lit + shade - rgb[roof]).astype(np.uint8)

    def turned(layer):
        return np.roll(layer[:, ::-1], MIRROR - (layer.shape[1] - 1), axis=1)

    img = Image.fromarray(turned(out))
    # The lettering, moved to where its wall now is and sheared to run down
    # it (its uprights stay upright)
    xs = np.where(hole.any(axis=0))[0]
    middle = (xs.min() + xs.max() + 1) / 2
    there = MIRROR + 1 - middle
    lean = 2 * LETTERS_CLIMB
    img.alpha_composite(
        Image.fromarray(letters).transform(
            img.size,
            Image.AFFINE,
            (1, 0, middle - there, -lean, 1, lean * there),
            Image.BICUBIC,
        )
    )
    return img


# --- the forklift ---------------------------------------------------------


def lift_forklift(card):
    """The orange forklift out of the card picture, whole: the picture,
    cropped to its box, and that box's corner."""
    solid = card[..., 3] > 40
    dx, dy = FORKLIFT_TWIN
    right = label_from(solid, FORKLIFT)
    left = label_from(solid, (FORKLIFT[0] + dx, FORKLIFT[1] + dy))
    # The left one, moved over the right one
    twin = np.roll(np.roll(card, -dy, 0), -dx, 1)
    left = np.roll(np.roll(left, -dy, 0), -dx, 1)
    cols = np.arange(card.shape[1])[None, :]
    whole = np.where(cols < FORKLIFT_SPLIT, left, right)
    source = np.where((cols < FORKLIFT_SPLIT)[..., None], twin, card)
    return order.lift(source, whole)


def stand_forklift(img, card):
    """The forklift on the pad, in front of the warehouse's door and facing
    it. Returns the box it is in."""
    # The door's foot, now the warehouse is turned, and from there out along
    # the floor (down to the right) and across it (down to the left)
    x, y = MIRROR + 1 - DOOR[0], DOOR[1]
    at = (
        x + (FORKLIFT_OUT - FORKLIFT_LEFT) * ISO_X,
        y + (FORKLIFT_OUT + FORKLIFT_LEFT) * ISO_Y,
    )
    return order.stand(img, *lift_forklift(card), FORKLIFT_SCALE, WHEEL, at)


def swap_yard(art, card):
    """The artwork (RGBA array) with the yard cleared: see the top of this
    file. Also returns a mask of the forklift (so that its thin parts are not
    taken for circuit traces)."""
    warehouse = lift_warehouse(art)
    img = Image.fromarray(bare_pad(art))
    img.alpha_composite(warehouse)
    x, y, w, h = stand_forklift(img, card)
    print(f"  forklift: x {x}, y {y}, w {w}, h {h}")
    drawn = np.zeros(art.shape[:2], bool)
    drawn[y : y + h, x : x + w] = True
    return np.array(img), drawn
