const assert = require("assert");
const { extract } = require("../tools/extract-cad-profile");

const fixture = [
  "0", "SECTION", "2", "ENTITIES",
  "0", "LINE", "8", "PROFILE", "10", "0", "20", "10", "11", "10", "21", "10",
  "0", "ARC", "8", "PROFILE", "10", "5", "20", "10", "40", "5", "50", "180", "51", "360",
  "0", "LINE", "8", "PROFILE", "10", "0", "20", "30", "11", "10", "21", "30",
  "0", "ENDSEC", "0", "EOF", ""
].join("\n");
const fs = require("fs");
const os = require("os");
const path = require("path");
const file = path.join(os.tmpdir(), "franta-profile-fixture.dxf");
fs.writeFileSync(file, fixture, "latin1");
const result = extract(file);
fs.unlinkSync(file);

assert.equal(result.profileLayer, "PROFILE");
assert.equal(result.profiles.length, 2);
assert.equal(result.profiles[0].entities.length, 2);
assert.deepEqual(result.profiles[0].entities.map((entity) => entity.type).sort(), ["ARC", "LINE"]);
assert.equal(result.profiles[1].entities[0].y1, 0);

console.log("extract-cad-profile tests passed");
