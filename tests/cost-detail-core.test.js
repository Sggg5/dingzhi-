const assert = require("assert");
const CostDetailCore = require("../cost-detail-core");

const pricing = { fittingTaxDivisor: 1.13 };
const helpers = {
  formatNumber: value => Number(value).toFixed(2),
  formatFactor: value => Number(value).toFixed(2),
  money: value => `¥${Number(value).toFixed(2)}`,
  fittingLabel: value => value,
  isNoFitting: value => value === "无配件",
  fittingCost: (_name, diameter) => diameter / 10
};
const totals = {
  surfaceTreatmentCost: 1,
  subtotal: 10,
  tax: 1.3,
  factoryCost: 11.3,
  discountedPrice: 20,
  facePrice: 100
};

const dockingRows = CostDetailCore.dockingRows(
  { processFactor: 1 },
  {
    ...totals,
    productTubeWeightKg: 1,
    productTubeCost: 2,
    endFittingCost: 3,
    middleFittingCost: 4,
    endProcessCost: 5,
    middleProcessCost: 6,
    difficultyFactor: 1.1,
    processCost: 7,
    fittingTheoreticalWeightKg: 0.4,
    heatTreatmentExcludedWeightKg: 0,
    annealingWeightKg: 1.4,
    annealingCost: 2,
    hasFlange: false,
    managementCost: 3,
    packagingCost: 4
  },
  pricing,
  helpers
);
assert.strictEqual(dockingRows[0][0], "直管材料（1.00 kg）");
assert.strictEqual(dockingRows[3][1], "已计入合计：¥5.00");
assert.strictEqual(dockingRows.some(row => row[0] === "制造管理（加工费x2.14）"), true);
assert.strictEqual(dockingRows.at(-1)[0], "面价（17折基准）");

const manifoldRows = CostDetailCore.manifoldRows(
  {
    material: "304",
    tubeSeries: "A",
    mainDiameter: 40,
    mainFitting: "外丝",
    tailFitting: "无配件",
    branches: [{ diameter: 20, fitting: "外丝" }]
  },
  {
    ...totals,
    mainTubeWeightKg: 1,
    mainTubeCost: 2,
    branchTubeCost: 3,
    fittingCost: 4,
    processMultiplier: 1,
    largeDiameterHoleProcessCost: 0,
    difficultyFactor: 1,
    processCost: 5,
    totalTubeWeightKg: 1,
    annealingCost: 1,
    managementCost: 1,
    packagingCost: 1
  },
  pricing,
  helpers
);
assert.strictEqual(manifoldRows.some(row => row[0] === "进水端 外丝 D40"), true);
assert.strictEqual(manifoldRows.some(row => row[0] === "末尾 无配件 D40"), false);
assert.strictEqual(manifoldRows.some(row => row[0] === "1路 外丝 D20"), true);

console.log("cost detail core tests passed");
