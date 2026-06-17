(function exposeMaterialPriceCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.MaterialPriceCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createMaterialPriceCore() {
  function nextSteelTonPrice({ changedId, previousMaterial, currentMaterial, currentSteelPrice, ratio316, defaultSteelTonPrice }) {
    if (changedId !== "material") return null;
    const previous = previousMaterial || "304";
    const current = currentMaterial || "304";
    const price = Math.max(0, Number(currentSteelPrice) || 0);
    if (current === "316L" && previous === "304") return Math.round(price * ratio316);
    if (current === "304" && previous === "316L") return Math.round(price / ratio316);
    return defaultSteelTonPrice[current] || defaultSteelTonPrice["304"];
  }

  return { nextSteelTonPrice };
});
