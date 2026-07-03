(function (global) {
  function numberValue(value) {
    return Number(value);
  }

  function dockingMiddleAutoState({ diameterA, diameterB, thicknessA = "", thicknessB = "", previousPair = "", touched = false }) {
    const pair = `${diameterA}x${thicknessA}-${diameterB}x${thicknessB}`;
    const pairChanged = pair !== previousPair;
    const needsReducerMiddle = numberValue(diameterA) !== numberValue(diameterB)
      || numberValue(thicknessA) !== numberValue(thicknessB);
    const shouldAutoReducer = needsReducerMiddle && pairChanged && !touched;
    const shouldAutoStraight = !needsReducerMiddle && pairChanged && Boolean(previousPair) && !touched;
    const shouldAutoMiddle = shouldAutoReducer || shouldAutoStraight;
    return {
      pair,
      pairChanged,
      needsReducerMiddle,
      shouldAutoMiddle,
      hasMiddle: shouldAutoMiddle ? true : undefined,
      middleCount: shouldAutoMiddle ? "1" : undefined,
      middleType: shouldAutoReducer ? "中接" : (shouldAutoStraight ? "直管" : undefined)
    };
  }

  function dockingSideMiddleAutoState({
    diameterA,
    thicknessA = "",
    diameterB,
    thicknessB = "",
    middleDiameter,
    middleThickness = "",
    changedId = "",
    touched = false,
    currentMiddleA = "无",
    currentMiddleB = "无"
  }) {
    const triggers = new Set([
      "productDiameterA",
      "productThicknessA",
      "productDiameterB",
      "productThicknessB",
      "productMiddleDiameter",
      "productMiddleThickness",
      "tubeSeries",
      "productType"
    ]);
    if (touched || !triggers.has(changedId)) {
      return { middleA: currentMiddleA, middleB: currentMiddleB, changed: false };
    }
    const aNeedsReducer = numberValue(diameterA) !== numberValue(middleDiameter)
      || numberValue(thicknessA) !== numberValue(middleThickness);
    const bNeedsReducer = numberValue(diameterB) !== numberValue(middleDiameter)
      || numberValue(thicknessB) !== numberValue(middleThickness);
    return {
      middleA: aNeedsReducer ? "中接" : "无",
      middleB: bNeedsReducer ? "中接" : "无",
      changed: true
    };
  }

  function elbowSideMiddleValue({ changedId, side, sideDiameter, bodyDiameter, currentMiddle }) {
    const triggers = new Set(["elbowBodyDiameter", `elbowDiameter${side}`, "tubeSeries"]);
    if (triggers.has(changedId) && numberValue(sideDiameter) !== numberValue(bodyDiameter) && currentMiddle === "无") {
      return "中接";
    }
    return currentMiddle;
  }

  function teeSideMiddleValue({ changedId, side, sideDiameter, bodyDiameter, currentMiddle }) {
    const triggers = new Set([`teeDiameter${side}`, "teeBodyDiameter", "tubeSeries"]);
    if (!triggers.has(changedId)) return currentMiddle;
    return numberValue(sideDiameter) === numberValue(bodyDiameter) ? "无" : "中接";
  }

  function teeBMiddleForFitting({ changedId, fittingB, currentMiddleB, currentLengthB }) {
    if (changedId === "teeFittingB" && fittingB === "法兰") {
      return { middleB: "直管", lengthB: "50" };
    }
    return { middleB: currentMiddleB, lengthB: currentLengthB };
  }

  const api = {
    dockingMiddleAutoState,
    dockingSideMiddleAutoState,
    elbowSideMiddleValue,
    teeSideMiddleValue,
    teeBMiddleForFitting
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.ProductFormRulesCore = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
