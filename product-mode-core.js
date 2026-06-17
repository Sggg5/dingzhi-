(function (global) {
  function state(productType) {
    const manifoldMode = productType === "分水器类";
    const dockingMode = productType === "对接类";
    const teeMode = productType === "三通类";
    const elbowMode = productType === "弯头类";
    return {
      productType,
      manifoldMode,
      dockingMode,
      teeMode,
      elbowMode,
      fittingSectionHidden: manifoldMode,
      dockingOnlyHidden: !dockingMode,
      teeHidden: !teeMode,
      angleHidden: !elbowMode,
      productLengthLabel: elbowMode ? "中心高度 mm" : "中心长度/展开长度 mm"
    };
  }

  function elbowFieldHidden(mode, hasDockingField) {
    return hasDockingField ? !(mode.dockingMode || mode.elbowMode) : !mode.elbowMode;
  }

  function genericProductFieldHidden(mode, hasElbowField) {
    return mode.dockingMode || mode.teeMode || (mode.elbowMode && !hasElbowField);
  }

  const api = {
    state,
    elbowFieldHidden,
    genericProductFieldHidden
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.ProductModeCore = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
