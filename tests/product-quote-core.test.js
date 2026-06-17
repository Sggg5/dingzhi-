const assert = require("assert");
const ProductQuoteCore = require("../product-quote-core");

function closeTo(actual, expected, tolerance = 1e-9) {
  assert(Math.abs(actual - expected) <= tolerance, `${actual} is not close to ${expected}`);
}

const pricing = {
  annealingPerKg: 1.2,
  managementPerKg: 4.13,
  packagingPerKg: 0.938,
  surfaceTreatmentPerKg: { "酸洗": 0, "喷砂": 1 },
  processBaseForTwoBranches: 6.82,
  processPerExtraBranch: 1.81,
  heightProcessPerBranch: 1
};

const fittingCosts = { "无配件": 0, "外丝": 10, "法兰": 30, "中接": 8 };
const fittingWeights = { "无配件": 0, "外丝": 0.2, "法兰": 0.8, "中接": 0.3, "90弯头": 0.5, "45弯头": 0.4 };
const processCosts = { "无配件": 0, "外丝": 0.4, "法兰": 2.78, "中接": 0.4 };
const helpers = {
  tubeWeightKg(length) { return length / 1000; },
  tubeMaterialCost(weight) { return weight * 20; },
  fittingCost(name) { return fittingCosts[name] || 0; },
  fittingTheoreticalWeightKg(name) { return fittingWeights[name] || 0; },
  heatTreatmentFittingWeightKg(name) { return name === "法兰" ? 0 : fittingWeights[name] || 0; },
  dockingProcessCost(name) { return processCosts[name] || 0; },
  teeProcessCost(name) { return processCosts[name] || 0; },
  elbowProcessCost(name) { return processCosts[name] || 0; },
  branchLayout(config) { return { span: Math.max(0, config.branchCount - 1) * config.branchSpacing }; },
  weightWallThickness(value, positiveTolerance) { return positiveTolerance ? value + 0.05 : value * 0.9 + 0.02; },
  finalizeCost(subtotal, config) {
    return {
      factoryCost: subtotal * 1.13,
      tax: subtotal * 0.13,
      discountedPrice: subtotal * 1.13 / config.costRate,
      facePrice: subtotal * 1.13 / config.costRate / config.faceDiscountRate,
      unitPrice: subtotal * 1.13 / config.costRate / config.faceDiscountRate,
      totalPrice: subtotal * 1.13 / config.costRate / config.faceDiscountRate * config.quantity + config.freight,
      profit: subtotal * 1.13 / config.costRate - subtotal * 1.13
    };
  }
};

const common = {
  material: "304",
  tubeSeries: "A",
  diameterA: 40,
  diameterB: 40,
  thicknessA: 1.5,
  thicknessB: 1.5,
  diameter: 40,
  thickness: 1.5,
  fittingA: "外丝",
  fittingB: "外丝",
  middleItems: [],
  difficultyFactorInput: "",
  processFactor: 1,
  surfaceTreatment: "酸洗",
  steelTonPrice: 16000,
  costRate: 0.68,
  faceDiscountRate: 0.17,
  quantity: 1,
  freight: 0
};

const noMiddle = ProductQuoteCore.calculateDocking(common, pricing, helpers);
closeTo(noMiddle.productTubeWeightKg, 0);
closeTo(noMiddle.endFittingCost, 20);
closeTo(noMiddle.middleFittingCost, 0);
closeTo(noMiddle.autoDifficultyFactor, 1);
closeTo(noMiddle.processCost, 0.8);
closeTo(noMiddle.managementCost, noMiddle.processCost * 2.14);

const mixed = ProductQuoteCore.calculateDocking({
  ...common,
  diameterB: 50.8,
  fittingB: "法兰",
  middleItems: [
    { type: "直管", length: 100 },
    { type: "中接", fitting: "中接" }
  ]
}, pricing, helpers);
closeTo(mixed.productTubeWeightKg, 0.1);
closeTo(mixed.middleFittingCost, 8);
closeTo(mixed.fittingTheoreticalWeightKg, 1.3);
closeTo(mixed.heatTreatmentExcludedWeightKg, 0.8);
closeTo(mixed.annealingWeightKg, 0.6);
closeTo(mixed.autoDifficultyFactor, 1.15);
closeTo(mixed.managementCost, mixed.annealingWeightKg * pricing.managementPerKg);

const manual = ProductQuoteCore.calculateDocking({
  ...common,
  difficultyFactorInput: "1.5"
}, pricing, helpers);
closeTo(manual.difficultyFactor, 1.5);
closeTo(manual.processCost, 0.8 * 1.5);

const tee = ProductQuoteCore.calculateTee({
  ...common,
  diameter: 40,
  thickness: 1.5,
  bodyDiameter: 40,
  bodyThickness: 1.5,
  bodyLength: 52,
  length: 52,
  diameterA: 40,
  diameterB: 40,
  diameterC: 40,
  thicknessA: 1.5,
  thicknessB: 1.5,
  thicknessC: 1.5,
  fittingA: "外丝",
  fittingB: "法兰",
  fittingC: "外丝",
  middleA: "中接",
  middleB: "直管",
  middleC: "无",
  middleLengthB: 50
}, pricing, helpers);
closeTo(tee.productTubeWeightKg, 0.102);
closeTo(tee.endFittingCost, 50);
closeTo(tee.middleFittingCost, 8);
closeTo(tee.fittingTheoreticalWeightKg, 1.5);
closeTo(tee.heatTreatmentExcludedWeightKg, 0.8);
closeTo(tee.annealingWeightKg, 0.802);
closeTo(tee.autoDifficultyFactor, 1.19);
closeTo(tee.managementCost, tee.annealingWeightKg * pricing.managementPerKg);

const elbow90 = ProductQuoteCore.calculateElbow({
  ...common,
  angle: 90,
  length: 60,
  bodyDiameter: 40,
  bodyThickness: 1.5,
  fittingA: "外丝",
  fittingB: "法兰",
  middleA: "直管",
  middleB: "中接",
  middleLengthA: 100,
  middleLengthB: 0
}, pricing, helpers);
closeTo(elbow90.angleFactor, 1);
closeTo(elbow90.productTubeWeightKg, 0.25);
closeTo(elbow90.middleStraightWeightKg, 0.1);
closeTo(elbow90.endFittingCost, 40);
closeTo(elbow90.middleFittingCost, 8);
closeTo(elbow90.elbowBodyWeightKg, 0.5);
closeTo(elbow90.accessoryTheoreticalWeightKg, 1.3);
closeTo(elbow90.fittingTheoreticalWeightKg, 1.8);
closeTo(elbow90.heatTreatmentExcludedWeightKg, 0.8);
closeTo(elbow90.annealingWeightKg, 1.1);
closeTo(elbow90.autoDifficultyFactor, 1.13);
closeTo(elbow90.managementCost, elbow90.annealingWeightKg * pricing.managementPerKg);

const elbow45 = ProductQuoteCore.calculateElbow({
  ...common,
  angle: 45,
  length: 60,
  bodyDiameter: 40,
  bodyThickness: 1.5,
  fittingA: "外丝",
  fittingB: "外丝",
  middleA: "无",
  middleB: "无",
  middleLengthA: 0,
  middleLengthB: 0
}, pricing, helpers);
closeTo(elbow45.angleFactor, 0.8);
closeTo(elbow45.autoDifficultyFactor, 1.08);
closeTo(elbow45.processCost, 0.8 * 0.8 * 1.08);
closeTo(elbow45.managementCost, elbow45.processCost * 2.14);

const manifold = ProductQuoteCore.calculateManifold({
  ...common,
  productType: "分水器类",
  manifoldType: "单排",
  mainDiameter: 133,
  wallThickness: 2.5,
  mainPositiveTolerance: false,
  branchCount: 1,
  branchSpacing: 180,
  inletAllowance: 100,
  tailAllowance: 40,
  mainFitting: "外丝",
  tailFitting: "法兰",
  branches: [
    { diameter: 40, thickness: 1.5, fitting: "外丝", height: 100, positiveTolerance: false }
  ]
}, pricing, helpers);
closeTo(manifold.mainLength, 140);
closeTo(manifold.mainTubeWeightKg, 0.14);
closeTo(manifold.branchTubeWeightKg, 0.1);
closeTo(manifold.totalTubeWeightKg, 0.24);
closeTo(manifold.mainFittingCost, 40);
closeTo(manifold.branchFittingCost, 10);
closeTo(manifold.processMultiplier, 3);
closeTo(manifold.largeDiameterHoleProcessCost, 15);
closeTo(manifold.autoDifficultyFactor, 1.03);
closeTo(manifold.processCost, ((6.82 + 1) * 3 + 15) * 1.03);

console.log("product quote core tests passed");
