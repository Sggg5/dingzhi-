const assert = require("assert");
const TeeDrawing = require("../tee-drawing");
const helpers = {
  DrawingCore: { horizontalDimension: ({ label, y }) => `<dimension>${label}</dimension><dimension-y value="${y}"/>` },
  clamp: (v, min, max) => Math.min(max, Math.max(min, v)),
  compressedStraightVisualLength: v => v,
  drawingColors: { pipeFill: "#eee", stroke: "#333", label: "#123", dimension: "#777" },
  drawingTotalLengthText: v => `L=${v} mm`,
  fittingLabel: v => v,
  inlineFittingLength: () => 30,
  inlineFittingSvg: (name, _d, x) => `<inline name="${name}" x="${x}"/>`,
  isNoFitting: v => v === "无配件",
  pipeVisualDiameter: v => v,
  reducerSegmentSvg: (leftX, rightX) => `<reducer width="${Math.abs(rightX - leftX)}"/>`,
  teeBMiddleVisualLengthMm: c => c.middleLengthB || 0,
  teeHorizontalTotalLengthMm: () => 200,
  teeMiddleLengthMm: type => type === "中接" ? 20 : 0,
  verticalInlineFittingSvg: name => `<vertical name="${name}"/>`
};
const config = {
  diameter: 40, bodyDiameter: 40, bodyThickness: 1.5, bodyLength: 52,
  diameterA: 40, diameterB: 40, diameterC: 50,
  fittingA: "外丝", fittingB: "法兰", fittingC: "外丝",
  middleA: "中接", middleB: "直管", middleC: "中接", middleLengthB: 50
};
const svg = TeeDrawing.render(config, helpers);
assert(svg.includes("<reducer"));
assert(svg.includes('name="外丝"'));
assert(svg.includes('name="法兰"'));
assert(svg.includes("A端") && svg.includes("B端") && svg.includes("C端"));
assert(svg.includes("<dimension>总长 L=200 mm</dimension>"));
const largeSvg = TeeDrawing.render({
  ...config,
  bodyDiameter: 219,
  bodyThickness: 3,
  diameterA: 219,
  diameterB: 219,
  diameterC: 219
}, helpers);
const largeDimensionY = Number((largeSvg.match(/<dimension-y value="([^"]+)"/) || [])[1]);
assert(largeDimensionY > 405, "large tee dimension should move below the body");
const largeReducerWidths = Array.from(largeSvg.matchAll(/<reducer width="([^"]+)"/g), match => Number(match[1]));
assert(largeReducerWidths.length >= 2, "large tee should render A/C reducers");
assert(largeReducerWidths.every(width => width < 35), "large tee A/C reducers should be visually shortened");
console.log("tee drawing tests passed");
