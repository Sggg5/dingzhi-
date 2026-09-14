from __future__ import annotations

import json
import math
from collections import defaultdict
from pathlib import Path

import ezdxf
from ezdxf import bbox
from ezdxf.path import make_path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path("F:/01.C/linshi") / "\u7cfb\u7edf\u7ebf\u56fe"
OUTPUT = ROOT / "product-body-cad-profile-data.js"
GEOMETRY_TYPES = {
    "LINE",
    "ARC",
    "CIRCLE",
    "ELLIPSE",
    "LWPOLYLINE",
    "POLYLINE",
    "SPLINE",
}
VALID_DIAMETERS = (16.0, 20.0, 25.4, 32.0, 40.0, 50.8, 76.1, 88.9, 101.6, 133.0, 159.0, 219.0)


def source_file(token: str) -> Path:
    matches = [path for path in SOURCE_ROOT.glob("*.dxf") if token in path.name]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one {token} DXF, found {len(matches)}")
    return matches[0]


def expanded_entities(entities):
    for entity in entities:
        if entity.dxftype() == "INSERT":
            yield from expanded_entities(entity.virtual_entities())
        else:
            yield entity


def entity_layer(entity) -> str:
    try:
        return entity.dxf.layer
    except Exception:
        return "0"


def entity_bounds(entity):
    extents = bbox.extents([entity], fast=False)
    return (
        float(extents.extmin.x),
        float(extents.extmin.y),
        float(extents.extmax.x),
        float(extents.extmax.y),
    )


def flattened_path(entity):
    return [
        (round(float(point.x), 4), round(float(point.y), 4))
        for point in make_path(entity).flattening(0.03, segments=12)
    ]


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

    def chain_length(chain):
        return sum(
            math.hypot(b[0] - a[0], b[1] - a[1])
            for a, b in zip(chain, chain[1:])
        )

    return max(chains, key=chain_length)


def dimension_center(entity):
    p2 = entity.dxf.defpoint2
    p3 = entity.dxf.defpoint3
    return ((float(p2.x) + float(p3.x)) / 2, (float(p2.y) + float(p3.y)) / 2)


def grouped_dimensions(modelspace):
    result = defaultdict(list)
    for entity in modelspace:
        if entity.dxftype() != "DIMENSION":
            continue
        measurement = float(entity.dxf.actual_measurement)
        diameter = min(VALID_DIAMETERS, key=lambda item: abs(item - measurement))
        if abs(diameter - measurement) > 0.25:
            continue
        result[diameter].append(dimension_center(entity))
    return result


def assigned_geometry(modelspace, groups):
    centers = {
        diameter: sum(point[1] for point in points) / len(points)
        for diameter, points in groups.items()
    }
    result = defaultdict(list)
    seen = defaultdict(set)
    for entity in expanded_entities(modelspace):
        if entity.dxftype() not in GEOMETRY_TYPES:
            continue
        if entity_layer(entity) == "7\u6807\u6ce8\u5c42":
            continue
        path = flattened_path(entity)
        if len(path) < 2:
            continue
        _, y0, _, y1 = entity_bounds(entity)
        diameter = min(centers, key=lambda item: abs((y0 + y1) / 2 - centers[item]))
        forward = tuple(path)
        reverse = tuple(reversed(path))
        key = min(forward, reverse)
        if key in seen[diameter]:
            continue
        seen[diameter].add(key)
        result[diameter].append(path)
    return result


def normalize_paths(paths, datum):
    ax, ay = datum
    return [
        [[round(x - ax, 4), round(y - ay, 4)] for x, y in path]
        for path in paths
    ]


def make_profile(kind, angle, diameter, paths, datums):
    normalized = normalize_paths(paths, datums["A"])
    outline = longest_chain(normalized)
    relative_datums = {
        name: [
            round(point[0] - datums["A"][0], 4),
            round(point[1] - datums["A"][1], 4),
        ]
        for name, point in datums.items()
    }
    return {
        "kind": kind,
        "angle": angle,
        "diameter": diameter,
        "datums": relative_datums,
        "outline": outline,
        "paths": normalized,
    }


def tee_profiles():
    modelspace = ezdxf.readfile(str(source_file("16-219 \u4e09\u901a\u4f53"))).modelspace()
    groups = grouped_dimensions(modelspace)
    geometry = assigned_geometry(modelspace, groups)
    profiles = []
    for diameter, points in groups.items():
        paths = geometry[diameter]
        all_points = [point for path in paths for point in path]
        min_x = min(point[0] for point in all_points)
        max_x = max(point[0] for point in all_points)
        a = min(points, key=lambda point: point[0])
        candidates = sorted(points, key=lambda point: point[0])
        if len(candidates) >= 3:
            c = candidates[-1]
            b = max(candidates[1:-1], key=lambda point: abs(point[1] - a[1]))
        else:
            b = max(candidates[1:], key=lambda point: abs(point[1] - a[1]))
            c = (max_x, a[1])
        a = (min_x, a[1])
        c = (max_x, c[1] if len(candidates) >= 3 else a[1])
        profiles.append(make_profile("tee", 0, diameter, paths, {"A": a, "B": b, "C": c}))
    return profiles


def elbow_profiles(token, angle):
    modelspace = ezdxf.readfile(str(source_file(token))).modelspace()
    groups = grouped_dimensions(modelspace)
    geometry = assigned_geometry(modelspace, groups)
    profiles = []
    for diameter, points in groups.items():
        if len(points) < 2:
            raise RuntimeError(f"Missing elbow datum for {token} D{diameter}")
        a = min(points, key=lambda point: point[0])
        b = max(points, key=lambda point: point[0])
        profiles.append(
            make_profile(
                "elbow",
                angle,
                diameter,
                geometry[diameter],
                {"A": a, "B": b},
            )
        )
    return profiles


def main():
    source_names = [
        source_file("16-219 \u4e09\u901a\u4f53").name,
        source_file("16-101.6 45\u5f2f\u5934\u4f53").name,
        source_file("133-219 45\u5f2f\u5934\u4f53").name,
        source_file("16-101.6 90\u5f2f\u5934\u4f53").name,
        source_file("133-219 90\u5f2f\u5934\u4f53").name,
    ]
    profiles = tee_profiles()
    profiles.extend(elbow_profiles("16-101.6 45\u5f2f\u5934\u4f53", 45))
    profiles.extend(elbow_profiles("133-219 45\u5f2f\u5934\u4f53", 45))
    profiles.extend(elbow_profiles("16-101.6 90\u5f2f\u5934\u4f53", 90))
    profiles.extend(elbow_profiles("133-219 90\u5f2f\u5934\u4f53", 90))
    profiles.sort(key=lambda item: (item["kind"], item["angle"], item["diameter"]))

    payload = json.dumps(profiles, ensure_ascii=False, separators=(",", ":"))
    sources = json.dumps(source_names, ensure_ascii=False, separators=(",", ":"))
    script = f'''(function exposeProductBodyCadProfileData(root) {{
  const profiles = {payload};
  const sources = {sources};

  function getProfile(kind, angle, diameter) {{
    const items = profiles.filter(item => item.kind === kind && Number(item.angle) === Number(angle || 0));
    if (!items.length) return null;
    const target = Number(diameter) || 0;
    return items.reduce((best, item) =>
      Math.abs(item.diameter - target) < Math.abs(best.diameter - target) ? item : best
    , items[0]);
  }}

  root.ProductBodyCadProfileData = {{
    enabled: true,
    getProfile,
    profiles,
    sources
  }};
}})(typeof globalThis !== "undefined" ? globalThis : window);
'''
    OUTPUT.write_text(script, encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
