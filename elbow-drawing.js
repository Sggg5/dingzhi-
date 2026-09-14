(function exposeElbowDrawing(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ElbowDrawing = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createElbowDrawing() {
  function render(config, helpers) {
    const {
      DrawingCore, compressedStraightVisualLength, drawingColors, drawingTotalLengthText,
      cadFittingEnvelopeHeight, cadFittingLength, cadFittingSvg,
      elbowCadBodyGeometry, elbowMiddleLengthMm, elbowRoundBodySvg, fittingLabel, inlineFittingEnvelopeHeight,
      inlineFittingLength, inlineFittingSvg, isNoFitting, pipeVisualDiameter, reducerSegmentSvg,
      showInfoPanels = true
    } = helpers;
    const visualFittingLength = cadFittingLength || inlineFittingLength;
    const visualFittingSvg = cadFittingSvg || inlineFittingSvg;
    const visualFittingEnvelopeHeight = cadFittingEnvelopeHeight || inlineFittingEnvelopeHeight;
    const bodyDiameter = Number(config.bodyDiameter || config.diameter) || 0;
    const detailScale = bodyDiameter <= 54 ? 1.8 : bodyDiameter <= 108 ? 1.25 : 1;
    const logicalElbowPipe = pipeVisualDiameter(config.bodyDiameter || config.diameter);
    const logicalElbowAHeight = pipeVisualDiameter(config.diameterA);
    const logicalElbowBHeight = pipeVisualDiameter(config.diameterB);
    const elbowPipe = logicalElbowPipe * detailScale;
    const elbowAHeight = logicalElbowAHeight * detailScale;
    const elbowBHeight = logicalElbowBHeight * detailScale;
    const elbowOffsetX = 85;
    const elbowLargeLift = Math.max(0, Math.max(elbowPipe, elbowAHeight, elbowBHeight) - 80);
    const elbowOffsetY = -40 - elbowLargeLift;
    const elbowStartX = 430 + elbowOffsetX;
    const elbowStartY = 390 + elbowOffsetY;
    const cadBody = typeof elbowCadBodyGeometry === "function"
      ? elbowCadBodyGeometry(config.bodyDiameter || config.diameter, config.angle, elbowStartX, elbowStartY, elbowPipe)
      : null;
    const elbowEndX = cadBody ? cadBody.endX : (config.angle === 45 ? 638 : 534) + elbowOffsetX;
    const elbowEndY = cadBody ? cadBody.endY : (config.angle === 45 ? 304 : 286) + elbowOffsetY;
    const cadDimensionScale = elbowPipe / Math.max(1, Number(config.bodyDiameter || config.diameter));
    const elbowDimensionRight = cadBody
      ? elbowStartX + Number(config.length || 0) * cadDimensionScale
      : config.angle === 45 ? elbowStartX + 140 : elbowEndX;
    const elbowBRotation = config.angle === 45 ? -45 : -90;
    const elbowALength = visualFittingLength(config.fittingA, config.diameterA, elbowAHeight);
    const elbowBLength = visualFittingLength(config.fittingB, config.diameterB, elbowBHeight);
    const elbowALogicalLength = inlineFittingLength(config.fittingA, config.diameterA, logicalElbowAHeight);
    const elbowBLogicalLength = inlineFittingLength(config.fittingB, config.diameterB, logicalElbowBHeight);
    const elbowMiddleADimensionLength = elbowMiddleLengthMm(config.middleA, config.middleLengthA, Math.max(config.bodyDiameter || config.diameter, config.diameterA));
    const elbowMiddleBDimensionLength = elbowMiddleLengthMm(config.middleB, config.middleLengthB, Math.max(config.bodyDiameter || config.diameter, config.diameterB));
    const dimensionOffsets = config.dimensionOverrides || {};
    const dimensionOffset = id => dimensionOffsets[id] || { dx: 0, dy: 0 };
    const elbowMiddleALength = config.middleA === "中接" ? 34 : config.middleA === "直管" ? compressedStraightVisualLength(elbowMiddleADimensionLength) : 0;
    const elbowMiddleBLength = config.middleB === "中接" ? 34 : config.middleB === "直管" ? compressedStraightVisualLength(elbowMiddleBDimensionLength) : 0;
    const elbowADimensionLength = config.length + elbowMiddleADimensionLength + elbowALogicalLength;
    const elbowBDimensionLength = config.length + elbowMiddleBDimensionLength + elbowBLogicalLength;
    const elbowFittingAX = elbowStartX - elbowMiddleALength;
    const elbowFittingBX = elbowEndX + elbowMiddleBLength;
    const elbowALabelX = elbowFittingAX - elbowALength / 2;
    const elbowALabelY = elbowStartY;
    const elbowBLabelOffset = elbowMiddleBLength + elbowBLength / 2;
    const elbowBLabelX = config.angle === 45 ? elbowEndX + elbowBLabelOffset / Math.sqrt(2) : elbowEndX;
    const elbowBLabelY = config.angle === 45 ? elbowEndY - elbowBLabelOffset / Math.sqrt(2) : elbowEndY - elbowBLabelOffset;
    const elbowMiddleSvg = `
      ${config.middleA === "中接" ? reducerSegmentSvg(elbowFittingAX, elbowStartX, elbowStartY, elbowAHeight, elbowPipe) : ""}
      ${config.middleA === "直管" ? `<rect x="${elbowFittingAX}" y="${elbowStartY - elbowAHeight / 2}" width="${elbowMiddleALength}" height="${elbowAHeight}" rx="0" fill="${drawingColors.pipeFill}" stroke="${drawingColors.stroke}" stroke-width="${drawingColors.objectLineWidth}"/>` : ""}
      <g transform="rotate(${elbowBRotation} ${elbowEndX} ${elbowEndY})">
        ${config.middleB === "中接" ? reducerSegmentSvg(elbowEndX, elbowFittingBX, elbowEndY, elbowPipe, elbowBHeight) : ""}
        ${config.middleB === "直管" ? `<rect x="${elbowEndX}" y="${elbowEndY - elbowBHeight / 2}" width="${elbowMiddleBLength}" height="${elbowBHeight}" rx="0" fill="${drawingColors.pipeFill}" stroke="${drawingColors.stroke}" stroke-width="${drawingColors.objectLineWidth}"/>` : ""}
      </g>
    `;
    const elbowAEnvelopeHeight = visualFittingEnvelopeHeight(config.fittingA, config.diameterA, elbowAHeight);
    const elbowBEnvelopeHeight = visualFittingEnvelopeHeight(config.fittingB, config.diameterB, elbowBHeight);
    const elbowASpecX = elbowFittingAX - elbowALength - Math.max(34, elbowAEnvelopeHeight * 0.22);
    const elbowASpecY = elbowStartY - elbowAEnvelopeHeight / 2 - 18;
    const elbowBSpecDynamicX = config.angle === 45
      ? elbowEndX + (elbowMiddleBLength + elbowBLength + elbowBEnvelopeHeight / 2 + 28) / Math.sqrt(2)
      : elbowEndX + elbowBEnvelopeHeight / 2 + 42;
    const elbowBSpecDynamicY = config.angle === 45
      ? elbowEndY - (elbowMiddleBLength + elbowBLength + elbowBEnvelopeHeight / 2 + 28) / Math.sqrt(2)
      : elbowEndY - elbowMiddleBLength - elbowBLength - 18;
    const elbowDimensionClearance = Math.max(65, elbowPipe / 2 + 44, elbowAEnvelopeHeight / 2 + 44);
    const elbowDimensionY = elbowStartY + elbowDimensionClearance;
    const elbowADimensionExtension = Math.max(48, elbowPipe * 0.4 + 20);
    const elbowBDimensionExtension = Math.max(48, elbowPipe * 0.4 + 20);
    const labelFontSize = drawingColors.labelFontSize || 15;
    const dimensionFontSize = drawingColors.dimensionFontSize || 16;
    const layer = DrawingCore.layer || ((name, body) => `<g data-layer="${name}">${body || ""}</g>`);
    const dimensionText = length => `H=${drawingTotalLengthText(length, config.bodyDiameter || config.diameter).replace(/^L=/, "")}`;
    const elbowSlantDimensionSvg = config.angle === 45 ? (() => {
      const unit = 1 / Math.sqrt(2);
      const endBaseX = elbowEndX + (elbowMiddleBLength + elbowBLength) * unit;
      const endBaseY = elbowEndY - (elbowMiddleBLength + elbowBLength) * unit;
      return DrawingCore.projected45Dimension({
        centerBaseX: elbowDimensionRight,
        centerBaseY: elbowStartY + elbowPipe / 2,
        endBaseX,
        endBaseY,
        dimensionOffset: elbowBDimensionExtension,
        label: dimensionText(elbowBDimensionLength),
        dimensionId: "elbow-b",
        offset: dimensionOffset("elbow-b"),
        color: drawingColors.dimension,
        labelColor: drawingColors.label
      });
    })() : "";
    const elbowVerticalDimensionSvg = config.angle === 90 ? (() => {
      const extension = elbowBDimensionExtension;
      const dimX = elbowEndX + elbowBEnvelopeHeight / 2 + extension;
      const topY = elbowEndY - elbowMiddleBLength - elbowBLength;
      const bottomY = elbowStartY;
      return DrawingCore.verticalDimension({
        x: dimX,
        y1: topY,
        y2: bottomY,
        label: dimensionText(elbowBDimensionLength),
        color: drawingColors.dimension,
        labelColor: drawingColors.label,
        extensionTop: { fromX: dimX - extension, toX: dimX },
        extensionBottom: { fromX: dimX - extension, toX: dimX },
        labelOffset: -18,
        dimensionId: "elbow-b",
        offset: dimensionOffset("elbow-b"),
        fontSize: dimensionFontSize
      });
    })() : "";

    const objectLayer = `
      ${cadBody ? cadBody.svg : elbowRoundBodySvg(elbowStartX, elbowStartY, elbowEndX, elbowEndY, elbowPipe, config.angle)}
      ${elbowMiddleSvg}
      ${visualFittingSvg(config.fittingA, config.diameterA, elbowFittingAX, elbowStartY, elbowAHeight, "left")}
      <g transform="rotate(${elbowBRotation} ${elbowEndX} ${elbowEndY})">
        ${visualFittingSvg(config.fittingB, config.diameterB, elbowFittingBX, elbowEndY, elbowBHeight, "right")}
      </g>
    `;
    const labelLayer = `
      ${!isNoFitting(config.fittingA) ? `
        <text x="${elbowALabelX}" y="${elbowALabelY}" text-anchor="middle" dominant-baseline="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">A端</text>
        <text x="${elbowASpecX}" y="${elbowASpecY}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">${config.diameterA} ${fittingLabel(config.fittingA)}</text>
      ` : ""}
      ${!isNoFitting(config.fittingB) ? `
        <text x="${elbowBLabelX}" y="${elbowBLabelY}" text-anchor="middle" dominant-baseline="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">B端</text>
        <text x="${elbowBSpecDynamicX}" y="${elbowBSpecDynamicY}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">${config.diameterB} ${fittingLabel(config.fittingB)}</text>
      ` : ""}
      <text x="${(elbowFittingAX - elbowALength + elbowDimensionRight) / 2}" y="${elbowDimensionY + 34}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">D${config.bodyDiameter || config.diameter}x${config.bodyThickness || config.thickness} ${config.angle}°弯头</text>
    `;
    const dimensionLayer = `
      ${DrawingCore.horizontalDimension({
        x1: elbowFittingAX - elbowALength,
        x2: elbowDimensionRight,
        y: elbowDimensionY,
        label: dimensionText(elbowADimensionLength),
        color: drawingColors.dimension,
        labelColor: drawingColors.label,
        extensionStart: { fromY: elbowDimensionY - elbowADimensionExtension, toY: elbowDimensionY + 10 },
        extensionEnd: { fromY: elbowDimensionY - elbowADimensionExtension, toY: elbowDimensionY + 10 },
        labelY: elbowDimensionY - 12,
        dimensionId: "elbow-a",
        offset: dimensionOffset("elbow-a"),
        fontSize: dimensionFontSize
      })}
      ${elbowSlantDimensionSvg}
      ${elbowVerticalDimensionSvg}
    `;
    const content = `
      ${layer("object", objectLayer)}
      ${layer("dimension", dimensionLayer)}
      ${layer("label", labelLayer)}
    `;
    const bDimensionRight = config.angle === 45
      ? elbowEndX + (elbowMiddleBLength + elbowBLength + elbowBDimensionExtension + 36) / Math.sqrt(2)
      : elbowEndX + elbowBEnvelopeHeight / 2 + elbowBDimensionExtension + 34;
    const bDimensionTop = config.angle === 45
      ? elbowEndY - (elbowMiddleBLength + elbowBLength + elbowBDimensionExtension + 36) / Math.sqrt(2)
      : elbowEndY - elbowMiddleBLength - elbowBLength - 24;
    const bounds = {
      left: Math.min(elbowFittingAX - elbowALength - 26, elbowASpecX - 90),
      right: Math.max(bDimensionRight, elbowBSpecDynamicX + 90, elbowDimensionRight + 24),
      top: Math.min(bDimensionTop, elbowBSpecDynamicY - 30, elbowASpecY - 24),
      bottom: Math.max(elbowDimensionY + 58, elbowStartY + elbowPipe / 2 + 24)
    };
    return typeof DrawingCore.fitContent === "function"
      ? DrawingCore.fitContent({
        bounds,
        box: showInfoPanels
          ? { left: 145, right: 1055, top: 125, bottom: 455 }
          : { left: 145, right: 1055, top: 115, bottom: 585 },
        content,
        minScale: 0.5,
        maxScale: 1
      })
      : content;
  }
  return { render };
});
