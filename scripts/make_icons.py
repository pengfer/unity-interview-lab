#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""生成应用图标（圆角渐变底 + 白色等距立方体）。

用法：python scripts/make_icons.py
输出：icons/icon-192.png, icons/icon-512.png, icons/icon-maskable-512.png
"""
import math
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'icons')

C1 = (79, 124, 255)    # #4f7cff
C2 = (139, 92, 246)    # #8b5cf6


def gradient(size):
    """对角线渐变。"""
    img = Image.new('RGB', (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2.0 * (size - 1))
            px[x, y] = (
                int(C1[0] + (C2[0] - C1[0]) * t),
                int(C1[1] + (C2[1] - C1[1]) * t),
                int(C1[2] + (C2[2] - C1[2]) * t),
            )
    return img


def cube(draw, size, scale=1.0, alpha=255):
    """画一个白色等距立方体（六边形 + 三条内棱）。"""
    cx = cy = size / 2.0
    R = size * 0.30 * scale
    white = (255, 255, 255, alpha)

    # 六边形顶点：30°, 90°, 150°, 210°, 270°, 330°
    pts = []
    for k in range(6):
        ang = math.radians(30 + 60 * k)
        pts.append((cx + R * math.cos(ang), cy + R * math.sin(ang)))

    w = max(2, int(size * 0.055 * scale))
    draw.line(pts + [pts[0]], fill=white, width=w, joint='curve')

    # 三条从中心到顶点的棱：右(30°)、左(150°)、上(270°)
    for k in (0, 2, 4):
        ang = math.radians(30 + 60 * k)
        draw.line([(cx, cy), (cx + R * math.cos(ang), cy + R * math.sin(ang))],
                  fill=white, width=w)

    # 圆角收尾，避免直角毛刺
    r = w / 2.0
    for p in pts:
        draw.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=white)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=white)


def rounded_mask(size, radius):
    m = Image.new('L', (size, size), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return m


def make(size, radius_ratio=0.225, pad_ratio=0.0, bg=None):
    base = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    if bg is not None:
        fill = Image.new('RGBA', (size, size), bg)
        base.alpha_composite(fill)

    inner = int(size * (1 - 2 * pad_ratio))
    grad = gradient(inner).convert('RGBA')
    if radius_ratio and pad_ratio == 0:
        mask = rounded_mask(inner, int(inner * radius_ratio))
        base.alpha_composite(Image.composite(grad, Image.new('RGBA', (inner, inner), (0, 0, 0, 0)), mask),
                             (0, 0))
    else:
        mask = rounded_mask(inner, int(inner * radius_ratio))
        base.alpha_composite(Image.composite(grad, Image.new('RGBA', (inner, inner), (0, 0, 0, 0)), mask),
                             ((size - inner) // 2, (size - inner) // 2))

    d = ImageDraw.Draw(base)
    cube(d, size, scale=1.0 if pad_ratio == 0 else 0.86)
    return base


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    # 标准图标：512 原图 -> 缩放
    big = make(512, radius_ratio=0.225)
    big.save(os.path.join(OUT_DIR, 'icon-512.png'), 'PNG')
    big.resize((192, 192), Image.LANCZOS).save(os.path.join(OUT_DIR, 'icon-192.png'), 'PNG')

    # maskable：留出 20% 安全边距，底色铺满
    maskable = make(512, radius_ratio=0.225, pad_ratio=0.14, bg=(30, 34, 56, 255))
    maskable.save(os.path.join(OUT_DIR, 'icon-maskable-512.png'), 'PNG')

    # 站点小图标
    big.resize((64, 64), Image.LANCZOS).save(os.path.join(OUT_DIR, 'favicon.png'), 'PNG')

    for f in ('icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'favicon.png'):
        p = os.path.join(OUT_DIR, f)
        print('✓ %s  %d bytes' % (f, os.path.getsize(p)))


if __name__ == '__main__':
    main()
