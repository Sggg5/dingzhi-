const assert = require("assert");
const MiddleFieldCore = require("../middle-field-core");

assert.deepStrictEqual(MiddleFieldCore.elbowMiddleLengthFieldState("直管", ""), {
  enabled: true, hidden: false, disabled: false, value: "20"
});
assert.deepStrictEqual(MiddleFieldCore.elbowMiddleLengthFieldState("中接", "88"), {
  enabled: false, hidden: true, disabled: true, value: "88"
});
assert.deepStrictEqual(MiddleFieldCore.teeBMiddleLengthFieldState("直管", ""), {
  enabled: true, hidden: false, disabled: false, value: "50"
});
assert.strictEqual(MiddleFieldCore.straightLengthFieldState("直管", "12", 99).value, "12");

console.log("middle field core tests passed");
