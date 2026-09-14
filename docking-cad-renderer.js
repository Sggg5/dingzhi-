(function exposeDockingCadRenderer(root, factory) {
  const api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DockingCadRenderer = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createDockingCadRenderer(root) {
  function dataSource() {
    return root.DockingCadProfileData || null;
  }

  function profile(type, diameter) {
    const source = dataSource();
    if (!source || !source.enabled) return null;
    return source.getProfile(type, diameter);
  }

  function profilePath(points, close = false) {
    if (!points || points.length < 2) return "";
    return `M ${points.map(point => `${point[0]} ${point[1]}`).join(" L ")}${close ? " Z" : ""}`;
  }

  function fittingScale(item, pipeHeight) {
    const nominalDiameter = Number(item && item.diameter);
    if (nominalDiameter > 0) return pipeHeight / nominalDiameter;
    return pipeHeight / Math.max(1, Number(item && item.bounds && item.bounds.height) || 1);
  }

  function fittingLength(type, diameter, pipeHeight, fallback) {
    const item = profile(type, diameter);
    if (!item || !["外丝", "内丝", "双卡", "单卡", "环压", "插焊", "法兰", "堵头", "沟槽", "对焊"].includes(type)) return fallback;
    const scale = fittingScale(item, pipeHeight);
    return item.bounds.width * scale;
  }

  function fittingEnvelopeHeight(type, diameter, pipeHeight, fallback) {
    const item = profile(type, diameter);
    if (!item || !["外丝", "内丝", "双卡", "单卡", "环压", "插焊", "法兰", "堵头", "沟槽", "对焊"].includes(type)) return fallback;
    const scale = fittingScale(item, pipeHeight);
    return item.bounds.height * scale;
  }

  function fitting(type, diameter, datumX, y, pipeHeight, side, colors) {
    const item = profile(type, diameter);
    if (!item || !["外丝", "内丝", "双卡", "单卡", "环压", "插焊", "法兰", "堵头", "沟槽", "对焊"].includes(type)) return "";
    const scale = fittingScale(item, pipeHeight);
    const sourceExtendsLeft = item.datum === "right";
    const mirror = side === "left" ? !sourceExtendsLeft : sourceExtendsLeft;
    const xScale = mirror ? -scale : scale;
    const outline = profilePath(item.outline, true);
    const paths = item.paths.map(points => `<path d="${profilePath(points)}" vector-effect="non-scaling-stroke"/>`).join("");
    // Profile paths use non-scaling-stroke, so the requested display width must
    // not be divided by the geometry scale. This keeps fittings and bodies at
    // the same visible line weight for every nominal diameter.
    const strokeWidth = colors.fittingLineWidth || colors.objectLineWidth || 2;
    const connectionBandX = -1;
    const connectionBandWidth = Math.max(1, Number(item.bounds?.width) || 1) + 2;
    const connectionBandHeight = Math.max(1, Number(item.diameter) || Number(item.bounds?.height) || 1);
    return `<g class="docking-cad-fitting docking-cad-fitting-${type}" data-source-diameter="${item.diameter}"
      transform="translate(${datumX} ${y}) scale(${xScale} ${-scale})"
      stroke="${colors.fittingStroke || colors.stroke}" stroke-width="${strokeWidth}"
      stroke-linejoin="round" stroke-linecap="round">
      <rect class="docking-cad-fitting-mask" x="${connectionBandX}" y="${-connectionBandHeight / 2}"
        width="${connectionBandWidth}" height="${connectionBandHeight}"
        fill="${colors.fittingFill || "#f7f3e8"}" stroke="none"/>
      <path d="${outline}" fill="${colors.fittingFill || "#f7f3e8"}" stroke="none"/>
      <g fill="none">${paths}</g>
    </g>`;
  }

  function straight(diameter, x1, x2, y, visualHeight, colors) {
    const item = profile("直管", diameter);
    if (!item || !(x2 > x1)) return "";
    const xScale = (x2 - x1) / item.bounds.width;
    const yScale = visualHeight / item.bounds.height;
    const outline = profilePath(item.outline, true);
    const paths = item.paths.map(points => `<path d="${profilePath(points)}" vector-effect="non-scaling-stroke"/>`).join("");
    const lineWidth = colors.objectLineWidth || 3;
    return `<g class="docking-cad-straight" data-source-diameter="${item.diameter}">
      <g transform="translate(${x1} ${y}) scale(${xScale} ${-yScale})">
        <path d="${outline}" fill="${colors.pipeFill}" stroke="none"/>
      </g>
      <g transform="translate(${x1} ${y}) scale(${xScale} ${-yScale})"
        fill="none" stroke="${colors.stroke}" stroke-width="${lineWidth}">
        ${paths}
      </g>
    </g>`;
  }

  return { fitting, fittingEnvelopeHeight, fittingLength, profile, straight };
});
