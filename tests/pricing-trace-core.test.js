const assert = require("assert");
const PricingTraceCore = require("../pricing-trace-core");

const firstSettings = { settingsVersion: 12, fitting: { 40: 7.99 }, managementPerKg: 4.13 };
const trace = PricingTraceCore.create(firstSettings);
assert.strictEqual(trace.currentRevision, 1);
assert.match(trace.entries[0].fingerprint, /^P[0-9A-F]{8}$/);

const unchanged = PricingTraceCore.record(trace, firstSettings, "保存设置");
assert.strictEqual(unchanged.changed, false);
assert.strictEqual(unchanged.trace.entries.length, 1);

const changedSettings = { ...firstSettings, managementPerKg: 4.5 };
const changed = PricingTraceCore.record(trace, changedSettings, "保存设置");
assert.strictEqual(changed.changed, true);
assert.strictEqual(changed.entry.revision, 2);
assert.notStrictEqual(changed.entry.fingerprint, trace.entries[0].fingerprint);
assert.strictEqual(changed.entry.snapshot.managementPerKg, 4.5);

const restored = PricingTraceCore.normalize(changed.trace, changedSettings);
assert.strictEqual(PricingTraceCore.current(restored, changedSettings).revision, 2);
assert.strictEqual(PricingTraceCore.fingerprint({ b: 2, a: 1 }), PricingTraceCore.fingerprint({ a: 1, b: 2 }));

console.log("pricing trace core tests passed");
