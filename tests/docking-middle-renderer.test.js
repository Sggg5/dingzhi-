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
assert.strictEqual(mixed.leftX, 100);
assert.strictEqual(mixed.rightX, 500);
const large = DockingMiddleRenderer.render({ diameterA: 133, diameterB: 159, middleItems: [{ type: "中接" }] }, 100, 500, 200, h);
assert(!large.svg.includes("NaN"));
const selectedMiddleDiameter = DockingMiddleRenderer.render({
  diameterA: 40,
  diameterB: 40,
  middlePipeDiameter: 76.1,
  middlePipeThickness: 2,
  middleItems: [{ type: "直管", length: 100, diameter: 76.1, thickness: 2 }]
}, 100, 500, 200, h);
assert(selectedMiddleDiameter.svg.includes('height="76.1"'));
assert(selectedMiddleDiameter.svg.includes("直管 76.1 x 2"));
console.log("docking middle renderer tests passed");
