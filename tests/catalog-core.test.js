const assert = require("assert");
const CatalogCore = require("../catalog-core");

const options = {
  tubeSeries: {
    A: [
      { diameter: 20, thickness: 1.2 },
      { diameter: 32, thickness: 1.5 },
      { diameter: 40, thickness: 1.5 },
      { diameter: 50.8, thickness: 1.5 }
    ],
    B: [
      { diameter: 15, thickness: 1.5, equivalent: null },
      { diameter: 22, thickness: 1.5 },
      { diameter: 35, thickness: 1.5 },
      { diameter: 42, thickness: 1.5 },
      { diameter: 54, thickness: 1.5 }
    ]
  },
  branchOnlySeries: {
    A: [{ diameter: 16, thickness: 1 }],
    B: [{ diameter: 18, thickness: 1.5 }]
  }
};

assert.deepStrictEqual(CatalogCore.seriesDiameters(options, "A"), [20, 32, 40, 50.8]);
assert.deepStrictEqual(CatalogCore.seriesDiameters(options, "B"), [15, 22, 35, 42, 54]);
assert.deepStrictEqual(CatalogCore.fittingSettingDiameters(options, "A"), [16, 20, 32, 40, 50.8]);
assert.deepStrictEqual(CatalogCore.fittingSettingDiameters(options, "B"), [15, 18, 22, 35, 42, 54]);
assert.deepStrictEqual(CatalogCore.seriesThicknesses(options, "A"), [1, 1.2, 1.5]);
assert.strictEqual(CatalogCore.defaultWallThickness(options, "B", 15), 1.5);
assert.strictEqual(CatalogCore.defaultWallThickness(options, "A", 16), 1);
assert.strictEqual(CatalogCore.defaultWallThickness(options, "A", 40), 1.5);
assert.strictEqual(CatalogCore.defaultWallThickness(options, "A", 999), 1.5);

assert.strictEqual(CatalogCore.equivalentSeriesDiameter(options, 16, "B"), 18);
assert.strictEqual(CatalogCore.equivalentSeriesDiameter(options, 15, "A"), undefined);
assert.strictEqual(CatalogCore.equivalentSeriesDiameter(options, 40, "B"), 42);
assert.strictEqual(CatalogCore.equivalentSeriesDiameter(options, 42, "A"), 40);
assert.strictEqual(CatalogCore.equivalentSeriesDiameter(options, 999, "A"), undefined);

assert.strictEqual(CatalogCore.closestDiameter(39, [20, 32, 40, 50.8]), 40);
assert.strictEqual(CatalogCore.stableSeriesDiameter(options, 40, [22, 35, 42, 54], "B"), 42);
assert.strictEqual(CatalogCore.stableSeriesDiameter(options, 41, [22, 35, 42, 54], "B"), 42);
assert.strictEqual(CatalogCore.stableSeriesDiameter(options, 35, [22, 35, 42, 54], "B"), 35);
assert.deepStrictEqual(CatalogCore.branchOptions(options, "A", 32), [16, 20, 32]);

assert.strictEqual(CatalogCore.isNoFitting("直管"), true);
assert.strictEqual(CatalogCore.isNoFitting("无配件"), true);
assert.strictEqual(CatalogCore.isNoFitting("外丝"), false);
assert.strictEqual(CatalogCore.isRingPressLike("环压"), true);
assert.strictEqual(CatalogCore.isRingPressLike("插焊"), true);
assert.strictEqual(CatalogCore.isRingPressLike("双卡"), false);

const table = {
  "外丝": { 40: 7.99 },
  "法兰": { 76.1: 61 }
};
assert.deepStrictEqual(
  CatalogCore.availableFittings(["无配件", "直管", "外丝", "法兰"], 40, table),
  ["无配件", "直管", "外丝"]
);

console.log("catalog core tests passed");
