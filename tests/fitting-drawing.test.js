const assert = require("assert");
const FittingDrawing = require("../fitting-drawing");

const flange = FittingDrawing.flange(1, 2, 3, 4, "#fff", "#000");
assert(flange.includes('x="1"') && flange.includes('rx="2"'));
assert(FittingDrawing.flange(1, 2, 3, 4, "#fff", "#000", 1.5).includes('stroke-width="1.5"'));

const reducer = FittingDrawing.reducer(10, 30, 20, 8, 16, "#eee", "#333");
assert(reducer.includes("M 10 16") && reducer.includes("L 30 12"));
assert(FittingDrawing.reducer(10, 30, 20, 8, 16, "#eee", "#333", 2.5).includes('stroke-width="2.5"'));

const groove = FittingDrawing.groove(0, 0, 40, 80, "#eee", "#333");
assert(groove.includes("<path") && groove.includes("stroke-linejoin"));

const buttWeld = FittingDrawing.buttWeld(0, 0, 20, 40, "#eee", "#333");
assert(buttWeld.includes('rx="0"') && buttWeld.includes('height="40"'));

for (const name of ["cap", "doubleCard", "ringPress", "innerThread", "outerThread"]) {
  const svg = FittingDrawing[name](0, 0, 60, 40, "#eee", "#333");
  assert(svg.includes("<path"), `${name} should render a path`);
  assert(svg.includes('fill="#eee"'), `${name} should preserve fill`);
}

console.log("fitting drawing tests passed");
