(function exposeDockingDrawing(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.DockingDrawing = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createDockingDrawing() {
  function render(config, helpers) {
    const {
      DrawingCore,
      clamp,
      dockingMiddleAssembly,
      dockingTotalLengthMm,
      drawingColors,
      drawingTotalLengthText,
      fittingLabel,
      inlineFittingLength,
      inlineFittingSvg,
      isNoFitting,
      pipeVisualDiameter
    } = helpers;
    const middleItems = config.middleItems || [];
    const hasMiddleAdapter = middleItems.some(item => item.type === "中接");
    const totalMiddleLength = middleItems
      .filter(item => item.type === "直管")
      .reduce((sum, item) => sum + item.length, 0);
    const pipeA = pipeVisualDiameter(config.diameterA);
    const pipeB = pipeVisualDiameter(config.diameterB);
    const directVisualLength = !hasMiddleAdapter && totalMiddleLength > 0
      ? clamp(totalMiddleLength * 2.2, 240, 620)
      : 600;
    const leftEnd = 600 - directVisualLength / 2;
    const rightEnd = 600 + directVisualLength / 2;
    const middleX = 600;
    const hasMiddleItems = middleItems.length > 0;
    const assembly = hasMiddleItems
      ? dockingMiddleAssembly(config, leftEnd, rightEnd, 280)
      : { svg: "", leftX: leftEnd, rightX: rightEnd };
    const noMiddleGap = [config.fittingA, config.fittingB]
      .some(fitting => ["法兰", "移动螺母", "移动螺纹"].includes(fitting)) ? 0 : 12;
    const leftConnectionX = hasMiddleItems ? assembly.leftX : middleX - noMiddleGap / 2;
    const rightConnectionX = hasMiddleItems ? assembly.rightX : middleX + noMiddleGap / 2;
    const totalLength = dockingTotalLengthMm(config);
    const dimensionLeft = leftConnectionX - inlineFittingLength(config.fittingA, config.diameterA, pipeA);
    const dimensionRight = rightConnectionX + inlineFittingLength(config.fittingB, config.diameterB, pipeB);
    const leftLabelX = hasMiddleItems ? (dimensionLeft + leftConnectionX) / 2 : dimensionLeft - 28;
    const rightLabelX = hasMiddleItems ? (dimensionRight + rightConnectionX) / 2 : dimensionRight + 28;
    const leftFittingCenterX = (dimensionLeft + leftConnectionX) / 2;
    const rightFittingCenterX = (dimensionRight + rightConnectionX) / 2;
    const specLabelY = Math.min(238, 280 - Math.max(pipeA, pipeB) / 2 - 16);
    const dimensionY = 372;
    const dimensionSvg = totalLength > 0 ? DrawingCore.horizontalDimension({
      x1: dimensionLeft,
      x2: dimensionRight,
      y: dimensionY,
      label: drawingTotalLengthText(totalLength, config.diameter),
      color: drawingColors.dimension,
      labelColor: drawingColors.label,
      extensionStart: { fromY: 318, toY: dimensionY + 10 },
      extensionEnd: { fromY: 318, toY: dimensionY + 10 },
      labelY: dimensionY - 12,
      fontSize: 16
    }) : "";
    const content = `
      ${hasMiddleItems ? assembly.svg : ""}
      ${inlineFittingSvg(config.fittingA, config.diameterA, leftConnectionX, 280, pipeA, "left")}
      ${inlineFittingSvg(config.fittingB, config.diameterB, rightConnectionX, 280, pipeB, "right")}
      ${dimensionSvg}
      ${!isNoFitting(config.fittingA) ? `
        <text x="${leftFittingCenterX}" y="288" text-anchor="middle" font-size="15" fill="${drawingColors.label}">A端</text>
        <text x="${leftLabelX}" y="${specLabelY}" text-anchor="middle" font-size="15" fill="${drawingColors.label}">${config.diameterA} ${fittingLabel(config.fittingA)}</text>
      ` : ""}
      ${!isNoFitting(config.fittingB) ? `
        <text x="${rightFittingCenterX}" y="288" text-anchor="middle" font-size="15" fill="${drawingColors.label}">B端</text>
        <text x="${rightLabelX}" y="${specLabelY}" text-anchor="middle" font-size="15" fill="${drawingColors.label}">${config.diameterB} ${fittingLabel(config.fittingB)}</text>
      ` : ""}
    `;
    const bounds = {
      left: Math.min(dimensionLeft, leftLabelX - 72),
      right: Math.max(dimensionRight, rightLabelX + 72),
      top: specLabelY - 24,
      bottom: dimensionY + 24
    };
    return typeof DrawingCore.fitContent === "function"
      ? DrawingCore.fitContent({
        bounds,
        box: { left: 150, right: 1050, top: 145, bottom: 455 },
        content,
        minScale: 0.62
      })
      : content;
  }

  return { render };
});
