(function exposeTeeDrawing(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.TeeDrawing = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createTeeDrawing() {
  function render(config, helpers) {
    const {
      DrawingCore, clamp, compressedStraightVisualLength, drawingColors, drawingTotalLengthText,
      fittingLabel, inlineFittingLength, inlineFittingSvg, isNoFitting, pipeVisualDiameter,
      reducerSegmentSvg, teeBMiddleVisualLengthMm, teeHorizontalTotalLengthMm, teeMiddleLengthMm,
      verticalInlineFittingSvg,
      showInfoPanels = true
    } = helpers;
    const pipeA = pipeVisualDiameter(config.diameterA);
    const pipeB = pipeVisualDiameter(config.diameterB);
    const pipeC = pipeVisualDiameter(config.diameterC);
    const bodyHeight = pipeVisualDiameter(config.bodyDiameter || config.diameter);
    const lengthVisual = clamp((config.bodyLength || config.length) * 2.1, 140, 310);
    const pxPerMm = lengthVisual / Math.max(1, config.bodyLength || config.length);
    const sideMiddleVisualWidth = (type, diameter) => {
      const logicalLength = teeMiddleLengthMm(type, Math.max(config.bodyDiameter || config.diameter, diameter));
      const baseWidth = compressedStraightVisualLength(logicalLength) * pxPerMm;
      return type === "中接" && Number(diameter) >= 133 ? baseWidth * 0.5 : baseWidth;
    };
    const middleAWidth = sideMiddleVisualWidth(config.middleA, config.diameterA);
    const middleBReducerDiameter = Math.max(Number(config.bodyDiameter || config.diameter) || 0, Number(config.diameterB) || 0);
    const middleBLogicalLength = config.middleB === "直管"
      ? teeBMiddleVisualLengthMm(config)
      : config.middleB === "中接"
      ? teeMiddleLengthMm("中接", middleBReducerDiameter)
      : 0;
    const middleBWidth = compressedStraightVisualLength(middleBLogicalLength) * pxPerMm * 0.5 * (config.middleB === "中接" && middleBReducerDiameter >= 133 ? 0.5 : 1);
    const middleCWidth = sideMiddleVisualWidth(config.middleC, config.diameterC);
    const leftX = 600 - lengthVisual / 2;
    const rightX = 600 + lengthVisual / 2;
    const centerX = 600;
    const mainY = 300;
    const branchTopY = mainY - bodyHeight / 2;
    const fittingAX = leftX - middleAWidth;
    const fittingBX = centerX;
    const bFittingHeight = inlineFittingLength(config.fittingB, config.diameterB, pipeB);
    const bSeatAdjustY = ["外丝", "内丝", "双卡", "环压", "插焊"].includes(config.fittingB) ? -6 : 0;
    const fittingBY = (["直管", "中接"].includes(config.middleB) ? branchTopY - middleBWidth : branchTopY) + bSeatAdjustY;
    const fittingCX = rightX + middleCWidth;
    const fittingALength = inlineFittingLength(config.fittingA, config.diameterA, pipeA);
    const fittingCLength = inlineFittingLength(config.fittingC, config.diameterC, pipeC);
    const dimensionLeft = fittingAX - fittingALength;
    const dimensionRight = fittingCX + fittingCLength;
    const fittingACenterX = dimensionLeft + fittingALength / 2;
    const fittingCCenterX = dimensionRight - fittingCLength / 2;
    const fittingBCenterY = fittingBY - bFittingHeight / 2;
    const branchHeightMm = (Number(config.bodyDiameter || config.diameter) || 0) / 2
      + middleBLogicalLength
      + (isNoFitting(config.fittingB) ? 0 : inlineFittingLength(config.fittingB, config.diameterB, pipeB));
    const branchDimensionX = dimensionRight + Math.max(58, Math.max(pipeB, bodyHeight) * 0.18);
    const branchDimensionTopY = fittingBY - (isNoFitting(config.fittingB) ? 0 : bFittingHeight);
    const branchDimensionBottomY = mainY;
    const sideSpecY = Math.min(246, mainY - Math.max(pipeA, pipeC, bodyHeight) / 2 - 28);
    const bSpecY = fittingBY - bFittingHeight - 20;
    const labelFontSize = drawingColors.labelFontSize || 15;
    const bodyLabelFontSize = drawingColors.bodyLabelFontSize || 14;
    const dimensionFontSize = drawingColors.dimensionFontSize || labelFontSize;
    const layer = DrawingCore.layer || ((name, body) => `<g data-layer="${name}">${body || ""}</g>`);
    const totalLength = teeHorizontalTotalLengthMm(config);
    const bodyBottomY = mainY + bodyHeight / 2;
    const dimensionY = Math.max(405, bodyBottomY + Math.max(36, bodyHeight * 0.12));
    const dimensionExtensionTopY = Math.min(dimensionY - 26, bodyBottomY + 12);
    const dimensionLabelY = dimensionY - 15;
    const middleSvg = `
      ${config.middleA === "中接" ? reducerSegmentSvg(fittingAX, leftX, mainY, pipeA, bodyHeight) : ""}
      ${config.middleC === "中接" ? reducerSegmentSvg(rightX, fittingCX, mainY, bodyHeight, pipeC) : ""}
      ${config.middleB === "直管" ? `<rect x="${centerX - pipeB / 2}" y="${fittingBY}" width="${pipeB}" height="${branchTopY - fittingBY}" rx="0" fill="${drawingColors.pipeFill}" stroke="${drawingColors.stroke}" stroke-width="${drawingColors.objectLineWidth}"/>` : ""}
      ${config.middleB === "中接" ? `<path d="M ${centerX - pipeB / 2} ${fittingBY}
        L ${centerX + pipeB / 2} ${fittingBY}
        L ${centerX + bodyHeight / 2} ${branchTopY}
        L ${centerX - bodyHeight / 2} ${branchTopY}
        Z" fill="${drawingColors.pipeFill}" stroke="${drawingColors.stroke}" stroke-width="${drawingColors.objectLineWidth}" stroke-linejoin="round"/>` : ""}
    `;
    const objectLayer = `
      <rect x="${leftX}" y="${mainY - bodyHeight / 2}" width="${lengthVisual}" height="${bodyHeight}" rx="0" fill="${drawingColors.pipeFill}" stroke="${drawingColors.stroke}" stroke-width="${drawingColors.objectLineWidth}"/>
      ${middleSvg}
      ${inlineFittingSvg(config.fittingA, config.diameterA, fittingAX, mainY, pipeA, "left")}
      ${inlineFittingSvg(config.fittingC, config.diameterC, fittingCX, mainY, pipeC, "right")}
      ${verticalInlineFittingSvg(config.fittingB, config.diameterB, fittingBX, fittingBY, pipeB, "top")}
    `;
    const labelLayer = `
      <text x="${centerX}" y="${mainY + 5}" text-anchor="middle" dominant-baseline="middle" font-size="${bodyLabelFontSize}" fill="${drawingColors.label}">D${config.bodyDiameter || config.diameter}x${config.bodyThickness || config.thickness}</text>
      ${!isNoFitting(config.fittingA) ? `
        <text x="${fittingACenterX}" y="${mainY}" text-anchor="middle" dominant-baseline="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">A端</text>
        <text x="${fittingACenterX}" y="${sideSpecY}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">${config.diameterA} ${fittingLabel(config.fittingA)}</text>
      ` : ""}
      ${!isNoFitting(config.fittingB) ? `
        <text x="${fittingBX}" y="${fittingBCenterY + 4}" text-anchor="middle" dominant-baseline="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">B端</text>
        <text x="${fittingBX}" y="${bSpecY}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">${config.diameterB} ${fittingLabel(config.fittingB)}</text>
      ` : ""}
      ${!isNoFitting(config.fittingC) ? `
        <text x="${fittingCCenterX}" y="${mainY}" text-anchor="middle" dominant-baseline="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">C端</text>
        <text x="${fittingCCenterX}" y="${sideSpecY}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.label}">${config.diameterC} ${fittingLabel(config.fittingC)}</text>
      ` : ""}
    `;
    const dimensionLayer = `
      ${DrawingCore.horizontalDimension({
        x1: dimensionLeft, x2: dimensionRight, y: dimensionY,
        label: `总长 ${drawingTotalLengthText(totalLength, config.bodyDiameter || config.diameter)}`,
        color: drawingColors.dimension, labelColor: drawingColors.label,
        extensionStart: { fromY: dimensionExtensionTopY, toY: dimensionY + 10 },
        extensionEnd: { fromY: dimensionExtensionTopY, toY: dimensionY + 10 },
        labelY: dimensionLabelY, fontSize: dimensionFontSize
      })}
      ${branchHeightMm > 0 && typeof DrawingCore.verticalDimension === "function" ? DrawingCore.verticalDimension({
        x: branchDimensionX,
        y1: branchDimensionTopY,
        y2: branchDimensionBottomY,
        label: drawingTotalLengthText(branchHeightMm, config.diameterB, "H="),
        color: drawingColors.dimension,
        labelColor: drawingColors.label,
        extensionTop: { fromX: fittingBX + Math.max(pipeB, bodyHeight) / 2 + 8, toX: branchDimensionX },
        extensionBottom: { fromX: fittingBX + Math.max(pipeB, bodyHeight) / 2 + 8, toX: branchDimensionX },
        labelOffset: 18,
        fontSize: labelFontSize
      }) : ""}
    `;
    const content = `
      ${layer("object", objectLayer)}
      ${layer("dimension", dimensionLayer)}
      ${layer("label", labelLayer)}
    `;
    const bounds = {
      left: Math.min(dimensionLeft, fittingACenterX - 84),
      right: Math.max(dimensionRight, fittingCCenterX + 84, branchDimensionX + 42),
      top: Math.min(bSpecY - 24, fittingBY - bFittingHeight - 12, branchDimensionTopY - 18, sideSpecY - 24),
      bottom: dimensionY + 30
    };
    return typeof DrawingCore.fitContent === "function"
      ? DrawingCore.fitContent({
        bounds,
        box: showInfoPanels
          ? { left: 145, right: 1055, top: 130, bottom: 455 }
          : { left: 145, right: 1055, top: 120, bottom: 585 },
        content,
        minScale: 0.58
      })
      : content;
  }
  return { render };
});
