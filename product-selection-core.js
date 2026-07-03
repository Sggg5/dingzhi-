(function exposeProductSelectionCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ProductSelectionCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createProductSelectionCore() {
  const LARGE_FITTING_DIAMETERS = new Set([133, 159, 219]);

  function isLargeFittingDiameter(diameter) {
    return LARGE_FITTING_DIAMETERS.has(Number(diameter));
  }

  function teeFittingOptions(diameter, options, availableFittings) {
    if (isLargeFittingDiameter(diameter)) {
      return availableFittings(["法兰", "沟槽", "对焊"], diameter);
    }
    return availableFittings(options.fittingConnections || [], diameter);
  }

  function elbowFittingOptions(diameter, options, availableFittings) {
    if (isLargeFittingDiameter(diameter)) {
      return availableFittings(["无配件", "法兰", "沟槽", "对焊"], diameter);
    }
    return teeFittingOptions(diameter, options, availableFittings);
  }

  function fittingOptionsForProduct(productType, diameter, options, availableFittings) {
    if (productType === "三通类") return teeFittingOptions(diameter, options, availableFittings);
    if (productType === "弯头类") return elbowFittingOptions(diameter, options, availableFittings);
    return availableFittings(options.fittingConnections || [], diameter);
  }

  return { elbowFittingOptions, fittingOptionsForProduct, isLargeFittingDiameter, teeFittingOptions };
});
