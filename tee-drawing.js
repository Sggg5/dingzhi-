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
      verticalInlineFittingSvg
    } = helpers;
    const pipeA = pipeVisualDiameter(config.diameterA);
    const pipeB = pipeVisualDiameter(config.diameterB);
    const pipeC = pipeVisualDiameter(config.diameterC);
    const bodyHeight = pipeVisualDiameter(config.bodyDiameter || config.diameter);
    const lengthVisual = clamp((config.bodyLength || config.length) * 2.1, 140, 310);
    const pxPerMm = lengthVisual / Math.max(1, config.bodyLength || config.length);
    const middleAWidth = compressedStraightVisualLength(teeMiddleLengthMm(config.middleA, Math.max(config.bodyDiameter || config.diameter, config.diameterA))) * pxPerMm;
    const middleBWidth = compressedStraightVisualLength(teeBMiddleVisualLengthMm(config)) * pxPerMm * 0.5;
    const middleCWidth = compressedStraightVisualLength(teeMiddleLengthMm(config.middleC, Math.max(config.bodyDiameter || config.diameter, config.diameterC))) * pxPerMm;
    const leftX = 600 - lengthVisual / 2;
    const rightX = 600 + lengthVisual / 2;
    const centerX = 600;
    const mainY = 300;
    const branchTopY = mainY - bodyHeight / 2;
    const fittingAX = leftX - middleAWidth;
    const fittingBX = centerX;
    const bFittingHeight = inlineFittingLength(config.fittingB, config.diameterB, pipeB);
    const bSeatAdjustY = ["外丝", "内丝", "双卡", "环压", "插焊"].includes(config.fittingB) ? -6 : 0;
    const fittingBY = (config.middleB === "直管" ? branchTopY - middleBWidth : branchTopY) + bSeatAdjustY;
    const fittingCX = rightX + middleCWidth;
    const fittingALength = inlineFittingLength(config.fittingA, config.diameterA, pipeA);
    const fittingCLength = inlineFittingLength(config.fittingC, config.diameterC, pipeC);
    const dimensionLeft = fittingAX - fittingALength;
    const dimensionRight = fittingCX + fittingCLength;
    const fittingACenterX = dimensionLeft + fittingALength / 2;
    const fittingCCenterX = dimensionRight - fittingCLength / 2;
    const fittingBCenterY = fittingBY - bFittingHeight / 2;
    const sideSpecY = Math.min(246, mainY - Math.max(pipeA, pipeC, bodyHeight) / 2 - 28);
    const bSpecY = fittingBY - bFittingHeight - 20;
    const totalLength = teeHorizontalTotalLengthMm(config);
    const middleSvg = `
      ${config.middleA === "中接" ? reducerSegmentSvg(fittingAX, leftX, mainY, pipeA, bodyHeight) : ""}
      ${config.middleC === "中接" ? reducerSegmentSvg(rightX, fittingCX, mainY, bodyHeight, pipeC) : ""}
      ${config.middleB === "直管" ? `<rect x="${centerX - pipeB / 2}" y="${fittingBY}" width="${pipeB}" height="${branchTopY - fittingBY}" rx="0" fill="${drawingColors.pipeFill}" stroke="${drawingColors.stroke}" stroke-width="3"/>` : ""}
    `;
    return `
      <rect x="${leftX}" y="${mainY - bodyHeight / 2}" width="${lengthVisual}" height="${bodyHeight}" rx="0" fill="${drawingColors.pipeFill}" stroke="${drawingColors.stroke}" stroke-width="3"/>
      ${middleSvg}
      ${inlineFittingSvg(config.fittingA, config.diameterA, fittingAX, mainY, pipeA, "left")}
      ${inlineFittingSvg(config.fittingC, config.diameterC, fittingCX, mainY, pipeC, "right")}
      ${verticalInlineFittingSvg(config.fittingB, config.diameterB, fittingBX, fittingBY, pipeB, "top")}
      <text x="${centerX}" y="${mainY + 5}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="${drawingColors.label}">D${config.bodyDiameter || config.diameter}x${config.bodyThickness || config.thickness}</text>
      ${!isNoFitting(config.fittingA) ? `
        <text x="${fittingACenterX}" y="${mainY}" text-anchor="middle" dominant-baseline="middle" font-size="15" fill="${drawingColors.label}">A端</text>
        <text x="${fittingACenterX}" y="${sideSpecY}" text-anchor="middle" font-size="15" fill="${drawingColors.label}">${config.diameterA} ${fittingLabel(config.fittingA)}</text>
      ` : ""}
      ${!isNoFitting(config.fittingB) ? `
        <text x="${fittingBX}" y="${fittingBCenterY + 4}" text-anchor="middle" dominant-baseline="middle" font-size="15" fill="${drawingColors.label}">B端</text>
        <text x="${fittingBX}" y="${bSpecY}" text-anchor="middle" font-size="15" fill="${drawingColors.label}">${config.diameterB} ${fittingLabel(config.fittingB)}</text>
      ` : ""}
      ${!isNoFitting(config.fittingC) ? `
        <text x="${fittingCCenterX}" y="${mainY}" text-anchor="middle" dominant-baseline="middle" font-size="15" fill="${drawingColors.label}">C端</text>
        <text x="${fittingCCenterX}" y="${sideSpecY}" text-anchor="middle" font-size="15" fill="${drawingColors.label}">${config.diameterC} ${fittingLabel(config.fittingC)}</text>
      ` : ""}
      ${DrawingCore.horizontalDimension({
        x1: dimensionLeft, x2: dimensionRight, y: 405,
        label: `总长 ${drawingTotalLengthText(totalLength, config.bodyDiameter || config.diameter)}`,
        color: drawingColors.dimension, labelColor: drawingColors.label,
        extensionStart: { fromY: 330, toY: 415 }, extensionEnd: { fromY: 330, toY: 415 },
        labelY: 390, fontSize: 18
      })}
    `;
  }
  return { render };
});
