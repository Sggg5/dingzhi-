(function exposeCostDetailCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.CostDetailCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createCostDetailCore() {
  function formatters(helpers = {}) {
    return {
      formatNumber: helpers.formatNumber || (value => String(value)),
      formatFactor: helpers.formatFactor || (value => String(value)),
      money: helpers.money || (value => String(value))
    };
  }

  function totalRows(result, pricing, helpers) {
    const { formatFactor } = formatters(helpers);
    return [
      ["表面处理", result.surfaceTreatmentCost],
      ["成本小计（不含税）", result.subtotal],
      [`税额（x${formatFactor(pricing.fittingTaxDivisor)}）`, result.tax],
      ["含税成本", result.factoryCost],
      ["68%成交价", result.discountedPrice],
      ["面价（17折基准）", result.facePrice]
    ];
  }

  function managementLabel(result, helpers) {
    const { formatNumber } = formatters(helpers);
    return result.hasFlange
      ? `制造管理（法兰件按${formatNumber(result.annealingWeightKg)} kg）`
      : "制造管理（加工费x2.14）";
  }

  function manifoldRows(config, result, pricing, helpers = {}) {
    const { fittingCost, fittingLabel, isNoFitting } = helpers;
    const { formatFactor, formatNumber, money } = formatters(helpers);
    const fittingDetails = [
      { label: `进水端 ${fittingLabel(config.mainFitting)} D${config.mainDiameter}`, fitting: config.mainFitting, diameter: config.mainDiameter },
      { label: `末尾 ${fittingLabel(config.tailFitting)} D${config.mainDiameter}`, fitting: config.tailFitting, diameter: config.mainDiameter },
      ...config.branches.map((branch, index) => ({
        label: `${index + 1}路 ${fittingLabel(branch.fitting)} D${branch.diameter}`,
        fitting: branch.fitting,
        diameter: branch.diameter
      }))
    ]
      .filter(item => !isNoFitting(item.fitting))
      .map(item => [
        item.label,
        `已计入配件：${money(fittingCost(item.fitting, item.diameter, config.material, config.tubeSeries))}`
      ]);
    const holeText = result.largeDiameterHoleProcessCost > 0
      ? ` / 大规格开孔+${formatNumber(result.largeDiameterHoleProcessCost)}`
      : "";
    return [
      [`主管材料（${formatNumber(result.mainTubeWeightKg)} kg）`, result.mainTubeCost],
      ["支管材料", result.branchTubeCost],
      ["配件", result.fittingCost],
      ...fittingDetails,
      [`加工（规格x${result.processMultiplier}${holeText} / 难度x${formatFactor(result.difficultyFactor)}）`, result.processCost],
      [`退火（${formatNumber(result.totalTubeWeightKg)} kg）`, result.annealingCost],
      [`制造管理（${formatNumber(result.totalTubeWeightKg)} kg）`, result.managementCost],
      [`包材（${formatNumber(result.totalTubeWeightKg)} kg）`, result.packagingCost],
      ...totalRows(result, pricing, helpers)
    ];
  }

  function dockingRows(config, result, pricing, helpers) {
    const { formatFactor, formatNumber, money } = formatters(helpers);
    return [
      [`直管材料（${formatNumber(result.productTubeWeightKg)} kg）`, result.productTubeCost],
      ["A/B端配件", result.endFittingCost],
      ["中接配件", result.middleFittingCost],
      ["A/B端加工（表格取值）", `已计入合计：${money(result.endProcessCost)}`],
      ["中接加工（表格取值）", `已计入合计：${money(result.middleProcessCost)}`],
      [`对接加工合计（系数x${formatFactor(config.processFactor)} / 难度x${formatFactor(result.difficultyFactor)}）`, result.processCost],
      ["配件理论重量", `${formatNumber(result.fittingTheoreticalWeightKg)} kg`],
      ["法兰不退火重量", `${formatNumber(result.heatTreatmentExcludedWeightKg)} kg`],
      [`退火（${formatNumber(result.annealingWeightKg)} kg）`, result.annealingCost],
      [managementLabel(result, helpers), result.managementCost],
      [`包材（${formatNumber(result.annealingWeightKg)} kg）`, result.packagingCost],
      ...totalRows(result, pricing, helpers)
    ];
  }

  function teeRows(config, result, pricing, helpers) {
    const { formatFactor, formatNumber, money } = formatters(helpers);
    return [
      [`三通体/直管材料（${formatNumber(result.productTubeWeightKg)} kg）`, result.productTubeCost],
      ["A/B/C端配件", result.endFittingCost],
      ["中接配件", result.middleFittingCost],
      ["A/B/C端加工（表格取值）", `已计入合计：${money(result.endProcessCost)}`],
      ["中间段加工（表格取值）", `已计入合计：${money(result.middleProcessCost)}`],
      [`三通加工合计（系数x${formatFactor(config.processFactor)} / 难度x${formatFactor(result.difficultyFactor)}）`, result.processCost],
      ["配件理论重量", `${formatNumber(result.fittingTheoreticalWeightKg)} kg`],
      ["法兰不退火重量", `${formatNumber(result.heatTreatmentExcludedWeightKg)} kg`],
      [`退火（${formatNumber(result.annealingWeightKg)} kg）`, result.annealingCost],
      [managementLabel(result, helpers), result.managementCost],
      [`包材（${formatNumber(result.annealingWeightKg)} kg）`, result.packagingCost],
      ...totalRows(result, pricing, helpers)
    ];
  }

  function elbowRows(config, result, pricing, helpers) {
    const { formatFactor, formatNumber, money } = formatters(helpers);
    return [
      [`${result.elbowBodyName}本体（表格取值）`, result.productTubeCost],
      [`A/B端直管（${formatNumber(result.middleStraightWeightKg)} kg）`, result.middleStraightCost],
      ["A/B端配件", result.endFittingCost],
      ["变径中接配件", result.middleFittingCost],
      ["A/B端加工（表格取值）", `已计入合计：${money(result.endProcessCost)}`],
      ["中接加工（表格取值）", `已计入合计：${money(result.middleProcessCost)}`],
      [`弯头加工合计（角度x${formatFactor(result.angleFactor)} / 系数x${formatFactor(config.processFactor)} / 难度x${formatFactor(result.difficultyFactor)}）`, result.processCost],
      ["弯头本体理论重量", `${formatNumber(result.elbowBodyWeightKg)} kg`],
      ["A/B及中间配件理论重量", `${formatNumber(result.accessoryTheoreticalWeightKg)} kg`],
      ["弯头理论重量合计", `${formatNumber(result.fittingTheoreticalWeightKg)} kg`],
      ["法兰不退火重量", `${formatNumber(result.heatTreatmentExcludedWeightKg)} kg`],
      [`退火（${formatNumber(result.annealingWeightKg)} kg）`, result.annealingCost],
      [managementLabel(result, helpers), result.managementCost],
      [`包材（${formatNumber(result.annealingWeightKg)} kg）`, result.packagingCost],
      ...totalRows(result, pricing, helpers)
    ];
  }

  return { dockingRows, elbowRows, manifoldRows, managementLabel, teeRows, totalRows };
});
