const assert = require("assert");
const QuoteHistoryStorageCore = require("../quote-history-storage-core");

const entry = QuoteHistoryStorageCore.createEntry({
  config: { quoteNo: "Q-001", productCode: "A3804002", productType: "对接类", material: "316L", tubeSeries: "A", steelTonPrice: 33500 },
  result: { factoryCost: 100, discountedPrice: 150, unitPrice: 900, totalPrice: 900, quoteIssues: [] },
  items: [{ id: 1, name: "测试对接", quantity: 1, unitPrice: 900, totalPrice: 900, config: { productType: "对接类" }, result: { quoteIssues: [] } }],
  columns: ["unitPrice"],
  pricingVersion: 12,
  pricingTrace: { revision: 3, fingerprint: "P1A2B3C4D", snapshot: { managementPerKg: 4.13 } }
});
assert.strictEqual(entry.quoteNo, "Q-001");
assert.strictEqual(entry.items.length, 1);
const restored = QuoteHistoryStorageCore.deserialize(QuoteHistoryStorageCore.serialize([entry]));
assert.strictEqual(restored.length, 1);
assert.strictEqual(restored[0].result.unitPrice, 900);
assert.strictEqual(restored[0].pricingRevision, 3);
assert.strictEqual(restored[0].pricingSnapshot.managementPerKg, 4.13);
assert.deepStrictEqual(QuoteHistoryStorageCore.deserialize(""), []);

console.log("quote history storage core tests passed");
