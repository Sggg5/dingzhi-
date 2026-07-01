const assert = require("assert");
const CombinationCore = require("../combination-core");

const geometry = CombinationCore.geometry([
  { type: "直管", diameter: 40, thickness: 1.5, length: 100 },
  { type: "90°弯头", diameter: 40, thickness: 1.5, length: 60, direction: "左" },
  { type: "直管", diameter: 40, thickness: 1.5, length: 100 },
  { type: "90°弯头", diameter: 40, thickness: 1.5, length: 60, direction: "右" },
  { type: "直管", diameter: 40, thickness: 1.5, length: 80 }
]);
assert.strictEqual(geometry.segments.length, 5);
assert(Math.abs(geometry.end.x - 300) < 1e-6);
assert(Math.abs(geometry.end.y + 220) < 1e-6);

const teeGeometry = CombinationCore.geometry([
  { type: "三通", diameter: 40, thickness: 1.5, length: 80, branchLength: 60, direction: "左" }
]);
assert.strictEqual(teeGeometry.branches.length, 0);
assert.strictEqual(teeGeometry.branchEnds.length, 1);
const teeWithElbowGeometry = CombinationCore.geometry([{
  type: "三通", diameter: 40, thickness: 1.5, length: 80,
  branchDiameter: 32, branchThickness: 1.5, branchLength: 60, direction: "左",
  branchComponents: [{ type: "90°弯头", diameter: 32, thickness: 1.5, length: 48, direction: "右" }],
  branchFittingDiameter: 32, branchFitting: "外丝", branchMiddle: "无"
}]);
assert.strictEqual(teeWithElbowGeometry.branches.some(branch => branch.role === "chain"), true);
assert(Math.abs(teeWithElbowGeometry.branchEnds[0].heading) < 1e-9);
const normalizedTee = CombinationCore.normalizeComponent({
  type: "三通", diameter: 40, branchDiameter: 32, branchFittingDiameter: 40, branchMiddle: "无"
});
assert.strictEqual(normalizedTee.branchMiddle, "中接");

const pricing = {
  annealingPerKg: 1.2,
  packagingPerKg: 0.938,
  heightProcessPerBranch: 1,
  processBaseForTwoBranches: 6.82,
  combination: {
    teeBodyBaseProcess: 9,
    branchChainProcessPerSegment: 2,
    managementProcessFactor: 2.5
  },
  surfaceTreatmentPerKg: { 酸洗: 0 }
};
const result = CombinationCore.calculate({
  material: "304", tubeSeries: "A", steelTonPrice: 16000,
  fittingA: "外丝", fittingB: "外丝", surfaceTreatment: "酸洗",
  costRate: 0.68, faceDiscountRate: 0.17, quantity: 1, freight: 0,
  components: [
    { type: "直管", diameter: 40, thickness: 1.5, length: 100 },
    { type: "90°弯头", diameter: 40, thickness: 1.5, length: 60, direction: "左" }
  ]
}, pricing, {
  tubeWeightKg: length => length / 1000,
  tubeMaterialCost: weight => weight * 20,
  fittingCost: name => name === "90弯头" ? 8 : 2,
  fittingTheoreticalWeightKg: name => name === "90弯头" ? 0.2 : 0.05,
  isNoFitting: name => name === "无配件",
  elbowProcessCost: (name, diameter) => name === "对焊" ? diameter / 10 : 0,
  dockingProcessCost: () => 0.5,
  teeProcessCost: () => 0.4,
  finalizeCost: subtotal => ({ factoryCost: subtotal * 1.13, discountedPrice: subtotal * 2, unitPrice: subtotal * 3, totalPrice: subtotal * 3 })
});
assert.strictEqual(result.bomRows.length, 4);
assert(Number.isFinite(result.factoryCost));
assert(result.fittingCost > 0);
assert.strictEqual(result.assemblyCost, 4);
assert.strictEqual(result.endpointProcessCost, 1);
assert.strictEqual(result.processCost, 5);
assert.strictEqual(result.jointRows[0].diameter, 40);
assert(result.costRows.some(row => row[0] === "制造管理" && row[1].includes("2.5")));

const weldFallbackResult = CombinationCore.calculate({
  material: "304", tubeSeries: "A", steelTonPrice: 16000,
  fittingA: "外丝", fittingB: "外丝", surfaceTreatment: "酸洗",
  costRate: 0.68, faceDiscountRate: 0.17, quantity: 1, freight: 0,
  components: [
    { type: "直管", diameter: 40, thickness: 1.5, length: 100 },
    { type: "直管", diameter: 40, thickness: 1.5, length: 100 }
  ]
}, pricing, {
  tubeWeightKg: length => length / 1000,
  tubeMaterialCost: weight => weight * 20,
  fittingCost: () => 2,
  fittingTheoreticalWeightKg: () => 0.05,
  isNoFitting: name => name === "无配件",
  elbowProcessCost: name => name === "对焊" ? 4 : 0,
  dockingProcessCost: () => 0.5,
  teeProcessCost: () => 0.4,
  finalizeCost: subtotal => ({ factoryCost: subtotal * 1.13, discountedPrice: subtotal * 2, unitPrice: subtotal * 3, totalPrice: subtotal * 3 })
});
assert.strictEqual(weldFallbackResult.assemblyCost, 4);
assert.strictEqual(weldFallbackResult.processCost, 5);

const teeResult = CombinationCore.calculate({
  material: "304", tubeSeries: "A", steelTonPrice: 16000,
  fittingA: "无配件", fittingB: "无配件", surfaceTreatment: "酸洗",
  costRate: 0.68, faceDiscountRate: 0.17, quantity: 1, freight: 0,
  components: [{
    type: "三通", diameter: 40, thickness: 1.5, length: 80,
    branchDiameter: 32, branchThickness: 1.5, branchLength: 60,
    branchFittingDiameter: 40, branchFitting: "外丝",
    branchMiddle: "中接", branchMiddleLength: 50, direction: "左",
    branchComponents: [{ type: "90°弯头", diameter: 32, thickness: 1.5, length: 48, direction: "右" }]
  }]
}, pricing, {
  tubeWeightKg: (length, diameter) => length * diameter / 100000,
  tubeMaterialCost: weight => weight * 20,
  fittingCost: name => name === "中接" ? 8 : name === "外丝" ? 2 : 0,
  fittingTheoreticalWeightKg: name => name === "无配件" ? 0 : 0.05,
  isNoFitting: name => name === "无配件",
  elbowProcessCost: (name, diameter) => name === "对焊" ? diameter / 10 : 0,
  teeProcessCost: () => 0.4,
  finalizeCost: subtotal => ({ factoryCost: subtotal * 1.13, discountedPrice: subtotal * 2, unitPrice: subtotal * 3, totalPrice: subtotal * 3 })
});
assert(teeResult.bomRows.some(row => row.name.includes("支口外丝 D40")));
assert(teeResult.bomRows.some(row => row.name.includes("支口中接 D32-D40")));
assert(teeResult.bomRows.some(row => row.name.includes("支路90°弯头 D32")));
assert.strictEqual(teeResult.geometry.branchEnds.length, 1);
assert(teeResult.fittingCost >= 10);
assert(teeResult.processCost >= 11);

console.log("combination core tests passed");
