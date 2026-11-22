"""The moving parts of the Fulfillment hero's delivery.

A parcel goes round the picture's four stations and, from the last of them,
the truck takes it to the phone the order was placed on, which turns over to
say PARCEL DELIVERED (components/hero-art-loop.tsx). For that the picture
gives up, as pictures of their own:
  truck            the truck, lifted off its pad (with the wheel a box hid
                   put back, and a shadow)
  trolley          the trolley of boxes that stands in front of it
  phone-order      the phone, as hero_order_phone.py draws it
  phone-delivered  ... and saying PARCEL DELIVERED
  hand             the man's hand, which goes in front of the phone
  parcel           the parcel
Its top right pad is left bare for the truck and the trolley (the loose boxes
that stood there go), and on its bottom right pad a second trolley takes the
place of the forklift.

Used by build-hero-fx.py.
"""

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

import hero_order_phone as order
from hero_iso import ISO_X, ISO_Y, SS, Canvas, grow, label_from
from hero_packing_station import carton

# The truck's station: the box its pad is in, the box all that stands on it
# is in, and a point on the truck's side
PAD = (940, 150, 1345, 420)
STATION = (940, 60, 1360, 420)
TRUCK = (1200, 180)
# Its box starts here: what is left of this near the pad is the trolley
TRUCK_LEFT = 1077
# The truck stands along the floor's axis: it drops this much a pixel across
DROP = ISO_Y / ISO_X
# The front of its box, over the cab: the artwork draws only a sliver of it
# along the roof's edge and leaves the rest see-through. The two ends of that
# edge, how far down the front goes behind the cab, and its colour
BOX_FRONT = ((1222, 217.5), (1282.5, 183.4))
BOX_FRONT_DEEP = 70
BOX_FRONT_SHADE = (0, 89, 123)
# The parcel: how far it reaches either side of its middle, and its height
PARCEL = (13, 24)
# The trolley by the truck: a point on its deck and one on the boxes on it
TROLLEY, STACK = (1127, 317), (1090, 257)
# The forklift on the phone's pad (a point on its mast), and where the second
# trolley goes in its place: this far from where the first one stands
FORKLIFT = (1073, 707)
SECOND_TROLLEY = (-26, 492)
# The three circuit traces the forklift stood in front of: where each comes
# out from behind it (x, the middle of the trace there) and how far right it
# has to go on, dropping DROP a pixel, to be under the pad's edge
TRACE = (211, 239, 254)
TRACE_THICK = 6
TRACES = (((1034, 665.0), 1114), ((1032, 698.3), 1084), ((1018, 727.5), 1052))


def channels(a):
    return [a[..., i].astype(float) for i in range(4)]


def fill_holes(mask):
    """The mask with everything it encloses."""
    ys, xs = np.where(mask)
    x0, y0, x1, y1 = xs.min() - 2, ys.min() - 2, xs.max() + 3, ys.max() + 3
    out = mask.copy()
    out[y0:y1, x0:x1] = ~label_from(~mask[y0:y1, x0:x1], (0, 0))
    return out


def in_box(mask, box):
    out = np.zeros_like(mask)
    x0, y0, x1, y1 = box
    out[y0:y1, x0:x1] = mask[y0:y1, x0:x1]
    return out


def shade(a):
    """How much of the pad's top shows in each pixel that is nothing but the
    pad's colour, darkened or not (1 for the bare pad, less in a shadow, 0
    for anything else)."""
    R, G, B, A = channels(a)
    k = np.stack([R / order.TOP[0], G / order.TOP[1], B / order.TOP[2]], axis=2)
    even = (k.max(axis=2) - k.min(axis=2) < 0.035) & (A > 250)
    k = k.mean(axis=2)
    return np.where(even & (k > 0.7) & (k < 1.012), k, 0)


# --- the truck ------------------------------------------------------------


def box_front(a, side):
    """Where the front of a truck's box is, over its cab: the two ends of the
    roof's front edge (the corner where the roof meets the box's side, and
    the roof's tip). `side` is a point on the side of the box. The trucks in
    all these pictures are the one drawing, at different sizes."""
    R, G, B, A = channels(a)
    rgb = a[..., :3].astype(float)
    flat = (np.abs(rgb - (48, 189, 245)).max(axis=2) < 14) & (A > 250)
    # (from the nearest pixel of the side's own colour: the point may be on
    # its lettering)
    ys, xs = np.where(flat[side[1] - 30 : side[1] + 30, side[0] - 30 : side[0] + 30])
    near = np.argmin((xs - 30) ** 2 + (ys - 30) ** 2)
    panel = label_from(flat, (int(side[0] - 30 + xs[near]), int(side[1] - 30 + ys[near])))
    ys, xs = np.where(panel)
    right = xs.max()
    corner = (right + 1.0, float(ys[xs == right].min()))
    # The roof: the paler blues above the side, joined to it
    roof = (A > 250) & (B > 245) & (G > 200) & ~panel
    roof = label_from(roof, (int(np.median(xs)), int(ys[xs == int(np.median(xs))].min()) - 4))
    ys, xs = np.where(roof)
    tip = xs.max()
    return corner, (tip + 1.0, float(ys[xs == tip].max()) + 1)


def fill_box_front(a, side):
    """The artwork with the front of a truck's box filled in: it draws only
    a sliver of it along the roof's edge and leaves the rest see-through, so
    that whatever is behind the truck shows between its box and its cab."""
    (xa, ya), (xb, yb) = box_front(a, side)
    deep = 1.16 * (xb - xa)
    x0, y0 = int(xa) - 4, int(yb) - 4
    size = (int(xb - xa) + 8, int(ya - yb + deep) + 8)
    front = Image.new("L", (size[0] * SS, size[1] * SS), 0)
    corners = [(xa, ya), (xb, yb), (xb, yb + deep), (xa, ya + deep)]
    ImageDraw.Draw(front).polygon([((x - x0) * SS, (y - y0) * SS) for x, y in corners], fill=255)
    cover = np.zeros(a.shape[:2])
    cover[y0 : y0 + size[1], x0 : x0 + size[0]] = np.array(front.reduce(SS)) / 255
    # Only where the truck is not: nothing, or the pad it stands on. The
    # truck's own soft edges stay, over the new front.
    alpha = a[..., 3:4] / 255
    pad = (shade(a) > 0)[..., None]
    c = (cover * ((a[..., 3] < 250) | pad[..., 0]))[..., None]
    rgb = a[..., :3].astype(float)
    front = np.array(BOX_FRONT_SHADE, float)
    filled = np.where(pad, front, rgb * alpha + front * (1 - alpha))
    new_alpha = alpha * (1 - c) + c
    new_rgb = (rgb * alpha * (1 - c) + filled * c) / np.maximum(new_alpha, 1e-6)
    out = a.copy()
    out[..., :3] = np.round(new_rgb).astype(np.uint8)
    out[..., 3:4] = np.round(new_alpha * 255).astype(np.uint8)
    return out


def find_truck(a):
    """The truck as it is in view: all that is joined to its side and is not
    the pad, its shadow on the pad, the boxes' card or the trolley."""
    R, G, B, A = channels(a)
    card = (R > 180) & (R - B > 40) & (B > 85)
    things = (A > 40) & (shade(a) == 0) & ~card & ~order.flat(a, order.SIDE, 6)
    things &= ~order.far_line(a)
    things[:, :TRUCK_LEFT] = False
    truck = fill_holes(label_from(in_box(things, STATION), TRUCK))
    # (less any thin line that is only joined on to it: the trolley's edge)
    core = label_from(~grow(~truck, 1), TRUCK)
    return grow(core, 1) & truck, card


def hidden_wheel(a, truck, card):
    """The part of the truck's back wheel that a box on the trolley stands in
    front of: its back wheels are a pair, one a step along the truck from
    the other, so it is the same part of the next wheel. Returns the pixels
    and the step to what goes in them."""
    R, G, B, A = channels(a)
    hub = truck & (R > 215) & (G > 110) & (G < 190) & (B < 100)
    hub[:228] = False  # (the lettering on the side is orange too)
    # The hubs, back to front
    spots, todo = [], hub.copy()
    while todo.any():
        y, x = np.argwhere(todo)[0]
        part = label_from(hub, (x, y))
        todo &= ~part
        if part.sum() > 20:
            ys, xs = np.where(part)
            spots.append((xs.mean(), ys.mean()))
    spots.sort()
    # The step between the pair, along the truck: wherever the first wheel's
    # part in view matches the second best
    (x1, y1), (x2, y2) = spots[0], spots[1]
    near = np.zeros_like(truck)
    near[int(y1) - 16 : int(y1) + 18, int(x1) - 18 : int(x1) + 8] = True
    rgb = a[..., :3].astype(int)
    best = None
    for k in np.arange(16, 32, 0.5):
        dx, dy = round(k * ISO_X), round(k * ISO_Y)
        moved = np.roll(np.roll(rgb, -dy, 0), -dx, 1)
        same = (np.abs(rgb - moved).max(axis=2) < 24) & near & truck
        if best is None or same.sum() > best[0]:
            best = (same.sum(), dx, dy)
    _, dx, dy = best
    # The wheel's own round, a step back from the second one's
    ys, xs = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    wheel = ((xs - (x2 - dx)) / 13.5) ** 2 + ((ys - (y2 - dy) - 2) / 15.5) ** 2 < 1
    src = np.roll(np.roll(truck, -dy, 0), -dx, 1)
    return grow(card, 1) & wheel & src & ~truck, (dx, dy)


def lift_truck(a):
    """The truck out of the artwork, cropped to its box: the picture, and the
    box's corner."""
    truck, card = find_truck(a)
    hidden, (dx, dy) = hidden_wheel(a, truck, card)
    # The soft pixels round it, only where there is nothing behind them: over
    # the pad they are all but the pad's colour
    soft = grow(truck, 1) & ~truck & (a[..., 3] > 0) & (a[..., 3] < 250)
    whole = truck | soft | hidden
    out = np.zeros_like(a)
    out[truck | soft] = a[truck | soft]
    ys, xs = np.where(hidden)
    out[ys, xs] = a[ys + dy, xs + dx]
    # A shadow of its own on the ground, to go with it: a soft dark band
    # under its wheels (the artwork's is part hidden by the trolley)
    low = np.where(whole.any(axis=0), whole.shape[0] - 1 - whole[::-1].argmax(axis=0), -99)
    ys, xs = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    band = (ys > low[xs] - 13) & (ys < low[xs] + 4) & (low[xs] > 0)
    shadow = Image.fromarray((band * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))
    shadow = np.array(shadow).astype(float) * 0.26
    under = Image.fromarray(np.dstack([np.zeros(a.shape[:2] + (3,), np.uint8), shadow.astype(np.uint8)]))
    # The front of its box, filled in behind the roof's edge and the cab
    (xa, ya), (xb, yb) = BOX_FRONT
    x0, y0 = int(xa) - 4, int(yb) - 4
    size = (int(xb - xa) + 8, int(ya - yb) + BOX_FRONT_DEEP + 8)
    front = Image.new("L", (size[0] * SS, size[1] * SS), 0)
    corners = [(xa, ya), (xb, yb), (xb, yb + BOX_FRONT_DEEP), (xa, ya + BOX_FRONT_DEEP)]
    ImageDraw.Draw(front).polygon([((x - x0) * SS, (y - y0) * SS) for x, y in corners], fill=255)
    under.paste(Image.new("RGBA", size, BOX_FRONT_SHADE + (255,)), (x0, y0), front.reduce(SS))
    under.alpha_composite(Image.fromarray(out))
    out = np.array(under)
    ys, xs = np.where(out[..., 3] > 3)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    return out[y0:y1, x0:x1], (int(x0), int(y0))


def lift_trolley(a):
    """The trolley and the boxes on it, out of the artwork: the picture, and
    its box's corner."""
    R, G, B, A = channels(a)
    truck, card = find_truck(a)
    things = (A > 40) & (shade(a) == 0) & ~order.flat(a, order.SIDE, 6)
    things = in_box(things & ~order.far_line(a) & ~grow(truck, 1), STATION)
    # Its deck, handle and wheels, then the boxes stacked on it (not the
    # loose ones on the pad beside it, which are the same card)
    seen = label_from(things & ~card, TROLLEY) | label_from(things & card, STACK)
    # ... and what they enclose, but for the pad showing through its handle
    whole = seen | (fill_holes(seen) & (shade(a) == 0))
    soft = grow(whole, 1) & ~whole & ~grow(truck, 1) & (a[..., 3] > 0) & (a[..., 3] < 250)
    out = np.zeros_like(a)
    out[whole | soft] = a[whole | soft]
    ys, xs = np.where(whole | soft)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    return out[y0:y1, x0:x1], (int(x0), int(y0))


def bare_pad(a):
    """The artwork with everything taken off the truck's pad."""
    R, G, B, A = channels(a)
    x0, y0, x1, y1 = PAD
    # What stands on it: all that is not the pad or a shadow on it, down to
    # the pad's near edge (and not the odd pixel along the pad's own edges)
    _, near = order.pad_edges(a, PAD)
    ys, xs = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
    edge = np.full(a.shape[1], -1.0)
    edge[x0:x1] = np.nan_to_num(near, nan=-1)
    things = (A > 40) & (shade(a) == 0) & ~order.flat(a, order.SIDE, 8) & ~order.far_line(a)
    things = in_box(things & (ys < edge[xs] - 2), STATION)
    gone, todo = np.zeros_like(things), things.copy()
    while todo.any():
        y, x = np.argwhere(todo)[0]
        part = label_from(things, (x, y))
        todo &= ~part
        if part.sum() > 40:
            gone |= part
    gone = grow(gone, 2)
    out = order.clear(a, gone, PAD)
    # Then the pad's far edge once more all the way along where they stood,
    # with nothing left over beyond it, and the top made the one colour all
    # over (the shadows have gone)
    far, near = order.pad_edges(out, PAD)
    cols = np.where(gone.any(axis=0))[0]
    stood = np.zeros_like(gone)
    for x in range(cols.min(), cols.max() + 1):
        if not np.isnan(far[x - x0]):
            stood[STATION[1] : int(far[x - x0]) + 3, x] = out[STATION[1] : int(far[x - x0]) + 3, x, 3] > 0
            out[int(np.ceil(far[x - x0])) + 2 : int(near[x - x0]) - 1, x] = order.TOP + (255,)
    return order.clear(out, stood, PAD)


# --- the second trolley ---------------------------------------------------


def standing(a):
    """All that stands on the phone's pad: not the pad, nor the circuit
    traces that run up to it."""
    R, G, B, A = channels(a)
    trace = (B > 225) & (R > 150) & (R < 240) & (B - R > 25) & (G > 190)
    things = (A > 40) & ~order.flat(a, order.TOP, 12) & ~order.flat(a, order.SIDE, 8)
    return in_box(things & ~order.far_line(a) & ~trace, order.STATION)


def swap_forklift(a, trolley, corner):
    """The artwork with the forklift taken off the phone's pad and a trolley
    like the one by the truck in its place, behind the man and the roller
    table. The traces the forklift stood in front of are run on to the pad."""
    things = standing(a)
    gone = grow(fill_holes(label_from(things, FORKLIFT)), 2)
    out = order.clear(a, gone, order.PAD)
    # The traces, wherever there is now nothing
    x0, y0 = order.STATION[:2]
    layer = Image.new("L", ((order.STATION[2] - x0) * SS, (order.STATION[3] - y0) * SS), 0)
    d = ImageDraw.Draw(layer)
    half = TRACE_THICK / 2
    for (xa, ya), xb in TRACES:
        yb = ya + (xb - xa) * DROP
        box = [(xa, ya - half), (xb, yb - half), (xb, yb + half), (xa, ya + half)]
        d.polygon([((x - x0) * SS, (y - y0) * SS) for x, y in box], fill=255)
    cover = np.zeros(a.shape[:2])
    cover[y0 : order.STATION[3], x0 : order.STATION[2]] = np.array(layer.reduce(SS))
    bare = gone & (cover > out[..., 3])
    out[bare, :3] = TRACE
    out[bare, 3] = cover[bare].astype(np.uint8)
    # The trolley, only where the pad (or nothing at all) is: what stands
    # nearer than it stays in front
    x, y = corner[0] + SECOND_TROLLEY[0], corner[1] + SECOND_TROLLEY[1]
    whole = np.zeros_like(a)
    whole[y : y + trolley.shape[0], x : x + trolley.shape[1]] = trolley
    whole[standing(out), 3] = 0
    img = Image.fromarray(out)
    img.alpha_composite(Image.fromarray(whole))
    return np.array(img)


# --- the parcel -----------------------------------------------------------


def draw_parcel():
    """A parcel like the ones on the packing bench's conveyor, with the
    brand's badge on it. Returns the picture and where the middle of its
    foot is in it."""
    r, high = PARCEL
    box = (0, 0, 64, 64)
    centre = (32, 44)
    c = Canvas(box, centre)
    carton(c, -r, -r, r, r, 0, high, "badge")
    img = np.array(c.img.reduce(SS))
    ys, xs = np.where(img[..., 3] > 0)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    return img[y0:y1, x0:x1], (centre[0] - x0, centre[1] - y0)


# --- the phone ------------------------------------------------------------


def tick(face):
    """A mask of a ring with a tick in it, where the trolley is on the other
    face."""
    middle, r = (49.2, 65), 12.5
    ring = [
        (middle[0] + r * np.cos(t), middle[1] + r * np.sin(t))
        for t in np.linspace(0, 2 * np.pi, 49)
    ]
    mark = [(middle[0] - 6.2, middle[1] - 0.2), (middle[0] - 1.6, middle[1] - 5), (middle[0] + 6.6, middle[1] + 5.2)]
    return ImageChops.lighter(face.strokes([ring], 2.2), face.strokes([mark], 3))


DELIVERED = (("DELIVERED", 10.5), ("PARCEL", 30.5))


def draw_phones(art, shape):
    """The phone on its own, saying ORDER PLACED and saying PARCEL DELIVERED,
    cropped to its box."""
    x0, y0, x1, y1 = order.PHONE_AREA
    out = []
    for words, sign in ((order.WORDS, None), (DELIVERED, tick)):
        img = Image.new("RGBA", (shape[1], shape[0]), (0, 0, 0, 0))
        order.draw_phone(img, art, words, sign)
        out.append(np.array(img)[y0:y1, x0:x1])
    return out


def lift_hand(with_phone, without, phone):
    """The man's hand and sleeve where they are in front of the phone: where
    the finished picture is not just the phone over the picture without it.
    There is nothing behind them but the phone (they are above the pad), so
    the picture without the phone has them just as they are, soft edges and
    all."""
    x0, y0, x1, y1 = order.PHONE_AREA
    under = Image.fromarray(without[y0:y1, x0:x1])
    under.alpha_composite(Image.fromarray(phone))
    seen = with_phone[y0:y1, x0:x1]
    his = np.abs(seen.astype(int) - np.array(under).astype(int)).max(axis=2) > 6
    his = grow(his, 2)
    ys, xs = np.where(his)
    bx0, by0, bx1, by1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    hand = without[y0 + by0 : y0 + by1, x0 + bx0 : x0 + bx1].copy()
    hand[..., 3] = np.where(his[by0:by1, bx0:bx1], hand[..., 3], 0)
    return hand, (int(x0 + bx0), int(y0 + by0))


# --- all of it ------------------------------------------------------------


def take_delivery(art, original, with_phone):
    """art: the artwork without its phone (hero_order_phone.swap_worker with
    phone=False); original: the artwork as it came; with_phone: the artwork
    with the phone in.

    Returns the artwork with its truck's pad bare and a trolley where the
    forklift stood, and the moving parts: name -> (picture, the corner of its
    box in the artwork)."""
    truck, corner = lift_truck(original)
    trolley, trolley_corner = lift_trolley(original)
    order_phone, delivered_phone = draw_phones(original, art.shape)
    hand, hand_corner = lift_hand(with_phone, art, order_phone)
    parcel, foot = draw_parcel()
    phone_corner = order.PHONE_AREA[:2]
    parts = {
        "truck": (truck, corner),
        "trolley": (trolley, trolley_corner),
        "phone-order": (order_phone, phone_corner),
        "phone-delivered": (delivered_phone, phone_corner),
        "hand": (hand, hand_corner),
        # (the parcel's corner is where the middle of its foot is in it)
        "parcel": (parcel, (int(foot[0]), int(foot[1]))),
    }
    return bare_pad(swap_forklift(art, trolley, trolley_corner)), parts
