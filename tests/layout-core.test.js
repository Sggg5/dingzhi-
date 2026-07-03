const assert = require("assert");
const fs = require("fs");
const path = require("path");
const LayoutCore = require("../layout-core");

function config(manifoldType, branches, branchSpacing = 180) {
  return {
    manifoldType,
    branches,
    branchCount: branches.length,
    branchSpacing
  };
}

const uniform = config("单排", [
  { spacingAfter: 180 },
  { spacingAfter: 180 },
  { spacingAfter: 180 },
  { spacingAfter: 0 }
]);
assert.deepStrictEqual(LayoutCore.branchSpacings(uniform), [180, 180, 180]);
assert.deepStrictEqual(LayoutCore.branchLayout(uniform), {
  offsets: [0, 180, 360, 540],
  stations: [0, 180, 360, 540],
  stationSpacings: [180, 180, 180],
  span: 540
});
assert.strictEqual(LayoutCore.spacingExpression([180, 180, 180]), "180x3");
assert.strictEqual(LayoutCore.spacingSpec(uniform), "180 mm");

const custom = config("单排", [
  { spacingAfter: 150 },
  { spacingAfter: 200 },
  { spacingAfter: 250 },
  { spacingAfter: 0 }
]);
assert.deepStrictEqual(LayoutCore.branchSpacings(custom), [150, 200, 250]);
assert.deepStrictEqual(LayoutCore.branchLayout(custom).offsets, [0, 150, 350, 600]);
assert.strictEqual(LayoutCore.spacingExpression([150, 200, 250]), "150 + 200 + 250");
assert.strictEqual(LayoutCore.spacingSpec(custom), "1-2:150mm，2-3:200mm，3-4:250mm");

const aligned = config("双排对齐", [
  { spacingAfter: 180 },
  { spacingAfter: 180 },
  { spacingAfter: 180 },
  { spacingAfter: 0 }
]);
assert.deepStrictEqual(LayoutCore.branchLayout(aligned), {
  offsets: [0, 0, 180, 180],
  stations: [0, 180],
  stationSpacings: [180],
  span: 180
});

const staggered = config("双排交错", [
  { spacingAfter: 180 },
  { spacingAfter: 180 },
  { spacingAfter: 180 },
  { spacingAfter: 0 }
]);
assert.deepStrictEqual(LayoutCore.branchLayout(staggered), {
  offsets: [0, 90, 180, 270],
  stations: [0, 90, 180, 270],
  stationSpacings: [90, 90, 90],
  span: 270
});

assert.deepStrictEqual(LayoutCore.branchLayout(config("单排", [])), {
  offsets: [],
  stations: [],
  stationSpacings: [],
  span: 0
});

const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
function zIndexOf(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{[\\s\\S]*?z-index:\\s*(\\d+)`, "m"));
  return match ? Number(match[1]) : NaN;
}

assert(
  zIndexOf(".modal-backdrop") > zIndexOf(".settings-panel"),
  "password modal should appear above the settings panel"
);

console.log("layout core tests passed");
