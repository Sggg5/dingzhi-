const assert = require("assert");
const BranchFittingRenderer = require("../branch-fitting-renderer");

const path = name => () => `<${name}/>`;
const h = {
  drawingColors: { fittingFill: "#eee", fittingStroke: "#333", stroke: "#222" },
  doubleCardVisualSize: () => ({ width: 60, height: 30 }),
  ringPressVisualSize: () => ({ width: 50, height: 25 }),
  innerThreadBranchVisualSize: () => ({ width: 40, height: 30 }),
  outerThreadBranchVisualSize: () => ({ width: 45, height: 35 }),
  doubleCardPath: path("double-card"), ringPressPath: path("ring-press"),
  innerThreadPath: path("inner-thread"), outerThreadPath: path("outer-thread"),
  groovePath: path("groove"), buttWeldPath: path("butt-weld")
};

assert.deepStrictEqual(BranchFittingRenderer.size({ fitting: "直管" }, 20, h), { width: 20, height: 0 });
assert.deepStrictEqual(BranchFittingRenderer.size({ fitting: "双卡", diameter: 20 }, 20, h), { width: 30, height: 60 });
assert.strictEqual(BranchFittingRenderer.seatOffset({ fitting: "环压" }, 30), 0);
assert.strictEqual(BranchFittingRenderer.render({ fitting: "直管" }, 100, 100, 20, h), "");
for (const fitting of ["双卡", "环压", "内丝", "外丝", "沟槽", "对焊"]) {
  const svg = BranchFittingRenderer.render({ fitting, diameter: 40 }, 100, 100, 30, h);
  assert(svg.includes("rotate(90"), `${fitting} should render vertically`);
}
assert(BranchFittingRenderer.render({ fitting: "法兰", diameter: 40 }, 100, 100, 30, h).includes("<rect"));

console.log("branch fitting renderer tests passed");
