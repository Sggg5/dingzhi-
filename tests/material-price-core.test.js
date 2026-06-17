const assert = require("assert");
const MaterialPriceCore = require("../material-price-core");

const defaults = { "304": 16000, "316L": 23200 };
assert.strictEqual(MaterialPriceCore.nextSteelTonPrice({
  changedId: "quantity",
  previousMaterial: "304",
  currentMaterial: "316L",
  currentSteelPrice: 16000,
  ratio316: 1.45,
  defaultSteelTonPrice: defaults
}), null);
assert.strictEqual(MaterialPriceCore.nextSteelTonPrice({
  changedId: "material",
  previousMaterial: "304",
  currentMaterial: "316L",
  currentSteelPrice: 16000,
  ratio316: 1.45,
  defaultSteelTonPrice: defaults
}), 23200);
assert.strictEqual(MaterialPriceCore.nextSteelTonPrice({
  changedId: "material",
  previousMaterial: "316L",
  currentMaterial: "304",
  currentSteelPrice: 23200,
  ratio316: 1.45,
  defaultSteelTonPrice: defaults
}), 16000);
assert.strictEqual(MaterialPriceCore.nextSteelTonPrice({
  changedId: "material",
  previousMaterial: "304",
  currentMaterial: "304",
  currentSteelPrice: 1,
  ratio316: 1.45,
  defaultSteelTonPrice: defaults
}), 16000);

console.log("material price core tests passed");
