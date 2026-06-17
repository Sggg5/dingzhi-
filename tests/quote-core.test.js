const assert = require("assert");
const QuoteCore = require("../quote-core");

function closeTo(actual, expected, tolerance = 1e-9) {
  assert(Math.abs(actual - expected) <= tolerance, `${actual} is not close to ${expected}`);
}

closeTo(QuoteCore.weightWallThickness(1.5, false), 1.37);
closeTo(QuoteCore.weightWallThickness(1.5, true), 1.55);

const weight304 = QuoteCore.tubeWeightKg(1000, 40, 1.5, "304", false);
const weight316 = QuoteCore.tubeWeightKg(1000, 40, 1.5, "316L", false);
assert(weight304 > 0);
assert(weight316 > weight304);
closeTo(weight304, 0.02482 * 1.37 * (40 - 1.37));

closeTo(QuoteCore.tubeMaterialCost(10, 16000, 1.13), 10 / 1000 * 18000 / 1.13);

const pricing = {
  fittingTaxDivisor: 1.13,
  fittingMaterialFactor: { "304": 1, "316L": 1.5 },
  fittingWeightFactor: { "外丝": 4.2, "法兰": 1.8 },
  fittingByDiameter: {},
  fittingBySeries: {
    A: { "外丝": { 40: 7.99 }, "法兰": { 76.1: 61 } },
    B: { "外丝": { 42: 7.99 }, "法兰": { 76.1: 70 } }
  }
};
const tubeSeries = {
  A: [{ diameter: 40 }, { diameter: 76.1 }],
  B: [{ diameter: 42 }, { diameter: 76.1 }]
};
const isNoFitting = name => name === "无配件" || name === "直管";

const baseArgs = { pricing, tubeSeries, isNoFitting, material: "304" };
closeTo(QuoteCore.fittingCost({ ...baseArgs, fittingName: "外丝", diameter: 40, series: "A" }), 7.99 / 1.13);
closeTo(QuoteCore.fittingCost({ ...baseArgs, fittingName: "外丝", diameter: 42, series: "B" }), 7.99 / 1.13);
closeTo(QuoteCore.fittingCost({ ...baseArgs, fittingName: "无配件", diameter: 40, series: "A" }), 0);
closeTo(QuoteCore.fittingCost({ ...baseArgs, fittingName: "外丝", diameter: 40, series: "A", material: "316L" }), 7.99 / 1.13 * 1.5);

const fittingWeight = QuoteCore.fittingTheoreticalWeightKg({
  ...baseArgs,
  fittingName: "外丝",
  diameter: 40,
  series: "A",
  steelTonPrice: 16000
});
closeTo(fittingWeight, (7.99 / 1.13) / (18 * 4.2));
closeTo(QuoteCore.heatTreatmentFittingWeightKg({
  ...baseArgs,
  fittingName: "法兰",
  diameter: 76.1,
  series: "A",
  steelTonPrice: 16000
}), 0);

const standards = [16, 20, 25.4, 32, 40];
closeTo(QuoteCore.nearestDiameter(25.4, standards), 25.4);
closeTo(QuoteCore.nearestDiameter(27, standards), 25.4);
closeTo(QuoteCore.processCost({
  fittingName: "外丝",
  diameter: 27,
  processTable: { "外丝": { 25.4: 0.32 } },
  standardDiameters: standards,
  isNoFitting
}), 0.32);
closeTo(QuoteCore.processCost({
  fittingName: "无配件",
  diameter: 27,
  processTable: { "无配件": { 25.4: 99 } },
  standardDiameters: standards,
  isNoFitting
}), 0);

const lengthPricing = {
  fittingLengthBySeries: { A: { "外丝": { 40: 37.8 } } },
  fittingLengthByDiameter: { "外丝": { 25.4: 34 } }
};
closeTo(QuoteCore.fittingLengthMm({
  fittingName: "外丝",
  diameter: 40,
  series: "A",
  pricing: lengthPricing,
  standardDiameters: standards,
  isNoFitting
}), 37.8);
closeTo(QuoteCore.fittingLengthMm({
  fittingName: "外丝",
  diameter: 27,
  series: "B",
  pricing: lengthPricing,
  standardDiameters: standards,
  isNoFitting
}), 34);

const totals = QuoteCore.finalizeCost(100, {
  costRate: 0.68,
  faceDiscountRate: 0.17,
  quantity: 2,
  freight: 10
}, 1.13);
closeTo(totals.factoryCost, 113);
closeTo(totals.tax, 13);
closeTo(totals.discountedPrice, 113 / 0.68);
closeTo(totals.facePrice, 113 / 0.68 / 0.17);
closeTo(totals.totalPrice, totals.unitPrice * 2 + 10);

console.log("quote core tests passed");
