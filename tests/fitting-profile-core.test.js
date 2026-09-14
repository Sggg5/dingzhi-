const assert = require("assert");
const profiles = require("../fitting-profile-core");

assert.equal(profiles.connectionDatumInset("外丝"), 6);
assert.equal(profiles.connectionDatumInset("双卡"), 6);
assert.equal(profiles.connectionDatumInset("法兰"), 0);
assert.equal(profiles.leftProfileOrigin(200, 50, "外丝"), 156);
assert.equal(profiles.rightProfileOrigin(200, "外丝"), 194);
assert.equal(profiles.leftProfileOrigin(200, 50, "法兰"), 150);
assert.equal(profiles.hasCadSource("外丝"), true);
assert.equal(profiles.hasCadSource("法兰"), false);

console.log("fitting-profile-core tests passed");
