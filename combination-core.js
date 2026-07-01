(function exposeCombinationCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.CombinationCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createCombinationCore() {
  const TYPES = ["直管", "45°弯头", "90°弯头", "三通"];
  const BRANCH_TYPES = ["直管", "45°弯头", "90°弯头"];

  function positive(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function normalizeBranchComponent(item = {}, index = 0, fallbackDiameter = 40, fallbackThickness = 1.5) {
    const type = BRANCH_TYPES.includes(item.type) ? item.type : "直管";
    return {
      id: item.id || `branch-component-${index + 1}`,
      type,
      diameter: positive(item.diameter, fallbackDiameter),
      thickness: positive(item.thickness, fallbackThickness),
      length: positive(item.length, type === "直管" ? 100 : 60),
      direction: item.direction === "右" ? "右" : "左"
    };
  }

  function normalizeBranchComponents(items, fallbackDiameter, fallbackThickness) {
    if (!Array.isArray(items)) return [];
    return items.map((item, index) => normalizeBranchComponent(item, index, fallbackDiameter, fallbackThickness));
  }

  function normalizeComponent(item = {}, index = 0) {
    const type = TYPES.includes(item.type) ? item.type : "直管";
    const fallbackLength = type === "直管" ? 100 : type === "三通" ? 80 : 60;
    const diameter = positive(item.diameter, 40);
    const thickness = positive(item.thickness, 1.5);
    const branchDiameter = positive(item.branchDiameter, diameter);
    const branchThickness = positive(item.branchThickness, thickness);
    const branchFittingDiameter = positive(item.branchFittingDiameter, branchDiameter);
    const branchComponents = normalizeBranchComponents(item.branchComponents, branchDiameter, branchThickness);
    const branchOutletDiameter = branchComponents[branchComponents.length - 1]?.diameter || branchDiameter;
    const requestedBranchMiddle = ["无", "直管", "中接"].includes(item.branchMiddle) ? item.branchMiddle : "无";
    return {
      id: item.id || `component-${index + 1}`,
      type,
      diameter,
      thickness,
      length: positive(item.length, fallbackLength),
      branchLength: positive(item.branchLength, 60),
      branchDiameter,
      branchThickness,
      branchComponents,
      branchFittingDiameter,
      branchFitting: String(item.branchFitting || "外丝"),
      branchMiddle: branchFittingDiameter !== branchOutletDiameter && requestedBranchMiddle === "无" ? "中接" : requestedBranchMiddle,
      branchMiddleLength: positive(item.branchMiddleLength, 50),
      direction: item.direction === "右" ? "右" : "左"
    };
  }

  function normalizeComponents(items) {
    const source = Array.isArray(items) && items.length ? items : [
      { type: "直管", length: 120 },
      { type: "90°弯头", direction: "左", length: 60 },
      { type: "直管", length: 140 },
      { type: "90°弯头", direction: "右", length: 60 },
      { type: "直管", length: 100 }
    ];
    return source.map(normalizeComponent);
  }

  function rotate(vector, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x: vector.x * cos - vector.y * sin, y: vector.x * sin + vector.y * cos };
  }

  function geometry(items) {
    const components = normalizeComponents(items);
    let point = { x: 0, y: 0 };
    let heading = 0;
    const segments = [];
    const branches = [];
    const branchEnds = [];
    const labels = [];
    const allPoints = [{ ...point }];

    components.forEach((component, index) => {
      const start = { ...point };
      if (component.type === "直管" || component.type === "三通") {
        const end = {
          x: point.x + Math.cos(heading) * component.length,
          y: point.y + Math.sin(heading) * component.length
        };
        segments.push({ component, points: [start, end] });
        if (component.type === "三通") {
          const middle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
          const side = component.direction === "右" ? 1 : -1;
          let branchHeading = heading + side * Math.PI / 2;
          const branchBodyEnd = {
            x: middle.x + Math.cos(branchHeading) * component.branchLength,
            y: middle.y + Math.sin(branchHeading) * component.branchLength
          };
          const directBranchFitting = !component.branchComponents.length && component.branchMiddle === "无";
          const branchSeatEnd = directBranchFitting
            ? {
              x: middle.x + Math.cos(branchHeading) * component.diameter * 0.21,
              y: middle.y + Math.sin(branchHeading) * component.diameter * 0.21
            }
            : branchBodyEnd;
          if (!directBranchFitting) {
            branches.push({ component, diameter: component.branchDiameter, points: [middle, branchBodyEnd], role: "body" });
          }
          let branchEnd = branchSeatEnd;
          component.branchComponents.forEach((branchComponent, branchIndex) => {
            const chainStart = { ...branchEnd };
            if (branchComponent.type === "直管") {
              branchEnd = {
                x: chainStart.x + Math.cos(branchHeading) * branchComponent.length,
                y: chainStart.y + Math.sin(branchHeading) * branchComponent.length
              };
              branches.push({ component, branchComponent, branchIndex, diameter: branchComponent.diameter, points: [chainStart, branchEnd], role: "chain" });
            } else {
              const angle = branchComponent.type === "45°弯头" ? Math.PI / 4 : Math.PI / 2;
              const branchSide = branchComponent.direction === "右" ? 1 : -1;
              const radius = branchComponent.length;
              const normal = { x: -Math.sin(branchHeading), y: Math.cos(branchHeading) };
              const center = { x: chainStart.x + normal.x * radius * branchSide, y: chainStart.y + normal.y * radius * branchSide };
              const startVector = { x: chainStart.x - center.x, y: chainStart.y - center.y };
              const samples = Math.max(5, Math.round(angle / (Math.PI / 18)));
              const points = Array.from({ length: samples + 1 }, (_, sampleIndex) => {
                const vector = rotate(startVector, branchSide * angle * sampleIndex / samples);
                return { x: center.x + vector.x, y: center.y + vector.y };
              });
              branches.push({ component, branchComponent, branchIndex, diameter: branchComponent.diameter, points, role: "chain" });
              branchEnd = points[points.length - 1];
              branchHeading += branchSide * angle;
            }
            allPoints.push({ ...branchEnd });
          });
          const branchOutletDiameter = component.branchComponents[component.branchComponents.length - 1]?.diameter || component.branchDiameter;
          const middleStart = { ...branchEnd };
          if (component.branchMiddle === "直管") {
            branchEnd = {
              x: middleStart.x + Math.cos(branchHeading) * component.branchMiddleLength,
              y: middleStart.y + Math.sin(branchHeading) * component.branchMiddleLength
            };
            branches.push({ component, diameter: branchOutletDiameter, points: [middleStart, branchEnd], role: "straight" });
          } else if (component.branchMiddle === "中接") {
            branchEnd = {
              x: middleStart.x + Math.cos(branchHeading) * 20,
              y: middleStart.y + Math.sin(branchHeading) * 20
            };
            branches.push({ component, diameter: Math.max(branchOutletDiameter, component.branchFittingDiameter), points: [middleStart, branchEnd], role: "adapter" });
          }
          branchEnds.push({ component, point: branchEnd, heading: branchHeading });
          allPoints.push(branchEnd);
        }
        point = end;
      } else {
        const angle = component.type === "45°弯头" ? Math.PI / 4 : Math.PI / 2;
        const side = component.direction === "右" ? 1 : -1;
        const radius = component.length;
        const normal = { x: -Math.sin(heading), y: Math.cos(heading) };
        const center = { x: point.x + normal.x * radius * side, y: point.y + normal.y * radius * side };
        const startVector = { x: point.x - center.x, y: point.y - center.y };
        const samples = Math.max(5, Math.round(angle / (Math.PI / 18)));
        const points = Array.from({ length: samples + 1 }, (_, sampleIndex) => {
          const vector = rotate(startVector, side * angle * sampleIndex / samples);
          return { x: center.x + vector.x, y: center.y + vector.y };
        });
        segments.push({ component, points });
        point = points[points.length - 1];
        heading += side * angle;
      }
      allPoints.push({ ...point });
      labels.push({
        index: index + 1,
        text: component.type,
        point: { x: (start.x + point.x) / 2, y: (start.y + point.y) / 2 },
        component
      });
    });

    const xs = allPoints.map(item => item.x);
    const ys = allPoints.map(item => item.y);
    return {
      components, segments, branches, branchEnds, labels,
      start: { x: 0, y: 0 },
      end: { ...point },
      endHeading: heading,
      bounds: { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) }
    };
  }

  function calculate(config, pricing, helpers) {
    const components = normalizeComponents(config.components);
    const combinationPricing = {
      teeBodyBaseProcess: 6.82,
      branchChainProcessPerSegment: 1,
      managementProcessFactor: 2.14,
      ...(pricing.combination || {})
    };
    let tubeWeight = 0;
    let tubeCost = 0;
    let componentCost = 0;
    let componentWeight = 0;
    let processCost = 0;
    const bomRows = [];
    const heatTreatmentWeight = helpers.heatTreatmentFittingWeightKg || helpers.fittingTheoreticalWeightKg;

    components.forEach((component, index) => {
      if (component.type === "直管" || component.type === "三通") {
        let weight = helpers.tubeWeightKg(component.length, component.diameter, component.thickness, config.material, false);
        if (component.type === "三通") {
          weight += helpers.tubeWeightKg(component.branchLength, component.branchDiameter, component.branchThickness, config.material, false);
          component.branchComponents.forEach((branchComponent, branchIndex) => {
            if (branchComponent.type === "直管") {
              const branchTubeWeight = helpers.tubeWeightKg(branchComponent.length, branchComponent.diameter, branchComponent.thickness, config.material, false);
              weight += branchTubeWeight;
              bomRows.push({ name: `${index + 1}.${branchIndex + 1} 支路直管 D${branchComponent.diameter}x${branchComponent.thickness} L${Math.ceil(branchComponent.length)}`, quantity: 1 });
            } else {
              const branchElbowName = branchComponent.type === "45°弯头" ? "45弯头" : "90弯头";
              componentCost += helpers.fittingCost(branchElbowName, branchComponent.diameter, config.material, config.tubeSeries);
              componentWeight += helpers.fittingTheoreticalWeightKg(branchElbowName, branchComponent.diameter, config.material, config.steelTonPrice, config.tubeSeries);
              bomRows.push({ name: `${index + 1}.${branchIndex + 1} 支路${branchComponent.type} D${branchComponent.diameter}`, quantity: 1 });
            }
          });
          const branchOutlet = component.branchComponents[component.branchComponents.length - 1];
          const branchOutletDiameter = branchOutlet?.diameter || component.branchDiameter;
          const branchOutletThickness = branchOutlet?.thickness || component.branchThickness;
          if (component.branchMiddle === "直管") {
            weight += helpers.tubeWeightKg(component.branchMiddleLength, branchOutletDiameter, branchOutletThickness, config.material, false);
          }
        }
        const cost = helpers.tubeMaterialCost(weight, config.steelTonPrice);
        tubeWeight += weight;
        tubeCost += cost;
        if (component.type === "三通") {
          const branchOutletDiameter = component.branchComponents[component.branchComponents.length - 1]?.diameter || component.branchDiameter;
          const branchOutletThickness = component.branchComponents[component.branchComponents.length - 1]?.thickness || component.branchThickness;
          processCost += Number(combinationPricing.teeBodyBaseProcess) || 0;
          processCost += component.branchComponents.length * (Number(combinationPricing.branchChainProcessPerSegment) || 0);
          const branchFittingCost = helpers.fittingCost(component.branchFitting, component.branchFittingDiameter, config.material, config.tubeSeries);
          const branchFittingWeight = heatTreatmentWeight(component.branchFitting, component.branchFittingDiameter, config.material, config.steelTonPrice, config.tubeSeries);
          componentCost += branchFittingCost;
          componentWeight += branchFittingWeight;
          processCost += helpers.teeProcessCost(component.branchFitting, component.branchFittingDiameter);
          if (component.branchMiddle === "中接") {
            const adapterDiameter = Math.max(branchOutletDiameter, component.branchFittingDiameter);
            componentCost += helpers.fittingCost("中接", adapterDiameter, config.material, config.tubeSeries);
            componentWeight += heatTreatmentWeight("中接", adapterDiameter, config.material, config.steelTonPrice, config.tubeSeries);
            processCost += helpers.teeProcessCost("中接", adapterDiameter);
          }
          bomRows.push({ name: `${index + 1}. 三通体 D${component.diameter}x${component.thickness} / 支口D${component.branchDiameter}x${component.branchThickness}`, quantity: 1 });
          if (component.branchMiddle === "直管") bomRows.push({ name: `${index + 1}. 支口末段直管 D${branchOutletDiameter}x${branchOutletThickness} L${Math.ceil(component.branchMiddleLength)}`, quantity: 1 });
          if (component.branchMiddle === "中接") bomRows.push({ name: `${index + 1}. 支口中接 D${branchOutletDiameter}-D${component.branchFittingDiameter}`, quantity: 1 });
          if (!helpers.isNoFitting(component.branchFitting)) bomRows.push({ name: `${index + 1}. 支口${component.branchFitting} D${component.branchFittingDiameter}`, quantity: 1 });
        } else {
          bomRows.push({ name: `${index + 1}. 直管 D${component.diameter}x${component.thickness} L${Math.ceil(component.length)}`, quantity: 1 });
        }
      } else {
        const fittingName = component.type === "45°弯头" ? "45弯头" : "90弯头";
        componentCost += helpers.fittingCost(fittingName, component.diameter, config.material, config.tubeSeries);
        componentWeight += helpers.fittingTheoreticalWeightKg(fittingName, component.diameter, config.material, config.steelTonPrice, config.tubeSeries);
        bomRows.push({ name: `${index + 1}. ${component.type} D${component.diameter}`, quantity: 1 });
      }
    });

    const firstDiameter = components[0]?.diameter || 40;
    const lastDiameter = components[components.length - 1]?.diameter || firstDiameter;
    const endFittingCost = helpers.fittingCost(config.fittingA, firstDiameter, config.material, config.tubeSeries)
      + helpers.fittingCost(config.fittingB, lastDiameter, config.material, config.tubeSeries);
    const endFittingWeight = heatTreatmentWeight(config.fittingA, firstDiameter, config.material, config.steelTonPrice, config.tubeSeries)
      + heatTreatmentWeight(config.fittingB, lastDiameter, config.material, config.steelTonPrice, config.tubeSeries);
    if (!helpers.isNoFitting(config.fittingA)) bomRows.unshift({ name: `A端 ${config.fittingA} D${firstDiameter}`, quantity: 1 });
    if (!helpers.isNoFitting(config.fittingB)) bomRows.push({ name: `B端 ${config.fittingB} D${lastDiameter}`, quantity: 1 });

    const endpointProcessCost = helpers.dockingProcessCost
      ? helpers.dockingProcessCost(config.fittingA, firstDiameter) + helpers.dockingProcessCost(config.fittingB, lastDiameter)
      : 0;
    const mainDiameterOf = component => Number(component?.diameter) || 0;
    const jointRows = components.slice(0, -1).map((component, index) => {
      const nextComponent = components[index + 1];
      const diameter = Math.max(mainDiameterOf(component), mainDiameterOf(nextComponent));
      const cost = helpers.elbowProcessCost
        ? helpers.elbowProcessCost("对焊", diameter)
        : 0;
      return { index: index + 1, diameter, cost };
    });
    const pricedJointRows = jointRows.map(item => {
      const fallbackCost = helpers.elbowProcessCost ? helpers.elbowProcessCost("对焊", item.diameter) : 0;
      return { ...item, cost: Math.max(item.cost, fallbackCost) };
    });
    const jointCount = pricedJointRows.length;
    const assemblyCost = pricedJointRows.reduce((sum, item) => sum + item.cost, 0);
    processCost += endpointProcessCost + assemblyCost;
    const annealingWeight = tubeWeight + componentWeight + endFittingWeight;
    const annealingCost = annealingWeight * pricing.annealingPerKg;
    const packagingCost = annealingWeight * pricing.packagingPerKg;
    const managementCost = processCost * (Number(combinationPricing.managementProcessFactor) || 0);
    const surfaceTreatmentCost = tubeWeight * (pricing.surfaceTreatmentPerKg[config.surfaceTreatment] || 0);
    const fittingCost = componentCost + endFittingCost;
    const subtotal = tubeCost + fittingCost + processCost + annealingCost + packagingCost + managementCost + surfaceTreatmentCost;
    const totals = helpers.finalizeCost(subtotal, config);
    return {
      totalTubeWeightKg: annealingWeight,
      tubeWeightKg: tubeWeight,
      tubeCost,
      componentCost,
      endFittingCost,
      fittingCost,
      processCost,
      endpointProcessCost,
      assemblyCost,
      jointRows: pricedJointRows,
      annealingCost,
      packagingCost,
      managementCost,
      surfaceTreatmentCost,
      subtotal,
      bomRows,
      geometry: geometry(components),
      difficultyFactor: 1,
      manualDifficultyFactor: null,
      ...totals,
      costRows: [
        ["组合管材", `${components.filter(item => item.type === "直管" || item.type === "三通").length} 段 / ${tubeWeight.toFixed(2)} kg`, tubeCost],
        ["弯头及各端配件", "含三通支口配件；按含税表价去税并乘材质系数", fittingCost],
        ["组合加工", `${jointCount} 个焊接点按弯头类加工费表“对焊”行 + 三通体/支路组合加工`, processCost],
        ["退火", `${annealingWeight.toFixed(2)} kg`, annealingCost],
        ["制造管理", `组合加工费 x ${combinationPricing.managementProcessFactor}`, managementCost],
        ["包材", `${annealingWeight.toFixed(2)} kg`, packagingCost],
        ["表面处理", config.surfaceTreatment, surfaceTreatmentCost],
        ["成本小计（不含税）", "组合件试算", subtotal],
        ["含税成本", "按当前税额系数", totals.factoryCost]
      ]
    };
  }

  return {
    BRANCH_TYPES, TYPES, calculate, geometry, normalizeBranchComponent,
    normalizeBranchComponents, normalizeComponent, normalizeComponents
  };
});
