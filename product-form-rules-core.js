(function (global) {
  function numberValue(value) {
    return Number(value);
  }

  function dockingMiddleAutoState({ diameterA, diameterB, previousPair = "", touched = false }) {
    const pair = `${diameterA}-${diameterB}`;
    const pairChanged = pair !== previousPair;
    const needsReducerMiddle = numberValue(diameterA) !== numberValue(diameterB);
    const shouldAutoMiddle = needsReducerMiddle && pairChanged && !touched;
    return {
      pair,
      pairChanged,
      needsReducerMiddle,
      shouldAutoMiddle,
      hasMiddle: shouldAutoMiddle ? true : undefined,
      middleCount: shouldAutoMiddle ? "1" : undefined,
      middleType: shouldAutoMiddle ? "中接" : undefined
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
