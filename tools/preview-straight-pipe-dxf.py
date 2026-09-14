from __future__ import annotations

import html
from pathlib import Path

import ezdxf
from ezdxf import bbox
from ezdxf.path import make_path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path("F:/01.C/linshi")
OUTPUT_DIR = ROOT / "cad-profile-previews"
OUT_SVG = OUTPUT_DIR / "straight-pipe-full-extraction.svg"

PROFILE_BANDS = (
    ("101.6", 340.0, 460.0),
    ("88.9", 562.0, 670.0),
    ("76.1", 860.0, 955.0),
    ("50.8", 1074.0, 1142.0),
    ("40", 1187.0, 1245.0),
    ("32", 1308.0, 1358.0),
    ("25.4", 1398.0, 1440.0),
    ("20", 1471.0, 1507.0),
    ("16", 1531.0, 1563.0),
)


def source_file() -> Path:
    target = "\u76f4\u7ba1"
    matches = [
        path
        for path in SOURCE_ROOT.glob("*/*16-101.6*.dxf")
        if target in path.name
    ]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one straight-pipe DXF, found {len(matches)}")
    return matches[0]


def entity_bounds(entity) -> tuple[float, float, float, float]:
    extents = bbox.extents([entity], fast=False)
    return (
        float(extents.extmin.x),
        float(extents.extmin.y),
        float(extents.extmax.x),
        float(extents.extmax.y),
    )


def profile_paths(modelspace, y_min: float, y_max: float):
    paths = []
    for entity in modelspace:
        if entity.dxftype() not in {
            "LINE",
            "ARC",
            "CIRCLE",
            "ELLIPSE",
            "LWPOLYLINE",
            "POLYLINE",
            "SPLINE",
        }:
            continue
        x0, y0, x1, y1 = entity_bounds(entity)
        if x0 < 220.0 or x1 > 340.0 or y0 < y_min or y1 > y_max:
            continue
        points = list(make_path(entity).flattening(0.03, segments=12))
        if len(points) >= 2:
            paths.append([(float(point.x), float(point.y)) for point in points])
    return paths


def path_bounds(paths):
    points = [point for path in paths for point in path]
    return (
        min(point[0] for point in points),
        min(point[1] for point in points),
        max(point[0] for point in points),
        max(point[1] for point in points),
    )


def render_profile(label: str, paths, x: float, y: float, width: float, height: float):
    min_x, min_y, max_x, max_y = path_bounds(paths)
    source_width = max_x - min_x
    source_height = max_y - min_y
    scale = min((width - 84.0) / source_width, (height - 76.0) / source_height)
    draw_width = source_width * scale
    draw_height = source_height * scale
    offset_x = x + (width - draw_width) / 2.0
    offset_y = y + 40.0 + (height - 58.0 - draw_height) / 2.0

    def project(point):
        px = offset_x + (point[0] - min_x) * scale
        py = offset_y + (max_y - point[1]) * scale
        return px, py

    fragments = [
        f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="6" '
        'fill="#ffffff" stroke="#cbd8d5"/>',
        f'<text x="{x + 16}" y="{y + 25}" class="size">D{html.escape(label)} 直管</text>',
    ]
    for path in paths:
        points = " ".join(f"{px:.2f},{py:.2f}" for px, py in map(project, path))
        fragments.append(
            f'<polyline points="{points}" fill="none" stroke="#203c39" '
            'stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>'
        )

    datum_top = offset_y - 7.0
    datum_bottom = offset_y + draw_height + 7.0
    for datum_x in (offset_x, offset_x + draw_width):
        fragments.append(
            f'<line x1="{datum_x:.2f}" y1="{datum_top:.2f}" '
            f'x2="{datum_x:.2f}" y2="{datum_bottom:.2f}" '
            'stroke="#e04b4b" stroke-width="2" stroke-dasharray="6 4"/>'
        )
    fragments.extend(
        [
            f'<text x="{offset_x:.2f}" y="{offset_y - 14:.2f}" '
            'text-anchor="middle" class="datum">A</text>',
            f'<text x="{offset_x + draw_width:.2f}" y="{offset_y - 14:.2f}" '
            'text-anchor="middle" class="datum">B</text>',
            f'<text x="{offset_x + draw_width / 2:.2f}" y="{offset_y + draw_height + 24:.2f}" '
            'text-anchor="middle" class="length">源图管长 100 mm</text>',
        ]
    )
    return "\n".join(fragments)


def main() -> None:
    source = source_file()
    modelspace = ezdxf.readfile(str(source)).modelspace()
    profiles = []
    for label, y_min, y_max in PROFILE_BANDS:
        paths = profile_paths(modelspace, y_min, y_max)
        if not paths:
            raise RuntimeError(f"No contour geometry found for D{label}")
        profiles.append((label, paths, len(paths)))

    cards = []
    for index, (label, paths, _) in enumerate(profiles):
        column = index % 3
        row = index // 3
        cards.append(
            render_profile(label, paths, 28 + column * 454, 130 + row * 292, 430, 270)
        )

    counts = " / ".join(f"D{label}: {count}实体" for label, _, count in profiles)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1030" viewBox="0 0 1400 1030">
<style>
  text {{ font-family: "Microsoft YaHei", "Noto Sans CJK SC", sans-serif; fill: #173432; }}
  .title {{ font-size: 28px; font-weight: 700; }}
  .subtitle {{ font-size: 15px; fill: #5b6f6d; }}
  .size {{ font-size: 18px; font-weight: 700; }}
  .datum {{ font-size: 12px; fill: #d63f3f; dominant-baseline: middle; }}
  .length {{ font-size: 12px; fill: #5b6f6d; }}
</style>
<rect width="100%" height="100%" fill="#f3f7f6"/>
<text x="28" y="45" class="title">国I 16-101.6 直管 DXF 完整轮廓提取</text>
<text x="28" y="76" class="subtitle">排除原图尺寸标注，仅保留双线管体轮廓。左右红色虚线分别为 A、B 连接基准面。</text>
<text x="28" y="101" class="subtitle">{html.escape(counts)}</text>
{''.join(cards)}
</svg>'''
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_SVG.write_text(svg, encoding="utf-8")
    print(OUT_SVG)


if __name__ == "__main__":
    main()
