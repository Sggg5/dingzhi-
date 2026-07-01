const assert = require("assert");
const CostDetailCore = require("../cost-detail-core");

const pricing = { fittingTaxDivisor: 1.13 };
const helpers = {
  formatNumber: value => Number(value).toFixed(2),
  formatFactor: value => Number(value).toFixed(2),
  money: value => `¥${Number(value).toFixed(2)}`,
  fittingLabel: value => value,
  isNoFitting: value => value === "无配件",
  fittingCost: (_name, diameter) => diameter / 10,
  fittingCostDetail: (_name, diameter) => ({
    priceDiameter: diameter,
    taxIncludedPrice: diameter / 10,
    taxDivisor: 1.13,
    materialFactor: 1.5,
    cost: diameter / 10 / 1.13 * 1.5
  }),
  processCostDetail: (_type, _name, diameter) => ({
    processDiameter: diameter,
    processCost: diameter / 100
  })
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
  {
    processFactor: 1,
    material: "316L",
    tubeSeries: "A",
    diameter: 40,
    diameterA: 40,
    diameterB: 50,
    fittingA: "外丝",
    fittingB: "法兰",
    middleItems: [{ type: "中接" }]
  },
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
assert.strictEqual(dockingRows.some(row => row[0] === "A端 外丝 D40"), true);
const fittingNote = dockingRows.find(row => row[0] === "A端 外丝 D40")[1];
assert.strictEqual(fittingNote.includes("表格取径 D40"), true);
assert.strictEqual(fittingNote.includes("含税表价 ¥4.00"), true);
assert.strictEqual(fittingNote.includes("去税 ÷ 1.13"), true);
assert.strictEqual(fittingNote.includes("材质系数 x 1.50"), true);
assert.strictEqual(fittingNote.includes("计入成本 ¥5.31"), true);
assert.strictEqual(dockingRows.some(row => row[1] === "两端加工基础合计 ¥5.00"), true);
const processNote = dockingRows.find(row => row[0] === "A端 外丝 D40 加工")[1];
assert.strictEqual(processNote.includes("加工费表格取径 D40"), true);
assert.strictEqual(processNote.includes("表格取值 ¥0.40"), true);
assert.strictEqual(dockingRows.some(row => row[0] === "制造管理（加工费 x 2.14）"), true);
assert.strictEqual(dockingRows.at(-1)[0], "面价（17折基准）");

const manifoldRows = CostDetailCore.manifoldRows(
  {
    branchCount: 1,
    material: "304",
    tubeSeries: "A",
    mainDiameter: 40,
    mainFitting: "外丝",
    tailFitting: "无配件",
    branches: [{ diameter: 20, fitting: "外丝", height: 0 }]
  },
  {
    ...totals,
    mainTubeWeightKg: 1,
    mainTubeCost: 2,
    branchTubeWeightKg: 0,
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
  {
    ...pricing,
    processBaseForTwoBranches: 6.82,
    processPerExtraBranch: 1.81,
    heightProcessPerBranch: 1
  },
  helpers
);
assert.strictEqual(manifoldRows.some(row => row[0] === "进水端 外丝 D40"), true);
assert.strictEqual(manifoldRows.some(row => row[0] === "末尾 无配件 D40"), false);
assert.strictEqual(manifoldRows.some(row => row[0] === "1路 外丝 D20"), true);
assert.strictEqual(manifoldRows.find(row => row[0] === "1路 外丝 D20")[2] > 0, true);
assert.strictEqual(manifoldRows.some(row => row[0] === "加工基础"), true);
assert.strictEqual(manifoldRows.find(row => row[0] === "加工基础")[1].includes("1口产品也按2口基础加工费起算"), true);
assert.strictEqual(manifoldRows.some(row => row[0] === "加工合计"), true);

const combinationRows = CostDetailCore.combinationRows(
  {
    material: "316L",
    tubeSeries: "A",
    steelTonPrice: 16000,
    surfaceTreatment: "酸洗",
    fittingA: "外丝",
    fittingB: "法兰",
    components: [
      { type: "直管", diameter: 40, thickness: 1.5, length: 120 },
      {
        type: "三通", diameter: 40, thickness: 1.5, length: 80,
        branchLength: 60, branchDiameter: 32, branchThickness: 1.5,
        branchFitting: "外丝", branchFittingDiameter: 32,
        branchMiddle: "中接", branchMiddleLength: 50,
        branchComponents: [{ type: "90°弯头", diameter: 32, thickness: 1.5, length: 60 }]
      }
    ]
  },
  {
    ...totals,
    tubeWeightKg: 1.2,
    totalTubeWeightKg: 1.6,
    tubeCost: 8,
    fittingCost: 6,
    processCost: 5,
    endpointProcessCost: 0.8,
    annealingCost: 1,
    managementCost: 2,
    packagingCost: 1,
    surfaceTreatmentCost: 0,
    jointRows: [{ index: 1, diameter: 40, cost: 0.4 }]
  },
  { ...pricing, combination: { teeBodyBaseProcess: 6.82, branchChainProcessPerSegment: 1, managementProcessFactor: 2.14 } },
  {
    ...helpers,
    tubeWeightKg: (length, diameter, thickness) => length * diameter * thickness / 100000,
    tubeMaterialCost: weight => weight * 5,
    teeProcessCost: (_name, diameter) => diameter / 100
  }
);
assert.strictEqual(combinationRows.some(row => String(row[0]).includes("主链直管")), true);
assert.strictEqual(combinationRows.some(row => String(row[0]).includes("焊接点 1")), true);
assert.strictEqual(combinationRows.some(row => String(row[0]).includes("三通体基础加工")), true);
assert.strictEqual(combinationRows.some(row => String(row[0]).includes("配件明细")), true);

assert.strictEqual(combinationRows.some(row => String(row[0]).includes("A/B端配件加工")), true);

console.log("cost detail core tests passed");
