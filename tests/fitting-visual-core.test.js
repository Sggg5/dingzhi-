const assert = require("assert");
const FittingVisualCore = require("../fitting-visual-core");

const deps = {
  doubleCardISeries: { 20: { l1: 40, d2: 30 }, 40: { l1: 50, d2: 50 } },
  ringPressISeries: { 20: { l2: 40, d2: 30 }, 40: { l2: 50, d2: 50 } },
  fittingPriceDiameter: value => Number(value) > 30 ? 40 : 20,
  fittingLengthMm: (name, diameter) => name === "法兰" ? Number(diameter) / 2 : 0,
  isNoFitting: value => value === "无配件",
  isRingPressLike: value => value === "环压" || value === "插焊"
};

assert.strictEqual(FittingVisualCore.threadVisualLengthFactor(20), 0.7);
assert.strictEqual(FittingVisualCore.threadVisualLengthFactor(40), 1);
assert(FittingVisualCore.threadVisualWidth("外丝", 20, 40) < FittingVisualCore.threadVisualWidth("外丝", 40, 40));
assert.deepStrictEqual(FittingVisualCore.doubleCardVisualSize(40, deps), { width: 72.5, height: 32 });
assert.deepStrictEqual(FittingVisualCore.ringPressVisualSize(40, deps), { width: 54, height: 36 });
assert.strictEqual(FittingVisualCore.flangeVisualWidth(40, 40, deps.fittingLengthMm), 20);
assert.strictEqual(FittingVisualCore.inletFittingLength({ mainFitting: "直管", mainDiameter: 40 }, 40, deps), 0);
assert.strictEqual(FittingVisualCore.inletFittingLength({ mainFitting: "法兰", mainDiameter: 40 }, 40, deps), 20);
assert.strictEqual(FittingVisualCore.tailFittingLength({ tailFitting: "堵头" }, 100, deps), 21);
assert.strictEqual(FittingVisualCore.inlineFittingLength("无配件", 40, 40, deps), 0);
assert.strictEqual(FittingVisualCore.inlineFittingEnvelopeHeight("法兰", 40, 40, deps), 68);
assert.deepStrictEqual(FittingVisualCore.outerThreadBranchVisualSize(20, value => value), { width: 30, height: 28 });

console.log("fitting visual core tests passed");
