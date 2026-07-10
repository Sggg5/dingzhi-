const assert = require("assert");
const QuoteListStorageCore = require("../quote-list-storage-core");

const item = {
  id: 123,
  name: "304 直管",
  quantity: 2,
  config: { productType: "对接类", productCode: "A380400200" },
  result: { unitPrice: 100 }
};

const text = QuoteListStorageCore.serialize([item], ["factoryCost", "unitPrice"]);
const restored = QuoteListStorageCore.deserialize(text, ["factoryCost", "discountedPrice", "unitPrice"]);
assert.strictEqual(restored.items.length, 1);
assert.strictEqual(restored.items[0].id, 123);
assert.strictEqual(restored.items[0].quantity, 2);
assert.deepStrictEqual(restored.columns, ["factoryCost", "unitPrice"]);
assert.deepStrictEqual(QuoteListStorageCore.normalizeColumns([], ["unitPrice"]), ["unitPrice"]);
assert.strictEqual(QuoteListStorageCore.deserialize("", ["unitPrice"]), null);
assert.strictEqual(QuoteListStorageCore.deserialize('{"items":[{"id":"bad"}]}', ["unitPrice"]).items.length, 0);

console.log("quote list storage core tests passed");
