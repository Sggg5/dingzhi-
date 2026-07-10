const assert = require("assert");
const NxParamExportCore = require("../nx-param-export-core");
const ProductCodeCore = require("../product-code-core");

const baseConfig = {
  productType: "三通类",
  productCode: "A36050104004000",
  material: "316L",
  tubeSeries: "A",
  bodyDiameter: 40,
  bodyThickness: 1.5,
  bodyLength: 52,
  diameterA: 40,
  diameterB: 40,
  diameterC: 40,
  surfaceTreatment: "酸洗",
  quantity: 2
};

const params = NxParamExportCore.buildParams(
  baseConfig,
  { unitPrice: 270.66 },
  {
    productCodeCore: ProductCodeCore,
    teeHorizontalTotalLengthMm: () => 128,
    outputOptions: { schemaVersion: 1 }
  }
);

assert.deepStrictEqual(Object.keys(params), [
  "productType",
  "productCode",
  "dn",
  "material",
  "outerDiameter",
  "thickness",
  "totalLength",
  "socketDepth",
  "sealGrooveWidth",
  "sealGrooveDepth",
  "pressGrooveWidth",
  "pressGrooveDepth",
  "surfaceTreatment",
  "quantity",
  "quotePrice",
  "outputOptions"
]);
assert.strictEqual(params.productType, "三通类");
assert.strictEqual(params.productCode, "A36050104004000");
assert.strictEqual(params.dn, 40);
assert.strictEqual(params.material, "316L");
assert.strictEqual(params.outerDiameter, 40);
assert.strictEqual(params.thickness, 1.5);
assert.strictEqual(params.totalLength, 128);
assert.strictEqual(params.socketDepth, null);
assert.strictEqual(params.quantity, 2);
assert.strictEqual(params.quotePrice, 270.66);
assert.strictEqual(params.outputOptions.target, "Siemens NX");
assert.strictEqual(params.outputOptions.generateModel, false);
assert.strictEqual(params.outputOptions.callNxService, false);
assert.strictEqual(params.outputOptions.schemaVersion, 1);

assert.strictEqual(
  NxParamExportCore.fileName(params),
  "FRT-A36050104004000-DN40-316L-T1.5.json"
);
assert.ok(NxParamExportCore.jsonText(params).includes('"productType": "三通类"'));
const manifoldParams = NxParamExportCore.buildParams({
  productType: "分水器类",
  material: "304",
  tubeSeries: "B",
  mainDiameter: 108,
  wallThickness: 2,
  surfaceTreatment: "喷砂",
  quantity: 1
}, { mainLength: 680, totalPrice: 413.3 }, { productCodeCore: ProductCodeCore });
assert.strictEqual(manifoldParams.dn, 100);
assert.strictEqual(manifoldParams.totalLength, 680);
assert.strictEqual(NxParamExportCore.fileName(manifoldParams), "FRT-待确认-DN100-304-T2.json");

assert.rejects(
  () => NxParamExportCore.callNxModelingService(params),
  /只导出参数 JSON/
).then(() => {
  console.log("nx param export core tests passed");
});
