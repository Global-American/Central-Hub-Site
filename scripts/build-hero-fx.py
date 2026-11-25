"""Cut the hero artwork into the layers its animations use.

Writes public/hero-variation-smart/fx/ (see components/hero-art-fx.tsx):
  <slide>-base.png        the artwork with its vehicles taken out and its
                          middle redrawn: for Freight a projector for the
                          page's globe in place of the ring and dotted globe
                          (hero_projector.py), for Returns and Fulfillment a
                          circuit board in place of the cog
                          (hero_circuit_board.py). Returns' truck has the
                          front of its box filled in (the artwork leaves it
                          see-through over the cab). Fulfillment also gets the
                          man placing an order on a phone from its card
                          picture, in place of the worker and the tall phone
                          on its bottom right station (hero_order_phone.py),
                          and a packing station in place of the man at a
                          desk on its bottom left one
                          (hero_packing_station.py), and on its top left one
                          the warehouse alone, with an orange forklift from
                          the card picture in place of the yard in front of
                          it (hero_warehouse.py). Its truck and that
                          phone are not in it: they are pictures of their
                          own, below
  fulfil-<part>.png       the moving parts of Fulfillment's delivery
                          (hero_delivery.py): the truck, the trolley that
                          stands in front of it, the phone saying ORDER
                          PLACED (phone-order) and PARCEL DELIVERED
                          (phone-delivered), the hand in front of it, and
                          the parcel
  <slide>-<vehicle>.png   each vehicle on its own, cropped to its box
  <slide>-lines.webp      only the artwork's network / circuit lines, with a
                          soft halo, as a mask for the waves of light
  <slide>-silhouette.webp the artwork's outline (half size), as a mask for
                          the gloss sweep
  <slide>-cover.webp      everything but what a vehicle arrives from behind
                          (the projector and the globe over it), as a mask
                          for that vehicle

Run it again whenever a hero picture changes, then update the sprite boxes it
prints into the slide configs in components/hero-section.tsx.

    python3 scripts/build-hero-fx.py      (needs numpy and Pillow)
"""

import os
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

from hero_circuit_board import find_traces, swap_cog
from hero_delivery import fill_box_front, take_delivery
from hero_order_phone import swap_worker
from hero_packing_station import swap_desk
from hero_projector import swap_hub
from hero_warehouse import swap_yard

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "hero-variation-smart")
OUT = os.path.join(ROOT, "fx")
CARDS = os.path.join(ROOT, "..", "card-thumbnails")


# A point on the side of the Returns picture's truck
RETURN_TRUCK = (280, 239)


def load(name):
    return np.array(Image.open(os.path.join(ROOT, name)).convert("RGBA"))


def dilate(m, r):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out


def erode(m, r):
    return ~dilate(~m, r)


def label(mask, ds):
    """Connected regions of mask, found on a ds-times smaller grid."""
    H, W = mask.shape
    h, w = H // ds, W // ds
    m = mask[: h * ds, : w * ds].reshape(h, ds, w, ds).any(axis=(1, 3))
    lab = np.zeros((h, w), np.int32)
    sizes = {}
    n = 0
    for y in range(h):
        for x in range(w):
            if m[y, x] and not lab[y, x]:
                n += 1
                lab[y, x] = n
                q = deque([(y, x)])
                count = 0
                while q:
                    cy, cx = q.popleft()
                    count += 1
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            ny, nx = cy + dy, cx + dx
                            if 0 <= ny < h and 0 <= nx < w and m[ny, nx] and not lab[ny, nx]:
                                lab[ny, nx] = n
                                q.append((ny, nx))
                sizes[n] = count
    full = np.zeros((H, W), np.int32)
    full[: h * ds, : w * ds] = np.repeat(np.repeat(lab, ds, 0), ds, 1)
    return full, sizes


def white(alpha):
    img = Image.new("RGBA", (alpha.shape[1], alpha.shape[0]), (255, 255, 255, 255))
    img.putalpha(Image.fromarray(alpha.astype(np.uint8)))
    return img


def save_webp(img, name):
    img.save(os.path.join(OUT, name), "WEBP", lossless=True, method=6)


def save_lines(mask, a, name):
    """The lines, plus a soft halo so a passing wave glows around them."""
    lines = np.where(dilate(mask, 1), a[..., 3], 0).astype(float)
    blurred = white(lines).getchannel("A").filter(ImageFilter.GaussianBlur(5))
    halo = np.minimum(np.array(blurred).astype(float) * 2.2, 200)
    save_webp(white(np.maximum(lines, halo)), name)


def save_silhouette(a, name):
    img = white(a[..., 3])
    save_webp(img.resize((img.width // 2, img.height // 2), Image.LANCZOS), name)


def split(a, points, pad=4):
    """Lift the objects under each point out of the artwork into sprites."""
    lab, _ = label(a[..., 3] > 40, 4)
    base = a.copy()
    taken = np.zeros(lab.shape, bool)
    for name, (px, py) in points.items():
        own = lab == lab[py, px]
        region = dilate(own, pad) & ((lab == 0) | own)
        ys, xs = np.where(region)
        x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        sprite = a[y0:y1, x0:x1].copy()
        sprite[..., 3] = np.where(region[y0:y1, x0:x1], sprite[..., 3], 0)
        Image.fromarray(sprite).save(os.path.join(OUT, name + ".png"), optimize=True)
        base[..., 3] = np.where(region, 0, base[..., 3])
        taken |= region
        print(f"  {name}: x {x0}, y {y0}, w {x1 - x0}, h {y1 - y0}")
    return base, taken


def channels(a):
    return [a[..., i].astype(int) for i in range(4)]


def main():
    os.makedirs(OUT, exist_ok=True)

    print("Shipping")
    a = load("ship-it-smart.png")
    save_silhouette(a, "ship-silhouette.webp")
    base, taken = split(a, {"ship-ship": (300, 450)})
    Image.fromarray(base).save(os.path.join(OUT, "ship-base.png"), optimize=True)
    R, G, B, A = channels(a)
    cyan = (A > 80) & (G > 170) & (B > 200) & (R < 160) & (G - R > 90) & ~dilate(taken, 2)
    cyan[550:815, 655:940] = False  # truck box and its lettering
    cyan[150:372, 420:600] = False  # cloud body (keeps the four lines under it)
    save_lines(cyan, a, "ship-lines.webp")

    print("Freight")
    a = load("freight-it-smart.png")
    base, taken = split(
        a,
        {"freight-ship": (300, 700), "freight-truck": (680, 720), "freight-plane": (1000, 760)},
    )
    # The ring in the middle and the dotted globe standing in it, swapped for
    # a projector for the page's own globe
    lab, _ = label(base[..., 3] > 40, 4)
    ring = lab == lab[500, 900]
    base, blocked = swap_hub(base, dilate(ring, 4) & ((lab == 0) | ring))
    Image.fromarray(base).save(os.path.join(OUT, "freight-base.png"), optimize=True)
    save_webp(white(255 - blocked), "freight-cover.webp")
    whole = base.copy()  # with the vehicles back in their places
    whole[taken] = a[taken]
    save_silhouette(whole, "freight-silhouette.webp")
    R, G, B, A = channels(base)
    teal = (A > 80) & (G > 150) & (R < 120) & (G - R > 80) & ~dilate(taken, 2)
    save_lines(teal, base, "freight-lines.webp")

    # Returns / Fulfillment: the cog in the middle swapped for a circuit
    # board, then the thin circuit traces, without the stations and the board
    # but with the board's own traces. The two pictures have the same traces
    # round the middle (a few pixels apart), and only Fulfillment draws them
    # in a colour that tells them from the cog, so it finds them for both.
    hubs = {"return": (743, 570), "fulfil": (731, 570)}  # middle of the diamonds
    real, keep = find_traces(load("fulfil-it-smart-no-globe.png"), hubs["fulfil"])
    for key, centre in hubs.items():
        print(key)
        shift = centre[0] - hubs["fulfil"][0]
        art = load(f"{key}-it-smart-no-globe.png")
        station = np.zeros(art.shape[:2], bool)
        parts = {}
        if key == "return":
            # The front of its truck's box, which the artwork leaves open
            art = fill_box_front(art, RETURN_TRUCK)
        if key == "fulfil":
            card = np.array(Image.open(os.path.join(CARDS, "fulfill-itsmart.png")).convert("RGBA"))
            # Its truck and its phone are pictures of their own, for the
            # delivery (hero_delivery.py): the artwork is left without them
            bare, parts = take_delivery(
                swap_worker(art, card, phone=False), art, swap_worker(art, card)
            )
            art, station = swap_desk(bare)
            art, yard = swap_yard(art, card)
            station |= yard
        a, board = swap_cog(
            art,
            centre,
            np.roll(real, shift, 1),
            np.roll(keep, shift, 1),
        )
        Image.fromarray(a).save(os.path.join(OUT, f"{key}-base.png"), optimize=True)
        whole = Image.fromarray(a)
        for name, (part, (x, y)) in parts.items():
            Image.fromarray(part).save(os.path.join(OUT, f"{key}-{name}.png"), optimize=True)
            print(f"  {name}: x {x}, y {y}, w {part.shape[1]}, h {part.shape[0]}")
            if name in ("phone-order", "trolley"):  # always there: the gloss is for them too
                whole.alpha_composite(Image.fromarray(part), (x, y))
        save_silhouette(np.array(whole), f"{key}-silhouette.webp")
        solid = a[..., 3] > 40
        opened = dilate(erode(solid, 4), 4)
        lab, sizes = label(opened, 2)
        big = np.isin(lab, [k for k, v in sizes.items() if v > 3000])
        thin = solid & ~dilate(big, 3) & ~dilate(station, 2)
        save_lines(thin | (board > 128), a, f"{key}-lines.webp")


if __name__ == "__main__":
    main()
