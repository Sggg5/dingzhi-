(function exposeProductGeometryCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ProductGeometryCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createProductGeometryCore() {
  function elbowRoundBody(startX, startY, endX, endY, width, angle, colors) {
    const half = width / 2;
    if (angle === 45) {
      const cornerX = startX + 170;
      const radius = Math.max(78, half + 24);
      const theta = Math.PI / 4;
      const tangentX = cornerX - radius;
      const arcEndX = tangentX + radius * Math.sin(theta);
      const arcEndY = startY - radius * (1 - Math.cos(theta));
      const nx = Math.sin(theta);
      const ny = Math.cos(theta);
      const innerRadius = Math.max(8, radius - half);
      const outerRadius = radius + half;
      const centerY = startY - radius;
      const innerArcEndX = tangentX + innerRadius * Math.sin(theta);
      const innerArcEndY = centerY + innerRadius * Math.cos(theta);
      const outerArcEndX = tangentX + outerRadius * Math.sin(theta);
      const outerArcEndY = centerY + outerRadius * Math.cos(theta);
      const bodyPath = `M ${startX} ${startY - half} L ${tangentX} ${startY - half}
        A ${innerRadius} ${innerRadius} 0 0 0 ${innerArcEndX} ${innerArcEndY}
        L ${endX - nx * half} ${endY - ny * half} L ${endX + nx * half} ${endY + ny * half}
        L ${outerArcEndX} ${outerArcEndY} A ${outerRadius} ${outerRadius} 0 0 1 ${tangentX} ${startY + half}
        L ${startX} ${startY + half} Z`;
      const centerPath = `M ${startX} ${startY} L ${tangentX} ${startY}
        A ${radius} ${radius} 0 0 0 ${arcEndX} ${arcEndY} L ${endX} ${endY}`;
      return bodySvg(bodyPath, centerPath, colors);
    }

    const cornerX = endX;
    const cornerY = startY;
    const radius = 78;
    const centerX = cornerX - radius;
    const centerY = cornerY - radius;
    const innerRadius = Math.max(8, radius - half);
    const outerRadius = radius + half;
    const bodyPath = `M ${startX} ${cornerY - half} L ${centerX} ${cornerY - half}
      A ${innerRadius} ${innerRadius} 0 0 0 ${cornerX - half} ${centerY}
      L ${endX - half} ${endY} L ${endX + half} ${endY} L ${cornerX + half} ${centerY}
      A ${outerRadius} ${outerRadius} 0 0 1 ${centerX} ${cornerY + half}
      L ${startX} ${cornerY + half} Z`;
    const centerPath = `M ${startX} ${cornerY} L ${centerX} ${cornerY}
      A ${radius} ${radius} 0 0 0 ${cornerX} ${centerY} L ${endX} ${endY}`;
    return bodySvg(bodyPath, centerPath, colors);
  }

  function bodySvg(bodyPath, centerPath, colors) {
    const centerLineColor = colors.centerLine || "#8b928e";
    const centerLineWidth = colors.centerLineWidth || 1;
    const centerLineDash = colors.centerLineDash || "7 6";
    const objectLineWidth = colors.objectLineWidth || 3;
    return `
      <path d="${bodyPath}" fill="${colors.pipeFill}" stroke="${colors.stroke}" stroke-width="${objectLineWidth}" stroke-linejoin="round"/>
      <path d="${centerPath}" fill="none" stroke="${centerLineColor}" stroke-width="${centerLineWidth}" stroke-dasharray="${centerLineDash}" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  }

  return { elbowRoundBody };
});
