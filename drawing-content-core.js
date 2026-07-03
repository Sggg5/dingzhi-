(function exposeDrawingContentCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.DrawingContentCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createDrawingContentCore() {
  function addRow(rows, name, quantity = 1) {
    if (!name || quantity <= 0) return;
    const existing = rows.find(row => row.name === name);
    if (existing) existing.quantity += quantity;
    else rows.push({ name, quantity });
  }

  function titleBranchSummary(config) {
    const groups = new Map();
    config.branches.filter(branch => branch.fitting !== "无配件" && branch.fitting !== "直管").forEach(branch => {
      const key = `D${branch.diameter}`;
      groups.set(key, (groups.get(key) || 0) + 1);
    });
    return Array.from(groups.entries()).map(([spec, count]) => `${spec}x${count}口`).join("+");
  }

  function manifoldBomRows(config, helpers) {
    const { fittingLabel } = helpers;
    const isNoFitting = helpers.isNoFitting || (value => value === "无配件" || value === "直管");
    const rows = [];
    const mainFittingDiameter = config.mainFittingDiameter || config.mainDiameter;
    const tailFittingDiameter = config.tailFittingDiameter || config.mainDiameter;
    addRow(rows, `主管 D${config.mainDiameter} x ${config.wallThickness}`);
    if (!isNoFitting(config.mainFitting)) addRow(rows, `进水 ${fittingLabel(config.mainFitting)} D${mainFittingDiameter}`);
    if (config.mainAdapterEnabled) addRow(rows, `进水中接 D${mainFittingDiameter}-D${config.mainDiameter}`);
    if (!isNoFitting(config.tailFitting)) addRow(rows, `末尾 ${fittingLabel(config.tailFitting)} D${tailFittingDiameter}`);
    if (config.tailAdapterEnabled) addRow(rows, `末尾中接 D${config.mainDiameter}-D${tailFittingDiameter}`);
    config.branches.forEach(branch => {
      const heightText = branch.height > 0 ? ` 加高${branch.height}` : "";
      const toleranceText = branch.positiveTolerance ? " 正差" : "";
      if (branch.height > 0) addRow(rows, `支管 D${branch.diameter} x ${branch.thickness}${toleranceText}${heightText}`);
      if (!isNoFitting(branch.fitting)) addRow(rows, `支管${fittingLabel(branch.fitting)} D${branch.diameter}`);
    });
    return rows;
  }

  function productBomRows(config, helpers) {
    const { drawingLengthValue, fittingLabel, isNoFitting, productKindName } = helpers;
    const rows = [];
    if (config.productType === "对接类") {
      const middlePipeDiameter = config.middlePipeDiameter || config.diameter;
      const middlePipeThickness = config.middlePipeThickness || config.thickness;
      (config.middleItems || []).forEach(item => {
        if (item.type === "直管") addRow(rows, `直管 D${item.diameter || middlePipeDiameter} x ${item.thickness || middlePipeThickness} L${drawingLengthValue(item.length)}`);
        if (item.type === "中接") addRow(rows, `中接 D${config.diameter}`);
      });
      if (!isNoFitting(config.fittingA)) addRow(rows, `A端 ${fittingLabel(config.fittingA)} D${config.diameterA}`);
      if (!isNoFitting(config.fittingB)) addRow(rows, `B端 ${fittingLabel(config.fittingB)} D${config.diameterB}`);
      return rows;
    }
    if (config.productType === "弯头类") {
      addRow(rows, `弯头体 D${config.bodyDiameter || config.diameter} x ${config.bodyThickness || config.thickness}`);
      if (config.middleA === "中接") addRow(rows, `A端中接 D${Math.max(config.bodyDiameter || config.diameter, config.diameterA)}`);
      if (config.middleB === "中接") addRow(rows, `B端中接 D${Math.max(config.bodyDiameter || config.diameter, config.diameterB)}`);
      if (config.middleA === "直管") addRow(rows, `A端直管 D${config.diameterA} L${drawingLengthValue(config.middleLengthA)}`);
      if (config.middleB === "直管") addRow(rows, `B端直管 D${config.diameterB} L${drawingLengthValue(config.middleLengthB)}`);
      if (!isNoFitting(config.fittingA)) addRow(rows, `A端 ${fittingLabel(config.fittingA)} D${config.diameterA}`);
      if (!isNoFitting(config.fittingB)) addRow(rows, `B端 ${fittingLabel(config.fittingB)} D${config.diameterB}`);
      return rows;
    }
    if (config.productType === "三通类") {
      addRow(rows, `三通体 D${config.bodyDiameter || config.diameter} x ${config.bodyThickness || config.thickness}`);
      if (config.middleA === "中接") addRow(rows, `A端中接 D${Math.max(config.bodyDiameter || config.diameter, config.diameterA)}`);
      if (config.middleC === "中接") addRow(rows, `C端中接 D${Math.max(config.bodyDiameter || config.diameter, config.diameterC)}`);
      if (config.middleB === "直管") addRow(rows, `B端直管 D${config.diameterB} L${drawingLengthValue(config.middleLengthB)}`);
      if (config.middleB === "中接") addRow(rows, `B端中接 D${Math.max(config.bodyDiameter || config.diameter, config.diameterB)}`);
      if (!isNoFitting(config.fittingA)) addRow(rows, `A端 ${fittingLabel(config.fittingA)} D${config.diameterA}`);
      if (!isNoFitting(config.fittingB)) addRow(rows, `B端 ${fittingLabel(config.fittingB)} D${config.diameterB}`);
      if (!isNoFitting(config.fittingC)) addRow(rows, `C端 ${fittingLabel(config.fittingC)} D${config.diameterC}`);
      return rows;
    }
    addRow(rows, `${productKindName(config.productType)}本体 D${config.diameter} x ${config.thickness}`);
    return rows;
  }

  function productDimensionNotes(config, helpers) {
    const { drawingLengthText } = helpers;
    if (config.productType === "对接类") {
      const middlePipeDiameter = config.middlePipeDiameter || config.diameter;
      const middleText = (config.middleItems || []).length === 0
        ? "中间：无"
        : `中间：${config.middleItems.map(item => item.type === "直管" ? `直管D${item.diameter || middlePipeDiameter} ${drawingLengthText(item.length, "")}` : "中接").join("+")}`;
      return [`A：D${config.diameterA} x ${config.thicknessA}`, `B：D${config.diameterB} x ${config.thicknessB}`, middleText];
    }
    if (config.productType === "弯头类") {
      return [
        `D：${config.bodyDiameter || config.diameter} x ${config.bodyThickness || config.thickness}`,
        `角度：${config.angle}°`,
        `H：中心高度 ${drawingLengthText(config.length, "")}`
      ];
    }
    return [
      `主管：D${config.diameter} x ${config.thickness}`,
      `支口：D${config.diameter}`,
      `L：主管长度 ${drawingLengthText(config.length, "")}`
    ];
  }

  return { addRow, manifoldBomRows, productBomRows, productDimensionNotes, titleBranchSummary };
});
