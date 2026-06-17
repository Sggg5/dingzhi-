(function (global) {
  function isAmount(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function costRowDisplay(row, money) {
    const [name, value] = row;
    return {
      name,
      note: isAmount(value) ? "" : String(value ?? ""),
      amount: isAmount(value) ? money(value) : ""
    };
  }

  function costRowsDisplay(rows, money) {
    return (rows || []).map(row => costRowDisplay(row, money));
  }

  function topProductTitle(config) {
    if (config.productType === "弯头类") {
      return `${config.bodyDiameter || config.diameter} ${config.angle}° 弯头`;
    }
    if (config.productType === "三通类") {
      return `${config.bodyDiameter || config.diameter} 三通`;
    }
    if (config.productType === "对接类") {
      return `${config.diameterA} - ${config.diameterB} 对接`;
    }
    return `${config.mainDiameter} 分水器`;
  }

  function compactBranchSummary(config, helpers) {
    const uniqueBranches = new Set(config.branches.map(branch => {
      const toleranceText = branch.positiveTolerance ? " 正公差" : "";
      const fittingText = branch.fitting === "直管" ? "" : ` ${helpers.fittingLabel(branch.fitting)}`;
      const heightText = branch.height > 0 ? ` 加高${branch.height}` : "";
      return `D${branch.diameter}x${branch.thickness}${toleranceText}${fittingText}${heightText}`;
    }));
    if (uniqueBranches.size === 1) return Array.from(uniqueBranches)[0];
    return `${config.branchCount}路独立`;
  }

  function quoteItemName(config, helpers) {
    if (!helpers.isManifoldType(config.productType)) {
      if (config.productType === "对接类") {
        const middleText = (config.middleItems || []).length === 0
          ? "无中间"
          : config.middleItems.map(item => item.type === "直管" ? `直管L${helpers.drawingLengthValue(item.length)}` : "中接").join("+");
        return `${config.material} 对接 A端D${config.diameterA}x${config.thicknessA}${config.fittingA}，B端D${config.diameterB}x${config.thicknessB}${config.fittingB}，${middleText}`;
      }

      const angleText = config.productType === "弯头类" ? ` ${config.angle}°` : "";
      const fittingText = config.productType === "三通类"
        ? `${config.fittingA}/${config.fittingB}/${config.fittingC}`
        : `${config.fittingA}/${config.fittingB}`;
      return `${config.material} ${helpers.productKindName(config.productType)}${angleText} D${config.bodyDiameter || config.diameter}x${config.bodyThickness || config.thickness} L${helpers.drawingLengthValue(config.length)}，${fittingText}`;
    }

    const seriesText = helpers.tubeSeriesLabel[config.tubeSeries] || config.tubeSeries;
    const mainToleranceText = config.mainPositiveTolerance ? " 正公差" : "";
    return `${config.material} ${seriesText} ${config.manifoldType} 主管D${config.mainDiameter}x${config.wallThickness}${mainToleranceText}，${config.branchCount}路，支管${compactBranchSummary(config, helpers)}`;
  }

  function specItems(config, result, helpers) {
    if (!helpers.isManifoldType(config.productType)) {
      if (config.productType === "对接类") {
        return [
          ["客户", config.customerName],
          ["编号", config.quoteNo],
          ["产品类别", config.productType],
          ["材质", config.material],
          ["A端", `D${config.diameterA} x ${config.thicknessA} / ${config.fittingA}`],
          ["B端", `D${config.diameterB} x ${config.thicknessB} / ${config.fittingB}`],
          ["中间连接", (config.middleItems || []).length === 0 ? "无" : config.middleItems.map(item => item.type === "直管" ? `直管 ${helpers.drawingLengthText(item.length, "")}` : "中接").join("，")],
          ["钢价", `${helpers.formatNumber(config.steelTonPrice)} 元/吨`],
          ["表面处理", config.surfaceTreatment],
          ["加工系数", helpers.formatFactor(config.processFactor)],
          ["难度系数", `${helpers.formatFactor(result.difficultyFactor)}${result.manualDifficultyFactor === null ? " 自动" : " 手动"}`],
          ["总重", `${helpers.formatNumber(result.totalTubeWeightKg)} kg`]
        ];
      }

      const fittings = config.productType === "三通类"
        ? `${config.fittingA} / ${config.fittingB} / ${config.fittingC}`
        : `${config.fittingA} / ${config.fittingB}`;
      return [
        ["客户", config.customerName],
        ["编号", config.quoteNo],
        ["产品类别", config.productType],
        ["材质", config.material],
        ["规格", `D${config.bodyDiameter || config.diameter} x ${config.bodyThickness || config.thickness}`],
        ["长度", helpers.drawingLengthText(config.length, "")],
        ...(config.productType === "弯头类" ? [["角度", `${config.angle}°`]] : []),
        ["连接", fittings],
        ["钢价", `${helpers.formatNumber(config.steelTonPrice)} 元/吨`],
        ["表面处理", config.surfaceTreatment],
        ["加工系数", helpers.formatFactor(config.processFactor)],
        ["难度系数", `${helpers.formatFactor(result.difficultyFactor)}${result.manualDifficultyFactor === null ? " 自动" : " 手动"}`],
        ["总重", `${helpers.formatNumber(result.totalTubeWeightKg)} kg`]
      ];
    }

    const uniqueBranches = new Set(config.branches.map(branch => `D${branch.diameter}/${branch.thickness}/${branch.positiveTolerance}/${branch.fitting}/${branch.height}`));
    const branchSpec = uniqueBranches.size === 1
      ? `D${config.branches[0].diameter} x ${config.branches[0].thickness}${config.branches[0].positiveTolerance ? " 正差" : ""}`
      : `${config.branchCount} 路独立配置`;
    const heightSpec = uniqueBranches.size === 1
      ? (config.branches[0].height === 0 ? "不加高" : `${config.branches[0].height} mm`)
      : config.branches.map((branch, index) => `${index + 1}路:${branch.height === 0 ? "不加高" : `${branch.height}mm`}`).join("，");
    const fittingSpec = uniqueBranches.size === 1
      ? config.branches[0].fitting
      : config.branches.map((branch, index) => `${index + 1}路:${branch.fitting}`).join("，");

    return [
      ["客户", config.customerName],
      ["编号", config.quoteNo],
      ["材质", config.material],
      ["类型", config.manifoldType],
      ["主管", `D${config.mainDiameter} x ${config.wallThickness}${config.mainPositiveTolerance ? " 正差" : ""}`],
      ["支管", branchSpec],
      ["实际壁", `${helpers.formatNumber(result.actualWall)} mm`],
      ["支路", `${config.branchCount} 路`],
      ["间距", helpers.spacingSpec(config)],
      ["支管加高", heightSpec],
      ["进水配件", config.mainFitting],
      ["支管配件", fittingSpec],
      ["末尾配件", helpers.fittingLabel(config.tailFitting)],
      ["进水端", helpers.drawingLengthText(result.inletAllowance, "")],
      ["末尾", helpers.drawingLengthText(result.tailAllowance, "")],
      ["钢价", `${helpers.formatNumber(config.steelTonPrice)} 元/吨`],
      ["表面处理", config.surfaceTreatment],
      ["难度系数", `${helpers.formatFactor(result.difficultyFactor)}${result.manualDifficultyFactor === null ? " 自动" : " 手动"}`],
      ["总重", `${helpers.formatNumber(result.totalTubeWeightKg)} kg`],
      ["主管长", helpers.drawingLengthText(result.mainLength, "")]
    ];
  }

  const api = {
    costRowDisplay,
    costRowsDisplay,
    compactBranchSummary,
    quoteItemName,
    specItems,
    topProductTitle
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.DisplayCore = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
