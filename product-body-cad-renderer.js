(function exposeProductBodyCadRenderer(root, factory) {
  const api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ProductBodyCadRenderer = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createProductBodyCadRenderer(root) {
  function source() {
    return root.ProductBodyCadProfileData || null;
  }

  const explicitProfileSources = {
    "tee:0": { 15: 16 }
  };

  function profile(kind, angle, diameter) {
    const data = source();
    if (!data || !data.enabled) return null;
    const requestedDiameter = Number(diameter) || 0;
    const sourceDiameter = explicitProfileSources[`${kind}:${Number(angle) || 0}`]?.[requestedDiameter] || requestedDiameter;
    const item = data.getProfile(kind, angle, sourceDiameter);
    return item ? { ...item, requestedDiameter, explicitSourceDiameter: sourceDiameter } : null;
  }

  function path(points, close = false) {
    if (!points || points.length < 2) return "";
    return `M ${points.map(point => `${point[0]} ${point[1]}`).join(" L ")}${close ? " Z" : ""}`;
  }

  function profileSvg(item, transform, colors) {
    const outline = path(item.outline, true);
    const paths = item.paths.map(points =>
      `<path d="${path(points)}" vector-effect="non-scaling-stroke"/>`
    ).join("");
    return `<g class="product-body-cad product-body-cad-${item.kind}-${item.angle || 0}"
      data-source-diameter="${item.diameter}" data-requested-diameter="${item.requestedDiameter || item.diameter}" transform="${transform}"
      stroke="${colors.stroke}" stroke-width="${colors.objectLineWidth || 3}"
      stroke-linejoin="round" stroke-linecap="round">
      <path d="${outline}" fill="${colors.pipeFill}" stroke="none"/>
      <g fill="none">${paths}</g>
    </g>`;
  }

  function tee(diameter, centerX, mainY, pipeHeight, colors) {
    const item = profile("tee", 0, diameter);
    if (!item || !item.datums.C || !item.datums.B) return null;
    const scale = pipeHeight / item.diameter;
    const width = Math.abs(item.datums.C[0]) * scale;
    const leftX = centerX - width / 2;
    const rightX = centerX + width / 2;
    const branchX = leftX + item.datums.B[0] * scale;
    const branchY = mainY - item.datums.B[1] * scale;
    return {
      svg: profileSvg(item, `translate(${leftX} ${mainY}) scale(${scale} ${-scale})`, colors),
      leftX,
      rightX,
      branchX,
      branchY,
      branchHeightMm: Math.abs(item.datums.B[1]),
      width
    };
  }

  function elbow(diameter, angle, startX, startY, pipeHeight, colors) {
    const item = profile("elbow", angle, diameter);
    if (!item || !item.datums.B) return null;
    const scale = pipeHeight / item.diameter;
    const endX = startX + item.datums.B[0] * scale;
    const endY = startY + item.datums.B[1] * scale;
    return {
      svg: profileSvg(item, `translate(${startX} ${startY}) scale(${scale})`, colors),
      startX,
      startY,
      endX,
      endY,
      width: pipeHeight
    };
  }

  return { elbow, profile, tee };
});
