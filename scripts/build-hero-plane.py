"""The Freight slide's plane, facing the other way.

The hero artwork draws the plane pointing down and to the left. On the Freight
slide it flies in from the top left, so it is shown pointing down and to the
right instead, all the way to where it parks. That is the drawing's mirror
image, except for the lettering along its side, which would read backwards:
the lettering is lifted off first, and put back leaning the other way (the
same letters, sheared to run down the far side of the body).

Reads the layers scripts/build-hero-fx.py cuts (run that first if the artwork
changes) and writes, next to them in public/hero-variation-smart/fx/:
  freight-plane-right.png        the plane pointing down and to the right
  freight-silhouette-right.webp  the Freight picture's outline with the plane
                                 parked that way (half size), for the gloss

    python3 -B scripts/build-hero-plane.py      (needs numpy and Pillow)
"""

import os

import numpy as np
from PIL import Image

from hero_iso import grow

FX = os.path.join(os.path.dirname(__file__), "..", "public", "hero-variation-smart", "fx")

# Where the vehicles park in the artwork (see components/hero-section.tsx):
# the plane lower than the artwork has it, so that the straight line it flies
# in on passes between the projector and the truck
SHIP, TRUCK, PLANE = (80, 476), (536, 608), (842, 572)
# The lettering on the plane: the columns it is in, the line through its
# middle (x, y, and how much it climbs for each pixel across) and how far
# above and below that line it reaches
LETTERS_X = (199, 306)
LETTERS_MID, LETTERS_CLIMB = (254, 241), 0.575
LETTERS_UP, LETTERS_DOWN = 26, 22
NAVY, ORANGE = np.array([15, 84, 152.0]), np.array([246, 166, 60.0])


def load(name):
    return np.array(Image.open(os.path.join(FX, name)).convert("RGBA"))


def save(img, name, kind, **options):
    """Write the file whole or not at all (the site imports these pictures)."""
    path = os.path.join(FX, name)
    img.save(path + ".part", kind, **options)
    os.replace(path + ".part", path)


def lettering(a):
    """Where the lettering is: its inks, and a pixel or two round them."""
    R, G, B = [a[..., i].astype(int) for i in range(3)]
    rows, cols = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    middle = LETTERS_MID[1] - LETTERS_CLIMB * (cols - LETTERS_MID[0])
    band = (cols >= LETTERS_X[0]) & (cols < LETTERS_X[1]) & (rows > middle - LETTERS_UP) & (rows < middle + LETTERS_DOWN)
    ink = ((R < 130) & (B - R > 50)) | ((R > 215) & (B < 170))
    return grow(ink & band, 2) & band


def fill(a, hole):
    """The picture with the hole filled from round its edge inwards, each
    pixel the average of its neighbours that are already known."""
    out = a.astype(float)
    known = ~hole
    while not known.all():
        total = np.zeros_like(out)
        count = np.zeros(hole.shape)
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1)):
            k = np.roll(np.roll(known, dy, 0), dx, 1)
            total += np.roll(np.roll(out, dy, 0), dx, 1) * k[..., None]
            count += k
        ready = ~known & (count >= 3)
        if not ready.any():
            ready = ~known & (count > 0)
        out[ready] = total[ready] / count[ready][:, None]
        known |= ready
    return out


def lift(a, hole, clean):
    """The lettering on its own: for each pixel, how much navy or orange ink
    it takes to get from the body's own colour to the picture's."""
    rgb, under = a[..., :3].astype(float), clean[..., :3]
    layer = np.zeros(a.shape, np.uint8)
    for ink in (NAVY, ORANGE):
        towards = ink - under
        share = ((rgb - under) * towards).sum(axis=2) / np.maximum((towards**2).sum(axis=2), 1)
        mine = hole & (share > 0.08) & (share * 255 > layer[..., 3])
        layer[mine, :3] = ink
        layer[mine, 3] = np.clip(share[mine] * 255, 0, 255)
    return layer


def main():
    a = load("freight-plane.png")
    hole = lettering(a)
    clean = fill(a, hole)
    letters = Image.fromarray(lift(a, hole, clean))

    # The body, mirrored; then the lettering over it, moved to where it now
    # is and sheared to run down that side (its uprights stay upright)
    plane = Image.fromarray(np.round(clean).astype(np.uint8)).transpose(Image.FLIP_LEFT_RIGHT)
    across = (a.shape[1] - 1 - LETTERS_MID[0]) - LETTERS_MID[0]
    lean = 2 * LETTERS_CLIMB
    plane.alpha_composite(
        letters.transform(
            letters.size,
            Image.AFFINE,
            (1, 0, -across, -lean, 1, lean * (across + LETTERS_MID[0])),
            Image.BICUBIC,
        )
    )
    save(plane, "freight-plane-right.png", "PNG", optimize=True)

    # The outline of the finished picture, for the gloss that sweeps over it
    whole = Image.fromarray(load("freight-base.png"))
    for name, spot in (("freight-ship.png", SHIP), ("freight-truck.png", TRUCK)):
        whole.alpha_composite(Image.fromarray(load(name)), spot)
    whole.alpha_composite(plane, PLANE)
    outline = Image.new("RGBA", whole.size, (255, 255, 255, 255))
    outline.putalpha(whole.getchannel("A"))
    save(
        outline.resize((whole.width // 2, whole.height // 2), Image.LANCZOS),
        "freight-silhouette-right.webp",
        "WEBP",
        lossless=True,
        method=6,
    )
    print(f"plane: x {PLANE[0]}, y {PLANE[1]}, w {plane.width}, h {plane.height}")


if __name__ == "__main__":
    main()
