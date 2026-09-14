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
      dockingMiddleLengthMm,
      dockingTotalLengthMm,
      drawingColors,
      drawingTotalLengthText,
      dockingFittingLength,
      dockingFittingSvg,
      fittingLabel,
      inlineFittingLength,
      inlineFittingSvg,
      isNoFitting,
      pipeVisualDiameter,
      showInfoPanels = true
    } = helpers;
    const fittingLength = dockingFittingLength || inlineFittingLength;
    const fittingSvg = dockingFittingSvg || inlineFittingSvg;
    const middleItems = config.middleItems || [];
    const middleLengthMm = typeof dockingMiddleLengthMm === "function"
      ? dockingMiddleLengthMm(config)
      : middleItems.filter(item => item.type === "直管").reduce((sum, item) => sum + (Number(item.length) || 0), 0);
    const hasMiddleItems = middleItems.length > 0;
    const basePipeA = pipeVisualDiameter(config.diameterA);
    const basePipeB = pipeVisualDiameter(config.diameterB);
    const baseCompactWidth = fittingLength(config.fittingA, config.diameterA, basePipeA)
      + fittingLength(config.fittingB, config.diameterB, basePipeB);
    // Very short docking products are unreadable at the same visual scale as
    // long pipes. Enlarge only the geometry span; quoted and dimensioned
    // lengths remain the physical values.
    const compactScale = hasMiddleItems
      ? 1
      : clamp(200 / Math.max(1, baseCompactWidth), 1, 3.4);
    const pipeA = basePipeA * compactScale;
    const pipeB = basePipeB * compactScale;
    const baseFittingLengthA = fittingLength(config.fittingA, config.diameterA, basePipeA);
    const baseFittingLengthB = fittingLength(config.fittingB, config.diameterB, basePipeB);
    const middleVisualLength = middleItems.length > 0
      ? clamp(Math.max(1, middleLengthMm || 0) * 2.2, 120, 620)
      : 0;
    const middleX = 600;
    const leftEnd = middleX - middleVisualLength / 2;
    const rightEnd = middleX + middleVisualLength / 2;
    const assembly = hasMiddleItems
      ? dockingMiddleAssembly(config, leftEnd, rightEnd, 280)
      : { svg: "", leftX: leftEnd, rightX: rightEnd };
    // With no middle component, both fittings meet at the same connection
    // datum plane. A physical clearance must be modelled as a component,
    // rather than introduced as a drawing-only gap.
    const leftConnectionX = hasMiddleItems ? assembly.leftX : middleX;
    const rightConnectionX = hasMiddleItems ? assembly.rightX : middleX;
    const totalLength = dockingTotalLengthMm(config);
    const dimensionLeft = leftConnectionX - baseFittingLengthA * compactScale;
    const dimensionRight = rightConnectionX + baseFittingLengthB * compactScale;
    const leftLabelX = hasMiddleItems ? (dimensionLeft + leftConnectionX) / 2 : dimensionLeft - 28;
    const rightLabelX = hasMiddleItems ? (dimensionRight + rightConnectionX) / 2 : dimensionRight + 28;
    const leftFittingCenterX = (dimensionLeft + leftConnectionX) / 2;
    const rightFittingCenterX = (dimensionRight + rightConnectionX) / 2;
    const specLabelY = Math.min(238, 280 - Math.max(pipeA, pipeB) / 2 - 16);
    const labelFontSize = drawingColors.labelFontSize || 15;
    const dimensionFontSize = drawingColors.dimensionFontSize || 16;
    const layer = DrawingCore.layer || ((name, body) => `<g data-layer="${name}">${body || ""}</g>`);
    const bodyBottomY = 280 + Math.max(pipeA, pipeB) / 2;
    const dimensionY = Math.max(372, bodyBottomY + Math.max(36, Math.max(pipeA, pipeB) * 0.12));
    const dimensionExtensionTopY = Math.min(dimensionY - 24, bodyBottomY + 10);
    const dimensionSvg = totalLength > 0 ? DrawingCore.horizontalDimension({
      x1: dimensionLeft,
      x2: dimensionRight,
      y: dimensionY,
      label: drawingTotalLengthText(totalLength, config.diameter),
      color: drawingColors.dimension,
      labelColor: drawingColors.label,
      extensionStart: { fromY: dimensionExtensionTopY, toY: dimensionY + 10 },
      extensionEnd: { fromY: dimensionExtensionTopY, toY: dimensionY + 10 },
      labelY: dimensionY - 12,
      fontSize: dimensionFontSize
    }) : "";
    const scaleAtDatum = (svg, datumX) => compactScale === 1
      ? svg
      : `<g class="compact-docking-fitting" transform="translate(${datumX} 280) scale(${compactScale}) translate(${-datumX} -280)">${svg}</g>`;
    const objectLayer = `
      ${hasMiddleItems ? assembly.svg : ""}
      ${scaleAtDatum(fittingSvg(config.fittingA, config.diameterA, leftConnectionX, 280, basePipeA, "left"), leftConnectionX)}
      ${scaleAtDatum(fittingSvg(config.fittingB, config.diameterB, rightConnectionX, 280, basePipeB, "right"), rightConnectionX)}
    `;
    const labelLayer = `
      ${!isNoFitting(config.fittingA) ? `
        <text x="${leftFittingCenterX}" y="288" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">A端</text>
        <text x="${leftLabelX}" y="${specLabelY}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">${config.diameterA} ${fittingLabel(config.fittingA)}</text>
      ` : ""}
      ${!isNoFitting(config.fittingB) ? `
        <text x="${rightFittingCenterX}" y="288" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">B端</text>
        <text x="${rightLabelX}" y="${specLabelY}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">${config.diameterB} ${fittingLabel(config.fittingB)}</text>
      ` : ""}
    `;
    const content = `
      ${layer("object", objectLayer)}
      ${layer("dimension", dimensionSvg)}
      ${layer("label", labelLayer)}
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
        box: showInfoPanels
          ? { left: 150, right: 1050, top: 145, bottom: 455 }
          : { left: 145, right: 1055, top: 130, bottom: 585 },
        content,
        minScale: 0.62,
        maxScale: 1.4
      })
      : content;
  }

  return { render };
});
