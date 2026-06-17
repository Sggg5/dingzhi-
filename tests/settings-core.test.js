const assert = require("assert");
const SettingsCore = require("../settings-core");

const defaults = {
  settingsVersion: 9,
  annealingPerKg: 1.2,
  fittingBySeries: {
    A: {
      flange: { 40: 38, 76.1: 61 }
    }
  }
};

const merged = SettingsCore.mergeFittingSeries(
  { flange: { 40: 38, 76.1: 61 }, thread: { 40: 7.99 } },
  { flange: { 40: 99 }, custom: { 40: 12 } }
);
assert.deepStrictEqual(merged.flange, { 40: 99, 76.1: 61 });
assert.deepStrictEqual(merged.thread, { 40: 7.99 });
assert.deepStrictEqual(merged.custom, { 40: 12 });

const copy = SettingsCore.clone(defaults);
assert.notStrictEqual(copy, defaults);
assert.deepStrictEqual(copy, defaults);

const flattened = SettingsCore.flatten(defaults);
assert(flattened.some(row => row.path === '["annealingPerKg"]' && row.value === 1.2));
assert(flattened.some(row => row.path === '["fittingBySeries","A","flange","40"]' && row.value === 38));

assert.strictEqual(SettingsCore.parseCellValue(" 12.5 "), 12.5);
assert.strictEqual(SettingsCore.parseCellValue("true"), true);
assert.strictEqual(SettingsCore.parseCellValue("custom"), "custom");
assert.strictEqual(SettingsCore.escapeXml(`A&B<"'>`), "A&amp;B&lt;&quot;&apos;&gt;");

assert.strictEqual(SettingsCore.isAllowedPath(defaults, ["annealingPerKg"]), true);
assert.strictEqual(SettingsCore.isAllowedPath(defaults, ["missing"]), false);
assert.strictEqual(SettingsCore.isAllowedPath(defaults, ["__proto__", "polluted"]), false);

const imported = SettingsCore.clone(defaults);
assert.strictEqual(SettingsCore.setValueByPath(imported, defaults, ["fittingBySeries", "A", "flange", "40"], 88), true);
assert.strictEqual(imported.fittingBySeries.A.flange[40], 88);
assert.strictEqual(SettingsCore.setValueByPath(imported, defaults, ["fittingBySeries", "A", "unknown", "40"], 1), false);
assert.strictEqual(SettingsCore.setValueByPath(imported, defaults, ["constructor", "prototype", "polluted"], true), false);
assert.strictEqual({}.polluted, undefined);

console.log("settings core tests passed");
