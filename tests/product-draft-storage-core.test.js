const assert = require("assert");
const ProductDraftStorageCore = require("../product-draft-storage-core");

const config = {
  productType: "组合件",
  material: "304",
  components: [{ type: "直管", diameter: 40, thickness: 1.5, length: 100 }]
};
const text = ProductDraftStorageCore.serialize(config);
const restored = ProductDraftStorageCore.deserialize(text);
assert.strictEqual(restored.version, 1);
assert.deepStrictEqual(restored.config, config);
assert.strictEqual(ProductDraftStorageCore.deserialize(""), null);
assert.strictEqual(ProductDraftStorageCore.deserialize('{"config":{"productType":"未知"}}'), null);

console.log("product draft storage core tests passed");
