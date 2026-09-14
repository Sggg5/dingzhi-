from __future__ import annotations

import json
import math
from pathlib import Path

import ezdxf
from ezdxf import bbox
from ezdxf.path import make_path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path("F:/01.C/linshi") / "\u7cfb\u7edf\u7ebf\u56fe"
OUTPUT = ROOT / "docking-cad-profile-data.js"

OUTER_BANDS = (
    (101.6, 15.0, 147.0),
    (88.9, 185.0, 305.0),
    (76.1, 342.0, 450.0),
    (50.8, 515.0, 595.0),
    (40.0, 638.0, 704.0),
    (32.0, 744.0, 803.0),
    (25.4, 823.0, 877.0),
    (20.0, 902.0, 949.0),
    (16.0, 956.0, 994.0),
)

PIPE_BANDS = (
    (219.0, -550.0, -258.0),
    (159.0, -258.0, 2.0),
    (133.0, 2.0, 265.0),
    (101.6, 265.0, 508.0),
    (88.9, 508.0, 762.0),
    (76.1, 762.0, 1008.0),
    (50.8, 1008.0, 1162.0),
    (40.0, 1162.0, 1275.0),
    (32.0, 1275.0, 1376.0),
    (25.4, 1376.0, 1455.0),
    (20.0, 1455.0, 1519.0),
    (16.0, 1519.0, 1580.0),
)

INNER_BANDS = (
    (101.6, 555.0, 688.0),
    (88.9, 738.0, 858.0),
    (76.1, 918.0, 1028.0),
    (50.8, 1064.0, 1147.0),
    (40.0, 1170.0, 1241.0),
    (32.0, 1260.0, 1324.0),
    (25.4, 1353.0, 1410.0),
    (20.0, 1430.0, 1478.0),
    (16.0, 1495.0, 1536.0),
)

DOUBLE_CARD_BANDS = (
    (101.6, 526.0, 667.0),
    (88.9, 707.0, 832.0),
    (76.1, 858.0, 968.0),
    (50.8, 974.0, 1055.0),
    (40.0, 1087.0, 1156.0),
    (32.0, 1176.0, 1235.0),
    (25.4, 1248.0, 1297.0),
    (20.0, 1330.0, 1373.0),
    (16.0, 1409.0, 1446.0),
)

RING_PRESS_BANDS = (
    (101.6, 249.0, 375.0),
    (88.9, 424.0, 537.0),
    (76.1, 599.0, 699.0),
    (50.8, 781.0, 853.0),
    (40.0, 955.0, 1016.0),
    (32.0, 1128.0, 1180.0),
    (25.4, 1300.0, 1345.0),
    (20.0, 1471.0, 1510.0),
    (16.0, 1642.0, 1676.0),
)

FLANGE_BANDS = (
    (219.0, -1000.0, -594.0),
    (159.0, -594.0, -245.0),
    (133.0, -245.0, 89.0),
    (101.6, 89.0, 390.0),
    (88.9, 390.0, 641.0),
    (76.1, 641.0, 880.0),
    (50.8, 880.0, 1104.0),
    (40.0, 1104.0, 1314.0),
    (32.0, 1314.0, 1518.0),
    (25.4, 1518.0, 1697.0),
    (20.0, 1697.0, 1860.0),
    (16.0, 1860.0, 2025.0),
)

GROOVE_BANDS = (
    (219.0, 330.0, 625.0),
    (159.0, 625.0, 848.0),
    (133.0, 848.0, 1068.0),
    (101.6, 1068.0, 1296.0),
    (88.9, 1296.0, 1522.0),
    (76.1, 1522.0, 1710.0),
)

BUTT_WELD_BANDS = (
    (219.0, 180.0, 466.0),
    (159.0, 466.0, 726.0),
    (133.0, 726.0, 957.0),
    (101.6, 957.0, 1168.0),
    (88.9, 1168.0, 1422.0),
    (76.1, 1422.0, 1668.0),
    (50.8, 1668.0, 1822.0),
    (40.0, 1822.0, 1935.0),
    (32.0, 1935.0, 2036.0),
    (25.4, 2036.0, 2114.0),
    (20.0, 2114.0, 2178.0),
    (16.0, 2178.0, 2240.0),
)

CAP_BANDS = (
    (219.0, 150.0, 541.0),
    (159.0, 541.0, 841.0),
    (133.0, 841.0, 1087.0),
    (101.6, 1087.0, 1319.0),
    (88.9, 1319.0, 1548.0),
    (76.1, 1548.0, 1760.0),
    (50.8, 1760.0, 1924.0),
    (40.0, 1924.0, 2036.0),
    (32.0, 2036.0, 2134.0),
    (25.4, 2134.0, 2216.0),
    (20.0, 2216.0, 2291.0),
    (16.0, 2291.0, 2380.0),
)

SOCKET_WELD_DIAMETERS = (219.0, 159.0, 133.0, 101.6, 88.9, 76.1, 50.8, 40.0, 32.0, 25.4, 20.0, 16.0)
SINGLE_CARD_DIAMETERS = (108.0, 88.9, 76.1, 54.0, 42.0, 35.0, 28.0, 22.0, 18.0)

GEOMETRY_TYPES = {
    "LINE",
    "ARC",
    "CIRCLE",
    "ELLIPSE",
    "LWPOLYLINE",
    "POLYLINE",
    "SPLINE",
}


def source_file(name: str, range_hint: str = "") -> Path:
    matches = [
        path
        for path in SOURCE_ROOT.glob("*.dxf")
        if name in path.name
    ]
    if range_hint:
        matches = [path for path in matches if range_hint in path.name]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one {name} DXF, found {len(matches)}")
    return matches[0]


def bounds(entity) -> tuple[float, float, float, float]:
    extents = bbox.extents([entity], fast=False)
    return (
        float(extents.extmin.x),
        float(extents.extmin.y),
        float(extents.extmax.x),
        float(extents.extmax.y),
    )


def extract_paths(
    modelspace,
    y_min: float,
    y_max: float,
    x_min: float,
    x_max: float,
    allowed_layers=None,
):
    result = []
    seen = set()
    for entity in modelspace:
        if entity.dxftype() not in GEOMETRY_TYPES:
            continue
        if entity.dxf.layer == "7\u6807\u6ce8\u5c42":
            continue
        if allowed_layers and entity.dxf.layer not in allowed_layers:
            continue
        bx0, by0, bx1, by1 = bounds(entity)
        if bx0 < x_min or bx1 > x_max or by0 < y_min or by1 > y_max:
            continue
        points = [
            (round(float(point.x), 4), round(float(point.y), 4))
            for point in make_path(entity).flattening(0.03, segments=12)
        ]
        if len(points) < 2:
            continue
        forward = tuple(points)
        reverse = tuple(reversed(points))
        key = min(forward, reverse)
        if key in seen:
            continue
        seen.add(key)
        result.append(points)
    return result


def extract_connected_profiles(modelspace, x_min: float, x_max: float):
    """Split a stacked source drawing into one connected profile per nominal size."""
    paths = []
    seen = set()
    for entity in modelspace:
        if entity.dxftype() not in GEOMETRY_TYPES or entity.dxf.layer == "7\u6807\u6ce8\u5c42":
            continue
        bx0, _, bx1, _ = bounds(entity)
        if bx0 < x_min or bx1 > x_max:
            continue
        points = [
            (round(float(point.x), 4), round(float(point.y), 4))
            for point in make_path(entity).flattening(0.03, segments=12)
        ]
        if len(points) < 2:
            continue
        key = min(tuple(points), tuple(reversed(points)))
        if key in seen:
            continue
        seen.add(key)
        paths.append(points)

    parent = list(range(len(paths)))

    def find(index):
        while parent[index] != index:
            parent[index] = parent[parent[index]]
            index = parent[index]
        return index

    def union(left, right):
        left_root = find(left)
        right_root = find(right)
        if left_root != right_root:
            parent[right_root] = left_root

    endpoints = {}
    for index, path in enumerate(paths):
        for point in (path[0], path[-1]):
            key = point_key(point)
            for other in endpoints.get(key, []):
                union(index, other)
            endpoints.setdefault(key, []).append(index)

    grouped = {}
    for index, path in enumerate(paths):
        grouped.setdefault(find(index), []).append(path)
    components = list(grouped.values())

    def component_bounds(component):
        points = [point for path in component for point in path]
        return (
            min(point[0] for point in points),
            min(point[1] for point in points),
            max(point[0] for point in points),
            max(point[1] for point in points),
        )

    # Some source outlines contain a sub-path whose endpoint misses the main
    # outline by a fraction of a millimetre. Merge only strongly overlapping
    # fragments so neighbouring stacked sizes stay independent.
    changed = True
    while changed:
        changed = False
        for left_index in range(len(components)):
            left_bounds = component_bounds(components[left_index])
            left_height = left_bounds[3] - left_bounds[1]
            for right_index in range(left_index + 1, len(components)):
                right_bounds = component_bounds(components[right_index])
                right_height = right_bounds[3] - right_bounds[1]
                y_overlap = max(0.0, min(left_bounds[3], right_bounds[3]) - max(left_bounds[1], right_bounds[1]))
                overlap_ratio = y_overlap / max(0.001, min(left_height, right_height))
                x_gap = max(0.0, max(left_bounds[0], right_bounds[0]) - min(left_bounds[2], right_bounds[2]))
                if overlap_ratio < 0.8 or x_gap > 0.6:
                    continue
                components[left_index].extend(components.pop(right_index))
                changed = True
                break
            if changed:
                break

    components = [component for component in components if len(component) >= 3]
    return sorted(components, key=lambda component: component_bounds(component)[1])


def point_key(point, tolerance=0.08):
    return (round(point[0] / tolerance), round(point[1] / tolerance))


def longest_chain(paths):
    unused = set(range(len(paths)))
    chains = []
    while unused:
        first = unused.pop()
        chain = list(paths[first])
        changed = True
        while changed and unused:
            changed = False
            start_key = point_key(chain[0])
            end_key = point_key(chain[-1])
            for index in list(unused):
                path = paths[index]
                path_start = point_key(path[0])
                path_end = point_key(path[-1])
                if path_start == end_key:
                    chain.extend(path[1:])
                elif path_end == end_key:
                    chain.extend(reversed(path[:-1]))
                elif path_end == start_key:
                    chain = path[:-1] + chain
                elif path_start == start_key:
                    chain = list(reversed(path[1:])) + chain
                else:
                    continue
                unused.remove(index)
                changed = True
                break
        chains.append(chain)

    def length(chain):
        return sum(
            math.hypot(b[0] - a[0], b[1] - a[1])
            for a, b in zip(chain, chain[1:])
        )

    return max(chains, key=length)


def normalize_profile(
    profile_type: str,
    diameter: float,
    paths,
    datum: str = "left",
    scale_by: str = "bounds",
):
    points = [point for path in paths for point in path]
    min_x = min(point[0] for point in points)
    max_x = max(point[0] for point in points)
    min_y = min(point[1] for point in points)
    max_y = max(point[1] for point in points)
    center_y = (min_y + max_y) / 2.0

    def normalized(path):
        datum_x = max_x if datum == "right" else min_x
        return [
            [round(point[0] - datum_x, 4), round(point[1] - center_y, 4)]
            for point in path
        ]

    outline = longest_chain(paths)
    return {
        "type": profile_type,
        "diameter": diameter,
        "datum": datum,
        "scaleBy": scale_by,
        "bounds": {
            "width": round(max_x - min_x, 4),
            "height": round(max_y - min_y, 4),
        },
        "outline": normalized(outline),
        "paths": [normalized(path) for path in paths],
    }


def main() -> None:
    profiles = []
    specs = (
        ("\u5916\u4e1d", OUTER_BANDS, 350.0, 435.0, "left", "bounds", None, "16-101.6"),
        ("\u5185\u4e1d", INNER_BANDS, 345.0, 400.0, "left", "bounds", None, "16-101.6"),
        ("\u53cc\u5361", DOUBLE_CARD_BANDS, 372.0, 478.0, "left", "bounds", None, "16-101.6"),
        ("\u73af\u538b", RING_PRESS_BANDS, 968.0, 1072.0, "left", "bounds", None, "16-101.6"),
        ("\u76f4\u7ba1", PIPE_BANDS, 231.0, 337.0, "left", "diameter", {"0"}, "16-219"),
        (
            "\u6cd5\u5170",
            FLANGE_BANDS,
            1548.0,
            1575.0,
            "left",
            "diameter",
            {"1\u8f6e\u5ed3\u5b9e\u7ebf\u5c42"},
            "16-219",
        ),
        (
            "\u5835\u5934",
            CAP_BANDS,
            372.5,
            476.0,
            "left",
            "diameter",
            {"0"},
            "16-219",
        ),
        (
            "\u6c9f\u69fd",
            GROOVE_BANDS,
            313.0,
            385.0,
            "left",
            "diameter",
            {"0"},
            "76.1-219",
        ),
        (
            "\u5bf9\u710a",
            BUTT_WELD_BANDS,
            399.0,
            471.0,
            "left",
            "diameter",
            {"0"},
            "16-219",
        ),
    )
    for profile_type, bands, x_min, x_max, datum, scale_by, allowed_layers, range_hint in specs:
        source_name = "\u7ba1\u5e3d" if profile_type == "\u5835\u5934" else profile_type
        modelspace = ezdxf.readfile(str(source_file(source_name, range_hint))).modelspace()
        for diameter, y_min, y_max in bands:
            paths = extract_paths(
                modelspace,
                y_min,
                y_max,
                x_min,
                x_max,
                allowed_layers=allowed_layers,
            )
            if not paths:
                raise RuntimeError(f"No paths for {profile_type} D{diameter}")
            profiles.append(
                normalize_profile(
                    profile_type,
                    diameter,
                    paths,
                    datum=datum,
                    scale_by=scale_by,
                )
            )

    connected_specs = (
        ("\u63d2\u710a", SOCKET_WELD_DIAMETERS, 770.0, 860.0, "16-219"),
        ("\u5355\u5361", SINGLE_CARD_DIAMETERS, 440.0, 540.0, "18-108"),
    )
    for profile_type, diameters, x_min, x_max, range_hint in connected_specs:
        modelspace = ezdxf.readfile(str(source_file(profile_type, range_hint))).modelspace()
        components = extract_connected_profiles(modelspace, x_min, x_max)
        if len(components) != len(diameters):
            raise RuntimeError(
                f"Expected {len(diameters)} connected {profile_type} profiles, found {len(components)}"
            )
        for diameter, paths in zip(diameters, components):
            profiles.append(
                normalize_profile(
                    profile_type,
                    diameter,
                    paths,
                    datum="left",
                    scale_by="diameter",
                )
            )

    payload = json.dumps(profiles, ensure_ascii=False, separators=(",", ":"))
    script = f'''(function exposeDockingCadProfileData(root) {{
  const profiles = {payload};
  const byType = new Map();
  for (const profile of profiles) {{
    if (!byType.has(profile.type)) byType.set(profile.type, []);
    byType.get(profile.type).push(profile);
  }}
  for (const items of byType.values()) items.sort((a, b) => a.diameter - b.diameter);

  function getProfile(type, diameter) {{
    const items = byType.get(type) || [];
    if (!items.length) return null;
    const target = Number(diameter) || 0;
    return items.reduce((best, item) =>
      Math.abs(item.diameter - target) < Math.abs(best.diameter - target) ? item : best
    , items[0]);
  }}

  root.DockingCadProfileData = {{
    enabled: true,
    getProfile,
    profiles
  }};
}})(typeof globalThis !== "undefined" ? globalThis : window);
'''
    OUTPUT.write_text(script, encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
