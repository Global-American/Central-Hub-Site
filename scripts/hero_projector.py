"""The hologram projector in the middle of the Freight hero picture.

The original artwork has a navy ring of panels there with a dotted globe
standing in it. The page now floats its own spinning globe over the spot (the
same one as the Returns and Fulfillment slides), so this takes the ring and
the dotted globe out and draws a projector for that globe to come from: a
plate on the floor, a drum of light panels, a dotted dish with a lit lens,
four pylons round it and a cone of light going up. The artwork's own map pin
is kept, standing on the lens.

Used by build-hero-fx.py. Drawn in "ground units" on the artwork's isometric
floor (see hero_iso.py).
"""

import numpy as np
from PIL import Image, ImageFilter

from hero_iso import ROUND_X, ROUND_Y, SS, Canvas, arc, grow, label_from

# The middle of the projector on the floor, and the globe the page floats
# over it: centre x, y and diameter, all in artwork pixels. Keep the globe in
# step with the Freight slide's `globe` in components/hero-section.tsx.
CENTRE = (909, 470)
GLOBE = (909, 215, 280)

# Radius of each tier (ground units) and the height of its top (pixels)
PLATE, PLATE_TOP = 146, 14
DRUM, DRUM_TOP = 113, 58
COLLAR, COLLAR_TOP = 89, 70
DISH, LENS = 78, 24
PYLON_AT, PYLON_TALL = 130, 74


def mix(a, b, k):
    return tuple(round(x + (y - x) * k) for x, y in zip(a, b))


def lit(angle):
    """How much light a wall gets where it faces this way: most at the front left."""
    return (0.5 + 0.5 * np.cos(np.radians(angle - 125))) ** 1.3


def wall(c, r, h0, h1, dark, light, start=0, end=180):
    """The side of a tier that faces us, shaded round its curve."""
    shapes = []
    low, high = arc(r, h0, start, end), arc(r, h1, start, end)
    angles = np.linspace(start, end, len(low))
    for i in range(len(low) - 1):
        colour = mix(dark, light, lit((angles[i] + angles[i + 1]) / 2))
        shapes.append(([low[i], low[i + 1], high[i + 1], high[i]], colour))
    c.polys(shapes)


def pylon(c, angle):
    """A post on the plate with a lit orb on top."""
    u, v, _ = arc(PYLON_AT, 0, angle, angle)[0]
    top = PLATE_TOP + PYLON_TALL
    c.box(u - 5, v - 5, u + 5, v + 5, PLATE_TOP, top, (40, 130, 196), (16, 86, 148), (8, 54, 104))
    c.box(u - 6.5, v - 6.5, u + 6.5, v + 6.5, top - 16, top - 10, (255, 190, 96), (240, 150, 52), (204, 112, 30))
    x, y = c.pt(u, v, top + 7)
    for radius, fill, blur in [(15, (80, 220, 245, 190), 4), (7.5, (236, 252, 255, 255), 0)]:
        layer, d = c.layer()
        d.ellipse([x - radius * SS, y - radius * SS, x + radius * SS, y + radius * SS], fill=fill)
        c.add(layer, blur=blur)


def draw_base(c):
    """The projector, from the floor up."""
    cyan = (96, 214, 240)

    pylon(c, 225)
    pylon(c, 315)

    # Plate: a low disc with a lit ring and tick marks round its edge
    wall(c, PLATE, 0, PLATE_TOP, (3, 30, 60), (12, 70, 124))
    c.poly(arc(PLATE, PLATE_TOP), (9, 56, 104))
    c.line(arc(PLATE, PLATE_TOP), (70, 150, 205), 1.6, closed=True)
    c.line(arc(PLATE - 7, PLATE_TOP), cyan, 4.5, closed=True, blur=2.5, alpha=0.6)
    c.line(arc(PLATE - 7, PLATE_TOP), cyan, 2, closed=True)
    ticks = []
    for i, angle in enumerate(range(0, 360, 10)):
        inner, outer = (PLATE - 26, PLATE - 13) if i % 3 == 0 else (PLATE - 21, PLATE - 13)
        a, b = arc(inner, PLATE_TOP, angle - 0.9, angle + 0.9), arc(outer, PLATE_TOP, angle - 0.9, angle + 0.9)
        ticks.append(([a[0], a[-1], b[-1], b[0]], (255, 178, 70) if i % 9 == 0 else (120, 200, 235)))
    c.polys(ticks)

    # Drum: a ring of light panels
    wall(c, DRUM, PLATE_TOP, DRUM_TOP, (5, 40, 78), (16, 84, 144))
    panels, glow = [], []
    for k, at in enumerate(range(12, 180, 13)):
        low, high = arc(DRUM, PLATE_TOP + 9, at - 4.6, at + 4.6, 1), arc(DRUM, DRUM_TOP - 9, at - 4.6, at + 4.6, 1)
        on = k % 3 != 1
        colour = mix((30, 150, 205), (150, 240, 250), lit(at)) if on else mix((8, 60, 110), (26, 110, 172), lit(at))
        panels.append((low + high[::-1], colour))
        if on:
            glow.append((low + high[::-1], (80, 215, 245, 255)))
    c.polys(glow, blur=3, alpha=0.7)
    c.polys(panels)
    c.poly(arc(DRUM, DRUM_TOP), (10, 62, 114))
    c.line(arc(DRUM, DRUM_TOP), (86, 172, 226), 1.6, closed=True)

    # Collar and dish: a bright rim round a teal dish of dots
    wall(c, COLLAR, DRUM_TOP, COLLAR_TOP, (12, 78, 136), (52, 150, 210))
    c.poly(arc(COLLAR, COLLAR_TOP), (176, 234, 248))
    c.poly(arc(DISH + 3, COLLAR_TOP), (6, 44, 84))
    for i in range(12):
        k = i / 11
        c.poly(arc(DISH * (1 - 0.8 * k), COLLAR_TOP), mix((8, 112, 146), (40, 190, 204), k))
    dots, step = [], 8.5
    for i in range(-12, 13):
        for j in range(-12, 13):
            u, v = (i + (j % 2) / 2) * step, j * step * 0.866
            if LENS + 6 < (u * u + v * v) ** 0.5 < DISH - 6:
                ring = [(u + 1.9 * np.cos(t), v + 1.9 * np.sin(t), COLLAR_TOP) for t in np.linspace(0, 6.283, 10)[:-1]]
                dots.append((ring, (150, 240, 240)))
    c.polys(dots, alpha=0.85)
    for r in (DISH * 0.56, DISH * 0.86):
        c.line(arc(r, COLLAR_TOP), (190, 248, 248), 1.3, closed=True, alpha=0.75)

    # Lens
    c.poly(arc(LENS + 9, COLLAR_TOP), (90, 228, 240, 255), blur=4, alpha=0.8)
    c.poly(arc(LENS + 2.5, COLLAR_TOP), (232, 250, 252))
    for i in range(14):
        k = i / 13
        c.poly(arc(LENS * (1 - 0.92 * k), COLLAR_TOP), mix((44, 164, 196), (214, 252, 250), k))

    pylon(c, 45)
    pylon(c, 135)


def draw_beam(c):
    """The cone of light from the lens up into the globe, fading as it rises."""
    cx, cy = c.centre[0], c.centre[1] - COLLAR_TOP
    gx, gy, wide = GLOBE
    top, rx = gy + wide * 0.16, LENS * ROUND_X
    layer, d = c.layer()
    colour = (190, 250, 252, 255)
    d.polygon([c.px(cx - rx, cy), c.px(cx + rx, cy), c.px(gx + wide * 0.4, top), c.px(gx - wide * 0.4, top)], fill=colour)
    d.ellipse([c.px(cx - rx, cy - LENS * ROUND_Y), c.px(cx + rx, cy + LENS * ROUND_Y)], fill=colour)
    alpha = np.array(layer.getchannel("A")).astype(float)
    rows = np.arange(alpha.shape[0])[:, None] / SS + c.y0
    alpha *= 0.62 * (1 - np.clip((cy - rows) / (cy - top), 0, 1)) ** 1.2
    layer.putalpha(Image.fromarray(alpha.astype(np.uint8)))
    c.add(layer, blur=0.8)


def cut_pin(a):
    """The artwork's map pin, lifted out: (picture, x and y of its tip in it)."""
    R, G, B, A = [a[..., i].astype(int) for i in range(4)]
    orange = (A > 200) & (R > 150) & (R - B > 60) & (G > 40)
    ys, xs = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    orange &= (abs(xs - CENTRE[0]) < 60) & (ys > 280) & (ys < 440)
    y, x = np.argwhere(orange)[np.argmax(np.argwhere(orange)[:, 0])]
    own = label_from(orange, (x, y - 4))
    ys, xs = np.where(own)
    x0, y0, x1, y1 = xs.min() - 6, ys.min() - 6, xs.max() + 7, ys.max() + 7
    own = own[y0:y1, x0:x1]
    # A few of the old globe's dots sat on its edge: close the nicks they
    # leave, and give those pixels the orange next to them
    whole = ~grow(~grow(own, 3), 3)
    colours = np.where(own[..., None], a[y0:y1, x0:x1, :3], 0).astype(np.uint8)
    for _ in range(6):
        spread = np.array(Image.fromarray(colours).filter(ImageFilter.MaxFilter(3)))
        colours = np.where(colours.any(axis=2, keepdims=True), colours, spread)
    edge = Image.fromarray((whole * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    pin = np.dstack([colours, np.array(edge)])
    tip = np.argwhere(whole)[np.argmax(np.argwhere(whole)[:, 0])]
    return Image.fromarray(pin), (int(tip[1]), int(tip[0]))


def swap_hub(art, old):
    """The artwork with its ring and dotted globe (the area `old`) taken out
    and the projector put in.

    Returns the new artwork and what now stands in the way of anything behind
    the projection: the projector, the pin and the globe's disc (0 to 255).
    """
    pin, tip = cut_pin(art)
    a = art.copy()
    a[old] = 0
    # ... and the few dots of the old globe that stood apart from the rest
    gx, gy, wide = GLOBE
    a[55 : CENTRE[1] - 30, CENTRE[0] - 185 : CENTRE[0] + 185] = 0
    box = (CENTRE[0] - 230, 250, CENTRE[0] + 230, 610)
    spot = (slice(box[1], box[3]), slice(box[0], box[2]))

    shadow = Canvas(box, CENTRE)
    shadow.poly(arc(PLATE + 12, 0), (3, 26, 56, 160), blur=6)
    shadow.line(arc(PLATE + 2, 0), (96, 214, 240), 5, closed=True, blur=4, alpha=0.5)
    base = Canvas(box, CENTRE)
    draw_base(base)
    beam = Canvas((box[0], GLOBE[1], box[2], box[3]), CENTRE)
    draw_beam(beam)

    out = Image.fromarray(a)
    out.alpha_composite(shadow.flat(), box[:2])
    solid = base.flat()
    out.alpha_composite(solid, box[:2])
    out.alpha_composite(beam.flat(), (box[0], GLOBE[1]))
    at = (CENTRE[0] - tip[0], CENTRE[1] - COLLAR_TOP + 2 - tip[1])
    out.alpha_composite(pin, at)

    blocked = np.zeros(a.shape[:2], float)
    blocked[spot] = np.array(solid.getchannel("A"))
    pin_alpha = np.array(pin.getchannel("A"))
    held = blocked[at[1] : at[1] + pin.height, at[0] : at[0] + pin.width]
    held[:] = np.maximum(held, pin_alpha)
    # The globe is a hologram: what passes behind it shows through faintly
    ys, xs = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    far = ((xs - gx) ** 2 + (ys - gy) ** 2) ** 0.5
    blocked = np.maximum(blocked, 215 * np.clip((wide / 2 + 2 - far) / 5, 0, 1))
    return np.array(out), blocked.astype(np.uint8)
