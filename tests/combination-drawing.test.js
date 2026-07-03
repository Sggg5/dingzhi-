const assert = require("assert");
const CombinationCore = require("../combination-core");
const CombinationDrawing = require("../combination-drawing");

const components = [
  { type: "直管", diameter: 40, thickness: 1.5, length: 120 },
  { type: "90°弯头", diameter: 40, thickness: 1.5, length: 60, direction: "左" },
  {
    type: "三通", diameter: 40, thickness: 1.5, length: 80,
    branchLength: 60, branchDiameter: 40, branchThickness: 1.5,
    branchFittingDiameter: 40, branchFitting: "外丝", branchMiddle: "直管",
    branchMiddleLength: 50,
    branchComponents: [{ type: "90°弯头", diameter: 40, thickness: 1.5, length: 60, direction: "右" }]
  }
];

const DrawingCore = {
  arrowMarker: () => "<marker/>",
  engineeringFrame: () => "<frame/>",
  horizontalDimension: options => `<overall-horizontal y="${options.y}">${options.label}</overall-horizontal>`,
  verticalDimension: options => `<overall-vertical x="${options.x}">${options.label}</overall-vertical>`,
  infoBox: options => `<info>${options.title}${options.content}</info>`,
  bomBox: () => "<bom/>",
  technicalRequirements: () => "<requirements/>",
  titleBlock: () => "<title-block/>"
};

function renderScenario(items, extra = {}) {
  return CombinationDrawing.render({
    quoteNo: "组合-test", material: "304", tubeSeries: "A",
    fittingA: "外丝", fittingB: "法兰"
  }, {
    geometry: CombinationCore.geometry(items),
    bomRows: [{ name: "test", quantity: 1 }]
  }, {
    DrawingCore: extra.DrawingCore || DrawingCore,
    drawingColors: { stroke: "#333", pipeFill: "#eef3f2", center: "#999", label: "#123", dimension: "#777" },
    drawingTotalLengthText: value => `L=${Math.ceil(value)} mm`,
    fittingLabel: value => value,
    fittingLengthMm: fitting => fitting === "法兰" ? 21 : 30,
    inlineFittingLength: fitting => fitting === "法兰" ? 34 : 28,
    inlineFittingSvg: fitting => `<fitting name="${fitting}"/>`,
    isNoFitting: fitting => fitting === "无配件",
    showInfoPanels: extra.showInfoPanels !== false,
    svgTextLines: value => value,
    tubeSeriesLabel: { A: "国标" }
  });
}

const svg = renderScenario(components);
assert(svg.includes('stroke-dasharray="10 4 2 4"'), "combination drawing should render center lines");
assert(svg.includes("L="), "combination drawing should render length dimensions");
assert(svg.includes("H="), "combination drawing should render height dimensions");
assert(!svg.includes("NaN") && !svg.includes("undefined"), "combination drawing must not emit invalid coordinates");
assert(svg.includes("combination-elbow-leader"), "elbows should use leader annotations");
assert(svg.includes("40 外丝"), "combination drawing should label A-end fitting specification");
assert(svg.includes("40 法兰"), "combination drawing should label B-end fitting specification");
assert(svg.includes('data-dimension-id="combination-main-1"'), "main segment dimensions should be draggable");
assert(svg.includes('data-dimension-axis="vector"'), "main segment dimensions should be constrained to their drafting offset direction");

const annotationScenarios = [
  [{ type: "直管", diameter: 40, thickness: 1.5, length: 120 }],
  [{ type: "直管", diameter: 40, thickness: 1.5, length: 120 }, { type: "45°弯头", diameter: 40, thickness: 1.5, length: 60, direction: "左" }],
  [{ type: "90°弯头", diameter: 88.9, thickness: 2, length: 110, direction: "右" }, { type: "45°弯头", diameter: 88.9, thickness: 2, length: 80, direction: "左" }],
  [{
    type: "三通", diameter: 133, thickness: 2.5, length: 160,
    branchLength: 90, branchDiameter: 76.1, branchThickness: 2,
    branchFittingDiameter: 76.1, branchFitting: "法兰", branchMiddle: "直管", branchMiddleLength: 50,
    branchComponents: [{ type: "90°弯头", diameter: 76.1, thickness: 2, length: 70, direction: "左" }]
  }]
];

annotationScenarios.forEach((items, index) => {
  const scenarioSvg = renderScenario(items);
  assert(!scenarioSvg.includes("NaN") && !scenarioSvg.includes("undefined"), `annotation scenario ${index + 1} must not emit invalid coordinates`);
  if (items.some(item => item.type.includes("90") || item.branchComponents?.some(branch => branch.type.includes("90")))) {
    assert(scenarioSvg.includes("combination-elbow-leader"), `annotation scenario ${index + 1} should use elbow leaders for 90-degree elbows`);
  }
  if (items.some(item => item.type.includes("45") || item.branchComponents?.some(branch => branch.type.includes("45")))) {
    assert(scenarioSvg.includes("H="), `annotation scenario ${index + 1} should keep 45-degree H dimensions`);
  }
});

const singleFortyFiveSvg = renderScenario([{ type: CombinationCore.TYPES[1], diameter: 40, thickness: 1.5, length: 39, direction: "左" }]);
assert(!singleFortyFiveSvg.includes("combination-elbow-leader"), "single 45-degree combination elbow should use dimension lines instead of leader annotation");
assert(!/H=39/.test(singleFortyFiveSvg), "single 45-degree combination elbow H dimension should include end fitting length");
assert(/H=67/.test(singleFortyFiveSvg), "single 45-degree combination elbow should show center-height dimensions including fittings");
assert(singleFortyFiveSvg.includes('data-dimension-id="combination-main-1"'), "single 45-degree combination elbow should expose a draggable dimension");
assert(!singleFortyFiveSvg.includes("总高 H="), "single 45-degree combination elbow should not render an extra overall height dimension");
assert(!singleFortyFiveSvg.includes("总长 L="), "single 45-degree combination elbow should label the bottom dimension as H, not total length");
assert(!singleFortyFiveSvg.includes("NaN") && !singleFortyFiveSvg.includes("undefined"), "single 45-degree combination elbow must not emit invalid coordinates");

const hiddenDimensionCalls = [];
const hiddenDrawingCore = {
  ...DrawingCore,
  horizontalDimension: options => {
    hiddenDimensionCalls.push(options);
    return `<overall-horizontal y="${options.y}">${options.label}</overall-horizontal>`;
  }
};
renderScenario(components, { DrawingCore: hiddenDrawingCore, showInfoPanels: false });
const hiddenOverall = hiddenDimensionCalls.find(call => String(call.label).includes("L="));
assert(hiddenOverall.y >= 600 && hiddenOverall.y <= 610, "hidden combination overall dimension should stay in the lower frame lane");

const singleFortyFiveDimensionCalls = [];
const singleFortyFiveDrawingCore = {
  ...DrawingCore,
  horizontalDimension: options => {
    singleFortyFiveDimensionCalls.push(options);
    return `<overall-horizontal x1="${options.x1}" x2="${options.x2}" y="${options.y}">${options.label}</overall-horizontal>`;
  }
};
renderScenario([{ type: CombinationCore.TYPES[1], diameter: 40, thickness: 1.5, length: 39, direction: "左" }], { DrawingCore: singleFortyFiveDrawingCore });
const singleFortyFiveBottomDimension = singleFortyFiveDimensionCalls.find(call => String(call.label).startsWith("H="));
assert(singleFortyFiveBottomDimension, "single 45-degree combination elbow should draw a bottom H dimension");
assert(singleFortyFiveBottomDimension.x2 - singleFortyFiveBottomDimension.x1 < 220, "single 45-degree bottom H dimension should end at the elbow center, not at the full visual envelope");
assert(singleFortyFiveBottomDimension.y < 430, "single 45-degree bottom H dimension should stay close to the elbow instead of dropping to the info-panel lane");

const straightToElbowSvg = renderScenario([
  { type: "直管", diameter: 40, thickness: 1.5, length: 140 },
  { type: CombinationCore.TYPES[2], diameter: 40, thickness: 1.5, length: 60, direction: "右" }
]);
const straightDimensionGroup = straightToElbowSvg.match(/data-dimension-id="combination-main-1"[\s\S]*?<\/g>/)?.[0] || "";
const extensionLines = [...straightDimensionGroup.matchAll(/<line x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/g)];
assert(extensionLines.length >= 2, "straight-to-elbow segment should render both extension lines");
const extensionLength = line => Math.hypot(Number(line[3]) - Number(line[1]), Number(line[4]) - Number(line[2]));
assert(extensionLength(extensionLines[1]) > extensionLength(extensionLines[0]) + 8, "straight segment dimension should start from the elbow centerline on the elbow side");

const verticalDimensionCalls = [];
const verticalDrawingCore = {
  ...DrawingCore,
  verticalDimension: options => {
    verticalDimensionCalls.push(options);
    return `<overall-vertical x="${options.x}" y1="${options.y1}" y2="${options.y2}">${options.label}</overall-vertical>`;
  }
};
renderScenario([{ type: CombinationCore.TYPES[2], diameter: 40, thickness: 1.5, length: 60, direction: "左" }], { DrawingCore: verticalDrawingCore });
const heightDimension = verticalDimensionCalls.find(call => String(call.label).startsWith("H="));
assert(heightDimension, "combination height dimension should use center-height label");
assert(String(heightDimension.label).includes("H=94"), "single 90-degree B-side H dimension should include B-end fitting length and end at the elbow center");

const singleNinetySvg = renderScenario([{ type: CombinationCore.TYPES[2], diameter: 40, thickness: 1.5, length: 60, direction: "左" }]);
assert(!singleNinetySvg.includes("combination-elbow-leader"), "single 90-degree combination elbow should use center-height dimensions instead of leader annotation");
assert(!singleNinetySvg.includes("总长 L="), "single 90-degree combination elbow should label the bottom dimension as H, not total length");
assert(!singleNinetySvg.includes("总高 H="), "single 90-degree combination elbow should not render an extra overall height dimension");

const teeBranchElbowSvg = renderScenario([{
  type: CombinationCore.TYPES[3], diameter: 40, thickness: 1.5, length: 52,
  branchLength: 56, branchDiameter: 40, branchThickness: 1.5,
  branchFittingDiameter: 40, branchFitting: "外丝", branchMiddle: "无",
  branchComponents: [{ type: CombinationCore.BRANCH_TYPES[1], diameter: 40, thickness: 1.5, length: 60, direction: "右" }]
}]);
assert(!teeBranchElbowSvg.includes("NaN") && !teeBranchElbowSvg.includes("undefined"), "tee branch elbow dimensions must not emit invalid coordinates");
assert(teeBranchElbowSvg.includes('data-dimension-id="combination-branch-1-1"'), "tee branch elbow should expose its own draggable dimension");
assert(teeBranchElbowSvg.includes("1.1"), "tee branch elbow should keep branch component sequence labeling");

console.log("combination drawing tests passed");
