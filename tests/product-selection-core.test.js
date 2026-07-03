const assert = require("assert");
const ProductSelectionCore = require("../product-selection-core");

const options = { fittingConnections: ["无配件", "外丝", "内丝", "法兰", "沟槽", "对焊"] };
const availableFittings = names => names.filter(name => name !== "内丝");

assert.strictEqual(ProductSelectionCore.isLargeFittingDiameter(133), true);
assert.strictEqual(ProductSelectionCore.isLargeFittingDiameter(108), false);
assert.deepStrictEqual(ProductSelectionCore.teeFittingOptions(133, options, availableFittings), ["法兰", "沟槽", "对焊"]);
assert.deepStrictEqual(ProductSelectionCore.teeFittingOptions(40, options, availableFittings), ["无配件", "外丝", "法兰", "沟槽", "对焊"]);
assert.deepStrictEqual(ProductSelectionCore.elbowFittingOptions(159, options, availableFittings), ["无配件", "法兰", "沟槽", "对焊"]);
assert.deepStrictEqual(ProductSelectionCore.fittingOptionsForProduct("对接类", 40, options, availableFittings), ["无配件", "外丝", "法兰", "沟槽", "对焊"]);

console.log("product selection core tests passed");
