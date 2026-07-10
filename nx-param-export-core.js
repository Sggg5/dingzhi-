(function exposeNxParamExportCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NxParamExportCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createNxParamExportCore() {
  const EMPTY_GROOVE = null;

  function numberOrNull(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function firstFinite(...values) {
    for (const value of values) {
      const number = Number(value);
      if (Number.isFinite(number) && number > 0) return number;
    }
    return null;
  }

  function safeText(value, fallback = "") {
    const text = String(value ?? "").trim();
    return text || fallback;
  }

  function sanitizeFilePart(value, fallback) {
    return safeText(value, fallback)
      .replace(/[\\/:*?"<>|\s]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || fallback;
  }

  function seriesKey(config) {
    return config?.tubeSeries || "A";
  }

  function diameterToDn(diameter, series, productCodeCore) {
    const table = productCodeCore?.DN_BY_SERIES?.[series] || productCodeCore?.DN_BY_SERIES?.A || {};
    const number = Number(diameter);
    const key = Number.isFinite(number) ? String(number) : "";
    return table[key] ?? null;
  }

  function primaryOuterDiameter(config) {
    if (!config) return null;
    if (config.productType === "分水器类") return numberOrNull(config.mainDiameter);
    if (config.productType === "三通类") return numberOrNull(config.bodyDiameter || config.diameter || config.diameterA);
    if (config.productType === "弯头类") return numberOrNull(config.bodyDiameter || config.diameter || config.diameterA);
    if (config.productType === "组合件") {
      const first = config.components?.[0];
      return numberOrNull(first?.diameter || first?.bodyDiameter || first?.branchDiameter || config.diameterA);
    }
    return numberOrNull(config.middlePipeDiameter || config.diameter || config.diameterA || config.productDiameter);
  }

  function primaryThickness(config) {
    if (!config) return null;
    if (config.productType === "分水器类") return numberOrNull(config.wallThickness);
    if (config.productType === "三通类") return numberOrNull(config.bodyThickness || config.thickness || config.thicknessA);
    if (config.productType === "弯头类") return numberOrNull(config.bodyThickness || config.thickness || config.thicknessA);
    if (config.productType === "组合件") {
      const first = config.components?.[0];
      return numberOrNull(first?.thickness || first?.bodyThickness || first?.branchThickness || config.thicknessA);
    }
    return numberOrNull(config.middlePipeThickness || config.thickness || config.thicknessA || config.productThickness);
  }

  function quoteTotalLength(config, result, helpers = {}) {
    if (!config) return null;
    if (config.productType === "分水器类") return firstFinite(result?.mainLength);
    if (config.productType === "三通类") {
      return firstFinite(
        helpers.teeHorizontalTotalLengthMm?.(config),
        config.bodyLength,
        config.length
      );
    }
    if (config.productType === "对接类") {
      return firstFinite(
        helpers.dockingTotalLengthMm?.(config),
        config.totalLengthRequirement,
        config.length
      );
    }
    if (config.productType === "弯头类") return firstFinite(config.length);
    if (config.productType === "组合件") {
      const bounds = result?.geometry?.bounds;
      if (bounds) {
        return firstFinite(bounds.right - bounds.left);
      }
      return firstFinite(result?.totalLength, config.totalLengthRequirement);
    }
    return firstFinite(config.totalLengthRequirement, config.length, result?.mainLength);
  }

  function outputOptions(config, extra = {}) {
    return {
      target: "Siemens NX",
      format: "NX_OPEN_CSHARP_PARAMETER_JSON",
      unit: "mm",
      generateModel: false,
      callNxService: false,
      productType: config?.productType || "",
      reservedNxServiceEndpoint: extra.nxServiceEndpoint || null,
      ...extra
    };
  }

  function buildParams(config, result = {}, dependencies = {}) {
    const productCodeCore = dependencies.productCodeCore || (typeof ProductCodeCore !== "undefined" ? ProductCodeCore : null);
    const productCodeResult = config?.productCodeResult || productCodeCore?.generate?.(config || {});
    const productCode = safeText(config?.productCode || productCodeResult?.code, "待确认");
    const outerDiameter = primaryOuterDiameter(config);
    const thickness = primaryThickness(config);
    const dn = diameterToDn(outerDiameter, seriesKey(config), productCodeCore);

    return {
      productType: safeText(config?.productType, "分水器类"),
      productCode,
      dn,
      material: safeText(config?.material, "304"),
      outerDiameter,
      thickness,
      totalLength: quoteTotalLength(config, result, dependencies),
      socketDepth: EMPTY_GROOVE,
      sealGrooveWidth: EMPTY_GROOVE,
      sealGrooveDepth: EMPTY_GROOVE,
      pressGrooveWidth: EMPTY_GROOVE,
      pressGrooveDepth: EMPTY_GROOVE,
      surfaceTreatment: safeText(config?.surfaceTreatment, "酸洗"),
      quantity: Math.max(1, Number(config?.quantity) || 1),
      quotePrice: numberOrNull(result?.unitPrice ?? result?.totalPrice ?? result?.discountedPrice ?? result?.factoryCost),
      outputOptions: outputOptions(config, dependencies.outputOptions)
    };
  }

  function fileName(params) {
    const code = sanitizeFilePart(params?.productCode, "待确认");
    const dn = params?.dn ? `DN${params.dn}` : "DN待确认";
    const material = sanitizeFilePart(params?.material, "304");
    const thickness = sanitizeFilePart(params?.thickness, "0");
    return `FRT-${code}-${dn}-${material}-T${thickness}.json`;
  }

  function jsonText(params) {
    return `${JSON.stringify(params, null, 2)}\n`;
  }

  async function callNxModelingService(_params, _options = {}) {
    throw new Error("NX建模服务接口已预留，当前版本只导出参数 JSON，不直接调用 UG/NX。");
  }

  return {
    buildParams,
    callNxModelingService,
    fileName,
    jsonText,
    outputOptions,
    sanitizeFilePart
  };
});
