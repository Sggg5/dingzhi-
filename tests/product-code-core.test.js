const assert = require("assert");
const ProductCodeCore = require("../product-code-core");

assert.strictEqual(ProductCodeCore.diameterCode(40, "A"), "040");
assert.strictEqual(ProductCodeCore.diameterCode(76.1, "A"), "065");
assert.strictEqual(ProductCodeCore.diameterCode(42, "B"), "040");
assert.strictEqual(ProductCodeCore.diameterCode(108, "B"), "100");

const manifold = ProductCodeCore.generate({
  productType: "分水器类",
  material: "304",
  tubeSeries: "A",
  mainDiameter: 40,
  branchDiameter: 20,
  branchCount: 2,
  branches: [{ diameter: 20 }, { diameter: 20 }]
});
assert.strictEqual(manifold.valid, true);
assert.strictEqual(manifold.code, "A38040020020000");
assert.strictEqual(manifold.code.length, 15);

const sixPortManifold = ProductCodeCore.generate({
  productType: "分水器类",
  material: "316L",
  tubeSeries: "A",
  mainDiameter: 88.9,
  branchDiameter: 32,
  branchCount: 6,
  branches: [{ diameter: 32 }]
});
assert.strictEqual(sixPortManifold.valid, true);
assert.strictEqual(sixPortManifold.code, "B38080032060000");

const twentyPortManifold = ProductCodeCore.generate({
  productType: "分水器类",
  material: "304",
  tubeSeries: "A",
  mainDiameter: 101.6,
  branchDiameter: 20,
  branchCount: 20,
  branches: [{ diameter: 20 }]
});
assert.strictEqual(twentyPortManifold.valid, true);
assert.strictEqual(twentyPortManifold.code, "A38100020200000");

const unsupportedManifold = ProductCodeCore.generate({
  productType: "分水器类",
  material: "304",
  tubeSeries: "A",
  mainDiameter: 40,
  branchDiameter: 20,
  branchCount: 21,
  branches: [{ diameter: 20 }]
});
assert.strictEqual(unsupportedManifold.valid, false);
assert(unsupportedManifold.message.includes("超出 01～20 范围"));

const docking = ProductCodeCore.generate({
  productType: "对接类",
  material: "316L",
  tubeSeries: "A",
  diameterA: 40,
  diameterB: 50.8,
  fittingA: "外丝",
  fittingB: "法兰"
});
assert.strictEqual(docking.valid, true);
assert.strictEqual(docking.code, "B36010104005000");

const tee = ProductCodeCore.generate({
  productType: "三通类",
  material: "304",
  tubeSeries: "B",
  bodyDiameter: 42,
  diameterA: 42,
  diameterB: 28,
  diameterC: 42,
  fittingA: "法兰",
  fittingB: "外丝",
  fittingC: "双卡"
});
assert.strictEqual(tee.valid, true);
assert.strictEqual(tee.code, "A16050404002500");

const unknownFitting = ProductCodeCore.generate({
  productType: "弯头类",
  material: "304",
  tubeSeries: "A",
  diameterA: 40,
  diameterB: 40,
  fittingA: "堵头"
});
assert.strictEqual(unknownFitting.valid, false);
assert(unknownFitting.message.includes("第一连接分类"));

console.log("product code core tests passed");
