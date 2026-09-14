(function exposeFittingVisualCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.FittingVisualCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createFittingVisualCore() {
  function threadVisualLengthFactor(diameter) {
    return Number(diameter) < 32 ? 0.7 : 1;
  }

  function threadVisualWidth(fitting, diameter, height) {
    const visualHeight = height / 0.76;
    const baseWidth = fitting === "内丝" ? Math.max(52, visualHeight * 0.9) : Math.max(62, visualHeight * 1.18);
    return baseWidth * threadVisualLengthFactor(diameter);
  }

  function tableVisualSize(diameter, table, resolveDiameter, fallbackDiameter, width, height) {
    const dim = table[diameter] || table[resolveDiameter(diameter)] || table[fallbackDiameter];
    return { width: width(dim), height: height(dim) };
  }

  function doubleCardVisualSize(diameter, deps) {
    return tableVisualSize(diameter, deps.doubleCardISeries, deps.fittingPriceDiameter, 20,
      dim => Math.max(48, dim.l1 * 1.45),
      dim => Math.max(32, dim.d2 * 0.62));
  }

  function ringPressVisualSize(diameter, deps) {
    return tableVisualSize(diameter, deps.ringPressISeries, deps.fittingPriceDiameter, 20,
      dim => Math.max(42, dim.l2 * 1.08),
      dim => Math.max(28, dim.d2 * 0.72));
  }

  function flangeVisualWidth(diameter, height, fittingLengthMm) {
    return Math.max(11, fittingLengthMm("法兰", diameter) || height * 0.22);
  }

  function inletFittingLength(config, height, deps) {
    const fitting = config.mainFitting;
    const diameter = config.mainFittingDiameter || config.mainDiameter;
    if (fitting === "直管") return 0;
    if (fitting === "堵头") return Math.max(14, height * 0.21);
    if (fitting === "法兰") return flangeVisualWidth(diameter, height, deps.fittingLengthMm);
    if (fitting === "双卡") return doubleCardVisualSize(diameter, deps).width - 6;
    if (deps.isRingPressLike(fitting)) {
      const base = ringPressVisualSize(diameter, deps);
      const visualHeight = Math.max(base.height, height);
      return Math.max(base.width, visualHeight * (base.width / base.height)) - 6;
    }
    if (fitting === "内丝" || fitting === "外丝") return threadVisualWidth(fitting, diameter, height) - 6;
    if (fitting === "沟槽" || fitting === "对焊") return Math.max(34, height * 0.34);
    return 42;
  }

  function tailFittingLength(config, height, deps) {
    if (config.tailFitting === "直管") return 0;
    if (config.tailFitting === "堵头") return Math.max(14, height * 0.21);
    return inletFittingLength({ ...config, mainFitting: config.tailFitting, mainFittingDiameter: config.tailFittingDiameter || config.mainDiameter }, height, deps);
  }

  function inlineFittingLength(fitting, diameter, height, deps) {
    if (deps.isNoFitting(fitting)) return 0;
    if (fitting === "堵头") return Math.max(14, height * 0.21);
    return inletFittingLength({ mainDiameter: diameter, mainFitting: fitting }, height, deps);
  }

  function inlineFittingEnvelopeHeight(fitting, diameter, height, deps) {
    if (deps.isNoFitting(fitting) || fitting === "堵头") return height;
    if (fitting === "法兰") return Math.max(height * 1.7, 64);
    if (fitting === "双卡") return Math.max(doubleCardVisualSize(diameter, deps).height, height / 0.76);
    if (deps.isRingPressLike(fitting)) return Math.max(ringPressVisualSize(diameter, deps).height, height);
    if (fitting === "内丝" || fitting === "外丝") return height / 0.76;
    return height;
  }

  function outerThreadBranchVisualSize(diameter, pipeVisualDiameter) {
    const pipeSize = pipeVisualDiameter(diameter);
    return { width: Math.max(30, pipeSize * 1.45), height: Math.max(28, pipeSize * 1.32) };
  }

  function innerThreadBranchVisualSize(diameter, pipeVisualDiameter) {
    const pipeSize = pipeVisualDiameter(diameter);
    return { width: Math.max(28, pipeSize * 1.18), height: Math.max(30, pipeSize * 1.34) };
  }

  return {
    doubleCardVisualSize, flangeVisualWidth, inletFittingLength, inlineFittingEnvelopeHeight,
    inlineFittingLength, innerThreadBranchVisualSize, outerThreadBranchVisualSize,
    ringPressVisualSize, tailFittingLength, threadVisualLengthFactor, threadVisualWidth
  };
});
