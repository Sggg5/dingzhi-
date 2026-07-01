(function exposeQuoteCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.QuoteCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createQuoteCore() {
  function weightWallThickness(nominalThicknessMm, positiveTolerance = false) {
    return positiveTolerance ? nominalThicknessMm + 0.05 : nominalThicknessMm * 0.9 + 0.02;
  }

  function tubeWeightKg(lengthMm, diameterMm, nominalThicknessMm, material, positiveTolerance = false) {
    const coefficient = material === "316L" ? 0.02513 : 0.02482;
    const wall = weightWallThickness(nominalThicknessMm, positiveTolerance);
    const kgPerMeter = coefficient * wall * (diameterMm - wall);
    return kgPerMeter * lengthMm / 1000;
  }

  function tubeMaterialCost(weightKg, steelTonPrice, materialTaxDivisor) {
    const taxDivisor = Math.max(1, Number(materialTaxDivisor) || 1);
    return Number(weightKg) / 1000 * (Number(steelTonPrice) + 2000) / taxDivisor;
  }

  function fittingPriceDiameter(diameter, series, pricing, tubeSeries) {
    if (pricing.fittingBySeries?.[series]) return diameter;
    if (series === "A") return diameter;
    const index = (tubeSeries.B || []).findIndex(item => item.diameter === diameter);
    return index >= 0 ? tubeSeries.A[index].diameter : diameter;
  }

  function fittingSeriesTable(series, pricing) {
    return pricing.fittingBySeries?.[series] || pricing.fittingByDiameter;
  }

  function costLookupFittingName(fittingName) {
    return fittingName === "中接" ? "堵头" : fittingName;
  }

  function fittingCost({ fittingName, diameter, material, series, pricing, tubeSeries, isNoFitting }) {
    if (isNoFitting(fittingName)) return 0;
    const lookupFittingName = costLookupFittingName(fittingName);
    const table = fittingSeriesTable(series, pricing);
    const priceDiameter = fittingPriceDiameter(diameter, series, pricing, tubeSeries);
    const taxIncludedPrice = table[lookupFittingName]?.[priceDiameter] || 0;
    const taxDivisor = Math.max(1, Number(pricing.fittingTaxDivisor) || 1);
    return taxIncludedPrice / taxDivisor * (Number(pricing.fittingMaterialFactor[material]) || 0);
  }

  function finalizeCost(subtotal, config, taxMultiplier) {
    const multiplier = Math.max(1, Number(taxMultiplier) || 1);
    const factoryCost = subtotal * multiplier;
    const tax = factoryCost - subtotal;
    const discountedPrice = factoryCost / config.costRate;
    const facePrice = discountedPrice / config.faceDiscountRate;
    const unitPrice = facePrice;
    const totalPrice = unitPrice * config.quantity + config.freight;
    return {
      factoryCost,
      tax,
      discountedPrice,
      facePrice,
      unitPrice,
      totalPrice,
      profit: discountedPrice - factoryCost
    };
  }

  function fittingTheoreticalWeightKg(args) {
    const { fittingName, steelTonPrice, pricing, isNoFitting } = args;
    if (isNoFitting(fittingName)) return 0;
    const lookupFittingName = costLookupFittingName(fittingName);
    const factor = Number(pricing.fittingWeightFactor?.[lookupFittingName]) || 0;
    const materialKgPrice = (Number(steelTonPrice) + 2000) / 1000;
    if (factor <= 0 || materialKgPrice <= 0) return 0;
    return fittingCost(args) / (materialKgPrice * factor);
  }

  function heatTreatmentFittingWeightKg(args) {
    if (args.fittingName === "法兰") return 0;
    return fittingTheoreticalWeightKg(args);
  }

  function nearestDiameter(diameter, standardDiameters) {
    const numericDiameter = Number(diameter);
    if (standardDiameters.includes(numericDiameter)) return numericDiameter;
    return standardDiameters.reduce((best, item) => (
      Math.abs(item - numericDiameter) < Math.abs(best - numericDiameter) ? item : best
    ), standardDiameters[0]);
  }

  function processCost({
    fittingName,
    diameter,
    processTable,
    standardDiameters,
    isNoFitting,
    fallbackProcessTable,
    fallbackFittingName
  }) {
    if (isNoFitting(fittingName)) return 0;
    const lookupFittingName = costLookupFittingName(fittingName);
    const processDiameter = nearestDiameter(diameter, standardDiameters);
    const cost = Number(processTable?.[lookupFittingName]?.[processDiameter]) || 0;
    if (cost || fittingName !== "对焊") return cost;
    return Number(fallbackProcessTable?.[fallbackFittingName || fittingName]?.[processDiameter]) || 0;
  }

  function fittingLengthMm({ fittingName, diameter, series, pricing, standardDiameters, isNoFitting }) {
    if (isNoFitting(fittingName)) return 0;
    const seriesLength = pricing.fittingLengthBySeries?.[series]?.[fittingName]?.[Number(diameter)];
    if (seriesLength !== undefined) return Number(seriesLength) || 0;
    return pricing.fittingLengthByDiameter?.[fittingName]?.[nearestDiameter(diameter, standardDiameters)] || 0;
  }

  return {
    costLookupFittingName,
    finalizeCost,
    fittingCost,
    fittingLengthMm,
    fittingPriceDiameter,
    fittingSeriesTable,
    fittingTheoreticalWeightKg,
    heatTreatmentFittingWeightKg,
    nearestDiameter,
    processCost,
    tubeMaterialCost,
    tubeWeightKg,
    weightWallThickness
  };
});
