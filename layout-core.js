(function exposeLayoutCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.LayoutCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createLayoutCore() {
  function branchSpacings(config) {
    return (config.branches || [])
      .slice(0, Math.max(0, Number(config.branchCount) - 1))
      .map(branch => Number(branch.spacingAfter) || Number(config.branchSpacing) || 0);
  }

  function branchLayout(config) {
    const sourceSpacings = branchSpacings(config);
    const spacingAt = index => Number(sourceSpacings[index]) || Number(config.branchSpacing) || 0;
    const offsets = (config.branches || []).map((_, index) => {
      if (config.manifoldType === "双排对齐") {
        const pairIndex = Math.floor(index / 2);
        return sourceSpacings.slice(0, pairIndex).reduce((sum, spacing) => sum + spacing, 0);
      }

      if (config.manifoldType === "双排交错") {
        const pairIndex = Math.floor(index / 2);
        const base = sourceSpacings.slice(0, pairIndex).reduce((sum, spacing) => sum + spacing, 0);
        return index % 2 === 1 ? base + spacingAt(pairIndex) / 2 : base;
      }

      return sourceSpacings.slice(0, index).reduce((sum, spacing) => sum + spacing, 0);
    });
    const stations = Array.from(new Set(offsets.map(offset => Math.round(offset * 1000) / 1000)))
      .sort((a, b) => a - b);
    const stationSpacings = stations.slice(1).map((station, index) => station - stations[index]);

    return {
      offsets,
      stations,
      stationSpacings,
      span: stations.length ? stations[stations.length - 1] - stations[0] : 0
    };
  }

  function spacingExpression(spacings) {
    if (!spacings.length) return "0";
    if (spacings.every(spacing => spacing === spacings[0])) {
      return `${spacings[0]}x${spacings.length}`;
    }
    return spacings.join(" + ");
  }

  function spacingSpec(config) {
    const spacings = branchSpacings(config);
    if (!spacings.length) return "0 mm";
    if (spacings.every(spacing => spacing === spacings[0])) {
      return `${spacings[0]} mm`;
    }
    return spacings.map((spacing, index) => `${index + 1}-${index + 2}:${spacing}mm`).join("，");
  }

  return { branchLayout, branchSpacings, spacingExpression, spacingSpec };
});
