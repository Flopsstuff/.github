#!/usr/bin/env python3
"""Check generated card images against the house art direction.

    python3 scripts/check-card-images.py public/projects/*.jpg

Exits non-zero if any file fails. Photographic and screenshot-derived cards are
not expected to pass - the bands are tuned to the generated set.
"""
import os
import sys

import numpy as np
from PIL import Image

LUMA_MAX = 0.25
# Not a mean floor: nothing in the set has ever failed for being too dark, and a
# mean floor rejects correct frames that are mostly shadow (wetty, 9.1%). What a
# frame must have is a subject - some part of it bright enough to see.
CONTRAST_MIN = 0.10
HIGHLIGHT_MAX = 0.015
RED_MAX = 0.05
SIZE = (1200, 675)
WEIGHT_MAX_KB = 150

# Deliberately outside the direction. Reported, never failed, so the checker can
# be run over the whole directory.
KNOWN = {
    "flopbut-pl.jpg": "a real face, kept on purpose",
    "keryx.jpg": "light, kept over a regrade",
    "triki.jpg": "light, kept over a regrade",
    "flopcoin.jpg": "off-palette, kept over a regrade",
    "korovany.jpg": "HUD in frame, kept over a re-frame",
}


def measure(path):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(float)
    luma = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]) / 255.0

    mx, mn = a.max(axis=2), a.min(axis=2)
    d = mx - mn
    sat = np.divide(d, mx, out=np.zeros_like(mx), where=mx > 0)
    hue = np.zeros_like(mx)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    for channel_is_max, formula in (
        (mx == r, lambda: (60 * np.divide(g - b, d, out=np.zeros_like(d), where=d > 0)) % 360),
        (mx == g, lambda: 60 * (np.divide(b - r, d, out=np.zeros_like(d), where=d > 0) + 2)),
        (mx == b, lambda: 60 * (np.divide(r - g, d, out=np.zeros_like(d), where=d > 0) + 4)),
    ):
        sel = (d > 0) & channel_is_max
        hue[sel] = formula()[sel]
    # Only *bright* saturated red competes with the logo mark; in frames this
    # dark, large areas of dim red are part of the direction, not a violation.
    red = (((hue <= 20) | (hue >= 340)) & (sat > 0.5) & (mx / 255.0 > 0.40)).mean()

    return (
        im.size,
        os.path.getsize(path) / 1024,
        luma.mean(),
        float(np.percentile(luma, 95)),
        (luma > 0.90).mean(),
        red,
    )


def main(paths):
    failed = 0
    for path in paths:
        size, kb, luma, contrast, highlights, red = measure(path)
        name = os.path.basename(path)
        fail = []
        if size != SIZE:
            fail.append("size")
        if kb > WEIGHT_MAX_KB:
            fail.append("weight")
        if luma > LUMA_MAX:
            fail.append("luma")
        if contrast < CONTRAST_MIN:
            fail.append("contrast")
        if highlights > HIGHLIGHT_MAX:
            fail.append("highlights")
        if red > RED_MAX:
            fail.append("red")
        if fail and name in KNOWN:
            verdict = f"KNOWN ({KNOWN[name]})"
        elif fail:
            verdict = "FAIL: " + ",".join(fail)
            failed += 1
        else:
            verdict = "PASS"
        print(
            f"{name:<18}{size[0]}x{size[1]} {kb:5.0f}KB  "
            f"luma {luma * 100:5.1f}%  p95 {contrast * 100:5.1f}%  "
            f">90% {highlights * 100:5.2f}%  red {red * 100:5.2f}%  {verdict}"
        )
    return 1 if failed else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1:]))
