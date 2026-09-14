from __future__ import annotations

import html
import math
from pathlib import Path

import ezdxf
from ezdxf import bbox
from ezdxf.path import make_path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path("F:/01.C/linshi")
OUTPUT_DIR = ROOT / "cad-profile-previews"
OUT_SVG = OUTPUT_DIR / "outer-thread-full-extraction.svg"

GEOMETRY_TYPES = {
    "LINE",
    "ARC",
    "CIRCLE",
    "ELLIPSE",
    "LWPOLYLINE",
    "POLYLINE",
    "SPLINE",
}

# Source drawing rows, from large to small. The padded bands intentionally
# include every contour entity while excluding dimensions and notes.
PROFILE_BANDS = (
    ("101.6", 15.0, 147.0),
    ("88.9", 185.0, 305.0),
    ("76.1", 342.0, 450.0),
    ("50.8", 515.0, 595.0),
    ("40", 638.0, 704.0),
    ("32", 744.0, 803.0),
    ("25.4", 823.0, 877.0),
    ("20", 902.0, 949.0),
    ("16", 956.0, 994.0),
)


def source_file() -> Path:
    target = "\u5916\u4e1d"
    matches = [
        path
        for path in SOURCE_ROOT.glob("*/*16-101.6*.dxf")
        if target in path.name
    ]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one outer-thread DXF, found {len(matches)}")
    return matches[0]


def entity_bounds(entity) -> tuple[float, float, float, float]:
    extents = bbox.extents([entity], fast=False)
    return (
        float(extents.extmin.x),
        float(extents.extmin.y),
        float(extents.extmax.x),
        float(extents.extmax.y),
    )


def profile_entities(modelspace, y_min: float, y_max: float):
    selected = []
    for entity in modelspace:
        if entity.dxftype() not in GEOMETRY_TYPES:
            continue
        if entity.dxf.layer == "7\u6807\u6ce8\u5c42":
            continue
        x0, y0, x1, y1 = entity_bounds(entity)
        if x1 < 350.0 or x0 > 435.0 or y1 < y_min or y0 > y_max:
            continue
        # Ignore long construction and sheet lines that merely cross a band.
        if x0 < 350.0 or x1 > 435.0 or y0 < y_min or y1 > y_max:
            continue
        selected.append(entity)
    return selected


def flattened_paths(entities):
    paths = []
    for entity in entities:
        points = list(make_path(entity).flattening(0.03, segments=12))
        if len(points) < 2:
            continue
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
    scale = min((width - 90.0) / source_width, (height - 52.0) / source_height)
    draw_width = source_width * scale
    draw_height = source_height * scale
    offset_x = x + 42.0 + (width - 62.0 - draw_width) / 2.0
    offset_y = y + 34.0 + (height - 46.0 - draw_height) / 2.0

    def project(point):
        px = offset_x + (point[0] - min_x) * scale
        py = offset_y + (max_y - point[1]) * scale
        return px, py

    fragments = [
        f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="6" '
        'fill="#ffffff" stroke="#cbd8d5"/>',
        f'<text x="{x + 16}" y="{y + 25}" class="size">D{html.escape(label)} 外丝</text>',
    ]
    for path in paths:
        points = " ".join(f"{px:.2f},{py:.2f}" for px, py in map(project, path))
        fragments.append(
            f'<polyline points="{points}" fill="none" stroke="#203c39" '
            'stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>'
        )

    # The source drawing defines the fitting connection datum at the left end.
    datum_x = offset_x
    datum_top = offset_y - 6.0
    datum_bottom = offset_y + draw_height + 6.0
    fragments.extend(
        [
            f'<line x1="{datum_x:.2f}" y1="{datum_top:.2f}" '
            f'x2="{datum_x:.2f}" y2="{datum_bottom:.2f}" '
            'stroke="#e04b4b" stroke-width="2" stroke-dasharray="6 4"/>',
            f'<text x="{datum_x - 8:.2f}" y="{offset_y + draw_height / 2:.2f}" '
            'text-anchor="end" class="datum">连接基准面</text>',
        ]
    )
    return "\n".join(fragments)


def main() -> None:
    source = source_file()
    document = ezdxf.readfile(str(source))
    modelspace = document.modelspace()
    profiles = []
    for label, y_min, y_max in PROFILE_BANDS:
        entities = profile_entities(modelspace, y_min, y_max)
        paths = flattened_paths(entities)
        if not paths:
            raise RuntimeError(f"No contour geometry found for D{label}")
        profiles.append((label, paths, len(entities)))

    page_width = 1400
    page_height = 1030
    card_width = 430
    card_height = 270
    cards = []
    for index, (label, paths, _) in enumerate(profiles):
        column = index % 3
        row = index // 3
        cards.append(
            render_profile(
                label,
                paths,
                28 + column * 454,
                130 + row * 292,
                card_width,
                card_height,
            )
        )

    counts = " / ".join(f"D{label}: {count}实体" for label, _, count in profiles)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{page_width}" height="{page_height}" viewBox="0 0 {page_width} {page_height}">
<style>
  text {{ font-family: "Microsoft YaHei", "Noto Sans CJK SC", sans-serif; fill: #173432; }}
  .title {{ font-size: 28px; font-weight: 700; }}
  .subtitle {{ font-size: 15px; fill: #5b6f6d; }}
  .size {{ font-size: 18px; font-weight: 700; }}
  .datum {{ font-size: 13px; fill: #d63f3f; dominant-baseline: middle; }}
</style>
<rect width="100%" height="100%" fill="#f3f7f6"/>
<text x="28" y="45" class="title">国I 16-101.6 外丝 DXF 完整轮廓提取</text>
<text x="28" y="76" class="subtitle">合并轮廓实线层、0 层和 1 层；排除标注层。红色虚线为源图左侧连接基准面，尚未接入系统。</text>
<text x="28" y="101" class="subtitle">{html.escape(counts)}</text>
{''.join(cards)}
</svg>'''
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_SVG.write_text(svg, encoding="utf-8")
    print(OUT_SVG)


if __name__ == "__main__":
    main()
