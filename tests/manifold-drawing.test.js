const assert = require("assert");
const ManifoldDrawing = require("../manifold-drawing");

const tag = name => () => `<${name}/>`;
const helpers = {
  DrawingCore: {
    arrowMarker: tag("arrow"),
    centerLine: () => "<center-line/>",
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
  reducerSegmentSvg: (...args) => `<reducer>${args.slice(0, 5).join(",")}</reducer>`,
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
let capturedTitleBlockY = null;
const titlePositionHelpers = {
  ...helpers,
  DrawingCore: {
    ...helpers.DrawingCore,
    titleBlock: ({ y }) => {
      capturedTitleBlockY = y;
      return "<title/>";
    }
  }
};
const svg = ManifoldDrawing.render(config, { mainLength: 320, inletAllowance: 100, tailAllowance: 40 }, titlePositionHelpers);
assert(svg.includes("<frame/>"));
assert(svg.includes("<inlet/>") && svg.includes("<tail/>"));
assert(svg.includes("<branch-fitting>外丝</branch-fitting>"));
assert(svg.includes("<dimension>总长 L=320 mm</dimension>"));
assert(svg.includes("<bom>1</bom>"));
assert.strictEqual(capturedTitleBlockY, 675);
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

const adapterSvg = ManifoldDrawing.render({
  ...config,
  mainFittingDiameter: 50.8,
  tailFittingDiameter: 32,
  mainAdapterEnabled: true,
  tailAdapterEnabled: true
}, { mainLength: 320, inletAllowance: 100, tailAllowance: 40 }, helpers);
assert(adapterSvg.includes("<reducer>"));
assert(adapterSvg.includes("50.8 外丝"));

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

const manualBottomSvg = ManifoldDrawing.render(
  {
    ...config,
    manifoldType: "双排交错",
    branches: [
      { diameter: 32, fitting: "外丝", height: 100, side: "下" }
    ]
  },
  { mainLength: 220, inletAllowance: 100, tailAllowance: 40 },
  helpers
);
assert(manualBottomSvg.includes("scale(1 -1)"));
const blankBranchSvg = ManifoldDrawing.render(
  {
    ...config,
    branches: [
      { diameter: 20, fitting: "澶栦笣", height: 50 },
      { diameter: 20, fitting: "无配件", height: 50, side: "下" }
    ]
  },
  { mainLength: 320, inletAllowance: 100, tailAllowance: 40 },
  helpers
);
assert.strictEqual((blankBranchSvg.match(/<branch-fitting>/g) || []).length, 1);

let denseDimensionFontSize = null;
const denseBranches = Array.from({ length: 20 }, () => ({ diameter: 20, fitting: "外丝", height: 100 }));
const denseSvg = ManifoldDrawing.render(
  { ...config, branches: denseBranches },
  { mainLength: 2420, inletAllowance: 100, tailAllowance: 40 },
  {
    ...helpers,
    branchLayout: () => ({
      span: 2280,
      offsets: Array.from({ length: 20 }, (_, index) => index * 120),
      stations: Array.from({ length: 20 }, (_, index) => index * 120),
      stationSpacings: Array.from({ length: 19 }, () => 120)
    }),
    DrawingCore: {
      ...helpers.DrawingCore,
      horizontalDimension: ({ label, fontSize }) => {
        if (String(label).startsWith("P=")) denseDimensionFontSize = fontSize;
        return `<dimension>${label}</dimension>`;
      }
    }
  }
);
assert(denseSvg.includes(">20外丝</text>"));
assert(denseSvg.includes("<dimension>P=120</dimension>"));
assert.strictEqual(denseDimensionFontSize, 8);
console.log("manifold drawing tests passed");
