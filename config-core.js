(function exposeConfigCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.ConfigCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createConfigCore() {
  const PRODUCT_TYPES = new Set(["分水器类", "对接类", "三通类", "弯头类", "组合件"]);

  function number(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function nonNegativeNumber(value, fallback = 0) {
    return Math.max(0, number(value, fallback));
  }

  function positiveNumber(value, fallback = 1) {
    const parsed = number(value, fallback);
    return parsed > 0 ? parsed : fallback;
  }

  function positiveInteger(value, fallback = 1) {
    return Math.max(1, Math.round(positiveNumber(value, fallback)));
  }

  function normalizeCommon(config) {
    return {
      ...config,
      customerName: String(config.customerName || "未填写").trim() || "未填写",
      quoteNo: String(config.quoteNo || "").trim(),
      material: String(config.material || "304"),
      tubeSeries: String(config.tubeSeries || "A"),
      quantity: positiveInteger(config.quantity, 1),
      processFactor: nonNegativeNumber(config.processFactor, 1),
      steelTonPrice: nonNegativeNumber(config.steelTonPrice),
      costRate: positiveNumber(config.costRate, 0.68),
      faceDiscountRate: positiveNumber(config.faceDiscountRate, 0.17),
      freight: nonNegativeNumber(config.freight)
    };
  }

  function normalizeMiddleItems(items) {
    if (!Array.isArray(items)) return [];
    return items.map(item => {
      const type = item?.type === "中接" ? "中接" : "直管";
      return {
        ...item,
        type,
        fitting: type === "中接" ? "中接" : "直管",
        length: type === "直管" ? nonNegativeNumber(item?.length) : 0
      };
    });
  }

  function normalizeBranches(branches) {
    if (!Array.isArray(branches)) return [];
    return branches.map(branch => ({
      ...branch,
      diameter: positiveNumber(branch?.diameter),
      thickness: positiveNumber(branch?.thickness),
      height: nonNegativeNumber(branch?.height),
      spacingAfter: nonNegativeNumber(branch?.spacingAfter),
      side: branch?.side === "下" ? "下" : branch?.side === "上" ? "上" : "",
      positiveTolerance: Boolean(branch?.positiveTolerance)
    }));
  }

  function normalizeManifoldConfig(rawConfig) {
    const config = normalizeCommon(rawConfig);
    const branches = normalizeBranches(config.branches);
    return {
      ...config,
      productType: "分水器类",
      mainDiameter: positiveNumber(config.mainDiameter),
      wallThickness: positiveNumber(config.wallThickness),
      branchDiameter: positiveNumber(config.branchDiameter),
      branchThickness: positiveNumber(config.branchThickness),
      branchCount: positiveInteger(config.branchCount || branches.length, 1),
      branchSpacing: nonNegativeNumber(config.branchSpacing),
      branchHeight: nonNegativeNumber(config.branchHeight),
      inletAllowance: nonNegativeNumber(config.inletAllowance),
      tailAllowance: nonNegativeNumber(config.tailAllowance),
      mainFittingDiameter: positiveNumber(config.mainFittingDiameter, positiveNumber(config.mainDiameter)),
      tailFittingDiameter: positiveNumber(config.tailFittingDiameter, positiveNumber(config.mainDiameter)),
      mainAdapterEnabled: Boolean(config.mainAdapterEnabled) && number(config.mainFittingDiameter, config.mainDiameter) !== number(config.mainDiameter),
      tailAdapterEnabled: Boolean(config.tailAdapterEnabled) && number(config.tailFittingDiameter, config.mainDiameter) !== number(config.mainDiameter),
      branches
    };
  }

  function normalizeDockingConfig(rawConfig) {
    const config = normalizeCommon(rawConfig);
    const middleItems = normalizeMiddleItems(config.middleItems);
    const length = middleItems
      .filter(item => item.type === "直管")
      .reduce((sum, item) => sum + item.length, 0);
    return {
      ...config,
      productType: "对接类",
      diameterA: positiveNumber(config.diameterA),
      diameterB: positiveNumber(config.diameterB),
      thicknessA: positiveNumber(config.thicknessA),
      thicknessB: positiveNumber(config.thicknessB),
      diameter: positiveNumber(config.diameter, Math.max(number(config.diameterA), number(config.diameterB), 1)),
      thickness: positiveNumber(config.thickness, Math.max(number(config.thicknessA), number(config.thicknessB), 1)),
      length,
      middleItems,
      totalLengthRequirement: nonNegativeNumber(config.totalLengthRequirement)
    };
  }

  function normalizeTeeConfig(rawConfig) {
    const config = normalizeCommon(rawConfig);
    return {
      ...config,
      productType: "三通类",
      diameterA: positiveNumber(config.diameterA),
      diameterB: positiveNumber(config.diameterB),
      diameterC: positiveNumber(config.diameterC),
      thicknessA: positiveNumber(config.thicknessA),
      thicknessB: positiveNumber(config.thicknessB),
      thicknessC: positiveNumber(config.thicknessC),
      bodyDiameter: positiveNumber(config.bodyDiameter || config.diameter),
      bodyThickness: positiveNumber(config.bodyThickness || config.thickness),
      bodyLength: positiveNumber(config.bodyLength || config.length),
      middleLengthB: nonNegativeNumber(config.middleLengthB)
    };
  }

  function normalizeElbowConfig(rawConfig) {
    const config = normalizeCommon(rawConfig);
    return {
      ...config,
      productType: "弯头类",
      diameterA: positiveNumber(config.diameterA),
      diameterB: positiveNumber(config.diameterB),
      thicknessA: positiveNumber(config.thicknessA),
      thicknessB: positiveNumber(config.thicknessB),
      bodyDiameter: positiveNumber(config.bodyDiameter || config.diameter),
      bodyThickness: positiveNumber(config.bodyThickness || config.thickness),
      length: positiveNumber(config.length),
      angle: number(config.angle) === 45 ? 45 : 90,
      middleLengthA: nonNegativeNumber(config.middleLengthA),
      middleLengthB: nonNegativeNumber(config.middleLengthB)
    };
  }

  function normalizeCombinationConfig(rawConfig) {
    const config = normalizeCommon(rawConfig);
    return {
      ...config,
      productType: "组合件",
      fittingA: String(config.fittingA || "无配件"),
      fittingB: String(config.fittingB || "无配件"),
      components: Array.isArray(config.components) ? config.components : []
    };
  }

  function normalizeConfig(rawConfig = {}) {
    const productType = rawConfig.productType || "分水器类";
    if (productType === "对接类") return normalizeDockingConfig(rawConfig);
    if (productType === "三通类") return normalizeTeeConfig(rawConfig);
    if (productType === "弯头类") return normalizeElbowConfig(rawConfig);
    if (productType === "组合件") return normalizeCombinationConfig(rawConfig);
    return normalizeManifoldConfig(rawConfig);
  }

  function validateConfig(config = {}) {
    const errors = [];
    const warnings = [];
    if (!PRODUCT_TYPES.has(config.productType || "分水器类")) {
      errors.push(`不支持的产品类型：${config.productType}`);
    }
    if (!config.customerName?.trim()) warnings.push("客户名称为空");
    if (!config.quoteNo?.trim()) warnings.push("报价编号为空");
    if (number(config.steelTonPrice) <= 0) warnings.push("钢价未设置");
    if (config.productType === "分水器类" && (!Array.isArray(config.branches) || config.branches.length === 0)) {
      errors.push("分水器至少需要一条支路");
    }
    return { valid: errors.length === 0, errors, warnings };
  }

  return {
    nonNegativeNumber,
    normalizeBranches,
    normalizeConfig,
    normalizeDockingConfig,
    normalizeElbowConfig,
    normalizeManifoldConfig,
    normalizeCombinationConfig,
    normalizeMiddleItems,
    normalizeTeeConfig,
    number,
    positiveInteger,
    positiveNumber,
    validateConfig
  };
});
