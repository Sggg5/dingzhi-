const assert = require("assert");
const DockingDrawing = require("../docking-drawing");

const helpers = {
  DrawingCore: { horizontalDimension: ({ label, y }) => `<dimension>${label}</dimension><dimension-y value="${y}"/>` },
  clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
  dockingMiddleAssembly: () => ({ svg: "<middle/>", leftX: 500, rightX: 700 }),
  dockingTotalLengthMm: () => 180,
  drawingColors: { dimension: "#777", label: "#123" },
  drawingTotalLengthText: value => `L=${value} mm`,
  fittingLabel: value => value,
  inlineFittingLength: () => 30,
  inlineFittingSvg: (fitting, _diameter, x) => `<fitting name="${fitting}" x="${x}"/>`,
  isNoFitting: value => value === "无配件",
  pipeVisualDiameter: value => value
};

const config = {
  diameter: 40,
  diameterA: 40,
  diameterB: 50,
  fittingA: "外丝",
  fittingB: "法兰",
  middleItems: [{ type: "直管", length: 100 }]
};
const svg = DockingDrawing.render(config, helpers);
assert(svg.includes("<middle/>"));
assert(svg.includes('name="外丝" x="500"'));
assert(svg.includes('name="法兰" x="700"'));
assert(svg.includes("<dimension>L=180 mm</dimension>"));
assert(svg.includes("A端"));
assert(svg.includes("B端"));

const noFittingSvg = DockingDrawing.render({ ...config, fittingA: "无配件", middleItems: [] }, helpers);
assert.strictEqual(noFittingSvg.includes("A端"), false);

const largeSvg = DockingDrawing.render({
  ...config,
  diameterA: 219,
  diameterB: 219,
  middleItems: []
}, helpers);
const largeDimensionY = Number((largeSvg.match(/<dimension-y value="([^"]+)"/) || [])[1]);
assert(largeDimensionY > 372, "large docking dimension should move below the body");

console.log("docking drawing tests passed");
