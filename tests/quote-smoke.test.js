const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const appPath = path.join(__dirname, "..", "app.js");
const settingsCorePath = path.join(__dirname, "..", "settings-core.js");
const quoteCorePath = path.join(__dirname, "..", "quote-core.js");
const productQuoteCorePath = path.join(__dirname, "..", "product-quote-core.js");
const dimensionCorePath = path.join(__dirname, "..", "dimension-core.js");
const layoutCorePath = path.join(__dirname, "..", "layout-core.js");
const catalogCorePath = path.join(__dirname, "..", "catalog-core.js");
const configCorePath = path.join(__dirname, "..", "config-core.js");
const productSelectionCorePath = path.join(__dirname, "..", "product-selection-core.js");
const materialPriceCorePath = path.join(__dirname, "..", "material-price-core.js");
const middleFieldCorePath = path.join(__dirname, "..", "middle-field-core.js");
const costDetailCorePath = path.join(__dirname, "..", "cost-detail-core.js");
const drawingCorePath = path.join(__dirname, "..", "drawing-core.js");
const drawingContentCorePath = path.join(__dirname, "..", "drawing-content-core.js");
const fittingDrawingPath = path.join(__dirname, "..", "fitting-drawing.js");
const fittingVisualCorePath = path.join(__dirname, "..", "fitting-visual-core.js");
const fittingRendererPath = path.join(__dirname, "..", "fitting-renderer.js");
const branchFittingRendererPath = path.join(__dirname, "..", "branch-fitting-renderer.js");
const productGeometryCorePath = path.join(__dirname, "..", "product-geometry-core.js");
const dockingMiddleRendererPath = path.join(__dirname, "..", "docking-middle-renderer.js");
const manifoldDrawingPath = path.join(__dirname, "..", "manifold-drawing.js");
const dockingDrawingPath = path.join(__dirname, "..", "docking-drawing.js");
const teeDrawingPath = path.join(__dirname, "..", "tee-drawing.js");
const elbowDrawingPath = path.join(__dirname, "..", "elbow-drawing.js");
const appCode = fs.readFileSync(appPath, "utf8");
const settingsCoreCode = fs.readFileSync(settingsCorePath, "utf8");
const quoteCoreCode = fs.readFileSync(quoteCorePath, "utf8");
const productQuoteCoreCode = fs.readFileSync(productQuoteCorePath, "utf8");
const dimensionCoreCode = fs.readFileSync(dimensionCorePath, "utf8");
const layoutCoreCode = fs.readFileSync(layoutCorePath, "utf8");
const catalogCoreCode = fs.readFileSync(catalogCorePath, "utf8");
const configCoreCode = fs.readFileSync(configCorePath, "utf8");
const productSelectionCoreCode = fs.readFileSync(productSelectionCorePath, "utf8");
const materialPriceCoreCode = fs.readFileSync(materialPriceCorePath, "utf8");
const middleFieldCoreCode = fs.readFileSync(middleFieldCorePath, "utf8");
const costDetailCoreCode = fs.readFileSync(costDetailCorePath, "utf8");
const drawingCoreCode = fs.readFileSync(drawingCorePath, "utf8");
const drawingContentCoreCode = fs.readFileSync(drawingContentCorePath, "utf8");
const fittingDrawingCode = fs.readFileSync(fittingDrawingPath, "utf8");
const fittingVisualCoreCode = fs.readFileSync(fittingVisualCorePath, "utf8");
const fittingRendererCode = fs.readFileSync(fittingRendererPath, "utf8");
const branchFittingRendererCode = fs.readFileSync(branchFittingRendererPath, "utf8");
const productGeometryCoreCode = fs.readFileSync(productGeometryCorePath, "utf8");
const dockingMiddleRendererCode = fs.readFileSync(dockingMiddleRendererPath, "utf8");
const manifoldDrawingCode = fs.readFileSync(manifoldDrawingPath, "utf8");
const dockingDrawingCode = fs.readFileSync(dockingDrawingPath, "utf8");
const teeDrawingCode = fs.readFileSync(teeDrawingPath, "utf8");
const elbowDrawingCode = fs.readFileSync(elbowDrawingPath, "utf8");

const document = {
  readyState: "loading",
  addEventListener() {},
  querySelector() { return null; },
  querySelectorAll() { return []; }
};

const context = vm.createContext({
  console,
  document,
  window: { alert() {}, print() {} },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout,
  clearTimeout,
  Date,
  Math,
  JSON,
  Number,
  String,
  Array,
  Object,
  Set,
  Map
});

const tests = `
fields = { tubeSeries: { value: "A" } };

function assertFiniteQuote(name, result) {
  if (!Number.isFinite(result.factoryCost) || !Number.isFinite(result.totalPrice)) {
    throw new Error(name + " quote contains a non-finite value");
  }
  if (!Array.isArray(result.costRows) || result.costRows.length === 0) {
    throw new Error(name + " quote has no cost rows");
  }
}

const explicitSeriesPrice = fittingCost("法兰", 76.1, "304", "B");
const expectedSeriesPrice = pricing.fittingBySeries.B["法兰"][76.1] / pricing.fittingTaxDivisor;
if (Math.abs(explicitSeriesPrice - expectedSeriesPrice) > 1e-9) {
  throw new Error("explicit B-series fitting price did not use B-series table");
}
fields.tubeSeries.value = "B";
const explicitAPrice = fittingCost("法兰", 76.1, "304", "A");
const expectedAPrice = pricing.fittingBySeries.A["法兰"][76.1] / pricing.fittingTaxDivisor;
if (Math.abs(explicitAPrice - expectedAPrice) > 1e-9) {
  throw new Error("explicit A-series fitting price changed with UI series");
}

const importedSettings = SettingsCore.clone(pricing);
if (!SettingsCore.setValueByPath(importedSettings, defaultPricing, ["annealingPerKg"], 9.9)) {
  throw new Error("valid settings import path was rejected");
}
if (SettingsCore.setValueByPath(importedSettings, defaultPricing, ["__proto__", "polluted"], true)) {
  throw new Error("prototype-polluting settings path was accepted");
}
if (SettingsCore.setValueByPath(importedSettings, defaultPricing, ["settingsVersion", "nested"], true)) {
  throw new Error("unknown nested settings path was accepted");
}

const common = {
  customerName: "test",
  quoteNo: "test-001",
  material: "304",
  tubeSeries: "A",
  quantity: 1,
  surfaceTreatment: "酸洗",
  difficultyFactorInput: "",
  steelTonPrice: 16000,
  costRate: 0.68,
  faceDiscountRate: 0.17,
  freight: 0,
  processFactor: 1
};

assertFiniteQuote("manifold", calculate({
  ...common,
  productType: "分水器类",
  manifoldType: "单排",
  mainDiameter: 40,
  wallThickness: 1.5,
  mainPositiveTolerance: false,
  branchDiameter: 20,
  branchThickness: 1.2,
  branchPositiveTolerance: false,
  branchCount: 2,
  branchSpacing: 180,
  branchHeight: 50,
  inletAllowance: 100,
  tailAllowance: 40,
  mainFitting: "外丝",
  branchFitting: "外丝",
  tailFitting: "堵头",
  branches: [
    { diameter: 20, thickness: 1.2, fitting: "外丝", height: 50, positiveTolerance: false },
    { diameter: 20, thickness: 1.2, fitting: "外丝", height: 50, positiveTolerance: false }
  ]
}));

assertFiniteQuote("docking", calculateDocking({
  ...common,
  productType: "对接类",
  diameterA: 40,
  diameterB: 40,
  thicknessA: 1.5,
  thicknessB: 1.5,
  diameter: 40,
  thickness: 1.5,
  fittingA: "外丝",
  fittingB: "外丝",
  middleItems: []
}));

assertFiniteQuote("tee", calculateTee({
  ...common,
  productType: "三通类",
  diameter: 40,
  thickness: 1.5,
  bodyDiameter: 40,
  bodyThickness: 1.5,
  bodyLength: 52,
  length: 52,
  diameterA: 40,
  diameterB: 40,
  diameterC: 40,
  thicknessA: 1.5,
  thicknessB: 1.5,
  thicknessC: 1.5,
  fittingA: "外丝",
  fittingB: "外丝",
  fittingC: "外丝",
  middleA: "无",
  middleB: "无",
  middleC: "无",
  middleLengthB: 0
}));

assertFiniteQuote("elbow", calculateElbow({
  ...common,
  productType: "弯头类",
  diameter: 40,
  thickness: 1.5,
  bodyDiameter: 40,
  bodyThickness: 1.5,
  length: 60,
  angle: 90,
  diameterA: 40,
  diameterB: 40,
  thicknessA: 1.5,
  thicknessB: 1.5,
  fittingA: "外丝",
  fittingB: "外丝",
  middleA: "无",
  middleB: "无",
  middleLengthA: 0,
  middleLengthB: 0
}));

let unsupportedTypeRejected = false;
try {
  calculate({ productType: "未知类" });
} catch {
  unsupportedTypeRejected = true;
}
if (!unsupportedTypeRejected) {
  throw new Error("unsupported product type did not fail explicitly");
}

if (!branchFittingSvg({ fitting: "沟槽", diameter: 133 }, 100, 100, pipeVisualDiameter(133)).includes("<path")) {
  throw new Error("manifold groove branch fitting did not render");
}
if (!branchFittingSvg({ fitting: "对焊", diameter: 133 }, 100, 100, pipeVisualDiameter(133)).includes("<rect")) {
  throw new Error("manifold butt-weld branch fitting did not render");
}
const dockingMiddleSmoke = dockingMiddleAssembly({
  diameterA: 40,
  diameterB: 50,
  middleItems: [{ type: "直管", length: 100 }, { type: "中接" }]
}, 100, 500, 200);
if (!dockingMiddleSmoke.svg.includes("<rect") || !dockingMiddleSmoke.svg.includes("<path")) {
  throw new Error("docking middle drawing assembly did not render");
}
`;

vm.runInContext(`${settingsCoreCode}\n${quoteCoreCode}\n${productQuoteCoreCode}\n${dimensionCoreCode}\n${layoutCoreCode}\n${catalogCoreCode}\n${configCoreCode}\n${productSelectionCoreCode}\n${materialPriceCoreCode}\n${middleFieldCoreCode}\n${costDetailCoreCode}\n${drawingCoreCode}\n${drawingContentCoreCode}\n${fittingDrawingCode}\n${fittingVisualCoreCode}\n${fittingRendererCode}\n${branchFittingRendererCode}\n${productGeometryCoreCode}\n${dockingMiddleRendererCode}\n${manifoldDrawingCode}\n${dockingDrawingCode}\n${teeDrawingCode}\n${elbowDrawingCode}\n${appCode}\n${tests}`, context, { filename: "app.js" });
console.log("quote smoke tests passed");
