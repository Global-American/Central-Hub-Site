"""The circuit board in the middle of the Returns and Fulfillment hero pictures.

The original artwork has a cog there, standing on a flat navy pad inside two
outline diamonds, with a cone of light coming up out of it to the globe. This
takes all of that out, finishes the circuit traces the cog was hiding, and
draws an isometric circuit board in its place: a board with gold edge
contacts, traces fanning in to a processor, and a glowing core on the
processor that the cone of light now comes from.

Used by build-hero-fx.py. Everything is drawn in "ground units" on the
artwork's isometric floor (see hero_iso.py).
"""

import numpy as np
from PIL import Image

from hero_iso import SS, Canvas, grow, label_from, square

# Where things are, in ground units from the middle of the diamonds
OUTLINE_OUTER, OUTLINE_INNER = 109, 86
BOARD, BOARD_THICK = 80, 12
CHIP, CHIP_THICK = 30, 11
CORE = 15
# Six traces come in to each side of the diamonds, ending in pads: where the
# pads end and start, and how wide the pads and the traces are
PAD_TIP, PAD_START, PAD_WIDE, TRACE_WIDE = 128, 181, 13, 4.4
# The cog stood on the first four of them on the two far sides (left, right):
# where each is across its side, and how far out it has to be drawn again
HIDDEN_AT = ([-77.5, -43.4, -9.4, 24.6], [-78.3, -45.1, -9.2, 24.6])
HIDDEN_FROM = ([190, 200, 188, 188], [197, 200, 188, 188])
# The first trace on the right comes straight down to its bend, and the cog
# covered the bend: the foot of that upright (x from the middle, y, y)
HIDDEN_UPRIGHT = (99.6, 104.6, 422, 434)


# The four sides of the board, as turns of the first one: (u, v) -> (u, v),
# (v, -u), (-u, -v), (-v, u)
def turned(side, u, v):
    return [(u, v), (v, -u), (-u, -v), (-v, u)][side]


def draw_outlines(c, colour):
    """The two outline diamonds on the floor, with a little glow."""
    for r, width, alpha in [(OUTLINE_OUTER, 4.2, 1.0), (OUTLINE_INNER, 2.8, 0.85)]:
        c.line(square(r), colour, width * 2.2, closed=True, blur=2.5, alpha=0.45 * alpha)
        c.line(square(r), colour, width, closed=True, alpha=alpha)


def board_traces(c, fill, width):
    """The board's own traces: from each edge contact in to a processor pin."""
    contacts, pins = [10, 30, 50], [5, 15, 25]
    for side in range(4):
        for sign in (-1, 1):
            for contact, pin in zip(contacts, pins):
                gap = contact - pin
                path = [
                    (BOARD - 12, sign * contact),
                    (CHIP + 9 + gap, sign * contact),
                    (CHIP + 9, sign * pin),
                    (CHIP + 5, sign * pin),
                ]
                c.line(
                    [turned(side, u, v) + (BOARD_THICK,) for u, v in path], fill, width
                )


def draw_board(c):
    """The board, its contacts and parts, the processor and its core."""
    top = BOARD_THICK
    # Shadow on the floor, then the slab
    c.poly(square(BOARD + 9), (3, 26, 56, 150), blur=5)
    c.box(-BOARD, -BOARD, BOARD, BOARD, 0, top, (8, 60, 106), (6, 46, 84), (4, 35, 66))

    # Gold contacts along the edges, running down the two near sides
    gold, gold_side = (247, 178, 66), (206, 124, 38)
    for side in range(4):
        for at in (-50, -30, -10, 10, 30, 50):
            a, b = turned(side, BOARD - 13, at - 5), turned(side, BOARD - 1.5, at + 5)
            u0, u1 = sorted((a[0], b[0]))
            v0, v1 = sorted((a[1], b[1]))
            c.poly([(u0, v0, top), (u1, v0, top), (u1, v1, top), (u0, v1, top)], gold)
            if side == 0:  # the right-hand near side
                c.poly(
                    [(BOARD, v0, top), (BOARD, v1, top), (BOARD, v1, 3), (BOARD, v0, 3)],
                    gold_side,
                )
            if side == 3:  # the left-hand near side
                c.poly(
                    [(u0, BOARD, top), (u1, BOARD, top), (u1, BOARD, 3), (u0, BOARD, 3)],
                    gold_side,
                )
    c.line(square(BOARD, top), (62, 134, 192), 1.6, closed=True)

    # Traces, with a soft glow under them
    glow = Canvas(c.area, c.centre)
    board_traces(glow, (60, 190, 235, 255), 5)
    c.add(glow.img, blur=2, alpha=0.4)
    board_traces(c, (96, 214, 240, 255), 2.6)

    # Parts in the corners: a small chip left and right, two capacitors in
    # front, one behind
    for u, v in [(-58, 58), (58, -58)]:
        c.box(u - 12, v - 12, u + 12, v + 12, top, top + 5, (20, 92, 150), (8, 52, 96), (5, 40, 76))
        c.disc(u - 6, v - 6, top + 5, 2.2, (150, 214, 240))
    for u, v, long in [(50, 62, True), (62, 46, False), (-60, -58, True)]:
        du, dv = (9, 4.5) if long else (4.5, 9)
        tan, silver = (242, 172, 96), (226, 236, 246)
        c.box(u - du, v - dv, u + du, v + dv, top, top + 5, silver, (150, 172, 196), (124, 148, 176))
        iu, iv = (du * 0.5, dv) if long else (du, dv * 0.5)
        c.box(u - iu, v - iv, u + iu, v + iv, top, top + 5.4, tan, (204, 130, 60), (176, 106, 44))

    # The processor: its pins, then the body
    silver = (214, 230, 243)
    for side in range(4):
        for at in (-25, -15, -5, 5, 15, 25):
            a, b = turned(side, CHIP - 1, at - 2.6), turned(side, CHIP + 7, at + 2.6)
            u0, u1 = sorted((a[0], b[0]))
            v0, v1 = sorted((a[1], b[1]))
            h = top + 2
            c.poly([(u0, v0, h), (u1, v0, h), (u1, v1, h), (u0, v1, h)], silver)
    chip_top = top + CHIP_THICK
    c.box(-CHIP, -CHIP, CHIP, CHIP, top, chip_top, (15, 88, 148), (7, 44, 84), (4, 31, 62))
    c.line(square(CHIP, chip_top), (78, 164, 218), 1.5, closed=True)
    c.line(square(CHIP - 6.5, chip_top), (40, 122, 182), 1.2, closed=True)

    # The core: a lit lens in the processor
    c.disc(0, 0, chip_top, CORE + 7, (70, 220, 235, 255), blur=4, alpha=0.75)
    c.disc(0, 0, chip_top, CORE + 2.5, (226, 246, 250))
    for i in range(16):
        k = i / 15
        colour = tuple(round(a + (b - a) * k) for a, b in zip((36, 150, 184), (176, 244, 242)))
        c.disc(0, 0, chip_top, CORE * (1 - 0.92 * k), colour)


def draw_beam(c, top_y):
    """The cone of light from the core up to the globe, fading as it rises."""
    cx, cy = c.centre[0], c.centre[1] - BOARD_THICK - CHIP_THICK
    rx = CORE * 1.22
    layer, d = c.layer()
    d.polygon(
        [c.px(cx - rx, cy), c.px(cx + rx, cy), c.px(cx + 64, top_y), c.px(cx - 64, top_y)],
        fill=(196, 250, 250, 255),
    )
    d.ellipse([c.px(cx - rx, cy - rx * 0.587), c.px(cx + rx, cy + rx * 0.587)], fill=(196, 250, 250, 255))
    alpha = np.array(layer.getchannel("A")).astype(float)
    rows = np.arange(alpha.shape[0])[:, None] / SS + c.y0
    rise = np.clip((cy - rows) / (cy - top_y), 0, 1)
    alpha *= 0.72 * (1 - rise) ** 1.15
    layer.putalpha(Image.fromarray(alpha.astype(np.uint8)))
    c.add(layer, blur=0.6)


def trace_pixels(a):
    """The circuit traces, by their pale blue (not their soft edges)."""
    R, G, B, A = [a[..., i].astype(int) for i in range(4)]
    return (A > 40) & (B > 225) & (R > 150) & (R < 240) & (B - R > 25) & (G > 190)


def window(shape, centre):
    """The part of the picture the cog, its pad and the diamonds are in."""
    ys, xs = np.mgrid[0 : shape[0], 0 : shape[1]]
    return (abs(xs - centre[0]) < 215) & (ys > 395) & (ys < 700)


def find_traces(a, centre):
    """The traces round the middle of a picture that draws them in pale blue:
    their solid part, and the same with their soft edges."""
    traces = trace_pixels(a)
    # Pale highlights on the cog pass for traces: real ones are long
    real = np.zeros_like(traces)
    todo = traces & window(a.shape, centre)
    while todo.any():
        y, x = np.argwhere(todo)[0]
        part = label_from(traces, (x, y))
        if part.sum() > 400:
            real |= part
        todo &= ~part
    return real, grow(real, 1) & (a[..., 3] > 0)


def cog_area(a, centre, real, keep):
    """Everything in the middle that goes: the cog and its light, the navy pad
    and the outline diamonds. Only the traces stay (see find_traces), less
    the rim of cog along the ends it was standing on."""
    gone = window(a.shape, centre) & (a[..., 3] > 0) & ~keep
    rim = grow(gone & (a[..., 3] > 200), 1) & keep & ~real
    return gone | rim


def restore_traces(c, colour):
    """The ends of the traces the cog was standing on: the first four on each
    of the two far sides of the diamonds."""
    half, thin = PAD_WIDE / 2, TRACE_WIDE / 2
    for flip in (False, True):
        for at, start in zip(HIDDEN_AT[flip], HIDDEN_FROM[flip]):

            def p(u, v):
                return (v, u, 0) if flip else (u, v, 0)

            c.poly(
                [
                    p(-start, at - thin),
                    p(-PAD_START - 7, at - thin),
                    p(-PAD_START, at - half),
                    p(-PAD_TIP, at - half),
                    p(-PAD_TIP, at + half),
                    p(-PAD_START, at + half),
                    p(-PAD_START - 7, at + thin),
                    p(-start, at + thin),
                ],
                colour,
            )
    x0, x1, y0, y1 = HIDDEN_UPRIGHT
    layer, d = c.layer()
    d.rectangle(
        [c.px(c.centre[0] + x0, y0), c.px(c.centre[0] + x1, y1)], fill=colour + (255,)
    )
    c.add(layer)


def swap_cog(art, centre, real, keep, beam_top=412):
    """The artwork with the cog taken out and the circuit board put in.

    art: the artwork (RGBA array); centre: the middle of the diamonds;
    real, keep: the traces round it (see find_traces).
    Returns the new artwork and a mask of the board's own traces.
    """
    cog = cog_area(art, centre, real, keep)
    # The picture's own colours for its traces and its diamonds
    near = real & window(art.shape, centre) & (art[..., 3] == 255)
    trace = tuple(int(v) for v in np.median(art[near][:, :3], axis=0))
    outline = tuple(int(v) for v in art[centre[1], centre[0] - 185, :3])
    a = art.copy()
    a[cog] = 0
    box = (centre[0] - 240, 395, centre[0] + 240, 705)
    spot = (slice(box[1], box[3]), slice(box[0], box[2]))

    # Trace ends first, only where the cog was
    ends = Canvas(box, centre)
    restore_traces(ends, trace)
    ends = np.array(ends.flat())
    ends[..., 3] = np.where(cog[spot], ends[..., 3], 0)

    c = Canvas(box, centre)
    draw_outlines(c, outline)
    draw_board(c)
    draw_beam(c, beam_top)

    out = Image.fromarray(a)
    out.alpha_composite(Image.fromarray(ends), box[:2])
    out.alpha_composite(c.flat(), box[:2])

    lines = Canvas(box, centre)
    board_traces(lines, (255, 255, 255, 255), 2.6)
    traces = np.zeros(a.shape[:2], np.uint8)
    traces[spot] = np.array(lines.flat().getchannel("A"))
    return np.array(out), traces
