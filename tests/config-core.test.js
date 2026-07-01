const assert = require("assert");
const ConfigCore = require("../config-core");

assert.strictEqual(ConfigCore.number("12.5"), 12.5);
assert.strictEqual(ConfigCore.number("bad", 7), 7);
assert.strictEqual(ConfigCore.nonNegativeNumber(-2), 0);
assert.strictEqual(ConfigCore.positiveNumber(0, 3), 3);
assert.strictEqual(ConfigCore.positiveInteger(2.6), 3);

assert.deepStrictEqual(ConfigCore.normalizeMiddleItems([
  { type: "直管", length: "100" },
  { type: "中接", length: "99" },
  { type: "未知", length: -20 }
]), [
  { type: "直管", fitting: "直管", length: 100 },
  { type: "中接", fitting: "中接", length: 0 },
  { type: "直管", fitting: "直管", length: 0 }
]);

const docking = ConfigCore.normalizeConfig({
  productType: "对接类",
  diameterA: "40",
  diameterB: "50.8",
  thicknessA: "1.5",
  thicknessB: "2",
  middleItems: [{ type: "直管", length: "80" }, { type: "中接" }],
  quantity: "2"
});
assert.strictEqual(docking.productType, "对接类");
assert.strictEqual(docking.length, 80);
assert.strictEqual(docking.quantity, 2);
assert.strictEqual(docking.middleItems[1].length, 0);

const manifold = ConfigCore.normalizeConfig({
  mainDiameter: "88.9",
  mainFittingDiameter: "76.1",
  tailFittingDiameter: "88.9",
  mainAdapterEnabled: true,
  tailAdapterEnabled: true,
  wallThickness: "2",
  branchDiameter: "35",
  branchThickness: "1.5",
  branchCount: "2",
  branches: [{ diameter: "35", thickness: "1.5", height: "-5", spacingAfter: "150" }]
});
assert.strictEqual(manifold.productType, "分水器类");
assert.strictEqual(manifold.mainDiameter, 88.9);
assert.strictEqual(manifold.mainFittingDiameter, 76.1);
assert.strictEqual(manifold.mainAdapterEnabled, true);
assert.strictEqual(manifold.tailAdapterEnabled, false);
assert.strictEqual(manifold.branches[0].height, 0);

const elbow = ConfigCore.normalizeConfig({ productType: "弯头类", angle: 44, length: 60 });
assert.strictEqual(elbow.angle, 90);
assert.strictEqual(elbow.length, 60);

assert.strictEqual(ConfigCore.validateConfig(manifold).valid, true);
assert.strictEqual(ConfigCore.validateConfig({ productType: "未知类" }).valid, false);

console.log("config core tests passed");
