const assert = require("assert");
const DisplayCore = require("../display-core");

const money = value => `￥${Number(value).toFixed(2)}`;

assert.deepStrictEqual(DisplayCore.costRowDisplay(["配件", 12.3], money), {
  name: "配件",
  note: "",
  detail: "",
  amount: "￥12.30"
});

assert.deepStrictEqual(DisplayCore.costRowDisplay(["加工", "已计入合计：￥1.20"], money), {
  name: "加工",
  note: "已计入合计：￥1.20",
  detail: "",
  amount: ""
});

assert.deepStrictEqual(DisplayCore.costRowDisplay(["1路 外丝 D20", "含税表价￥2.65 / 1.13 x 材质系数1.50", 3.5177], money), {
  name: "1路 外丝 D20",
  note: "含税表价￥2.65 / 1.13 x 材质系数1.50",
  detail: "计入金额：￥3.52",
  amount: ""
});

assert.deepStrictEqual(DisplayCore.costRowDisplay(["加工合计", "端部加工汇总后乘系数", 7.2], money), {
  name: "加工合计",
  note: "端部加工汇总后乘系数",
  detail: "",
  amount: "￥7.20"
});

assert.deepStrictEqual(DisplayCore.costRowDisplay(["自定义明细", "表格取值", 1.23, { detail: true }], money), {
  name: "自定义明细",
  note: "表格取值",
  detail: "计入金额：￥1.23",
  amount: ""
});

assert.deepStrictEqual(DisplayCore.costRowDisplay(["重量明细", "主管 0.89 kg + 支管 0.00 kg", "0.89 kg"], money), {
  name: "重量明细",
  note: "主管 0.89 kg + 支管 0.00 kg",
  detail: "0.89 kg",
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
  isNoFitting: value => value === "无配件",
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
}, helpers), "304 40外丝x50.8法兰 对接，直管L100+中接");

assert.strictEqual(DisplayCore.quoteItemName({
  productType: "三通类",
  material: "304",
  bodyDiameter: 88.9,
  bodyThickness: 2,
  length: 98,
  diameterA: 88.9,
  fittingA: "沟槽",
  diameterB: 50.8,
  fittingB: "外丝",
  diameterC: 88.9,
  fittingC: "沟槽"
}, helpers), "304 88.9沟槽x50.8外丝x88.9沟槽 三通，三通直管L98");

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
assert.deepStrictEqual(manifoldSpec.find(row => row[0] === "末尾配件"), ["末尾配件", "88.9 管帽盖"]);

console.log("display core tests passed");
