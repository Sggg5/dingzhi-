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
      ["表面处理", "按报价参数选择的表面处理方式计算", result.surfaceTreatmentCost],
      ["成本小计（不含税）", "材料、配件、加工、退火、管理、包材、表面处理合计", result.subtotal],
      [`税额（x${formatFactor(pricing.fittingTaxDivisor)}）`, "不含税成本统一乘含税系数后的税差", result.tax],
      ["含税成本", "成本小计（不含税）x 含税系数", result.factoryCost],
      ["68%成交价", "含税成本 / 0.68", result.discountedPrice],
      ["面价（17折基准）", "含税成本 / 0.68 / 0.17", result.facePrice]
    ];
  }

  function managementLabel(result, helpers) {
    const { formatNumber } = formatters(helpers);
    return result.hasFlange
      ? `制造管理（带法兰，按扣除法兰后的重量 ${formatNumber(result.annealingWeightKg)} kg）`
      : "制造管理（加工费 x 2.14）";
  }

  function fittingNote(detail, helpers) {
    const { formatFactor, money } = formatters(helpers);
    if (!detail) return "按配件价格表取值；若为316L，再乘316L配件系数；进入成本前去税";
    const aliasText = detail.lookupFittingName && detail.lookupFittingName !== detail.fittingName
      ? `临时按${detail.lookupFittingName}行取值`
      : "";
    return [
      aliasText,
      `表格取径 D${detail.priceDiameter}`,
      `含税表价 ${money(detail.taxIncludedPrice)}`,
      `去税 ÷ ${formatFactor(detail.taxDivisor)}`,
      `材质系数 x ${formatFactor(detail.materialFactor)}`,
      `计入成本 ${money(detail.cost)}`
    ].filter(Boolean).join("；");
  }

  function fittingDetailRows(items, config, helpers = {}) {
    const { fittingCost, fittingCostDetail, fittingLabel, isNoFitting } = helpers;
    return items
      .filter(item => item.fitting && !isNoFitting(item.fitting))
      .map(item => {
        const detail = typeof fittingCostDetail === "function"
          ? fittingCostDetail(item.fitting, item.diameter, config.material, config.tubeSeries)
          : null;
        const amount = detail ? detail.cost : fittingCost(item.fitting, item.diameter, config.material, config.tubeSeries);
        return [
          `${item.label} ${fittingLabel(item.fitting)} D${item.diameter}`,
          fittingNote(detail, helpers),
          amount,
          { detail: true }
        ];
      });
  }

  function processDetailRows(items, processType, helpers = {}) {
    const { processCostDetail, fittingLabel, isNoFitting } = helpers;
    const { money } = formatters(helpers);
    if (typeof processCostDetail !== "function") return [];
    return items
      .filter(item => item.fitting && !isNoFitting(item.fitting))
      .map(item => {
        const detail = processCostDetail(processType, item.fitting, item.diameter);
        const fallbackText = detail.fallbackUsed ? `；对焊暂无专用表值，暂按双卡 ${money(detail.fallbackCost)} 取值` : "";
        const aliasText = detail.lookupFittingName && detail.lookupFittingName !== item.fitting
          ? `；临时按${detail.lookupFittingName}加工费行取值`
          : "";
        return [
          `${item.label} ${fittingLabel(item.fitting)} D${item.diameter} 加工`,
          `加工费表格取径 D${detail.processDiameter}；表格取值 ${money(detail.processCost)}${aliasText}${fallbackText}；该项先汇总，再乘成型/难度系数`,
          detail.processCost,
          { detail: true }
        ];
      });
  }

  function manifoldProcessRows(config, result, pricing, helpers = {}) {
    const { formatFactor, formatNumber, money } = formatters(helpers);
    const extraBranches = Math.max(0, config.branchCount - 2);
    const heightBranches = config.branches.filter(branch => branch.height > 0).length;
    const baseCost = pricing.processBaseForTwoBranches;
    const extraCost = extraBranches * pricing.processPerExtraBranch;
    const heightCost = heightBranches * pricing.heightProcessPerBranch;
    const baseProcessCost = baseCost + extraCost + heightCost;
    const rows = [
      ["加工基础", `2口基础加工费 ${money(baseCost)}；1口产品也按2口基础加工费起算`, baseCost]
    ];
    if (extraBranches > 0) {
      rows.push(["增加支路加工", `${extraBranches}口 x ${money(pricing.processPerExtraBranch)}`, extraCost]);
    }
    if (heightBranches > 0) {
      rows.push(["加高支路加工", `${heightBranches}路 x ${money(pricing.heightProcessPerBranch)}`, heightCost]);
    }
    if (result.largeDiameterHoleProcessCost > 0) {
      rows.push(["大规格开孔加工", `${config.branchCount}孔 x ${money(15)}，适用于主管133/159/219`, result.largeDiameterHoleProcessCost]);
    }
    rows.push([
      "加工合计",
      `(基础 ${formatNumber(baseProcessCost)} x 规格系数 ${formatFactor(result.processMultiplier)} + 开孔 ${formatNumber(result.largeDiameterHoleProcessCost)}) x 难度 ${formatFactor(result.difficultyFactor)}`,
      result.processCost
    ]);
    return rows;
  }

  function nonNegative(value) {
    return Math.max(0, Number(value) || 0);
  }

  function manifoldRows(config, result, pricing, helpers = {}) {
    const { formatFactor, formatNumber } = formatters(helpers);
    const mainFittingDiameter = config.mainFittingDiameter || config.mainDiameter;
    const tailFittingDiameter = config.tailFittingDiameter || config.mainDiameter;
    const fittingDetails = fittingDetailRows([
      { label: "进水端", fitting: config.mainFitting, diameter: mainFittingDiameter },
      ...(config.mainAdapterEnabled ? [{ label: "进水端短中接", fitting: "中接", diameter: Math.max(config.mainDiameter, mainFittingDiameter) }] : []),
      { label: "末尾", fitting: config.tailFitting, diameter: tailFittingDiameter },
      ...(config.tailAdapterEnabled ? [{ label: "末尾端短中接", fitting: "中接", diameter: Math.max(config.mainDiameter, tailFittingDiameter) }] : []),
      ...config.branches.filter(branch => branch.fitting !== "无配件").map((branch, index) => ({
        label: `${index + 1}路`,
        fitting: branch.fitting,
        diameter: branch.diameter
      }))
    ], config, helpers);
    const holeText = result.largeDiameterHoleProcessCost > 0
      ? ` / 大规格开孔 ${formatNumber(result.largeDiameterHoleProcessCost)}`
      : "";
    return [
      [`主管材料（${formatNumber(result.mainTubeWeightKg)} kg）`, "主管长度 x 主管米重 x 管材不含税材料单价", result.mainTubeCost],
      ["支管材料", "仅加高支管计入支管材料；不加高支管不计管材", result.branchTubeCost],
      ["配件", "下方逐项展开：表格含税价、去税、材质系数、计入成本金额", result.fittingCost],
      ...fittingDetails,
      [`加工（规格x${result.processMultiplier}${holeText} / 难度x${formatFactor(result.difficultyFactor)}）`, "分水器独立加工规则汇总", result.processCost],
      ...manifoldProcessRows(config, result, pricing, helpers),
      ["重量明细", `主管 ${formatNumber(result.mainTubeWeightKg)} kg + 支管 ${formatNumber(result.branchTubeWeightKg)} kg`, `${formatNumber(result.totalTubeWeightKg)} kg`],
      [`退火（${formatNumber(result.totalTubeWeightKg)} kg）`, "分水器按管材总重量计退火；法兰不进退火重量", result.annealingCost],
      [`制造管理（${formatNumber(result.totalTubeWeightKg)} kg）`, "分水器按管材总重量 x 制造管理费单价", result.managementCost],
      [`包材（${formatNumber(result.totalTubeWeightKg)} kg）`, "分水器按管材总重量 x 包材单价", result.packagingCost],
      ...totalRows(result, pricing, helpers)
    ];
  }

  function dockingRows(config, result, pricing, helpers) {
    const { formatFactor, formatNumber, money } = formatters(helpers);
    const endProcessItems = [
      { label: "A端", fitting: config.fittingA, diameter: config.diameterA },
      { label: "B端", fitting: config.fittingB, diameter: config.diameterB }
    ];
    const middleProcessItems = (config.middleItems || [])
      .filter(item => item.type === "中接")
      .map((item, index) => ({ label: `中间${index + 1}`, fitting: "中接", diameter: config.diameter }));
    const middleFittingItems = (config.middleItems || [])
      .filter(item => item.type === "中接")
      .map((item, index) => ({ label: `中间${index + 1}`, fitting: "中接", diameter: config.diameter }));
    return [
      [`直管材料（${formatNumber(result.productTubeWeightKg)} kg）`, "中间直管长度 x 管材米重 x 管材不含税材料单价", result.productTubeCost],
      ["A/B端配件", "两端配件逐项展开；无配件不计价、不显示明细", result.endFittingCost],
      ...fittingDetailRows(endProcessItems, config, helpers),
      ["中接配件", "启用中间段且类型为中接时计入；直管只计管材", result.middleFittingCost],
      ...fittingDetailRows(middleFittingItems, config, helpers),
      ["A/B端加工（表格取值）", `两端加工基础合计 ${money(result.endProcessCost)}`, ""],
      ...processDetailRows(endProcessItems, "docking", helpers),
      ["中接加工（表格取值）", `中接加工基础合计 ${money(result.middleProcessCost)}`, ""],
      ...processDetailRows(middleProcessItems, "docking", helpers),
      [`对接加工合计（系数x${formatFactor(config.processFactor)} / 难度x${formatFactor(result.difficultyFactor)}）`, "端部加工 + 中接加工，汇总后乘成型加工系数和难度系数", result.processCost],
      ["配件理论重量", "配件去税成本 ÷ ((钢价+2000)/1000 x 配件重量系数)", `${formatNumber(result.fittingTheoreticalWeightKg)} kg`],
      ["法兰不退火重量", "法兰只计配件成本，不计入退火、包材和带法兰管理重量", `${formatNumber(result.heatTreatmentExcludedWeightKg)} kg`],
      ["退火/包材重量", `直管 ${formatNumber(result.productTubeWeightKg)} kg + 非法兰退火配件 ${formatNumber(nonNegative(result.annealingWeightKg - result.productTubeWeightKg))} kg`, `${formatNumber(result.annealingWeightKg)} kg`],
      [`退火（${formatNumber(result.annealingWeightKg)} kg）`, "退火重量 x 退火费单价", result.annealingCost],
      [managementLabel(result, helpers), result.hasFlange ? "带法兰时按产品重量 x 4.13；不带法兰时按加工费 x 2.14" : "不带法兰按加工费 x 2.14", result.managementCost],
      [`包材（${formatNumber(result.annealingWeightKg)} kg）`, "包材重量同退火重量", result.packagingCost],
      ...totalRows(result, pricing, helpers)
    ];
  }

  function teeRows(config, result, pricing, helpers) {
    const { formatFactor, formatNumber, money } = formatters(helpers);
    const endProcessItems = [
      { label: "A端", fitting: config.fittingA, diameter: config.diameterA },
      { label: "B端", fitting: config.fittingB, diameter: config.diameterB },
      { label: "C端", fitting: config.fittingC, diameter: config.diameterC }
    ];
    const middleProcessItems = [
      { label: "A端中接", fitting: config.middleA === "中接" ? "中接" : "无配件", diameter: Math.max(config.bodyDiameter || config.diameter, config.diameterA) },
      { label: "C端中接", fitting: config.middleC === "中接" ? "中接" : "无配件", diameter: Math.max(config.bodyDiameter || config.diameter, config.diameterC) }
    ];
    return [
      [`三通体/直管材料（${formatNumber(result.productTubeWeightKg)} kg）`, "三通体直管 + B端直管等实际管材重量 x 管材不含税材料单价", result.productTubeCost],
      ["A/B/C端配件", "三端配件逐项展开；无配件不计价、不显示明细", result.endFittingCost],
      ...fittingDetailRows(endProcessItems, config, helpers),
      ["中接配件", "A/C端中间段为中接时计入；B端直管只计管材", result.middleFittingCost],
      ...fittingDetailRows(middleProcessItems, config, helpers),
      ["A/B/C端加工（表格取值）", `三端加工基础合计 ${money(result.endProcessCost)}`, ""],
      ...processDetailRows(endProcessItems, "tee", helpers),
      ["中间段加工（表格取值）", `中间段加工基础合计 ${money(result.middleProcessCost)}`, ""],
      ...processDetailRows(middleProcessItems, "tee", helpers),
      [`三通加工合计（系数x${formatFactor(config.processFactor)} / 难度x${formatFactor(result.difficultyFactor)}）`, "端部加工 + 中间段加工，汇总后乘成型加工系数和难度系数", result.processCost],
      ["配件理论重量", "配件去税成本 ÷ ((钢价+2000)/1000 x 配件重量系数)", `${formatNumber(result.fittingTheoreticalWeightKg)} kg`],
      ["法兰不退火重量", "法兰只计配件成本，不计入退火、包材和带法兰管理重量", `${formatNumber(result.heatTreatmentExcludedWeightKg)} kg`],
      ["退火/包材重量", `三通体/直管 ${formatNumber(result.productTubeWeightKg)} kg + 非法兰退火配件 ${formatNumber(nonNegative(result.annealingWeightKg - result.productTubeWeightKg))} kg`, `${formatNumber(result.annealingWeightKg)} kg`],
      [`退火（${formatNumber(result.annealingWeightKg)} kg）`, "退火重量 x 退火费单价", result.annealingCost],
      [managementLabel(result, helpers), result.hasFlange ? "带法兰时按产品重量 x 4.13；不带法兰时按加工费 x 2.14" : "不带法兰按加工费 x 2.14", result.managementCost],
      [`包材（${formatNumber(result.annealingWeightKg)} kg）`, "包材重量同退火重量", result.packagingCost],
      ...totalRows(result, pricing, helpers)
    ];
  }

  function elbowRows(config, result, pricing, helpers) {
    const { formatFactor, formatNumber, money } = formatters(helpers);
    const endProcessItems = [
      { label: "A端", fitting: config.fittingA, diameter: config.diameterA },
      { label: "B端", fitting: config.fittingB, diameter: config.diameterB }
    ];
    const middleProcessItems = [
      { label: "A端中接", fitting: config.middleA === "中接" ? "中接" : "无配件", diameter: Math.max(config.bodyDiameter || config.diameter, config.diameterA) },
      { label: "B端中接", fitting: config.middleB === "中接" ? "中接" : "无配件", diameter: Math.max(config.bodyDiameter || config.diameter, config.diameterB) }
    ];
    return [
      [`${result.elbowBodyName}本体（表格取值）`, "弯头本体按配件价格表取值；进入成本前去税并应用材质系数", result.productTubeCost],
      ...fittingDetailRows([{ label: "弯头本体", fitting: result.elbowBodyName, diameter: config.bodyDiameter || config.diameter }], config, helpers),
      [`A/B端直管（${formatNumber(result.middleStraightWeightKg)} kg）`, "A/B中间段选择直管时，按输入长度计管材重量和材料费", result.middleStraightCost],
      ["A/B端配件", "两端配件逐项展开；无配件不计价、不显示明细", result.endFittingCost],
      ...fittingDetailRows(endProcessItems, config, helpers),
      ["变径中接配件", "A/B中间段选择中接时计入；直管只计管材", result.middleFittingCost],
      ...fittingDetailRows(middleProcessItems, config, helpers),
      ["A/B端加工（表格取值）", `两端加工基础合计 ${money(result.endProcessCost)}`, ""],
      ...processDetailRows(endProcessItems, "elbow", helpers),
      ["中接加工（表格取值）", `中接加工基础合计 ${money(result.middleProcessCost)}`, ""],
      ...processDetailRows(middleProcessItems, "elbow", helpers),
      [`弯头加工合计（角度x${formatFactor(result.angleFactor)} / 系数x${formatFactor(config.processFactor)} / 难度x${formatFactor(result.difficultyFactor)}）`, "端部加工 + 中接加工，汇总后乘45/90角度系数、成型加工系数和难度系数", result.processCost],
      ["弯头本体理论重量", "用于退火/包材重量，不用于弯头本体价格；料长按中心高度H相关规则折算", `${formatNumber(result.elbowBodyWeightKg)} kg`],
      ["A/B及中间配件理论重量", "配件去税成本 ÷ ((钢价+2000)/1000 x 配件重量系数)", `${formatNumber(result.accessoryTheoreticalWeightKg)} kg`],
      ["弯头理论重量合计", "弯头本体理论重量 + A/B及中间配件理论重量", `${formatNumber(result.fittingTheoreticalWeightKg)} kg`],
      ["法兰不退火重量", "法兰只计配件成本，不计入退火、包材和带法兰管理重量", `${formatNumber(result.heatTreatmentExcludedWeightKg)} kg`],
      ["退火/包材重量", `弯头本体 ${formatNumber(result.elbowBodyWeightKg)} kg + 直管 ${formatNumber(result.middleStraightWeightKg)} kg + 非法兰退火配件 ${formatNumber(nonNegative(result.annealingWeightKg - result.elbowBodyWeightKg - result.middleStraightWeightKg))} kg`, `${formatNumber(result.annealingWeightKg)} kg`],
      [`退火（${formatNumber(result.annealingWeightKg)} kg）`, "退火重量 x 退火费单价", result.annealingCost],
      [managementLabel(result, helpers), result.hasFlange ? "带法兰时按产品重量 x 4.13；不带法兰时按加工费 x 2.14" : "不带法兰按加工费 x 2.14", result.managementCost],
      [`包材（${formatNumber(result.annealingWeightKg)} kg）`, "包材重量同退火重量", result.packagingCost],
      ...totalRows(result, pricing, helpers)
    ];
  }

  function combinationRows(config, result, pricing, helpers = {}) {
    const { formatFactor, formatNumber, money } = formatters(helpers);
    const { dockingProcessCost, fittingLabel, fittingTheoreticalWeightKg, isNoFitting, teeProcessCost, tubeMaterialCost, tubeWeightKg } = helpers;
    const components = Array.isArray(config.components) ? config.components : [];
    const pipeRows = [];
    const fittingItems = [];
    const processRows = [];
    const addPipe = (name, length, diameter, thickness) => {
      const weight = tubeWeightKg(length, diameter, thickness, config.material, false);
      pipeRows.push([
        name,
        `D${diameter} x ${thickness}；L=${formatNumber(length)} mm；重量 ${formatNumber(weight)} kg；钢价 ${formatNumber(config.steelTonPrice)} 元/吨，按管材去税系数 x${formatFactor(pricing.materialTaxDivisor)}`,
        tubeMaterialCost(weight, config.steelTonPrice),
        { detail: true }
      ]);
    };

    components.forEach((component, index) => {
      const itemNo = index + 1;
      if (component.type === "直管") {
        addPipe(`${itemNo}. 主链直管`, component.length, component.diameter, component.thickness);
        return;
      }
      if (component.type === "45°弯头" || component.type === "90°弯头") {
        addPipe(`${itemNo}. 主链${component.type}本体材料`, component.length * 2.5, component.diameter, component.thickness);
        fittingItems.push({ label: `${itemNo}. 主链${component.type}`, fitting: component.type === "45°弯头" ? "45弯头" : "90弯头", diameter: component.diameter });
        return;
      }
      if (component.type !== "三通") return;

      addPipe(`${itemNo}. 三通主管`, component.length, component.diameter, component.thickness);
      addPipe(`${itemNo}. 三通支管`, component.branchLength, component.branchDiameter, component.branchThickness);
      (component.branchComponents || []).forEach((branchComponent, branchIndex) => {
        const branchNo = `${itemNo}.${branchIndex + 1}`;
        if (branchComponent.type === "直管") {
          addPipe(`${branchNo} 支口直管`, branchComponent.length, branchComponent.diameter, branchComponent.thickness);
        } else {
          addPipe(`${branchNo} 支口${branchComponent.type}本体材料`, branchComponent.length * 2.5, branchComponent.diameter, branchComponent.thickness);
          fittingItems.push({ label: `${branchNo} 支口${branchComponent.type}`, fitting: branchComponent.type === "45°弯头" ? "45弯头" : "90弯头", diameter: branchComponent.diameter });
        }
      });
      const outlet = component.branchComponents?.[component.branchComponents.length - 1];
      const outletDiameter = outlet?.diameter || component.branchDiameter;
      const outletThickness = outlet?.thickness || component.branchThickness;
      if (component.branchMiddle === "直管") {
        addPipe(`${itemNo}. 支口末段直管`, component.branchMiddleLength, outletDiameter, outletThickness);
      } else if (component.branchMiddle === "中接") {
        fittingItems.push({ label: `${itemNo}. 支口中接`, fitting: "中接", diameter: Math.max(outletDiameter, component.branchFittingDiameter) });
      }
      fittingItems.push({ label: `${itemNo}. 支口末端`, fitting: component.branchFitting, diameter: component.branchFittingDiameter });
      processRows.push([`${itemNo}. 三通体基础加工`, `设置项“三通体基础加工费”取值 ${money(pricing.combination?.teeBodyBaseProcess || 0)}`, pricing.combination?.teeBodyBaseProcess || 0, { detail: true }]);
      const branchProcess = (component.branchComponents || []).length * (pricing.combination?.branchChainProcessPerSegment || 0);
      if (branchProcess > 0) {
        processRows.push([`${itemNo}. 支口组件加工`, `${component.branchComponents.length} 段 x ${money(pricing.combination?.branchChainProcessPerSegment || 0)}`, branchProcess, { detail: true }]);
      }
      if (!isNoFitting(component.branchFitting)) {
        const branchProcessCost = teeProcessCost(component.branchFitting, component.branchFittingDiameter);
        processRows.push([`${itemNo}. 支口${fittingLabel(component.branchFitting)}加工`, `三通类加工费表，取径 D${component.branchFittingDiameter}`, branchProcessCost, { detail: true }]);
      }
      if (component.branchMiddle === "中接") {
        const adapterDiameter = Math.max(outletDiameter, component.branchFittingDiameter);
        processRows.push([`${itemNo}. 支口中接加工`, `三通类加工费表，取径 D${adapterDiameter}`, teeProcessCost("中接", adapterDiameter), { detail: true }]);
      }
    });

    const firstDiameter = components[0]?.diameter || 40;
    const lastDiameter = components[components.length - 1]?.diameter || firstDiameter;
    fittingItems.unshift({ label: "A端", fitting: config.fittingA, diameter: firstDiameter });
    fittingItems.push({ label: "B端", fitting: config.fittingB, diameter: lastDiameter });
    const fittingRows = fittingDetailRows(fittingItems, config, helpers);
    if (result.endpointProcessCost > 0) {
      processRows.push(["A/B端配件加工", `对接类加工费表：A端D${firstDiameter} + B端D${lastDiameter}`, result.endpointProcessCost, { detail: true }]);
    }
    (result.jointRows || []).forEach((joint, index) => {
      const left = components[index]?.type || "前段";
      const right = components[index + 1]?.type || "后段";
      processRows.push([`焊接点 ${joint.index}`, `${left} / ${right} 相连；调用弯头类“对焊”加工费表，取较大外径 D${joint.diameter}`, joint.cost, { detail: true }]);
    });

    const fittingAnnealingWeight = Math.max(0, result.totalTubeWeightKg - result.tubeWeightKg);
    return [
      ["管材材料明细", "以下按主链、三通主管/支管及支口直管逐段计算", ""],
      ...pipeRows,
      ["配件明细", "配件价格为含税表价，计算成本时去税；316L 再乘材料系数", ""],
      ...fittingRows,
      ["组合加工明细", "焊接点按弯头类“对焊”行；三通体与支口按组合件设置项/三通加工表", ""],
      ...processRows,
      ["管材理论重量合计", "所有直管、三通主管/支管、弯头本体折算材料重量", `${formatNumber(result.tubeWeightKg)} kg`],
      ["非管材退火重量", "弯头、端部/支口配件的非法兰理论重量", `${formatNumber(fittingAnnealingWeight)} kg`],
      [`退火（${formatNumber(result.totalTubeWeightKg)} kg）`, "退火重量 = 管材重量 + 非法兰配件理论重量", result.annealingCost],
      [`制造管理（组合加工 x ${formatFactor(pricing.combination?.managementProcessFactor || 0)}）`, "组合加工费 x 组合件制造管理加工系数", result.managementCost],
      [`包材（${formatNumber(result.totalTubeWeightKg)} kg）`, "包材重量与退火重量相同", result.packagingCost],
      ["表面处理", `${config.surfaceTreatment}；仅按管材重量计算`, result.surfaceTreatmentCost],
      ...totalRows(result, pricing, helpers)
    ];
  }

  return { combinationRows, dockingRows, elbowRows, manifoldRows, managementLabel, teeRows, totalRows };
});
