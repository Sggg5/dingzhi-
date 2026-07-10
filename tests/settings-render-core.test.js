const assert = require("assert");
const fs = require("fs");
const path = require("path");
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
assert.deepStrictEqual(SettingsRenderCore.BASIC_SETTING_PATHS.settingFittingWeightReferenceSteel, ["fittingWeightReferenceSteelTonPrice"]);
assert.strictEqual(SettingsRenderCore.valueAtPath({ a: { b: 2 } }, ["a", "b"]), 2);
const mutable = { a: { b: 2 } };
SettingsRenderCore.setValueAtPath(mutable, ["a", "b"], 3);
assert.strictEqual(mutable.a.b, 3);
assert.strictEqual(SettingsRenderCore.isActiveSettingCategory("tee", "tee"), true);
assert.strictEqual(SettingsRenderCore.isActiveSettingSection("process", "dimensions"), false);

const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
assert(indexHtml.includes("45°弯头加工角度系数为 0.8"));
assert(indexHtml.includes("分水器不含税成本 = 主管材料 + 支管材料 + 配件 + 分水器加工费"));
assert(indexHtml.includes("对接不含税成本 = 中间直管材料 + A/B端配件"));
assert(indexHtml.includes("三通不含税成本 = 三通体/直管材料 + A/B/C端配件"));

console.log("settings render core tests passed");
