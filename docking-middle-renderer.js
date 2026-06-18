(function exposeDockingMiddleRenderer(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DockingMiddleRenderer = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createDockingMiddleRenderer() {
  function render(config, leftX, rightX, y, h) {
    const items = config.middleItems || [];
    if (items.length === 0) return { svg: "", leftX, rightX };
    const leftHeight = h.pipeVisualDiameter(config.diameterA);
    const rightHeight = h.pipeVisualDiameter(config.diameterB);
    const availableWidth = rightX - leftX;
    const middleLengthMm = h.dockingMiddleLengthMm(config);
    const pxPerMm = middleLengthMm > 0 ? h.clamp(availableWidth / middleLengthMm, 1.2, 4.8) : 2.4;
    const rawWidths = items.map(item => {
      if (item.type === "中接") {
        const adapterDiameter = Math.max(Number(config.diameterA), Number(config.diameterB));
        return h.fittingLengthMm("中接", adapterDiameter) * pxPerMm * (adapterDiameter >= 133 ? 0.5 : 1);
      }
      return Math.max(40, (Number(item.length) || h.productDefaultLength("对接类", config.diameterA)) * pxPerMm);
    });
    const totalRawWidth = rawWidths.reduce((sum, width) => sum + width, 0);
    const targetWidth = Math.min(availableWidth, Math.max(120, totalRawWidth));
    const scale = totalRawWidth > 0 ? targetWidth / totalRawWidth : 1;
    const widths = rawWidths.map(width => width * scale);
    const assemblyLeftX = (leftX + rightX - targetWidth) / 2;
    const objectLineWidth = h.drawingColors.objectLineWidth || 3;
    const smallFontSize = h.drawingColors.smallFontSize || 11;
    let cursor = assemblyLeftX;
    let currentHeight = leftHeight;
    const parts = items.map((item, index) => {
      const width = widths[index];
      const startX = cursor;
      const endX = cursor + width;
      cursor = endX;
      if (item.type === "中接") {
        const reducerStartX = startX + width * 0.12;
        const reducerEndX = startX + width * 0.88;
        const currentTop = y - currentHeight / 2;
        const currentBottom = y + currentHeight / 2;
        const nextTop = y - rightHeight / 2;
        const nextBottom = y + rightHeight / 2;
        currentHeight = rightHeight;
        return `<path d="M ${startX} ${currentTop} L ${reducerStartX} ${currentTop} L ${reducerEndX} ${nextTop}
          L ${endX} ${nextTop} L ${endX} ${nextBottom} L ${reducerEndX} ${nextBottom}
          L ${reducerStartX} ${currentBottom} L ${startX} ${currentBottom} Z"
          fill="${h.drawingColors.pipeFill}" stroke="${h.drawingColors.stroke}" stroke-width="${objectLineWidth}" stroke-linejoin="round"/>`;
      }
      return `<rect x="${startX}" y="${y - currentHeight / 2}" width="${width}" height="${currentHeight}" rx="0"
        fill="${h.drawingColors.pipeFill}" stroke="${h.drawingColors.stroke}" stroke-width="${objectLineWidth}"/>
        <text x="${(startX + endX) / 2}" y="${y + currentHeight / 2 + 24}" text-anchor="middle" font-size="${smallFontSize}"
        fill="${h.drawingColors.mutedLabel}">${h.drawingLengthText(item.length, "")}</text>`;
    }).join("");
    return { svg: parts, leftX: assemblyLeftX, rightX: assemblyLeftX + targetWidth };
  }
  return { render };
});
