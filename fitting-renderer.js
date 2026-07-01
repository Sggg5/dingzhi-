(function exposeFittingRenderer(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.FittingRenderer = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createFittingRenderer() {
  function inlet(config, mainLeft, y, height, h) {
    const fitting = config.mainFitting;
    const diameter = config.mainFittingDiameter || config.mainDiameter;
    const colors = h.drawingColors;
    if (fitting === "直管") return "";
    if (fitting === "法兰") {
      const width = h.flangeVisualWidth(diameter, height);
      const visualHeight = Math.max(height * 1.7, 64);
      return h.flangePath(mainLeft - width, y - visualHeight / 2, width, visualHeight, colors.fittingFill, colors.fittingStroke);
    }
    if (fitting === "双卡") {
      const base = h.doubleCardVisualSize(diameter);
      const visualHeight = Math.max(base.height, height / 0.76);
      return h.doubleCardPath(mainLeft - base.width + 6, y - visualHeight / 2, base.width, visualHeight, diameter, colors.fittingFill, colors.fittingStroke);
    }
    if (h.isRingPressLike(fitting)) {
      const base = h.ringPressVisualSize(diameter);
      const visualHeight = Math.max(base.height, height);
      const width = Math.max(base.width, visualHeight * (base.width / base.height));
      return h.ringPressPath(mainLeft - width + 6, y - visualHeight / 2, width, visualHeight, colors.fittingFill, colors.fittingStroke);
    }
    if (fitting === "内丝" || fitting === "外丝") {
      const visualHeight = height / 0.76;
      const width = h.threadVisualWidth(fitting, diameter, height);
      const path = fitting === "内丝" ? h.innerThreadPath : h.outerThreadPath;
      return path(mainLeft - width + 6, y - visualHeight / 2, width, visualHeight, colors.fittingFill, colors.fittingStroke);
    }
    if (fitting === "沟槽" || fitting === "对焊") {
      const width = Math.max(34, height * 0.34);
      const path = fitting === "沟槽" ? h.groovePath : h.buttWeldPath;
      return path(mainLeft - width, y - height / 2, width, height, colors.fittingFill, colors.fittingStroke);
    }
    return `<rect x="${mainLeft - 42}" y="${y - height / 2 - 9}" width="42" height="${height + 18}" rx="4" fill="${colors.fittingFill}" stroke="${colors.fittingStroke}" stroke-width="${colors.fittingLineWidth || 2}"/>`;
  }

  function tail(config, mainRight, y, height, h) {
    if (config.tailFitting === "直管") return "";
    if (config.tailFitting === "堵头") {
      return h.capPath(mainRight, y - height / 2, Math.max(14, height * 0.21), height, h.drawingColors.capFill, h.drawingColors.stroke);
    }
    return `<g transform="translate(${mainRight * 2} 0) scale(-1 1)">${inlet({ ...config, mainFitting: config.tailFitting, mainFittingDiameter: config.tailFittingDiameter || config.mainDiameter }, mainRight, y, height, h)}</g>`;
  }

  function inline(fitting, diameter, x, y, height, side, h) {
    if (h.isNoFitting(fitting)) return "";
    return side === "right"
      ? tail({ mainDiameter: diameter, mainFitting: "直管", tailFitting: fitting }, x, y, height, h)
      : inlet({ mainDiameter: diameter, mainFitting: fitting }, x, y, height, h);
  }

  function verticalInline(fitting, diameter, x, y, height, side, h) {
    if (h.isNoFitting(fitting)) return "";
    const angle = side === "bottom" ? -90 : 90;
    return `<g transform="rotate(${angle} ${x} ${y})">${inline(fitting, diameter, x, y, height, "left", h)}</g>`;
  }

  return { inlet, inline, tail, verticalInline };
});
