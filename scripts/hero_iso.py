"""Drawing on the hero artwork's isometric floor.

The hero pictures are isometric: a step along either floor axis moves ISO_X
pixels across and ISO_Y down. Canvas draws in those "ground units" (see
Canvas.pt), four times oversized and scaled down, so edges come out smooth.
Used by hero_circuit_board.py and hero_projector.py.
"""

from collections import deque

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SS = 4  # oversampling
ISO_X, ISO_Y = 0.863, 0.506  # artwork pixels per ground unit, across and down
# A circle of radius 1 on the floor is this wide and this high in the picture
ROUND_X, ROUND_Y = ISO_X * 2**0.5, ISO_Y * 2**0.5


class Canvas:
    """An oversized layer over a box of the artwork, drawn in ground units."""

    def __init__(self, box, centre):
        self.area = box
        self.x0, self.y0, x1, y1 = box
        self.centre = centre
        self.size = ((x1 - self.x0) * SS, (y1 - self.y0) * SS)
        self.img = Image.new("RGBA", self.size, (0, 0, 0, 0))

    def px(self, x, y):
        """Artwork pixels to canvas pixels."""
        return ((x - self.x0) * SS, (y - self.y0) * SS)

    def pt(self, u, v, h=0):
        """A point on the isometric floor (h pixels above it) to canvas pixels."""
        return self.px(
            self.centre[0] + (u - v) * ISO_X, self.centre[1] + (u + v) * ISO_Y - h
        )

    def layer(self):
        img = Image.new("RGBA", self.size, (0, 0, 0, 0))
        return img, ImageDraw.Draw(img)

    def add(self, layer, blur=0, alpha=1.0):
        if blur:
            layer = layer.filter(ImageFilter.GaussianBlur(blur * SS))
        if alpha != 1.0:
            layer.putalpha(layer.getchannel("A").point(lambda a: int(a * alpha)))
        self.img.alpha_composite(layer)

    def poly(self, points, fill, **kw):
        layer, d = self.layer()
        d.polygon([self.pt(*p) for p in points], fill=fill)
        self.add(layer, **kw)

    def polys(self, shapes, **kw):
        """Many polygons in one go: (points, fill) pairs."""
        layer, d = self.layer()
        for points, fill in shapes:
            d.polygon([self.pt(*p) for p in points], fill=fill)
        self.add(layer, **kw)

    def line(self, points, fill, width, closed=False, **kw):
        layer, d = self.layer()
        pts = [self.pt(*p) for p in points]
        if closed:
            pts += pts[:2]
        d.line(pts, fill=fill, width=round(width * SS), joint="curve")
        self.add(layer, **kw)

    def disc(self, u, v, h, r, fill, **kw):
        ring = [
            (u + r * np.cos(t), v + r * np.sin(t), h)
            for t in np.linspace(0, 2 * np.pi, 72, endpoint=False)
        ]
        self.poly(ring, fill, **kw)

    def box(self, u0, v0, u1, v1, h0, h1, top, left, right):
        """A block standing on the floor: its two near sides, then its top."""
        self.poly([(u0, v1, h0), (u1, v1, h0), (u1, v1, h1), (u0, v1, h1)], left)
        self.poly([(u1, v1, h0), (u1, v0, h0), (u1, v0, h1), (u1, v1, h1)], right)
        self.poly([(u0, v0, h1), (u1, v0, h1), (u1, v1, h1), (u0, v1, h1)], top)

    def flat(self):
        """Scaled down to the artwork's size."""
        return self.img.resize((self.size[0] // SS, self.size[1] // SS), Image.LANCZOS)


def square(r, h=0):
    return [(-r, -r, h), (r, -r, h), (r, r, h), (-r, r, h)]


def arc(r, h=0, start=0, end=360, step=3):
    """Points round a circle on the floor (h pixels above it), by the angle
    they are seen at in the picture: 0 right, 90 nearest, 180 left, 270
    farthest."""
    n = max(2, int(abs(end - start) / step) + 1)
    turns = np.radians(np.linspace(start, end, n) - 45)
    return [(r * np.cos(t), r * np.sin(t), h) for t in turns]


def label_from(mask, seed):
    """The connected part of mask that holds the seed pixel (x, y)."""
    out = np.zeros(mask.shape, bool)
    if not mask[seed[1], seed[0]]:
        return out
    out[seed[1], seed[0]] = True
    q = deque([seed])
    h, w = mask.shape
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and mask[ny, nx] and not out[ny, nx]:
                out[ny, nx] = True
                q.append((nx, ny))
    return out


def grow(m, r):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out
