#!/usr/bin/env node
/*
 * Extracts line/arc geometry from one source DXF into normalized profile
 * bands. The source files contain several nominal sizes arranged vertically;
 * dimensions and title graphics are discarded by selecting the densest
 * geometry layer. Usage:
 *   node tools/extract-cad-profile.js input.dxf output.json
 */
const fs = require("fs");
const path = require("path");

function pairs(text) {
  const lines = text.split(/\r?\n/);
  const entities = [];
  let entity = null;
  for (let index = 0; index + 1 < lines.length; index += 2) {
    const code = lines[index].trim();
    const value = lines[index + 1].trim();
    if (code === "0") {
      if (entity) entities.push(entity);
      entity = { type: value, values: {} };
    } else if (entity) {
      entity.values[code] = value;
    }
  }
  if (entity) entities.push(entity);
  return entities;
}

function number(entity, code) {
  return Number(entity.values[String(code)] || 0);
}

function bounds(entity) {
  if (entity.type === "LINE") {
    const x1 = number(entity, 10);
    const y1 = number(entity, 20);
    const x2 = number(entity, 11);
    const y2 = number(entity, 21);
    return { minX: Math.min(x1, x2), maxX: Math.max(x1, x2), minY: Math.min(y1, y2), maxY: Math.max(y1, y2) };
  }
  if (entity.type === "ARC" || entity.type === "CIRCLE") {
    const x = number(entity, 10);
    const y = number(entity, 20);
    const radius = number(entity, 40);
    return { minX: x - radius, maxX: x + radius, minY: y - radius, maxY: y + radius };
  }
  return null;
}

function geometry(entity) {
  if (entity.type === "LINE") {
    return { type: "LINE", x1: number(entity, 10), y1: number(entity, 20), x2: number(entity, 11), y2: number(entity, 21) };
  }
  if (entity.type === "ARC") {
    return { type: "ARC", cx: number(entity, 10), cy: number(entity, 20), radius: number(entity, 40), startAngle: number(entity, 50), endAngle: number(entity, 51) };
  }
  return null;
}

function extract(file) {
  const entities = pairs(fs.readFileSync(file, "latin1"));
  const byLayer = new Map();
  for (const entity of entities) {
    if (entity.type !== "LINE" && entity.type !== "ARC") continue;
    const box = bounds(entity);
    const layer = entity.values["8"] || "0";
    if (!byLayer.has(layer)) byLayer.set(layer, []);
    byLayer.get(layer).push({ entity, box });
  }
  const [profileLayer, profileEntities] = [...byLayer.entries()].sort((a, b) => b[1].length - a[1].length)[0] || [];
  if (!profileEntities) throw new Error("No LINE/ARC profile layer found.");

  const sorted = profileEntities.slice().sort((a, b) => a.box.minY - b.box.minY);
  const bands = [];
  for (const item of sorted) {
    const band = bands[bands.length - 1];
    if (!band || item.box.minY > band.maxY + 4) {
      bands.push({ minX: item.box.minX, maxX: item.box.maxX, minY: item.box.minY, maxY: item.box.maxY, entries: [item] });
    } else {
      band.minX = Math.min(band.minX, item.box.minX);
      band.maxX = Math.max(band.maxX, item.box.maxX);
      band.minY = Math.min(band.minY, item.box.minY);
      band.maxY = Math.max(band.maxY, item.box.maxY);
      band.entries.push(item);
    }
  }

  return {
    schema: "franta-cad-profile/v1",
    sourceFile: path.basename(file),
    profileLayer,
    profiles: bands.map((band, index) => ({
      id: `band-${index + 1}`,
      sourceBounds: { minX: band.minX, minY: band.minY, maxX: band.maxX, maxY: band.maxY },
      bounds: { width: band.maxX - band.minX, height: band.maxY - band.minY },
      entities: band.entries.map(({ entity }) => {
        const item = geometry(entity);
        if (item.type === "LINE") {
          item.x1 -= band.minX; item.x2 -= band.minX; item.y1 -= band.minY; item.y2 -= band.minY;
        } else {
          item.cx -= band.minX; item.cy -= band.minY;
        }
        return item;
      })
    }))
  };
}

if (require.main === module) {
  const [, , input, output] = process.argv;
  if (!input || !output) throw new Error("Usage: node tools/extract-cad-profile.js input.dxf output.json");
  fs.writeFileSync(output, `${JSON.stringify(extract(input), null, 2)}\n`, "utf8");
  console.log(`Extracted ${path.basename(input)} -> ${output}`);
}

module.exports = { extract };
