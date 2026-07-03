const assert = require("assert");
const ProductFormRulesCore = require("../product-form-rules-core");

assert.deepStrictEqual(ProductFormRulesCore.dockingMiddleAutoState({
  diameterA: 40,
  diameterB: 50.8,
  thicknessA: 1.5,
  thicknessB: 1.5,
  previousPair: "40x1.5-40x1.5",
  touched: false
}), {
  pair: "40x1.5-50.8x1.5",
  pairChanged: true,
  needsReducerMiddle: true,
  shouldAutoMiddle: true,
  hasMiddle: true,
  middleCount: "1",
  middleType: "中接"
});

assert.strictEqual(ProductFormRulesCore.dockingMiddleAutoState({
  diameterA: 40,
  diameterB: 50.8,
  thicknessA: 1.5,
  thicknessB: 1.5,
  previousPair: "40x1.5-40x1.5",
  touched: true
}).shouldAutoMiddle, false);

assert.deepStrictEqual(ProductFormRulesCore.dockingMiddleAutoState({
  diameterA: 40,
  diameterB: 40,
  thicknessA: 1.5,
  thicknessB: 1.5,
  previousPair: "40x1.5-50.8x1.5",
  touched: false
}), {
  pair: "40x1.5-40x1.5",
  pairChanged: true,
  needsReducerMiddle: false,
  shouldAutoMiddle: true,
  hasMiddle: true,
  middleCount: "1",
  middleType: "直管"
});

assert.strictEqual(ProductFormRulesCore.dockingMiddleAutoState({
  diameterA: 40,
  diameterB: 40,
  thicknessA: 1.5,
  thicknessB: 1.5,
  previousPair: "",
  touched: false
}).shouldAutoMiddle, false);

assert.deepStrictEqual(ProductFormRulesCore.dockingSideMiddleAutoState({
  diameterA: 40,
  thicknessA: 1.5,
  diameterB: 50.8,
  thicknessB: 1.5,
  middleDiameter: 40,
  middleThickness: 1.5,
  changedId: "productDiameterB",
  touched: false
}), {
  middleA: "无",
  middleB: "中接",
  changed: true
});

assert.deepStrictEqual(ProductFormRulesCore.dockingSideMiddleAutoState({
  diameterA: 40,
  thicknessA: 1.5,
  diameterB: 50.8,
  thicknessB: 1.5,
  middleDiameter: 40,
  middleThickness: 1.5,
  changedId: "productDiameterB",
  touched: true,
  currentMiddleA: "直管",
  currentMiddleB: "无"
}), {
  middleA: "直管",
  middleB: "无",
  changed: false
});

assert.strictEqual(ProductFormRulesCore.elbowSideMiddleValue({
  changedId: "elbowDiameterA",
  side: "A",
  sideDiameter: 50.8,
  bodyDiameter: 40,
  currentMiddle: "无"
}), "中接");

assert.strictEqual(ProductFormRulesCore.elbowSideMiddleValue({
  changedId: "elbowDiameterA",
  side: "A",
  sideDiameter: 50.8,
  bodyDiameter: 40,
  currentMiddle: "直管"
}), "直管");

assert.strictEqual(ProductFormRulesCore.teeSideMiddleValue({
  changedId: "teeDiameterC",
  side: "C",
  sideDiameter: 76.1,
  bodyDiameter: 40,
  currentMiddle: "无"
}), "中接");

assert.deepStrictEqual(ProductFormRulesCore.teeBMiddleForFitting({
  changedId: "teeFittingB",
  fittingB: "法兰",
  currentMiddleB: "无",
  currentLengthB: ""
}), { middleB: "直管", lengthB: "50" });

console.log("product form rules core tests passed");
