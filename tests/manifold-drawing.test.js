const assert = require("assert");
const ManifoldDrawing = require("../manifold-drawing");

const tag = name => () => `<${name}/>`;
const helpers = {
  DrawingCore: {
    arrowMarker: tag("arrow"),
    engineeringFrame: tag("frame"),
    horizontalDimension: ({ label }) => `<dimension>${label}</dimension>`,
    infoBox: ({ title }) => `<info>${title}</info>`,
    bomBox: ({ rows }) => `<bom>${rows.length}</bom>`,
    technicalRequirements: tag("requirements"),
    titleBlock: tag("title")
  },
  branchFittingSeatOffset: () => 0,
  branchFittingSize: () => ({ width: 30, height: 30 }),
  branchFittingSvg: branch => `<branch-fitting>${branch.fitting}</branch-fitting>`,
  branchLayout: () => ({ span: 180, offsets: [0, 180], stations: [0, 180], stationSpacings: [180] }),
  drawingBomRows: () => [["主管", "1"]],
  drawingColors: { dimension: "#777", label: "#123", mutedLabel: "#456", pipeFill: "#eee", stroke: "#333" },
  drawingLengthText: (value, prefix) => `${prefix}${value} mm`,
  drawingTotalLengthText: value => `L=${value} mm`,
  fittingLabel: value => value,
  inletFittingLength: () => 30,
  inletFittingSvg: tag("inlet"),
  pipeVisualDiameter: value => value,
  svgTextLines: () => "<title-lines/>",
  tailFittingLength: () => 20,
  tailFittingSvg: tag("tail"),
  titleBranchSummary: () => "2xD20",
  tubeSeriesLabel: { A: "国标" }
};
const config = {
  quoteNo: "test-001", material: "304", tubeSeries: "A", manifoldType: "单排",
  mainDiameter: 40, wallThickness: 1.5, mainPositiveTolerance: false,
  mainFitting: "外丝", tailFitting: "堵头", inletAllowance: 100, tailAllowance: 40,
  branches: [
    { diameter: 20, fitting: "外丝", height: 50 },
    { diameter: 20, fitting: "外丝", height: 50 }
  ]
};
const svg = ManifoldDrawing.render(config, { mainLength: 320, inletAllowance: 100, tailAllowance: 40 }, helpers);
assert(svg.includes("<frame/>"));
assert(svg.includes("<inlet/>") && svg.includes("<tail/>"));
assert(svg.includes("<branch-fitting>外丝</branch-fitting>"));
assert(svg.includes("<dimension>总长 L=320 mm</dimension>"));
assert(svg.includes("<bom>1</bom>"));
let capturedTailX = null;
let capturedEndSegment = null;
const largeTailHelpers = {
  ...helpers,
  branchFittingSize: () => ({ width: 36, height: 30 }),
  tailFittingLength: () => 95,
  tailFittingSvg: (_config, x) => {
    capturedTailX = x;
    return "<tail/>";
  },
  DrawingCore: {
    ...helpers.DrawingCore,
    horizontalDimension: ({ x1, x2, label }) => {
      if (String(label).startsWith("E=")) capturedEndSegment = { x1, x2 };
      return `<dimension>${label}</dimension>`;
    }
  }
};
ManifoldDrawing.render(config, { mainLength: 320, inletAllowance: 100, tailAllowance: 40 }, largeTailHelpers);
assert(capturedEndSegment);
assert(capturedTailX >= capturedEndSegment.x1 + 34);
assert.strictEqual(capturedEndSegment.x2 - capturedTailX, 95);

let doubleRowDimensionY = null;
const doubleRowHelpers = {
  ...helpers,
  branchFittingSize: () => ({ width: 34, height: 30 }),
  DrawingCore: {
    ...helpers.DrawingCore,
    horizontalDimension: ({ y, label }) => {
      if (String(label).startsWith("P=")) doubleRowDimensionY = y;
      return `<dimension>${label}</dimension>`;
    }
  }
};
ManifoldDrawing.render(
  {
    ...config,
    manifoldType: "双排交错",
    branches: [
      { diameter: 32, fitting: "外丝", height: 100 },
      { diameter: 32, fitting: "外丝", height: 100 }
    ]
  },
  { mainLength: 320, inletAllowance: 100, tailAllowance: 40 },
  doubleRowHelpers
);
assert(doubleRowDimensionY > 480);
console.log("manifold drawing tests passed");
