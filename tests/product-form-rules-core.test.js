const assert = require("assert");
const ProductFormRulesCore = require("../product-form-rules-core");

assert.deepStrictEqual(ProductFormRulesCore.dockingMiddleAutoState({
  diameterA: 40,
  diameterB: 50.8,
  previousPair: "40-40",
  touched: false
}), {
  pair: "40-50.8",
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
  previousPair: "40-40",
  touched: true
}).shouldAutoMiddle, false);

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
