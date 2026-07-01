(function exposeProductCodeCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ProductCodeCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createProductCodeCore() {
  const SOURCE = {
    repository: "Sggg5/code-rule-system",
    commit: "0520a468b1363d18337ee7a6e35bfcd65f487eed"
  };

  const MATERIAL_CODES = { "304": "A", "316L": "B" };
  const SERIES_CODES = { A: "3", B: "1" };
  const PRODUCT_TYPE_CODES = { "对接类": "01", "弯头类": "04", "三通类": "05" };
  const FITTING_CODES = {
    "无": "00",
    "无配件": "00",
    "外丝": "01",
    "内丝": "02",
    "移动螺母": "03",
    "法兰": "04",
    "双卡": "05",
    "单卡": "06",
    "对焊": "07",
    "插焊": "08",
    "沟槽": "09",
    "环压": "15"
  };
  const DN_BY_SERIES = {
    A: {
      16: 15, 20: 20, 25.4: 25, 32: 32, 40: 40, 50.8: 50,
      76.1: 65, 88.9: 80, 101.6: 100, 133: 125, 159: 150, 219: 200
    },
    B: {
      18: 15, 22: 20, 28: 25, 35: 32, 42: 40, 54: 50,
      76.1: 65, 88.9: 80, 108: 100
    }
  };

  function normalizeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? String(number) : "";
  }

  function diameterCode(diameter, series) {
    const dn = DN_BY_SERIES[series]?.[normalizeNumber(diameter)];
    return dn ? String(dn).padStart(3, "0") : "";
  }

  function pending(ruleId, reasons, segments = []) {
    return {
      code: "",
      valid: false,
      status: "pending",
      message: reasons.join("；"),
      reasons,
      ruleId,
      source: SOURCE,
      segments
    };
  }

  function complete(ruleId, segments) {
    const code = segments.map(segment => segment.code).join("");
    if (code.length !== 15) return pending(ruleId, [`编码长度为 ${code.length}，应为 15`], segments);
    return { code, valid: true, status: "valid", message: "编码有效", reasons: [], ruleId, source: SOURCE, segments };
  }

  function commonCodes(config, reasons) {
    const material = MATERIAL_CODES[config.material];
    const series = SERIES_CODES[config.tubeSeries];
    if (!material) reasons.push(`材质 ${config.material || "-"} 没有码值`);
    if (!series) reasons.push(`管材系列 ${config.tubeSeries || "-"} 没有码值`);
    return { material, series };
  }

  function generateManifold(config) {
    const ruleId = "rule-6";
    const reasons = [];
    const common = commonCodes(config, reasons);
    const firstBranch = config.branches?.[0];
    const mainSpec = diameterCode(config.mainDiameter, config.tubeSeries);
    const branchSpec = diameterCode(firstBranch?.diameter ?? config.branchDiameter, config.tubeSeries);
    const branchCount = Number(config.branchCount ?? config.branches?.length);
    const branchCountCode = branchCount >= 1 && branchCount <= 20 ? String(branchCount).padStart(2, "0") : "";
    if (!mainSpec) reasons.push(`主管外径 ${config.mainDiameter || "-"} 无法转换为现有 DN 码`);
    if (!branchSpec) reasons.push(`支管外径 ${firstBranch?.diameter ?? config.branchDiameter ?? "-"} 无法转换为现有 DN 码`);
    if (!branchCountCode) reasons.push(`分水器支口数 ${branchCount || 0} 超出 01～20 范围`);
    const segments = [
      { name: "品名", code: common.material || "" },
      { name: "系列", code: common.series || "" },
      { name: "连接分类1", code: "8" },
      { name: "规格1", code: mainSpec },
      { name: "规格2", code: branchSpec },
      { name: "支口数", code: branchCountCode },
      { name: "客户", code: "00" },
      { name: "流水号", code: "00" }
    ];
    return reasons.length ? pending(ruleId, reasons, segments) : complete(ruleId, segments);
  }

  function productSpecs(config) {
    if (config.productType === "三通类") {
      return [config.bodyDiameter || config.diameterA, config.diameterB];
    }
    return [config.diameterA, config.diameterB];
  }

  function generateCustomProduct(config) {
    const ruleId = "rule-4";
    const reasons = [];
    const common = commonCodes(config, reasons);
    const typeCode = PRODUCT_TYPE_CODES[config.productType];
    const firstFitting = config.fittingA;
    const fittingCode = FITTING_CODES[firstFitting];
    const [spec1Diameter, spec2Diameter] = productSpecs(config);
    const spec1 = diameterCode(spec1Diameter, config.tubeSeries);
    const spec2 = diameterCode(spec2Diameter, config.tubeSeries);
    if (!typeCode) reasons.push(`产品类型 ${config.productType || "-"} 没有码值`);
    if (!fittingCode) reasons.push(`第一连接分类 ${firstFitting || "-"} 没有码值`);
    if (!spec1) reasons.push(`规格1外径 ${spec1Diameter || "-"} 无法转换为现有 DN 码`);
    if (!spec2) reasons.push(`规格2外径 ${spec2Diameter || "-"} 无法转换为现有 DN 码`);
    const segments = [
      { name: "品名", code: common.material || "" },
      { name: "系列", code: common.series || "" },
      { name: "连接分类1", code: "6" },
      { name: "类型分类", code: typeCode || "" },
      { name: "连接分类2", code: fittingCode || "" },
      { name: "规格1", code: spec1 },
      { name: "规格2", code: spec2 },
      { name: "流水号", code: "00" }
    ];
    return reasons.length ? pending(ruleId, reasons, segments) : complete(ruleId, segments);
  }

  function generate(config) {
    return !config?.productType || config.productType === "分水器类"
      ? generateManifold(config || {})
      : generateCustomProduct(config || {});
  }

  return { DN_BY_SERIES, FITTING_CODES, MATERIAL_CODES, PRODUCT_TYPE_CODES, SERIES_CODES, SOURCE, diameterCode, generate };
});
