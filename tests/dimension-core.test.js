const assert = require("assert");
const DimensionCore = require("../dimension-core");

function closeTo(actual, expected, tolerance = 1e-9) {
  assert(Math.abs(actual - expected) <= tolerance, `${actual} is not close to ${expected}`);
}

assert.strictEqual(DimensionCore.drawingLengthValue(24.01), 25);
assert.strictEqual(DimensionCore.drawingLengthValue(-10), 0);
assert.strictEqual(DimensionCore.drawingLengthTolerance(25.4), "±3");
assert.strictEqual(DimensionCore.drawingLengthTolerance(32), "±5");
assert.strictEqual(DimensionCore.drawingLengthText(24.01), "L=25 mm");
assert.strictEqual(DimensionCore.drawingTotalLengthText(31.1, 40), "L=32 ±5 mm");

const fittingLengths = {
  "外丝/40/A": 37.8,
  "内丝/50.8/A": 29.4,
  "中接/50.8/A": 20,
  "外丝/50.8/A": 43
};
const fittingLengthMm = (name, diameter, series) => fittingLengths[`${name}/${diameter}/${series}`] || 0;

const docking = {
  diameterA: 40,
  diameterB: 50.8,
  fittingA: "外丝",
  fittingB: "内丝",
  tubeSeries: "A",
  totalLengthRequirement: 0,
  middleItems: [
    { type: "直管", length: 100 },
    { type: "中接" }
  ]
};
assert.strictEqual(DimensionCore.dockingMiddleLengthMm(docking, fittingLengthMm), 120);
closeTo(DimensionCore.dockingTotalLengthMm(docking, fittingLengthMm), 187.2);
assert.strictEqual(DimensionCore.dockingTotalLengthMm({ ...docking, totalLengthRequirement: 300 }, fittingLengthMm), 300);

assert.strictEqual(DimensionCore.teeMiddleLengthMm("中接", 50.8, "A", fittingLengthMm), 20);
assert.strictEqual(DimensionCore.teeMiddleLengthMm("无", 50.8, "A", fittingLengthMm), 0);
assert.strictEqual(DimensionCore.teeBMiddleVisualLengthMm({ middleB: "直管", middleLengthB: 50 }), 50);
assert.strictEqual(DimensionCore.teeBMiddleVisualLengthMm({ middleB: "无", middleLengthB: 50 }), 0);

assert.strictEqual(DimensionCore.elbowMiddleLengthMm("直管", 80, 40, "A", fittingLengthMm), 80);
assert.strictEqual(DimensionCore.elbowMiddleLengthMm("中接", 80, 50.8, "A", fittingLengthMm), 20);
assert.strictEqual(DimensionCore.elbowMiddleLengthMm("无", 80, 40, "A", fittingLengthMm), 0);

assert.strictEqual(DimensionCore.compressedStraightVisualLength(160), 160);
assert(DimensionCore.compressedStraightVisualLength(2000) < 2000);

const tee = {
  bodyDiameter: 40,
  bodyLength: 52,
  diameterA: 40,
  diameterC: 50.8,
  fittingA: "外丝",
  fittingC: "外丝",
  middleA: "无",
  middleC: "中接",
  tubeSeries: "A"
};
closeTo(DimensionCore.teeHorizontalTotalLengthMm(tee, fittingLengthMm), 152.8);

const pricing = {
  elbowCenterHeightBySeries: { A: { 40: 60 } },
  teeStraightLengthBySeries: { A: { 40: 52 } }
};
assert.strictEqual(DimensionCore.productDefaultLength({ productType: "对接类", diameter: 40, pricing }), 100);
assert.strictEqual(DimensionCore.productDefaultLength({ productType: "弯头类", diameter: 40, angle: 90, pricing }), 60);
assert.strictEqual(DimensionCore.productDefaultLength({ productType: "弯头类", diameter: 40, angle: 45, pricing }), 39);
assert.strictEqual(DimensionCore.productDefaultLength({ productType: "三通类", diameter: 40, pricing }), 52);
assert.strictEqual(DimensionCore.productDefaultLength({ productType: "分水器类", diameter: 40, pricing }), 120);

console.log("dimension core tests passed");
