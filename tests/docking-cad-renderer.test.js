const assert = require("assert");

require("../docking-cad-profile-data");
const DockingCadRenderer = require("../docking-cad-renderer");

assert.strictEqual(DockingCadProfileData.profiles.length, 111);
assert.strictEqual(DockingCadProfileData.getProfile("外丝", 40).diameter, 40);
assert.strictEqual(DockingCadProfileData.getProfile("直管", 101.6).bounds.width, 100);
assert.strictEqual(DockingCadProfileData.getProfile("外丝", 55).diameter, 50.8);

const colors = {
  fittingStroke: "#333",
  fittingFill: "#f7f3e8",
  objectLineWidth: 2,
  pipeFill: "#e7eeee",
  stroke: "#294542"
};

const left = DockingCadRenderer.fitting("外丝", 40, 500, 280, 28, "left", colors);
const right = DockingCadRenderer.fitting("外丝", 40, 700, 280, 28, "right", colors);
assert(left.includes("docking-cad-fitting-外丝"));
assert(left.includes("docking-cad-fitting-mask"), "CAD fittings must mask the pipe line beneath their connection area");
assert(left.includes("scale(-"), "A-side CAD profile should mirror around the left datum");
assert(right.includes("scale(0."), "B-side CAD profile should extend from the source left datum");
assert(left.includes('stroke-width="2"'), "CAD fitting line weight must match the configured visible object line weight");
for (const type of ["外丝", "内丝", "双卡", "单卡", "环压", "插焊", "法兰", "堵头", "沟槽", "对焊"]) {
  assert(DockingCadRenderer.fitting(type, 40, 500, 280, 28, "left", colors).includes("docking-cad-fitting"));
}
assert(DockingCadRenderer.fittingLength("外丝", 40, 28, 30) > 0);
assert(DockingCadRenderer.fittingEnvelopeHeight("外丝", 40, 28, 30) > 28);
const smallExternal = DockingCadRenderer.fitting("外丝", 15, 500, 280, 27, "right", colors);
assert(smallExternal.includes("scale(1.6875 -1.6875)"), "D15 fallback profile must scale its D16 connection datum to the requested pipe height");
assert(smallExternal.includes('stroke-width="2"'), "small CAD fittings must not become thinner after profile scaling");
assert.strictEqual(DockingCadRenderer.fittingEnvelopeHeight("无配件", 40, 28, 31), 31);
const flangeProfile = DockingCadProfileData.getProfile("法兰", 40);
assert.strictEqual(flangeProfile.datum, "left");
assert.strictEqual(flangeProfile.scaleBy, "diameter");
const leftFlange = DockingCadRenderer.fitting("法兰", 40, 500, 280, 28, "left", colors);
const rightFlange = DockingCadRenderer.fitting("法兰", 40, 700, 280, 28, "right", colors);
assert(leftFlange.includes("scale(-"), "A-side left-datum flange should mirror outward");
assert(rightFlange.includes("scale(0."), "B-side left-datum flange should retain the source direction");
assert(DockingCadRenderer.fitting("法兰", 219, 700, 280, 70, "right", colors).includes("docking-cad-fitting"));
const capProfile = DockingCadProfileData.getProfile("堵头", 219);
assert.strictEqual(capProfile.datum, "left");
assert.strictEqual(capProfile.scaleBy, "diameter");
assert.strictEqual(capProfile.diameter, 219);
const socketWeldProfile = DockingCadProfileData.getProfile("插焊", 219);
assert.strictEqual(socketWeldProfile.diameter, 219);
assert.strictEqual(socketWeldProfile.datum, "left");
assert.strictEqual(socketWeldProfile.scaleBy, "diameter");
assert.strictEqual(DockingCadProfileData.getProfile("单卡", 42).diameter, 42);
assert.strictEqual(DockingCadProfileData.getProfile("单卡", 15).diameter, 18);
assert(DockingCadRenderer.fitting("单卡", 42, 700, 280, 28, "right", colors).includes("docking-cad-fitting-单卡"));

const straight = DockingCadRenderer.straight(40, 500, 700, 280, 28, colors);
assert(straight.includes("docking-cad-straight"));
assert(straight.includes('data-source-diameter="40"'));
assert(straight.includes('vector-effect="non-scaling-stroke"'));

console.log("docking CAD renderer tests passed");
