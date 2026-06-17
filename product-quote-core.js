(function exposeProductQuoteCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.ProductQuoteCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createProductQuoteCore() {
  function calculateDocking(config, pricing, helpers) {
    const {
      dockingProcessCost,
      finalizeCost,
      fittingCost,
      fittingTheoreticalWeightKg,
      heatTreatmentFittingWeightKg,
      tubeMaterialCost,
      tubeWeightKg
    } = helpers;

    const straightItems = config.middleItems.filter(item => item.type === "直管");
    const adapterItems = config.middleItems.filter(item => item.type === "中接");
    const directTubeWeight = straightItems.reduce(
      (sum, item) => sum + tubeWeightKg(item.length, config.diameter, config.thickness, config.material, false),
      0
    );
    const directTubeCost = tubeMaterialCost(directTubeWeight, config.steelTonPrice);
    const endFittingCost = fittingCost(config.fittingA, config.diameterA, config.material, config.tubeSeries)
      + fittingCost(config.fittingB, config.diameterB, config.material, config.tubeSeries);
    const middleFittingCost = adapterItems.reduce(
      (sum, item) => sum + fittingCost(item.fitting, config.diameter, config.material, config.tubeSeries),
      0
    );
    const endFittingWeight = fittingTheoreticalWeightKg(config.fittingA, config.diameterA, config.material, config.steelTonPrice, config.tubeSeries)
      + fittingTheoreticalWeightKg(config.fittingB, config.diameterB, config.material, config.steelTonPrice, config.tubeSeries);
    const middleFittingWeight = adapterItems.reduce(
      (sum, item) => sum + fittingTheoreticalWeightKg(item.fitting, config.diameter, config.material, config.steelTonPrice, config.tubeSeries),
      0
    );
    const endHeatTreatmentFittingWeight = heatTreatmentFittingWeightKg(config.fittingA, config.diameterA, config.material, config.steelTonPrice, config.tubeSeries)
      + heatTreatmentFittingWeightKg(config.fittingB, config.diameterB, config.material, config.steelTonPrice, config.tubeSeries);
    const middleHeatTreatmentFittingWeight = adapterItems.reduce(
      (sum, item) => sum + heatTreatmentFittingWeightKg(item.fitting, config.diameter, config.material, config.steelTonPrice, config.tubeSeries),
      0
    );
    const fittingTheoreticalWeight = endFittingWeight + middleFittingWeight;
    const heatTreatmentExcludedWeight = Math.max(0, fittingTheoreticalWeight - endHeatTreatmentFittingWeight - middleHeatTreatmentFittingWeight);
    const annealingWeight = directTubeWeight + endHeatTreatmentFittingWeight + middleHeatTreatmentFittingWeight;
    const endProcessCost = dockingProcessCost(config.fittingA, config.diameterA)
      + dockingProcessCost(config.fittingB, config.diameterB);
    const middleProcessCost = adapterItems.reduce(
      (sum, item) => sum + dockingProcessCost(item.fitting, config.diameter),
      0
    );
    const hasAdapter = adapterItems.length > 0;
    const autoDifficultyFactor = Number((
      1
      + ((config.diameterA !== config.diameterB || config.thicknessA !== config.thicknessB) ? 0.08 : 0)
      + (hasAdapter ? 0.05 : 0)
      + Math.max(0, config.middleItems.length - 1) * 0.02
    ).toFixed(2));
    const manualDifficultyFactor = config.difficultyFactorInput === "" ? null : Math.max(0, Number(config.difficultyFactorInput) || 0);
    const difficultyFactor = manualDifficultyFactor ?? autoDifficultyFactor;
    const processCost = (endProcessCost + middleProcessCost) * config.processFactor * difficultyFactor;
    const annealingCost = annealingWeight * pricing.annealingPerKg;
    const hasFlange = [config.fittingA, config.fittingB].includes("法兰");
    const managementCost = hasFlange ? annealingWeight * pricing.managementPerKg : processCost * 2.14;
    const packagingCost = annealingWeight * pricing.packagingPerKg;
    const surfaceTreatmentCost = directTubeWeight * (pricing.surfaceTreatmentPerKg[config.surfaceTreatment] || 0);
    const subtotal = directTubeCost + endFittingCost + middleFittingCost + processCost + annealingCost + managementCost + packagingCost + surfaceTreatmentCost;
    const totals = finalizeCost(subtotal, config);

    return {
      totalTubeWeightKg: annealingWeight,
      productTubeWeightKg: directTubeWeight,
      fittingTheoreticalWeightKg: fittingTheoreticalWeight,
      heatTreatmentExcludedWeightKg: heatTreatmentExcludedWeight,
      annealingWeightKg: annealingWeight,
      productTubeCost: directTubeCost,
      fittingCost: endFittingCost + middleFittingCost,
      endFittingCost,
      middleFittingCost,
      processMultiplier: config.processFactor,
      difficultyFactor,
      autoDifficultyFactor,
      manualDifficultyFactor,
      processCost,
      endProcessCost,
      middleProcessCost,
      annealingCost,
      managementCost,
      packagingCost,
      surfaceTreatmentCost,
      subtotal,
      hasFlange,
      ...totals
    };
  }

  function calculateTee(config, pricing, helpers) {
    const {
      finalizeCost,
      fittingCost,
      fittingTheoreticalWeightKg,
      heatTreatmentFittingWeightKg,
      teeProcessCost,
      tubeMaterialCost,
      tubeWeightKg
    } = helpers;

    const bodyDiameter = config.bodyDiameter || config.diameter;
    const bodyThickness = config.bodyThickness || config.thickness;
    const bodyLength = Math.max(0, Number(config.bodyLength || config.length) || 0);
    const bodyTubeWeight = tubeWeightKg(bodyLength, bodyDiameter, bodyThickness, config.material, false);
    const branchStraightLength = config.middleB === "直管" ? Math.max(0, Number(config.middleLengthB) || 0) : 0;
    const branchStraightWeight = config.middleB === "直管"
      ? tubeWeightKg(branchStraightLength, config.diameterB, config.thicknessB, config.material, false)
      : 0;
    const directTubeWeight = bodyTubeWeight + branchStraightWeight;
    const directTubeCost = tubeMaterialCost(directTubeWeight, config.steelTonPrice);
    const endFittings = [
      { name: config.fittingA, diameter: config.diameterA },
      { name: config.fittingB, diameter: config.diameterB },
      { name: config.fittingC, diameter: config.diameterC }
    ];
    const middleFittings = [
      { name: config.middleA === "中接" ? "中接" : "无", diameter: Math.max(bodyDiameter, config.diameterA) },
      { name: config.middleC === "中接" ? "中接" : "无", diameter: Math.max(bodyDiameter, config.diameterC) }
    ];
    const endFittingCost = endFittings.reduce((sum, item) => sum + fittingCost(item.name, item.diameter, config.material, config.tubeSeries), 0);
    const middleFittingCost = middleFittings.reduce((sum, item) => sum + fittingCost(item.name, item.diameter, config.material, config.tubeSeries), 0);
    const endFittingWeight = endFittings.reduce((sum, item) => sum + fittingTheoreticalWeightKg(item.name, item.diameter, config.material, config.steelTonPrice, config.tubeSeries), 0);
    const middleFittingWeight = middleFittings.reduce((sum, item) => sum + fittingTheoreticalWeightKg(item.name, item.diameter, config.material, config.steelTonPrice, config.tubeSeries), 0);
    const endHeatTreatmentFittingWeight = endFittings.reduce((sum, item) => sum + heatTreatmentFittingWeightKg(item.name, item.diameter, config.material, config.steelTonPrice, config.tubeSeries), 0);
    const middleHeatTreatmentFittingWeight = middleFittings.reduce((sum, item) => sum + heatTreatmentFittingWeightKg(item.name, item.diameter, config.material, config.steelTonPrice, config.tubeSeries), 0);
    const fittingTheoreticalWeight = endFittingWeight + middleFittingWeight;
    const heatTreatmentExcludedWeight = Math.max(0, fittingTheoreticalWeight - endHeatTreatmentFittingWeight - middleHeatTreatmentFittingWeight);
    const annealingWeight = directTubeWeight + endHeatTreatmentFittingWeight + middleHeatTreatmentFittingWeight;
    const endProcessCost = endFittings.reduce((sum, item) => sum + teeProcessCost(item.name, item.diameter), 0);
    const middleProcessCost = middleFittings.reduce((sum, item) => sum + teeProcessCost(item.name, item.diameter), 0);
    const middleCount = [config.middleA, config.middleB, config.middleC].filter(value => value && value !== "无").length;
    const hasAdapter = config.middleA === "中接" || config.middleC === "中接";
    const autoDifficultyFactor = Number((1.12 + (hasAdapter ? 0.05 : 0) + Math.max(0, middleCount - 1) * 0.02).toFixed(2));
    const manualDifficultyFactor = config.difficultyFactorInput === "" ? null : Math.max(0, Number(config.difficultyFactorInput) || 0);
    const difficultyFactor = manualDifficultyFactor ?? autoDifficultyFactor;
    const processCost = (endProcessCost + middleProcessCost) * config.processFactor * difficultyFactor;
    const annealingCost = annealingWeight * pricing.annealingPerKg;
    const hasFlange = [...endFittings, ...middleFittings].some(item => item.name === "法兰");
    const managementCost = hasFlange ? annealingWeight * pricing.managementPerKg : processCost * 2.14;
    const packagingCost = annealingWeight * pricing.packagingPerKg;
    const surfaceTreatmentCost = directTubeWeight * (pricing.surfaceTreatmentPerKg[config.surfaceTreatment] || 0);
    const subtotal = directTubeCost + endFittingCost + middleFittingCost + processCost + annealingCost + managementCost + packagingCost + surfaceTreatmentCost;
    const totals = finalizeCost(subtotal, config);

    return {
      totalTubeWeightKg: annealingWeight,
      productTubeWeightKg: directTubeWeight,
      fittingTheoreticalWeightKg: fittingTheoreticalWeight,
      heatTreatmentExcludedWeightKg: heatTreatmentExcludedWeight,
      annealingWeightKg: annealingWeight,
      productTubeCost: directTubeCost,
      fittingCost: endFittingCost + middleFittingCost,
      endFittingCost,
      middleFittingCost,
      processMultiplier: config.processFactor,
      difficultyFactor,
      autoDifficultyFactor,
      manualDifficultyFactor,
      processCost,
      endProcessCost,
      middleProcessCost,
      annealingCost,
      managementCost,
      packagingCost,
      surfaceTreatmentCost,
      subtotal,
      hasFlange,
      ...totals
    };
  }

  function calculateElbow(config, pricing, helpers) {
    const {
      elbowProcessCost,
      finalizeCost,
      fittingCost,
      fittingTheoreticalWeightKg,
      heatTreatmentFittingWeightKg,
      tubeMaterialCost,
      tubeWeightKg
    } = helpers;

    const bodyDiameter = config.bodyDiameter || config.diameter;
    const bodyThickness = config.bodyThickness || config.thickness;
    const elbowMaterialLength = config.length * 2.5;
    const directTubeWeight = tubeWeightKg(elbowMaterialLength, bodyDiameter, bodyThickness, config.material, false);
    const elbowBodyName = Number(config.angle) === 45 ? "45弯头" : "90弯头";
    const elbowBodyCost = fittingCost(elbowBodyName, bodyDiameter, config.material, config.tubeSeries);
    const middleAStraightLength = config.middleA === "直管" ? Math.max(0, Number(config.middleLengthA) || 0) : 0;
    const middleBStraightLength = config.middleB === "直管" ? Math.max(0, Number(config.middleLengthB) || 0) : 0;
    const middleStraightWeight = tubeWeightKg(middleAStraightLength, config.diameterA, config.thicknessA, config.material, false)
      + tubeWeightKg(middleBStraightLength, config.diameterB, config.thicknessB, config.material, false);
    const middleStraightCost = tubeMaterialCost(middleStraightWeight, config.steelTonPrice);
    const endFittings = [
      { name: config.fittingA, diameter: config.diameterA },
      { name: config.fittingB, diameter: config.diameterB }
    ];
    const middleFittings = [
      { name: config.middleA === "中接" ? "中接" : "无", diameter: Math.max(bodyDiameter, config.diameterA) },
      { name: config.middleB === "中接" ? "中接" : "无", diameter: Math.max(bodyDiameter, config.diameterB) }
    ];
    const endFittingCost = endFittings.reduce((sum, item) => sum + fittingCost(item.name, item.diameter, config.material, config.tubeSeries), 0);
    const middleFittingCost = middleFittings.reduce((sum, item) => sum + fittingCost(item.name, item.diameter, config.material, config.tubeSeries), 0);
    const elbowBodyWeight = fittingTheoreticalWeightKg(elbowBodyName, bodyDiameter, config.material, config.steelTonPrice, config.tubeSeries);
    const endFittingWeight = endFittings.reduce((sum, item) => sum + fittingTheoreticalWeightKg(item.name, item.diameter, config.material, config.steelTonPrice, config.tubeSeries), 0);
    const middleFittingWeight = middleFittings.reduce((sum, item) => sum + fittingTheoreticalWeightKg(item.name, item.diameter, config.material, config.steelTonPrice, config.tubeSeries), 0);
    const endHeatTreatmentFittingWeight = endFittings.reduce((sum, item) => sum + heatTreatmentFittingWeightKg(item.name, item.diameter, config.material, config.steelTonPrice, config.tubeSeries), 0);
    const middleHeatTreatmentFittingWeight = middleFittings.reduce((sum, item) => sum + heatTreatmentFittingWeightKg(item.name, item.diameter, config.material, config.steelTonPrice, config.tubeSeries), 0);
    const accessoryTheoreticalWeight = endFittingWeight + middleFittingWeight;
    const fittingTheoreticalWeight = elbowBodyWeight + accessoryTheoreticalWeight;
    const heatTreatmentExcludedWeight = Math.max(0, accessoryTheoreticalWeight - endHeatTreatmentFittingWeight - middleHeatTreatmentFittingWeight);
    const annealingWeight = elbowBodyWeight + middleStraightWeight + endHeatTreatmentFittingWeight + middleHeatTreatmentFittingWeight;
    const endProcessCost = endFittings.reduce((sum, item) => sum + elbowProcessCost(item.name, item.diameter), 0);
    const middleProcessCost = middleFittings.reduce((sum, item) => sum + elbowProcessCost(item.name, item.diameter), 0);
    const angleFactor = Number(config.angle) === 45 ? 0.8 : 1;
    const hasAdapter = middleFittings.some(item => item.name === "中接");
    const autoDifficultyFactor = Number((1.08 + (hasAdapter ? 0.05 : 0)).toFixed(2));
    const manualDifficultyFactor = config.difficultyFactorInput === "" ? null : Math.max(0, Number(config.difficultyFactorInput) || 0);
    const difficultyFactor = manualDifficultyFactor ?? autoDifficultyFactor;
    const processCost = (endProcessCost + middleProcessCost) * config.processFactor * angleFactor * difficultyFactor;
    const annealingCost = annealingWeight * pricing.annealingPerKg;
    const hasFlange = [...endFittings, ...middleFittings].some(item => item.name === "法兰");
    const managementCost = hasFlange ? annealingWeight * pricing.managementPerKg : processCost * 2.14;
    const packagingCost = annealingWeight * pricing.packagingPerKg;
    const surfaceTreatmentCost = (directTubeWeight + middleStraightWeight) * (pricing.surfaceTreatmentPerKg[config.surfaceTreatment] || 0);
    const subtotal = elbowBodyCost + middleStraightCost + endFittingCost + middleFittingCost + processCost + annealingCost + managementCost + packagingCost + surfaceTreatmentCost;
    const totals = finalizeCost(subtotal, config);

    return {
      totalTubeWeightKg: annealingWeight,
      productTubeWeightKg: directTubeWeight + middleStraightWeight,
      fittingTheoreticalWeightKg: fittingTheoreticalWeight,
      accessoryTheoreticalWeightKg: accessoryTheoreticalWeight,
      heatTreatmentExcludedWeightKg: heatTreatmentExcludedWeight,
      elbowBodyWeightKg: elbowBodyWeight,
      elbowBodyName,
      angleFactor,
      annealingWeightKg: annealingWeight,
      productTubeCost: elbowBodyCost,
      middleStraightWeightKg: middleStraightWeight,
      middleStraightCost,
      fittingCost: endFittingCost + middleFittingCost,
      endFittingCost,
      middleFittingCost,
      processMultiplier: config.processFactor,
      difficultyFactor,
      autoDifficultyFactor,
      manualDifficultyFactor,
      processCost,
      endProcessCost,
      middleProcessCost,
      annealingCost,
      managementCost,
      packagingCost,
      surfaceTreatmentCost,
      subtotal,
      hasFlange,
      ...totals
    };
  }

  function calculateManifold(config, pricing, helpers) {
    const {
      branchLayout,
      finalizeCost,
      fittingCost,
      tubeMaterialCost,
      tubeWeightKg,
      weightWallThickness
    } = helpers;

    const inletAllowance = config.inletAllowance;
    const tailAllowance = config.tailAllowance;
    const layout = branchLayout(config);
    const mainLength = layout.span + inletAllowance + tailAllowance;
    const actualWall = weightWallThickness(config.wallThickness, config.mainPositiveTolerance);
    const mainTubeWeightKg = tubeWeightKg(mainLength, config.mainDiameter, config.wallThickness, config.material, config.mainPositiveTolerance);
    const mainTubeCost = tubeMaterialCost(mainTubeWeightKg, config.steelTonPrice);
    const branchTubeWeightKg = config.branches.reduce(
      (sum, branch) => sum + tubeWeightKg(branch.height, branch.diameter, branch.thickness, config.material, branch.positiveTolerance),
      0
    );
    const totalTubeWeightKg = mainTubeWeightKg + branchTubeWeightKg;
    const branchTubeCost = tubeMaterialCost(branchTubeWeightKg, config.steelTonPrice);
    const mainFittingCost = fittingCost(config.mainFitting, config.mainDiameter, config.material, config.tubeSeries)
      + fittingCost(config.tailFitting, config.mainDiameter, config.material, config.tubeSeries);
    const branchFittingCost = config.branches.reduce(
      (sum, branch) => sum + fittingCost(branch.fitting, branch.diameter, config.material, config.tubeSeries),
      0
    );
    const processMultiplier = config.mainDiameter > 50.8 ? 3 : 1;
    const baseProcessCost = pricing.processBaseForTwoBranches
      + Math.max(0, config.branchCount - 2) * pricing.processPerExtraBranch
      + config.branches.filter(branch => branch.height > 0).length * pricing.heightProcessPerBranch;
    const largeDiameterHoleProcessCost = [133, 159, 219].includes(config.mainDiameter) ? config.branchCount * 15 : 0;
    const branchKinds = new Set(config.branches.map(branch => `${branch.diameter}/${branch.thickness}/${branch.fitting}/${branch.height}/${branch.positiveTolerance}`));
    let autoDifficultyFactor = 1;
    if (branchKinds.size > 1) autoDifficultyFactor += 0.05;
    if (config.manifoldType !== "单排") autoDifficultyFactor += 0.05;
    if (config.branches.some(branch => branch.height > 0)) autoDifficultyFactor += 0.03;
    autoDifficultyFactor = Number(autoDifficultyFactor.toFixed(2));
    const manualDifficultyFactor = config.difficultyFactorInput === "" ? null : Math.max(0, Number(config.difficultyFactorInput) || 0);
    const difficultyFactor = manualDifficultyFactor ?? autoDifficultyFactor;
    const processCost = (baseProcessCost * processMultiplier + largeDiameterHoleProcessCost) * difficultyFactor;
    const annealingCost = totalTubeWeightKg * pricing.annealingPerKg;
    const managementCost = totalTubeWeightKg * pricing.managementPerKg;
    const packagingCost = totalTubeWeightKg * pricing.packagingPerKg;
    const surfaceTreatmentCost = totalTubeWeightKg * (pricing.surfaceTreatmentPerKg[config.surfaceTreatment] || 0);
    const subtotal = mainTubeCost + branchTubeCost + mainFittingCost + branchFittingCost + processCost + annealingCost + managementCost + packagingCost + surfaceTreatmentCost;
    const totals = finalizeCost(subtotal, config);

    return {
      mainLength,
      actualWall,
      mainTubeWeightKg,
      branchTubeWeightKg,
      totalTubeWeightKg,
      mainTubeCost,
      branchTubeCost,
      mainFittingCost,
      branchFittingCost,
      fittingCost: mainFittingCost + branchFittingCost,
      processMultiplier,
      largeDiameterHoleProcessCost,
      difficultyFactor,
      autoDifficultyFactor,
      manualDifficultyFactor,
      processCost,
      annealingCost,
      managementCost,
      packagingCost,
      surfaceTreatmentCost,
      subtotal,
      inletAllowance,
      tailAllowance,
      ...totals
    };
  }

  return { calculateDocking, calculateElbow, calculateManifold, calculateTee };
});
