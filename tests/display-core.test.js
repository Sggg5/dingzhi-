const assert = require("assert");
const DisplayCore = require("../display-core");

const money = value => `¥${Number(value).toFixed(2)}`;

assert.deepStrictEqual(DisplayCore.costRowDisplay(["配件", 12.3], money), {
  name: "配件",
  note: "",
  amount: "¥12.30"
});

assert.deepStrictEqual(DisplayCore.costRowDisplay(["加工", "已计入合计：¥1.20"], money), {
  name: "加工",
  note: "已计入合计：¥1.20",
  amount: ""
});

assert.strictEqual(DisplayCore.topProductTitle({ productType: "分水器类", mainDiameter: 88.9 }), "88.9 分水器");
assert.strictEqual(DisplayCore.topProductTitle({ productType: "对接类", diameterA: 40, diameterB: 50.8 }), "40 - 50.8 对接");
assert.strictEqual(DisplayCore.topProductTitle({ productType: "三通类", bodyDiameter: 76.1 }), "76.1 三通");
assert.strictEqual(DisplayCore.topProductTitle({ productType: "弯头类", bodyDiameter: 40, angle: 90 }), "40 90° 弯头");

const helpers = {
  drawingLengthText: (value, prefix = "L=") => `${prefix}${Number(value).toFixed(0)} mm`,
  drawingLengthValue: value => Number(value).toFixed(0),
  fittingLabel: value => value,
  formatFactor: value => Number(value).toFixed(2),
  formatNumber: value => Number(value).toFixed(2),
  isManifoldType: value => value === "分水器类",
  productKindName: value => value.replace("类", ""),
  spacingSpec: () => "1-2:180mm",
  tubeSeriesLabel: { A: "国标" }
};

assert.strictEqual(DisplayCore.compactBranchSummary({
  branchCount: 2,
  branches: [
    { diameter: 20, thickness: 1.5, positiveTolerance: false, fitting: "外丝", height: 100 },
    { diameter: 20, thickness: 1.5, positiveTolerance: false, fitting: "外丝", height: 100 }
  ]
}, helpers), "D20x1.5 外丝 加高100");

assert.strictEqual(DisplayCore.compactBranchSummary({
  branchCount: 2,
  branches: [
    { diameter: 20, thickness: 1.5, positiveTolerance: false, fitting: "外丝", height: 100 },
    { diameter: 25.4, thickness: 1.2, positiveTolerance: true, fitting: "直管", height: 0 }
  ]
}, helpers), "2路独立");

assert.strictEqual(DisplayCore.quoteItemName({
  productType: "对接类",
  material: "304",
  diameterA: 40,
  thicknessA: 1.5,
  fittingA: "外丝",
  diameterB: 50.8,
  thicknessB: 1.5,
  fittingB: "法兰",
  middleItems: [{ type: "直管", length: 100 }, { type: "中接" }]
}, helpers), "304 对接 A端D40x1.5外丝，B端D50.8x1.5法兰，直管L100+中接");

assert.strictEqual(DisplayCore.quoteItemName({
  productType: "分水器类",
  material: "316L",
  tubeSeries: "A",
  manifoldType: "单排",
  mainDiameter: 88.9,
  wallThickness: 2,
  mainPositiveTolerance: true,
  branchCount: 1,
  branches: [{ diameter: 35, thickness: 1.5, positiveTolerance: false, fitting: "外丝", height: 100 }]
}, helpers), "316L 国标 单排 主管D88.9x2 正公差，1路，支管D35x1.5 外丝 加高100");

const dockingSpec = DisplayCore.specItems({
  productType: "对接类",
  customerName: "客户A",
  quoteNo: "D-001",
  material: "304",
  diameterA: 40,
  thicknessA: 1.5,
  fittingA: "外丝",
  diameterB: 50.8,
  thicknessB: 1.5,
  fittingB: "法兰",
  middleItems: [{ type: "直管", length: 100 }],
  steelTonPrice: 16000,
  surfaceTreatment: "酸洗",
  processFactor: 1
}, { difficultyFactor: 1.08, manualDifficultyFactor: null, totalTubeWeightKg: 1.23 }, helpers);
assert.deepStrictEqual(dockingSpec.find(row => row[0] === "中间连接"), ["中间连接", "直管 100 mm"]);

const manifoldSpec = DisplayCore.specItems({
  productType: "分水器类",
  customerName: "客户B",
  quoteNo: "M-001",
  material: "316L",
  manifoldType: "单排",
  mainDiameter: 88.9,
  wallThickness: 2,
  mainPositiveTolerance: false,
  branchCount: 1,
  branches: [{ diameter: 35, thickness: 1.5, positiveTolerance: false, fitting: "外丝", height: 100 }],
  mainFitting: "直管",
  tailFitting: "管帽盖",
  steelTonPrice: 33500,
  surfaceTreatment: "酸洗"
}, {
  actualWall: 1.82,
  inletAllowance: 100,
  tailAllowance: 40,
  difficultyFactor: 1.08,
  manualDifficultyFactor: null,
  totalTubeWeightKg: 4.56,
  mainLength: 940
}, helpers);
assert.deepStrictEqual(manifoldSpec.find(row => row[0] === "间距"), ["间距", "1-2:180mm"]);
assert.deepStrictEqual(manifoldSpec.find(row => row[0] === "末尾配件"), ["末尾配件", "管帽盖"]);

console.log("display core tests passed");
