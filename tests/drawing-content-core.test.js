const assert = require("assert");
const DrawingContentCore = require("../drawing-content-core");

const helpers = {
  drawingLengthText: value => `${value} mm`,
  drawingLengthValue: value => Math.ceil(value),
  fittingLabel: value => value === "堵头" ? "管帽盖" : value,
  isNoFitting: value => value === "无配件" || value === "直管",
  productKindName: value => value.replace("类", "")
};

const manifold = {
  mainDiameter: 40,
  wallThickness: 1.5,
  mainFitting: "外丝",
  tailFitting: "堵头",
  branches: [
    { diameter: 20, thickness: 1, height: 100, positiveTolerance: false, fitting: "外丝" },
    { diameter: 20, thickness: 1, height: 100, positiveTolerance: false, fitting: "外丝" }
  ]
};
assert.strictEqual(DrawingContentCore.titleBranchSummary(manifold), "D20x2口");
const manifoldRows = DrawingContentCore.manifoldBomRows(manifold, helpers);
assert.deepStrictEqual(manifoldRows.find(row => row.name === "支管外丝 D20"), { name: "支管外丝 D20", quantity: 2 });
assert.strictEqual(manifoldRows.some(row => row.name === "末尾 管帽盖 D40"), true);
const adapterRows = DrawingContentCore.manifoldBomRows({
  ...manifold,
  mainFittingDiameter: 50.8,
  tailFittingDiameter: 32,
  mainAdapterEnabled: true,
  tailAdapterEnabled: true
}, helpers);
assert.strictEqual(adapterRows.some(row => row.name === "进水中接 D50.8-D40"), true);
assert.strictEqual(adapterRows.some(row => row.name === "末尾中接 D40-D32"), true);
const blankBranchRows = DrawingContentCore.manifoldBomRows({
  ...manifold,
  branches: [
    { diameter: 20, thickness: 1, height: 100, positiveTolerance: false, fitting: "外丝" },
    { diameter: 20, thickness: 1, height: 100, positiveTolerance: false, fitting: "无配件" }
  ]
}, helpers);
assert.strictEqual(DrawingContentCore.titleBranchSummary({
  ...manifold,
  branches: [
    { diameter: 20, thickness: 1, height: 100, positiveTolerance: false, fitting: "外丝" },
    { diameter: 20, thickness: 1, height: 100, positiveTolerance: false, fitting: "无配件" }
  ]
}), "D20x1口");
assert.strictEqual(blankBranchRows.some(row => row.name === "支管无配件 D20"), false);

const docking = {
  productType: "对接类",
  diameter: 40,
  thickness: 1.5,
  diameterA: 40,
  diameterB: 50.8,
  fittingA: "外丝",
  fittingB: "无配件",
  middleItems: [{ type: "直管", length: 100.2 }, { type: "中接" }]
};
const dockingRows = DrawingContentCore.productBomRows(docking, helpers);
assert.strictEqual(dockingRows.some(row => row.name === "直管 D40 x 1.5 L101"), true);
assert.strictEqual(dockingRows.some(row => row.name.startsWith("B端")), false);
const dockingMiddleRows = DrawingContentCore.productBomRows({
  ...docking,
  middlePipeDiameter: 76.1,
  middlePipeThickness: 2,
  middleItems: [{ type: "直管", length: 80, diameter: 76.1, thickness: 2 }]
}, helpers);
assert.strictEqual(dockingMiddleRows.some(row => row.name === "直管 D76.1 x 2 L80"), true);
assert.deepStrictEqual(DrawingContentCore.productDimensionNotes(docking, helpers), [
  "A：D40 x undefined",
  "B：D50.8 x undefined",
  "中间：直管D40 100.2 mm+中接"
]);

console.log("drawing content core tests passed");
