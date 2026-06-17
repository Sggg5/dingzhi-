const assert = require("assert");
const ElbowDrawing = require("../elbow-drawing");

const helpers = {
  DrawingCore: {
    horizontalDimension: ({ label }) => `<horizontal>${label}</horizontal>`,
    projected45Dimension: ({ label }) => `<projected45>${label}</projected45>`,
    verticalDimension: ({ label }) => `<vertical>${label}</vertical>`
  },
  compressedStraightVisualLength: value => value,
  drawingColors: { pipeFill: "#eee", stroke: "#333", label: "#123", dimension: "#777" },
  drawingTotalLengthText: value => `L=${value} mm`,
  elbowMiddleLengthMm: (type, length) => type === "直管" ? length : type === "中接" ? 20 : 0,
  elbowRoundBodySvg: (_sx, _sy, _ex, _ey, _pipe, angle) => `<body angle="${angle}"/>`,
  fittingLabel: value => value,
  inlineFittingEnvelopeHeight: () => 40,
  inlineFittingLength: () => 30,
  inlineFittingSvg: name => `<fitting name="${name}"/>`,
  isNoFitting: value => value === "无配件",
  pipeVisualDiameter: value => value,
  reducerSegmentSvg: () => "<reducer/>"
};
const base = {
  productType: "弯头类",
  diameter: 40, thickness: 1.5, bodyDiameter: 40, bodyThickness: 1.5,
  diameterA: 40, diameterB: 50, fittingA: "外丝", fittingB: "法兰",
  middleA: "直管", middleB: "中接", middleLengthA: 50, middleLengthB: 0,
  length: 60
};

const angle45 = ElbowDrawing.render({ ...base, angle: 45 }, helpers);
assert(angle45.includes('<body angle="45"/>'));
assert(angle45.includes("<projected45>H="));
assert(!angle45.includes("<vertical>"));
assert(angle45.includes("A端") && angle45.includes("B端"));
assert(angle45.includes("<reducer/>"));

const angle90 = ElbowDrawing.render({ ...base, angle: 90 }, helpers);
assert(angle90.includes('<body angle="90"/>'));
assert(angle90.includes("<vertical>H="));
assert(!angle90.includes("<projected45>"));

const noFittings = ElbowDrawing.render({ ...base, angle: 90, fittingA: "无配件", fittingB: "无配件" }, helpers);
assert(!noFittings.includes("A端"));
assert(!noFittings.includes("B端"));

console.log("elbow drawing tests passed");
