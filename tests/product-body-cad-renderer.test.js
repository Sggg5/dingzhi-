const assert = require("assert");

require("../product-body-cad-profile-data");
const renderer = require("../product-body-cad-renderer");

assert.strictEqual(ProductBodyCadProfileData.profiles.length, 36);
assert.strictEqual(ProductBodyCadProfileData.sources.length, 5);
assert(ProductBodyCadProfileData.sources.some(name => name.includes("133-219 45弯头体")));
assert(ProductBodyCadProfileData.sources.some(name => name.includes("133-219 90弯头体")));
assert.strictEqual(ProductBodyCadProfileData.getProfile("tee", 0, 219).diameter, 219);
assert.strictEqual(ProductBodyCadProfileData.getProfile("elbow", 45, 40).diameter, 40);
assert.strictEqual(ProductBodyCadProfileData.getProfile("elbow", 90, 159).diameter, 159);

const colors = {
  stroke: "#294542",
  pipeFill: "#e7eeee",
  objectLineWidth: 3
};
const tee = renderer.tee(40, 600, 300, 28.8, colors);
assert(tee && tee.svg.includes("product-body-cad-tee-0"));
assert(tee.leftX < tee.rightX);
assert(tee.branchY < 300);
assert(tee.svg.match(/<path/g).length >= 8);
const german15Tee = renderer.tee(15, 600, 300, 33.6, colors);
assert(german15Tee.svg.includes('data-source-diameter="16"'));
assert(german15Tee.svg.includes('data-requested-diameter="15"'));

for (const angle of [45, 90]) {
  const elbow = renderer.elbow(40, angle, 500, 350, 28.8, colors);
  assert(elbow && elbow.svg.includes(`product-body-cad-elbow-${angle}`));
  assert(elbow.endX > elbow.startX);
  assert(elbow.endY < elbow.startY);
  assert(elbow.svg.match(/<path/g).length >= 5);
}

for (const diameter of [133, 159, 219]) {
  for (const angle of [45, 90]) {
    const elbow = renderer.elbow(diameter, angle, 500, 350, diameter * 0.72, colors);
    assert(elbow && elbow.svg.includes(`data-source-diameter="${diameter}"`));
  }
}

console.log("product body CAD renderer tests passed");
