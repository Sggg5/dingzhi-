const assert = require("assert");
const ProductGeometryCore = require("../product-geometry-core");
const colors = { pipeFill: "#eee", stroke: "#333", centerLine: "#777" };

const angle45 = ProductGeometryCore.elbowRoundBody(100, 200, 300, 120, 40, 45, colors);
assert(angle45.includes("A "));
assert(angle45.includes('stroke-dasharray="8 7"'));
assert(angle45.includes('fill="#eee"'));

const angle90 = ProductGeometryCore.elbowRoundBody(100, 200, 220, 80, 40, 90, colors);
assert(angle90.includes("A 58 58"));
assert(angle90.includes("L 220 80"));

const large = ProductGeometryCore.elbowRoundBody(100, 200, 300, 120, 219, 45, colors);
assert(!large.includes("NaN"));

console.log("product geometry core tests passed");
