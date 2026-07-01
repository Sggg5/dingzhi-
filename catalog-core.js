(function exposeCatalogCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.CatalogCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createCatalogCore() {
  function seriesEntries(options, series) {
    return [
      ...(options.branchOnlySeries?.[series] || []),
      ...(options.tubeSeries?.[series] || options.tubeSeries?.A || [])
    ];
  }

  function equivalentEntries(options, series) {
    return seriesEntries(options, series).filter(item => item.equivalent !== null);
  }

  function defaultWallThickness(options, series, diameter) {
    return seriesEntries(options, series).find(item => item.diameter === Number(diameter))?.thickness || 1.5;
  }

  function seriesDiameters(options, series) {
    return (options.tubeSeries?.[series] || options.tubeSeries?.A || []).map(item => item.diameter);
  }

  function equivalentSeriesDiameter(options, diameter, targetSeries) {
    const allSeriesEntries = Object.keys(options.tubeSeries || {}).map(series => equivalentEntries(options, series));
    const sourceIndex = allSeriesEntries
      .map(items => items.findIndex(item => item.diameter === Number(diameter)))
      .find(index => index >= 0);
    const targetEntries = equivalentEntries(options, targetSeries);
    return sourceIndex >= 0 ? targetEntries[sourceIndex]?.diameter : undefined;
  }

  function closestDiameter(diameter, values) {
    if (!values.length) return diameter;
    return values.reduce((best, item) => (
      Math.abs(Number(item) - Number(diameter)) < Math.abs(Number(best) - Number(diameter)) ? item : best
    ), values[0]);
  }

  function stableSeriesDiameter(options, currentDiameter, values, targetSeries) {
    const current = Number(currentDiameter);
    if (values.includes(current)) return current;
    const equivalent = equivalentSeriesDiameter(options, current, targetSeries);
    if (values.includes(equivalent)) return equivalent;
    if (Number.isFinite(current)) return closestDiameter(current, values);
    return values.includes(40) ? 40 : values[Math.min(2, values.length - 1)];
  }

  function seriesThicknesses(options, series) {
    return Array.from(new Set(seriesEntries(options, series).map(item => item.thickness))).sort((a, b) => a - b);
  }

  function branchOptions(options, series, mainDiameter) {
    return Array.from(new Set(seriesEntries(options, series).map(item => item.diameter)))
      .filter(diameter => diameter <= Number(mainDiameter))
      .sort((a, b) => a - b);
  }

  function fittingSettingDiameters(options, series) {
    return Array.from(new Set(seriesEntries(options, series).map(item => item.diameter))).sort((a, b) => a - b);
  }

  function isNoFitting(fittingName) {
    return fittingName === "直管" || fittingName === "无配件";
  }

  function isRingPressLike(fittingName) {
    return fittingName === "环压" || fittingName === "插焊";
  }

  function availableFittings(fittingNames, priceDiameter, fittingTable) {
    return fittingNames.filter(name => isNoFitting(name) || fittingTable?.[name]?.[priceDiameter] !== undefined);
  }

  return {
    availableFittings,
    branchOptions,
    closestDiameter,
    defaultWallThickness,
    equivalentSeriesDiameter,
    fittingSettingDiameters,
    isNoFitting,
    isRingPressLike,
    seriesDiameters,
    seriesEntries,
    seriesThicknesses,
    stableSeriesDiameter
  };
});
