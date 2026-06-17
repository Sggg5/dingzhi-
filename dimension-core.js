(function exposeDimensionCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.DimensionCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createDimensionCore() {
  function drawingLengthValue(value) {
    return Math.ceil(Math.max(0, Number(value) || 0));
  }

  function drawingLengthTolerance(diameter) {
    return Number(diameter) < 32 ? "±3" : "±5";
  }

  function drawingLengthText(value, prefix = "L=") {
    return `${prefix}${drawingLengthValue(value)} mm`;
  }

  function drawingTotalLengthText(value, diameter, prefix = "L=") {
    return `${prefix}${drawingLengthValue(value)} ${drawingLengthTolerance(diameter)} mm`;
  }

  function dockingMiddleLengthMm(config, fittingLengthMm) {
    return (config.middleItems || []).reduce((sum, item) => {
      if (item.type === "中接") {
        return sum + fittingLengthMm(
          "中接",
          Math.max(Number(config.diameterA), Number(config.diameterB)),
          config.tubeSeries
        );
      }
      return sum + Math.max(0, Number(item.length) || 0);
    }, 0);
  }

  function dockingTotalLengthMm(config, fittingLengthMm) {
    if (config.totalLengthRequirement > 0) return config.totalLengthRequirement;
    return fittingLengthMm(config.fittingA, config.diameterA, config.tubeSeries)
      + dockingMiddleLengthMm(config, fittingLengthMm)
      + fittingLengthMm(config.fittingB, config.diameterB, config.tubeSeries);
  }

  function teeMiddleLengthMm(type, diameter, series, fittingLengthMm) {
    return type === "中接" ? fittingLengthMm("中接", diameter, series) : 0;
  }

  function teeBMiddleVisualLengthMm(config) {
    return config.middleB === "直管" ? Math.max(0, Number(config.middleLengthB) || 0) : 0;
  }

  function elbowMiddleLengthMm(type, length, diameter, series, fittingLengthMm) {
    if (type === "直管") return Math.max(0, Number(length) || 0);
    if (type === "中接") return fittingLengthMm("中接", diameter, series);
    return 0;
  }

  function compressedStraightVisualLength(length) {
    const numericLength = Math.max(0, Number(length) || 0);
    return numericLength <= 160 ? numericLength : 160 + Math.sqrt(numericLength - 160) * 4;
  }

  function teeHorizontalTotalLengthMm(config, fittingLengthMm) {
    return fittingLengthMm(config.fittingA, config.diameterA, config.tubeSeries)
      + teeMiddleLengthMm(
        config.middleA,
        Math.max(config.bodyDiameter || config.diameter, config.diameterA),
        config.tubeSeries,
        fittingLengthMm
      )
      + (config.bodyLength || config.length)
      + teeMiddleLengthMm(
        config.middleC,
        Math.max(config.bodyDiameter || config.diameter, config.diameterC),
        config.tubeSeries,
        fittingLengthMm
      )
      + fittingLengthMm(config.fittingC, config.diameterC, config.tubeSeries);
  }

  function productDefaultLength({ productType, diameter, angle, series = "A", pricing = {} }) {
    const diameterValue = Number(diameter) || 40;
    if (productType === "对接类") return Math.max(80, Math.round(diameterValue * 2.5));
    if (productType === "弯头类") {
      const height90 = pricing.elbowCenterHeightBySeries?.[series]?.[diameterValue]
        || Math.max(90, Math.round(diameterValue * 3.2));
      return Number(angle) === 45 ? Math.ceil(height90 * 0.65) : height90;
    }
    if (productType === "三通类") {
      return pricing.teeStraightLengthBySeries?.[series]?.[diameterValue]
        || Math.max(120, Math.round(diameterValue * 3.6));
    }
    return Math.max(100, Math.round(diameterValue * 3));
  }

  return {
    compressedStraightVisualLength,
    dockingMiddleLengthMm,
    dockingTotalLengthMm,
    drawingLengthText,
    drawingLengthTolerance,
    drawingLengthValue,
    drawingTotalLengthText,
    elbowMiddleLengthMm,
    productDefaultLength,
    teeBMiddleVisualLengthMm,
    teeHorizontalTotalLengthMm,
    teeMiddleLengthMm
  };
});
