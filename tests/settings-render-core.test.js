const assert = require("assert");
const SettingsRenderCore = require("../settings-render-core");

const pricing = {
  fittingLengthBySeries: {
    A: { 外丝: { 40: 37.8 } },
    B: { 法兰: { 42: 15 } }
  },
  fittingBySeries: {
    A: { 外丝: { 40: 7.99 } },
    B: { 法兰: { 42: 38 } }
  },
  teeStraightLengthBySeries: { A: { 40: 52 }, B: { 42: 52 } },
  dockingProcessByDiameter: { 外丝: { 40: 0.4 } }
};
const getDiameters = series => series === "A" ? [40] : [42];
const tubeSeriesLabel = { A: "国标", B: "德标" };

assert(SettingsRenderCore.seriesHeadHtml("配件长度", { getDiameters, tubeSeriesLabel }).includes("<th>国标<br>40</th>"));
assert(SettingsRenderCore.fittingLengthRowsHtml({ pricing, getDiameters, tubeSeriesLabel }).includes('data-fitting-length-name="外丝"'));
assert(SettingsRenderCore.fittingLengthRowsHtml({ pricing, getDiameters, tubeSeriesLabel }).includes('value="37.8"'));
assert(SettingsRenderCore.fittingPriceRowsHtml({ pricing, getDiameters, tubeSeriesLabel }).includes('data-fitting-name="外丝"'));
assert(SettingsRenderCore.fittingPriceRowsHtml({ pricing, getDiameters, tubeSeriesLabel }).includes('step="0.000001"'));
assert(SettingsRenderCore.singleSeriesValueRowsHtml({
  rowTitle: "三通直管长度",
  pricing,
  pricingKey: "teeStraightLengthBySeries",
  dataPrefix: "tee-length",
  getDiameters,
  tubeSeriesLabel,
  step: "0.1"
}).includes('data-tee-length-series="A"'));
assert(SettingsRenderCore.processHeadHtml("对接类加工费", [40]).includes("<th>40</th>"));
assert(SettingsRenderCore.processRowsHtml({
  pricing,
  pricingKey: "dockingProcessByDiameter",
  diameters: [40],
  fittingNames: ["外丝"],
  dataset: "docking"
}).includes('data-docking-process-diameter="40"'));

assert.deepStrictEqual(SettingsRenderCore.BASIC_SETTING_PATHS.settingAnnealing, ["annealingPerKg"]);
assert.strictEqual(SettingsRenderCore.valueAtPath({ a: { b: 2 } }, ["a", "b"]), 2);
const mutable = { a: { b: 2 } };
SettingsRenderCore.setValueAtPath(mutable, ["a", "b"], 3);
assert.strictEqual(mutable.a.b, 3);
assert.strictEqual(SettingsRenderCore.isActiveSettingCategory("tee", "tee"), true);
assert.strictEqual(SettingsRenderCore.isActiveSettingSection("process", "dimensions"), false);

console.log("settings render core tests passed");
