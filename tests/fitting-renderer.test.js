const assert = require("assert");
require("../fitting-profile-core");
require("../cad-profile-data");
const FittingRenderer = require("../fitting-renderer");

const path = name => (...args) => `<${name} x="${args[0]}"/>`;
const h = {
  drawingColors: { fittingFill: "#eee", fittingStroke: "#333", capFill: "#ddd", stroke: "#222" },
  flangeVisualWidth: () => 20,
  doubleCardVisualSize: () => ({ width: 50, height: 30 }),
  ringPressVisualSize: () => ({ width: 45, height: 28 }),
  threadVisualWidth: () => 40,
  isRingPressLike: value => value === "环压" || value === "插焊",
  isNoFitting: value => value === "无配件",
  flangePath: path("flange"), doubleCardPath: path("double-card"), ringPressPath: path("ring-press"),
  innerThreadPath: path("inner-thread"), outerThreadPath: path("outer-thread"),
  groovePath: path("groove"), buttWeldPath: path("butt-weld"), capPath: path("cap")
};

assert.strictEqual(FittingRenderer.inlet({ mainFitting: "直管", mainDiameter: 40 }, 100, 50, 40, h), "");
assert(FittingRenderer.inlet({ mainFitting: "法兰", mainDiameter: 40 }, 100, 50, 40, h).includes("<flange"));
assert(FittingRenderer.inlet({ mainFitting: "外丝", mainDiameter: 40 }, 100, 50, 40, h).includes("<outer-thread"));
assert(FittingRenderer.inlet({ mainFitting: "插焊", mainDiameter: 40 }, 100, 50, 40, h).includes("<ring-press"));
assert(FittingRenderer.tail({ tailFitting: "堵头" }, 100, 50, 40, h).includes("<cap"));
assert(FittingRenderer.tail({ tailFitting: "法兰", mainDiameter: 40 }, 100, 50, 40, h).includes("scale(-1 1)"));
assert.strictEqual(FittingRenderer.inline("无配件", 40, 100, 50, 40, "left", h), "");
assert(FittingRenderer.verticalInline("外丝", 40, 100, 50, 40, "bottom", h).includes("rotate(-90"));

console.log("fitting renderer tests passed");
