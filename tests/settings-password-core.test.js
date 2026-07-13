const assert = require("assert");
const SettingsPasswordCore = require("../settings-password-core");

assert.strictEqual(SettingsPasswordCore.validateNewPassword("12345"), "新密码至少需要 6 位");
assert.strictEqual(SettingsPasswordCore.validateNewPassword("123456"), "");
SettingsPasswordCore.hash("Franta", null).then(value => {
  assert.strictEqual(value, "plain:Franta");
  console.log("settings password core tests passed");
});
