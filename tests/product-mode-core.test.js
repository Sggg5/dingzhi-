const assert = require("assert");
const ProductModeCore = require("../product-mode-core");

const manifold = ProductModeCore.state("分水器类");
assert.strictEqual(manifold.manifoldMode, true);
assert.strictEqual(manifold.fittingSectionHidden, true);
assert.strictEqual(manifold.productLengthLabel, "中心长度/展开长度 mm");

const docking = ProductModeCore.state("对接类");
assert.strictEqual(docking.dockingMode, true);
assert.strictEqual(ProductModeCore.elbowFieldHidden(docking, true), false);
assert.strictEqual(ProductModeCore.genericProductFieldHidden(docking, false), true);

const tee = ProductModeCore.state("三通类");
assert.strictEqual(tee.teeMode, true);
assert.strictEqual(tee.teeHidden, false);

const elbow = ProductModeCore.state("弯头类");
assert.strictEqual(elbow.productLengthLabel, "中心高度 mm");
assert.strictEqual(ProductModeCore.elbowFieldHidden(elbow, false), false);
assert.strictEqual(ProductModeCore.genericProductFieldHidden(elbow, false), true);
assert.strictEqual(ProductModeCore.genericProductFieldHidden(elbow, true), false);

const combination = ProductModeCore.state("组合件");
assert.strictEqual(combination.combinationMode, true);
assert.strictEqual(combination.fittingSectionHidden, true);

console.log("product mode core tests passed");
