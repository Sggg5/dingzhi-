const assert = require("assert");
const DockingMiddleRenderer = require("../docking-middle-renderer");
const h = {
  clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
  dockingMiddleLengthMm: config => config.middleItems.reduce((sum, item) => sum + (item.type === "中接" ? 20 : item.length), 0),
  drawingColors: { pipeFill: "#eee", stroke: "#333", mutedLabel: "#777" },
  drawingLengthText: value => `${value} mm`,
  fittingLengthMm: () => 20,
  pipeVisualDiameter: value => value,
  productDefaultLength: () => 100
};
assert.deepStrictEqual(DockingMiddleRenderer.render({ middleItems: [] }, 100, 500, 200, h), { svg: "", leftX: 100, rightX: 500 });
const mixed = DockingMiddleRenderer.render({ diameterA: 40, diameterB: 50, middleItems: [{ type: "直管", length: 100 }, { type: "中接" }] }, 100, 500, 200, h);
assert(mixed.svg.includes("<rect") && mixed.svg.includes("<path"));
assert(mixed.leftX >= 100 && mixed.rightX <= 500);
const large = DockingMiddleRenderer.render({ diameterA: 133, diameterB: 159, middleItems: [{ type: "中接" }] }, 100, 500, 200, h);
assert(!large.svg.includes("NaN"));
console.log("docking middle renderer tests passed");
