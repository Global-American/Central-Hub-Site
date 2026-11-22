"""The packing station on the bottom-left pad of the Fulfillment hero picture.

The original artwork has a man at a desk with a laptop there. This takes the
desk, the laptop, the man and his chair out, mends what they hid (the far
edge of the pad and the end of one circuit trace), and draws a packing
station in their place: a bench with a roll of packing paper, an open carton
being packed, a tape dispenser and a label printer, a packer standing behind
it, and a roller conveyor taking the sealed parcels away.

Used by build-hero-fx.py. Everything is drawn in "ground units" on the
artwork's isometric floor (see hero_iso.py), in the artwork's own colours.
"""

import numpy as np
from PIL import Image

from hero_iso import SS, Canvas, grow, label_from

# The middle of the pad's top, and the box of the picture the station is in
CENTRE = (265.5, 759.5)
AREA = (60, 540, 470, 890)
# A point on the man, and the box all that goes with him is in (the trace
# his chair stands in front of carries on to the right of it)
MAN, DESK = (300, 720), (190, 636, 388, 825)
MAN_RIGHT = DESK[2]
# A point on the three boxes standing on the pad, which stay
STACK = (170, 780)
# The trace the chair hid the end of: a point on its middle line where it
# comes out from behind the chair, how far left it has to go on to be under
# the pad's edge, and a step along it (across, up) that lands on itself
TRACE_AT, TRACE_TO, TRACE_STEP = (392, 687.5), 356, (48, 29)

# The artwork's flat colours
PAD_TOP, PAD_SIDE = (218, 236, 245), (137, 167, 190)
TRACE = (211, 239, 254)
CARD_TOP, CARD_LEFT, CARD_RIGHT = (255, 226, 193), (229, 182, 126), (209, 150, 100)
CARD_IN_LEFT, CARD_IN_RIGHT = (190, 132, 88), (203, 142, 96)
TAPE_TOP, TAPE_RIGHT = (222, 161, 138), (203, 127, 98)
WHITE, PALE_LEFT, PALE_RIGHT = (255, 255, 255), (230, 230, 228), (183, 213, 227)
ORANGE, ORANGE_SHADE = (247, 159, 49), (226, 132, 30)
NAVY, NAVY_LEFT, NAVY_RIGHT = (26, 92, 142), (11, 60, 91), (7, 45, 72)
SKIN, HAIR = (253, 215, 192), (2, 20, 34)
STEEL, STEEL_LEFT, STEEL_RIGHT = (206, 220, 232), (156, 169, 173), (128, 146, 160)
SKY, SKY_LEFT, SKY_RIGHT = (132, 220, 246), (48, 176, 232), (22, 134, 196)

# The bench: where it stands and how high it is, and the worktop on it
BENCH = (-64, -52, 66, -10)
BENCH_HIGH, WORKTOP = 56, 5
# The conveyor that leaves its near side
BELT = (38, -10, 64, 78)
BELT_HIGH = 38
# The packer stands behind the bench, here
PACKER = (1, -70)


def channels(a):
    return [a[..., i].astype(int) for i in range(4)]


def is_colour(a, colour, slack=6, solid=True):
    """Where the picture is this colour (and, unless told not, not see-through)."""
    near = np.abs(a[..., :3].astype(int) - np.array(colour)).max(axis=2) < slack
    return near & (a[..., 3] > (250 if solid else 0))


# --- taking the desk out -------------------------------------------------


def find_stack(a):
    """The three boxes on the pad: their card colours, joined up."""
    R, G, B, A = channels(a)
    card = (A > 0) & (R > 180) & (R - B > 40) & (G > 100)
    return label_from(card, STACK)


def find_desk(a, top, stack):
    """The desk and all that is at it: everything joined to the man that is
    not the pad, the boxes on the pad or the traces beyond his chair."""
    side = label_from(is_colour(a, PAD_SIDE), (int(CENTRE[0]), int(CENTRE[1]) + 112))
    # The pad's soft edges are the pad too, and so is the seam between its
    # top and its side
    near = grow(top | side, 2)
    soft = is_colour(a, PAD_TOP, solid=False) | is_colour(a, PAD_SIDE, solid=False)
    pad = top | side | (near & soft) | (grow(top, 2) & grow(side, 2))
    other = (a[..., 3] > 0) & ~pad & ~stack
    x0, y0, x1, y1 = DESK
    window = np.zeros_like(other)
    window[y0:y1, x0:x1] = True
    # (joined corner to corner counts: label_from only steps along rows and
    # columns, so it is given the pixels a little fattened)
    desk = label_from(grow(other & window, 1) & window, MAN) & other
    return grow(desk, 1) & ~stack & ~top & ~side


def far_edge(top):
    """The first row of the pad's top in each column the desk hid it in: the
    left half of the pad is in view nearly to the middle, and the right half
    is the same the other way round."""
    cols = np.arange(top.shape[1])
    seen = top.any(axis=0)
    first = np.where(seen, top.argmax(axis=0), 0)
    x0, x1 = cols[seen].min(), cols[seen].max()
    # The last column from the left that the desk is not in the way in
    clear = x0
    while abs(int(first[clear + 1]) - int(first[clear])) <= 2:
        clear += 1
    # Where the mirror stands: wherever makes the straight stretch in view
    # on the right match the left best
    right = np.arange(MAN_RIGHT + 6, x1 - 12)
    turn = min(
        range(x0 + x1 - 2, x0 + x1 + 8),
        key=lambda k: np.abs(first[right] - first[k - right]).sum(),
    )
    hidden = range(clear + 1, MAN_RIGHT + 4)
    twin = {x: min(turn - x, clear) for x in hidden}
    edge = first.copy()
    for x in hidden:
        edge[x] = first[twin[x]]
    return edge, twin, (x0, x1)


def mend_pad(a, art, top, stack):
    """Paint the pad's top where the desk stood, with the stretch of its far
    edge that the desk hid copied from the same place on its left."""
    edge, twin, (x0, x1) = far_edge(top)
    last = top.shape[0] - 1 - top[::-1].argmax(axis=0)  # the near edge
    # The edge's own pixels: the top's colour, or that running into the thin
    # darker line the artwork draws along it
    R, G, B, A = channels(art)
    soft = is_colour(art, PAD_TOP, solid=False) | ((R > 85) & (B > 180) & (B - R > 20))
    for x in range(x0, x1 + 1):
        if x in twin:
            # The soft rows of the edge, wherever they are more solid than
            # what is here (a trace's end)
            for row in range(edge[x] - 4, edge[x] + 1):
                if soft[row, twin[x]] and art[row, twin[x], 3] > a[row, x, 3]:
                    a[row, x] = art[row, twin[x]]
        rows = slice(edge[x] + 1, last[x] - 1)
        column = a[rows, x]
        column[~stack[rows, x]] = PAD_TOP + (255,)


def mend_trace(a, art):
    """The end of the trace the chair stood in front of, on to the pad: the
    trace is straight, so it is the stretch in view moved along itself."""
    (x1, y1), (dx, dy) = TRACE_AT, TRACE_STEP
    for x in range(TRACE_TO, x1 + 2):
        middle = y1 + (x1 - x) * dy / dx
        for y in range(int(middle) - 7, int(middle) + 9):
            if art[y - dy, x + dx, 3] > a[y, x, 3]:
                a[y, x] = art[y - dy, x + dx]


# --- drawing -------------------------------------------------------------


def hull(points):
    """The outline round a set of points."""
    pts = sorted(set(points))

    def half(pts):
        out = []
        for p in pts:
            while len(out) > 1 and (
                (out[-1][0] - out[-2][0]) * (p[1] - out[-2][1])
                - (out[-1][1] - out[-2][1]) * (p[0] - out[-2][0])
            ) <= 0:
                out.pop()
            out.append(p)
        return out

    return half(pts)[:-1] + half(pts[::-1])[:-1]


def ring(u, v, h, r, start=0, end=360, step=10):
    """Points round an upright circle that faces along the v axis."""
    turns = np.radians(np.arange(start, end + 1, step))
    return [(u + r * np.cos(t), v, h + r * np.sin(t)) for t in turns]


def roll(c, u, v0, v1, h, r, body, light, end, hole):
    """A roll lying along the v axis: its body, the light along its top, the
    end towards us and the hole through it."""
    layer, d = c.layer()
    d.polygon(hull([c.pt(*p) for p in ring(u, v0, h, r) + ring(u, v1, h, r)]), fill=body)
    top = ring(u, v0, h, r, 55, 115) + ring(u, v1, h, r, 55, 115)
    d.polygon(hull([c.pt(*p) for p in top]), fill=light)
    d.polygon([c.pt(*p) for p in ring(u, v1, h, r)], fill=end)
    d.polygon([c.pt(*p) for p in ring(u, v1, h, r * 0.34)], fill=hole)
    c.add(layer)


def carton(c, u0, v0, u1, v1, h0, h1, label=None):
    """A sealed carton, taped across its top and down its right side like the
    artwork's own, with a label or the brand's badge on its left side."""
    c.box(u0, v0, u1, v1, h0, h1, CARD_TOP, CARD_LEFT, CARD_RIGHT)
    m, w = (v0 + v1) / 2, (v1 - v0) * 0.16
    c.poly([(u0, m - w, h1), (u1, m - w, h1), (u1, m + w, h1), (u0, m + w, h1)], TAPE_TOP)
    c.poly([(u1, m - w, h1), (u1, m + w, h1), (u1, m + w, h0), (u1, m - w, h0)], TAPE_RIGHT)
    mid, high = (u0 + u1) / 2, (h0 + h1) / 2
    if label == "label":
        c.poly(
            [(mid - 6, v1, high + 5), (mid + 6, v1, high + 5), (mid + 6, v1, high - 3), (mid - 6, v1, high - 3)],
            WHITE,
        )
        c.line([(mid - 4, v1, high + 2.6), (mid + 4, v1, high + 2.6)], NAVY_LEFT, 1.1)
        c.line([(mid - 4, v1, high - 0.2), (mid + 1.5, v1, high - 0.2)], NAVY_LEFT, 1.1)
    if label == "badge":
        # The brand's "it" in its blue roundel, as on the artwork's parcels
        c.poly(ring(mid, v1, high, 6), (11, 88, 152))
        c.poly(ring(mid - 2.6, v1, high + 3.1, 0.75, step=30), ORANGE)
        c.line([(mid - 2.6, v1, high + 1.4), (mid - 2.6, v1, high - 2.4)], ORANGE, 1.1)
        c.line([(mid - 0.2, v1, high + 3.6), (mid - 0.2, v1, high - 1.4), (mid + 0.8, v1, high - 2.4), (mid + 3, v1, high - 2.4)], ORANGE, 1.1)
        c.line([(mid - 1.2, v1, high + 1.5), (mid + 2.6, v1, high + 1.5)], ORANGE, 1.1)


def draw_bench(c):
    u0, v0, u1, v1 = BENCH
    under = BENCH_HIGH - WORKTOP
    c.box(u0, v0, u1, v1, 0, under, WHITE, PALE_LEFT, PALE_RIGHT)
    # A shelf let into its near side, with flat-packed cartons standing in it
    a, b, low, high = u0 + 8, BELT[0] - 8, 9, under - 8
    c.poly([(a, v1, low), (b, v1, low), (b, v1, high), (a, v1, high)], (188, 204, 216))
    c.poly([(a, v1, low), (a + 5, v1, low + 3), (a + 5, v1, high), (a, v1, high)], (206, 218, 227))
    c.poly([(a, v1, low), (b, v1, low), (b, v1, low + 3), (a + 5, v1, low + 3)], (226, 234, 240))
    for at, wide, tall in [(a + 9, 5, 22), (a + 16, 5, 25), (a + 23, 4, 20)]:
        c.poly(
            [(at, v1, low + 2), (at + wide, v1, low + 2), (at + wide, v1, low + tall), (at, v1, low + tall)],
            CARD_RIGHT if at == a + 16 else CARD_LEFT,
        )
    # ... and a parcel on it
    at = a + 38
    c.poly([(at, v1, low + 2), (at + 22, v1, low + 2), (at + 22, v1, low + 20), (at, v1, low + 20)], CARD_LEFT)
    c.poly([(at + 8, v1, low + 20), (at + 14, v1, low + 20), (at + 14, v1, low + 2), (at + 8, v1, low + 2)], TAPE_TOP)
    # The worktop, standing a little proud of it
    c.box(u0 - 2, v0 - 2, u1 + 2, v1 + 2, under, BENCH_HIGH, WHITE, (205, 219, 230), (150, 184, 204))


def draw_paper(c):
    """A roll of packing paper on a stand at the far end of the bench, with a
    length pulled off it along the worktop."""
    u, v0, v1, top = BENCH[0] + 11, BENCH[1] + 6, BENCH[3] - 8, BENCH_HIGH
    high, r = top + 16.5, 10
    sheet, sheet_fall = (246, 214, 170), (236, 196, 148)
    c.poly([(u + 9, v0 + 2, top), (u + 30, v0 + 2, top), (u + 30, v1 - 2, top), (u + 9, v1 - 2, top)], sheet)
    for v in (v0 - 3, v1 + 1):  # the far upright, the roll, then the near one
        if v > v0:
            roll(c, u, v0, v1, high, r, CARD_LEFT, CARD_TOP, (244, 206, 160), TAPE_RIGHT)
            c.poly(
                [(u + 7, v0 + 2, high + 7.5), (u + 7, v1 - 2, high + 7.5), (u + 9, v1 - 2, top), (u + 9, v0 + 2, top)],
                sheet_fall,
            )
        c.box(u - 2, v, u + 2, v + 2.5, top, high + 3, NAVY, NAVY_LEFT, NAVY_RIGHT)
        c.box(u - 6, v - 0.5, u + 6, v + 3, top, top + 2.5, NAVY, NAVY_LEFT, NAVY_RIGHT)


def draw_open_carton(c):
    """The carton being packed: its flaps open, tissue and a parcel in it."""
    u0, v0, u1, v1 = -15, -45, 19, -19
    low = BENCH_HIGH
    high = low + 19
    # The two far flaps, leaning back
    c.poly([(u0, v0, high), (u1, v0, high), (u1 - 1, v0 - 7, high + 9), (u0 - 1, v0 - 7, high + 9)], CARD_LEFT)
    c.poly([(u0, v0, high), (u0, v1, high), (u0 - 7, v1 - 1, high + 9), (u0 - 7, v0 - 1, high + 9)], CARD_RIGHT)
    # Inside: the two far walls, then what is in it
    fill = high - 7
    c.poly([(u0, v0, high), (u1, v0, high), (u1, v0, fill), (u0, v0, fill)], CARD_IN_RIGHT)
    c.poly([(u0, v0, high), (u0, v1, high), (u0, v1, fill), (u0, v0, fill)], CARD_IN_LEFT)
    c.poly([(u0, v0, fill), (u1, v0, fill), (u1, v1, fill), (u0, v1, fill)], (240, 244, 248))
    c.box(u0 + 5, v0 + 4, u0 + 19, v0 + 16, fill, fill + 5, SKY, SKY_LEFT, SKY_RIGHT)
    # The two near walls, and their flaps folded down outside them
    c.poly([(u0, v1, low), (u1, v1, low), (u1, v1, high), (u0, v1, high)], CARD_LEFT)
    c.poly([(u1, v1, low), (u1, v0, low), (u1, v0, high), (u1, v1, high)], CARD_RIGHT)
    c.poly([(u0, v1, high), (u1, v1, high), (u1, v1 + 6, high - 9), (u0, v1 + 6, high - 9)], CARD_TOP)
    c.poly([(u1, v0, high), (u1, v1, high), (u1 + 6, v1, high - 9), (u1 + 6, v0, high - 9)], (242, 204, 160))


def draw_tape(c):
    """A tape dispenser: a navy foot with a roll of tape standing in it."""
    top = BENCH_HIGH
    c.box(27, -41, 45, -34, top, top + 4, NAVY, NAVY_LEFT, NAVY_RIGHT)
    roll(c, 33, -40.5, -34.5, top + 9.5, 7, (236, 190, 120), (252, 224, 170), (246, 206, 140), WHITE)
    c.box(41, -41, 45, -34, top + 4, top + 8, STEEL, STEEL_LEFT, STEEL_RIGHT)


def draw_printer(c):
    """A label printer, with a label coming out of the front of it."""
    top = BENCH_HIGH
    u0, v0, u1, v1 = 47, -47, 63, -30
    c.box(u0, v0, u1, v1, top, top + 13, NAVY, NAVY_LEFT, NAVY_RIGHT)
    c.poly([(u0 + 3, v0 + 3, top + 13), (u1 - 3, v0 + 3, top + 13), (u1 - 3, v0 + 8, top + 13), (u0 + 3, v0 + 8, top + 13)], SKY_LEFT)
    a, b = u0 + 3, u1 - 3
    c.poly([(a, v1, top + 10.5), (b, v1, top + 10.5), (b, v1 + 3, top + 1), (a, v1 + 3, top + 1)], WHITE)
    c.line([(a + 2.2, v1 + 0.9, top + 7.6), (b - 2.2, v1 + 0.9, top + 7.6)], NAVY_LEFT, 1.1)
    c.line([(a + 2.2, v1 + 1.8, top + 4.6), (b - 5, v1 + 1.8, top + 4.6)], NAVY_LEFT, 1.1)


def draw_belt(c):
    """The roller conveyor from the bench's near side, and the parcels on it."""
    u0, v0, u1, v1 = BELT
    top, rail = BELT_HIGH, 3
    for u, v in [(u0, v0 + 12), (u0, v1 - 4), (u1 - 3, v0 + 12), (u1 - 3, v1 - 4)]:
        c.box(u, v, u + 3, v + 3, 0, top - 6, STEEL, STEEL_LEFT, STEEL_RIGHT)
    c.box(u0, v0, u1, v1, top - 7, top - 1.5, NAVY_LEFT, NAVY_LEFT, NAVY_RIGHT)
    rollers = []
    for v in np.arange(v0 + 2, v1 - 5, 6.5):
        a, b = u0 + rail, u1 - rail
        rollers.append(([(a, v + 3.6, top), (b, v + 3.6, top), (b, v + 5.2, top - 1.5), (a, v + 5.2, top - 1.5)], STEEL_RIGHT))
        rollers.append(([(a, v, top), (b, v, top), (b, v + 3.6, top), (a, v + 3.6, top)], (226, 236, 244)))
    c.polys(rollers)
    # The rails either side of the rollers, and the stop across the end
    c.box(u0, v0, u0 + rail, v1, top - 7, top + 1.5, NAVY, NAVY_LEFT, NAVY_RIGHT)
    c.box(u1 - rail, v0, u1, v1, top - 7, top + 1.5, NAVY, NAVY_LEFT, NAVY_RIGHT)
    c.box(u0, v1 - rail, u1, v1, top - 7, top + 1.5, NAVY, NAVY_LEFT, NAVY_RIGHT)
    carton(c, u0 + 3.5, v0 + 12, u1 - 3.5, v0 + 34, top, top + 19, "label")
    carton(c, u0 + 3.5, v0 + 53, u1 - 3.5, v0 + 77, top, top + 22, "badge")


class Figure:
    """Drawing a person, in artwork pixels from the spot they stand on (y up)."""

    def __init__(self, c, u, v):
        self.c = c
        x, y = c.pt(u, v)
        self.at = (x / SS + c.x0, y / SS + c.y0)
        self.layer, self.d = c.layer()

    def p(self, x, y):
        return self.c.px(self.at[0] + x, self.at[1] - y)

    def blob(self, points, fill, soft=0):
        """A shape, with its corners rounded off by `soft` pixels."""
        pts = [self.p(*q) for q in points]
        self.d.polygon(pts, fill=fill)
        if soft:
            self.d.line(pts + pts[:2], fill=fill, width=round(soft * 2 * SS), joint="curve")

    def limb(self, points, fill, width):
        pts = [self.p(*q) for q in points]
        self.d.line(pts, fill=fill, width=round(width * SS), joint="curve")
        for q in (points[0], points[-1]):
            self.oval(q, width / 2, width / 2, fill)

    def oval(self, at, rx, ry, fill):
        (x0, y0), (x1, y1) = self.p(at[0] - rx, at[1] + ry), self.p(at[0] + rx, at[1] - ry)
        self.d.ellipse([x0, y0, x1, y1], fill=fill)

    def done(self):
        self.c.add(self.layer)


# Where the packer's hands are, from the spot they stand on: over the carton
HANDS = ((-41, 77), (-27, 70))


def draw_packer_body(c):
    """The packer, standing behind the bench and turned towards us: legs,
    body and head (the bench goes in front, then their arms: draw_packer_arms)."""
    f = Figure(c, *PACKER)
    f.blob([(-9, 74), (10, 70), (9, 2), (2, 2), (0, 40), (-2, 2), (-9, 2)], NAVY_LEFT, 1)
    f.blob([(-11, 113), (11, 106), (12, 72), (-10, 76)], ORANGE, 3.5)
    f.blob([(-4.5, 122), (3, 121), (4, 111), (-4, 113)], SKIN, 1)
    f.oval((-1, 112.5), 5.5, 3.2, SKIN)
    f.oval((0.5, 133.5), 10.2, 11.2, HAIR)
    f.oval((-2.4, 130), 7.6, 8.8, SKIN)
    f.blob([(-10, 137), (-3, 142), (6, 139), (2, 135), (-6, 134.5)], HAIR, 1.5)
    f.done()


def draw_packer_arms(c):
    """Their arms, reaching over the bench, and the parcel in their hands."""
    f = Figure(c, *PACKER)
    left, right = HANDS
    # The parcel they are putting in the carton
    f.blob([(-41, 80), (-33, 84.5), (-25, 80), (-33, 75.5)], SKY, 0.4)
    f.blob([(-41, 80), (-33, 75.5), (-33, 66.5), (-41, 71)], SKY_LEFT, 0.4)
    f.blob([(-33, 75.5), (-25, 80), (-25, 71), (-33, 66.5)], SKY_RIGHT, 0.4)
    f.limb([(13, 105), (7, 84), right], ORANGE_SHADE, 9.5)
    f.limb([(12.5, 106.5), (6.5, 85.5), (right[0] + 2, right[1] + 1.5)], ORANGE, 8)
    f.oval(right, 3.9, 3.9, SKIN)
    f.limb([(-12.5, 111), (-25, 95), (left[0] + 2.5, left[1] + 2)], ORANGE, 8)
    f.oval(left, 3.9, 3.9, SKIN)
    f.done()


def draw_station(c):
    """Everything on the pad, farthest first."""
    draw_packer_body(c)
    draw_bench(c)
    draw_paper(c)
    draw_printer(c)
    draw_tape(c)
    draw_open_carton(c)
    draw_packer_arms(c)
    draw_belt(c)


def swap_desk(art):
    """The artwork (RGBA array) with the desk taken out and the packing
    station put in."""
    top = label_from(is_colour(art, PAD_TOP), (int(CENTRE[0]), int(CENTRE[1]) + 80))
    stack = find_stack(art)
    a = art.copy()
    a[find_desk(art, top, stack)] = 0
    mend_trace(a, art)
    mend_pad(a, art, top, stack)

    c = Canvas(AREA, CENTRE)
    draw_station(c)
    out = Image.fromarray(a)
    # (scaled down by plain averaging: the artwork's flat colours meet in
    # clean edges, with no bright fringe)
    out.alpha_composite(c.img.reduce(SS), AREA[:2])
    out = np.array(out)
    front = grow(stack, 1) & (art[..., 3] > 0)  # the boxes stand in front
    out[front] = art[front]
    return out
