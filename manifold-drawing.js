(function exposeManifoldDrawing(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ManifoldDrawing = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createManifoldDrawing() {
  function render(config, result, helpers) {
    const {
      DrawingCore, branchFittingSeatOffset, branchFittingSize, branchFittingSvg, branchLayout,
      drawingBomRows, drawingColors, drawingLengthText, drawingTotalLengthText, fittingLabel,
      inletFittingLength, inletFittingSvg, pipeVisualDiameter, reducerSegmentSvg, svgTextLines, tailFittingLength,
      tailFittingSvg, titleBranchSummary, tubeSeriesLabel,
      showInfoPanels = true
    } = helpers;
    const mainY = 285;
    const layout = branchLayout(config);
    const mainHeight = pipeVisualDiameter(config.mainDiameter);
    const mainFittingDiameter = config.mainFittingDiameter || config.mainDiameter;
    const tailFittingDiameter = config.tailFittingDiameter || config.mainDiameter;
    const inletFittingHeight = pipeVisualDiameter(mainFittingDiameter);
    const tailFittingHeight = pipeVisualDiameter(tailFittingDiameter);
    const inletAdapterLength = config.mainAdapterEnabled ? 24 : 0;
    const tailAdapterLength = config.tailAdapterEnabled ? 24 : 0;
    const inletBodyLength = inletFittingLength(config, inletFittingHeight);
    const tailBodyLength = tailFittingLength(config, tailFittingHeight);
    const inletLength = inletBodyLength + inletAdapterLength;
    const tailLength = tailBodyLength + tailAdapterLength;
    const frameDimensionLeft = 145;
    const frameDimensionRight = 1150;
    const availableDimensionWidth = frameDimensionRight - frameDimensionLeft;
    const layoutTotalLength = Math.max(1, layout.span + config.inletAllowance + config.tailAllowance);
    const allowanceScale = Math.min(1.1, availableDimensionWidth / layoutTotalLength);
    const firstBranch = config.branches[0];
    const firstBranchWidth = firstBranch ? pipeVisualDiameter(firstBranch.diameter) : 0;
    const firstBranchFittingWidth = firstBranch ? branchFittingSize(firstBranch, firstBranchWidth).width : 0;
    const lastBranch = config.branches[config.branches.length - 1];
    const lastBranchWidth = lastBranch ? pipeVisualDiameter(lastBranch.diameter) : 0;
    const lastBranchFittingWidth = lastBranch ? branchFittingSize(lastBranch, lastBranchWidth).width : 0;
    const inletBranchClearance = Math.max(34, firstBranchFittingWidth / 2 + 18);
    const tailBranchClearance = Math.max(34, lastBranchFittingWidth / 2 + 18);
    const visualInletAllowance = Math.max(36, config.inletAllowance * allowanceScale, inletLength + inletBranchClearance);
    const visualTailAllowance = Math.max(24, config.tailAllowance * allowanceScale, tailLength + tailBranchClearance);
    const usableWidth = Math.max(280, Math.min(720, availableDimensionWidth - visualInletAllowance - visualTailAllowance));
    const spanScale = layout.span > 0 ? usableWidth / layout.span : 0;
    const visualTotalWidth = visualInletAllowance + usableWidth + visualTailAllowance;
    const centeredDimensionLeft = (frameDimensionLeft + frameDimensionRight - visualTotalWidth) / 2;
    const dimensionStart = Math.max(frameDimensionLeft, Math.min(centeredDimensionLeft, frameDimensionRight - visualTotalWidth));
    const startX = dimensionStart + visualInletAllowance;
    const branchXs = layout.offsets.map(offset => startX + offset * spanScale);
    const stationXs = layout.stations.map(offset => startX + offset * spanScale);
    const stationPitch = stationXs.length > 1
      ? Math.min(...stationXs.slice(1).map((x, index) => Math.abs(x - stationXs[index])))
      : Infinity;
    const denseBranchLayout = config.branches.length >= 12 && stationPitch < 52;
    const endX = stationXs[stationXs.length - 1] || startX;
    const mainLeft = startX - visualInletAllowance + inletLength;
    const mainRight = endX + visualTailAllowance - tailLength;
    const inletFittingAnchor = mainLeft - inletAdapterLength;
    const tailFittingAnchor = mainRight + tailAdapterLength;
    const dimensionLeft = mainLeft - inletLength;
    const dimensionRight = mainRight + tailLength;
    const mainFittingLabelY = mainY - mainHeight / 2 - Math.max(24, Math.min(52, mainHeight * 0.5));
    const mainFittingLabelX = config.mainFitting === "直管" ? mainLeft : dimensionLeft + inletBodyLength / 2;
    const tailFittingLabelX = config.tailFitting === "直管" ? mainRight : tailFittingAnchor + tailBodyLength / 2;
    const baseDimensionY = mainY + mainHeight / 2 + (config.manifoldType === "单排" ? 36 : 90);
    const totalLengthText = `总长 ${drawingTotalLengthText(result.mainLength, config.mainDiameter)}`;
    const titleSpec = `D${config.mainDiameter}x${titleBranchSummary(config)} 分水器`;
    const bomRows = drawingBomRows(config);
    const lowerShiftY = 0;
    const infoBoxHeight = Math.max(110, 54 + bomRows.length * 15);
    const infoBoxWidth = 300;
    const labelFontSize = drawingColors.labelFontSize || 13;
    const infoFontSize = drawingColors.infoFontSize || 13;
    const smallFontSize = drawingColors.smallFontSize || 11;
    const branchLabelFontSize = denseBranchLayout ? Math.min(9, labelFontSize) : labelFontSize;
    const branchSmallFontSize = denseBranchLayout ? Math.min(8, smallFontSize) : smallFontSize;
    const dimensionFontSize = denseBranchLayout ? 8 : smallFontSize;
    const layer = DrawingCore.layer || ((name, body, attributes = "") => `<g data-layer="${name}"${attributes ? ` ${attributes}` : ""}>${body || ""}</g>`);
    const compactDimensionLabel = label => denseBranchLayout ? String(label).replace(/\s*mm$/, "") : label;
    const dimLine = (x1, x2, y, label, longStart = false, longEnd = false) => DrawingCore.horizontalDimension({
      x1, x2, y, label: compactDimensionLabel(label), fontSize: dimensionFontSize,
      color: drawingColors.dimension, labelColor: drawingColors.label, lineWidth: 1.4,
      extensionStart: { fromY: y - 18, toY: longStart ? y + 47 : y + 12 },
      extensionEnd: { fromY: y - 18, toY: longEnd ? y + 47 : y + 12 }
    });
    let contentTop = mainY - mainHeight / 2;
    let contentBottom = mainY + mainHeight / 2;
    let bottomBranchClearBottom = mainY + mainHeight / 2;
    const branches = config.branches.map((branch, index) => {
      if (branch.fitting === "无配件") return "";
      const x = branchXs[index];
      const manualSide = branch.side;
      const isBottom = config.manifoldType !== "单排" && (manualSide === "下" || (manualSide !== "上" && index % 2 === 1));
      const branchWidth = pipeVisualDiameter(branch.diameter);
      const visualBranchHeight = Math.min(branch.height, branch.fitting === "双卡" ? 50 : 80);
      const branchPipeHeight = visualBranchHeight > 0 ? 36 + visualBranchHeight * 0.55 : 0;
      const fittingSize = branchFittingSize(branch, branchWidth);
      const topFittingY = mainY - mainHeight / 2 - branchPipeHeight - fittingSize.height - branchFittingSeatOffset(branch, fittingSize.height);
      const fittingY = isBottom ? 2 * mainY - topFittingY - fittingSize.height : topFittingY;
      const labelLift = Math.max(branch.height > 0 ? 26 : 24, fittingSize.height * 0.46);
      const extraLift = branch.fitting === "双卡" ? 10 : 0;
      const labelY = isBottom ? fittingY + fittingSize.height + labelLift + extraLift : Math.max(18, fittingY - labelLift - extraLift);
      const numberY = isBottom ? labelY + 28 : labelY - 28;
      contentTop = Math.min(contentTop, fittingY - 6, labelY - 18, numberY - 14);
      contentBottom = Math.max(contentBottom, fittingY + fittingSize.height + 6, labelY + 18, numberY + 14);
      if (isBottom) {
        bottomBranchClearBottom = Math.max(bottomBranchClearBottom, fittingY + fittingSize.height + 6, labelY + 18, numberY + 14);
      }
      const heightLabel = branch.height > 0
        ? `<text x="${x}" y="${isBottom ? labelY - 15 : labelY + 15}" text-anchor="middle" font-size="${branchSmallFontSize}" fill="${drawingColors.mutedLabel}">${denseBranchLayout ? "加高" : "加高 "}${branch.height}</text>`
        : "";
      const topPipe = branchPipeHeight > 0 ? `<rect x="${x - branchWidth / 2}" y="${mainY - mainHeight / 2 - branchPipeHeight}" width="${branchWidth}" height="${branchPipeHeight}" fill="${drawingColors.pipeFill}" stroke="${drawingColors.stroke}" stroke-width="${drawingColors.secondaryLineWidth}"/>` : "";
      const topFitting = branchFittingSvg(branch, x, topFittingY, branchWidth);
      const topConnector = branchPipeHeight > 0 ? `<line x1="${x}" y1="${topFittingY + fittingSize.height}" x2="${x}" y2="${mainY - mainHeight / 2 - branchPipeHeight}" stroke="${drawingColors.stroke}" stroke-width="${drawingColors.secondaryLineWidth}"/>` : "";
      const branchGraphic = isBottom ? `<g transform="translate(0 ${2 * mainY}) scale(1 -1)">${topPipe}${topFitting}${topConnector}</g>` : `${topPipe}${topFitting}${topConnector}`;
      return `
        <circle cx="${x}" cy="${numberY}" r="${denseBranchLayout ? 8 : 10}" fill="#fff" stroke="${drawingColors.label}" stroke-width="1.3"/>
        <text x="${x}" y="${numberY + (denseBranchLayout ? 3 : 4)}" text-anchor="middle" font-size="${branchSmallFontSize}" fill="${drawingColors.label}">${index + 1}</text>
        ${branchGraphic}
        <text x="${x}" y="${labelY}" text-anchor="middle" font-size="${branchLabelFontSize}" fill="${drawingColors.label}">${branch.diameter}${branch.fitting === "直管" ? "" : `${denseBranchLayout ? "" : " "}${branch.fitting}`}</text>
        ${heightLabel}
      `;
    }).join("");
    const dimensionY = config.manifoldType === "单排"
      ? baseDimensionY
      : Math.max(baseDimensionY, bottomBranchClearBottom + 18);
    const totalDimensionY = dimensionY + 45;
    const infoBoxY = config.manifoldType === "单排" ? 430 : 500;
    contentBottom = Math.max(contentBottom, totalDimensionY + 18);
    const mainContent = `
      <rect x="${mainLeft}" y="${mainY - mainHeight / 2}" width="${mainRight - mainLeft}" height="${mainHeight}" fill="${drawingColors.pipeFill}" stroke="${drawingColors.stroke}" stroke-width="${drawingColors.objectLineWidth}"/>
      ${DrawingCore.centerLine(mainLeft - 40, mainY, dimensionRight + 8, mainY)}
      ${branches}
      ${config.mainAdapterEnabled ? reducerSegmentSvg(inletFittingAnchor, mainLeft, mainY, inletFittingHeight, mainHeight) : ""}
      ${config.tailAdapterEnabled ? reducerSegmentSvg(mainRight, tailFittingAnchor, mainY, mainHeight, tailFittingHeight) : ""}
      ${inletFittingSvg(config, inletFittingAnchor, mainY, inletFittingHeight)}
      ${tailFittingSvg(config, tailFittingAnchor, mainY, tailFittingHeight)}
      ${dimLine(dimensionLeft, startX, dimensionY, drawingLengthText(result.inletAllowance, "L="), true, false)}
      ${Array.from({ length: Math.max(0, stationXs.length - 1) }, (_, index) => dimLine(stationXs[index], stationXs[index + 1], dimensionY, drawingLengthText(layout.stationSpacings[index], "P="))).join("")}
      ${dimLine(endX, dimensionRight, dimensionY, drawingLengthText(result.tailAllowance, "E="), false, true)}
      ${DrawingCore.horizontalDimension({ x1: dimensionLeft, x2: dimensionRight, y: totalDimensionY, label: totalLengthText, color: drawingColors.dimension, labelColor: drawingColors.label, lineWidth: 1.5, labelY: totalDimensionY - 13, fontSize: drawingColors.labelFontSize || 15 })}
      <text x="${(startX + endX) / 2}" y="${mainY + 5}" text-anchor="middle" font-size="${drawingColors.bodyLabelFontSize || 14}" fill="${drawingColors.label}">主管 ${config.mainDiameter} x ${config.wallThickness}${config.mainPositiveTolerance ? " 正公差" : ""}</text>
      <text x="${mainFittingLabelX}" y="${mainFittingLabelY}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.mutedLabel}">${mainFittingDiameter}${config.mainFitting === "直管" ? "" : ` ${config.mainFitting}`}</text>
      <text x="${tailFittingLabelX}" y="${mainFittingLabelY}" text-anchor="middle" font-size="${labelFontSize}" fill="${drawingColors.mutedLabel}">${tailFittingDiameter}${config.tailFitting === "直管" ? "" : ` ${fittingLabel(config.tailFitting)}`}</text>
    `;
    const fittedMainContent = typeof DrawingCore.fitContent === "function"
      ? DrawingCore.fitContent({
        bounds: {
          left: Math.min(dimensionLeft, mainFittingLabelX - 72),
          right: Math.max(dimensionRight, tailFittingLabelX + 72),
          top: Math.min(contentTop, mainFittingLabelY - 18),
          bottom: contentBottom
        },
        box: showInfoPanels
          ? { left: 132, right: 1160, top: 110, bottom: infoBoxY - 38 }
          : { left: 132, right: 1160, top: 118, bottom: 585 },
        content: mainContent,
        minScale: config.manifoldType === "单排" ? 0.58 : 0.44,
        fitOnlyOnOverflow: showInfoPanels
      })
      : mainContent;
    return `
      <defs>${DrawingCore.arrowMarker(drawingColors.dimension)}</defs>
      ${layer("frame", DrawingCore.engineeringFrame(config.quoteNo))}
      ${layer("product", fittedMainContent)}
      ${layer("info", `
        ${DrawingCore.infoBox({ x: 180, y: infoBoxY, width: infoBoxWidth, height: infoBoxHeight, title: "尺寸说明", content: `<text x="18" y="56" font-size="${infoFontSize}" fill="${drawingColors.label}">L：进水端尺寸</text><text x="18" y="78" font-size="${infoFontSize}" fill="${drawingColors.label}">P：支管间距</text><text x="18" y="100" font-size="${infoFontSize}" fill="${drawingColors.label}">E：末尾尺寸</text>` })}
        ${DrawingCore.infoBox({ x: 500, y: infoBoxY, width: infoBoxWidth, height: infoBoxHeight, title: "技术参数", content: `<text x="18" y="58" font-size="${infoFontSize}" fill="${drawingColors.label}">主管：D${config.mainDiameter} x ${config.wallThickness}${config.mainPositiveTolerance ? " 正公差" : ""}</text><text x="18" y="82" font-size="${infoFontSize}" fill="${drawingColors.label}">材质：不锈钢 ${config.material}</text><text x="18" y="104" font-size="${infoFontSize}" fill="${drawingColors.label}">单位：mm</text>` })}
        ${DrawingCore.bomBox({ x: 820, y: infoBoxY, width: infoBoxWidth, height: infoBoxHeight, rows: bomRows, labelColor: drawingColors.label, lineHeight: Math.min(15, Math.max(11, (infoBoxHeight - 56) / Math.max(1, bomRows.length))), fontSize: 11 })}
      `, `style="${showInfoPanels ? "" : "display:none"}"`)}
      ${layer("notes", DrawingCore.technicalRequirements({ y: 625 + lowerShiftY, lines: ["1、分水器不得有气孔、夹渣、缩松等影响其强度的缺陷:", "3、未注公差按国标GB/T 19928.2；", "4、未注尺寸公差按国标GB/T1804-2000m:", "5、交货时酸洗钝化后焊件表面应清洁无氧化皮和其它污物，颜色为银白色。"] }))}
      ${layer("titleblock", DrawingCore.titleBlock({ y: 675, material: config.material, titleSvg: svgTextLines(titleSpec, 613.5, 72, { maxChars: 22, lineHeight: 16, fontSize: 14, multiLineOffset: 3 }), productLabel: `${tubeSeriesLabel[config.tubeSeries] || ""}定制产品`, productCode: config.productCode }))}
    `;
  }
  return { render };
});
