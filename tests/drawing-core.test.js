const assert = require("assert");
const DrawingCore = require("../drawing-core");

assert.strictEqual(DrawingCore.CAD_STANDARD.line.dimension, 1.2);
assert.strictEqual(DrawingCore.CAD_STANDARD.dimension.centerDash, "7 6");
assert.strictEqual(DrawingCore.CAD_STANDARD.text.dimensionEmphasis, 16);
assert.strictEqual(DrawingCore.CAD_STANDARD.text.dimensionTotal, 18);
assert.strictEqual(DrawingCore.CAD_STANDARD.text.info, 13);
assert.strictEqual(DrawingCore.CAD_STANDARD.frame.stroke, "#111");
assert.strictEqual(DrawingCore.CAD_STANDARD.frame.borderLine, 2.2);
assert.strictEqual(DrawingCore.CAD_STANDARD.frame.titleBlockLine, 2);

const marker = DrawingCore.arrowMarker("#777");
assert(marker.includes('id="arrow"'));
assert(marker.includes('fill="#777"'));

const center = DrawingCore.centerLine(0, 10, 100, 10);
assert(center.includes('stroke-dasharray="7 6"'));
assert(center.includes('stroke-width="1"'));

const frame = DrawingCore.engineeringFrame("TEST-001");
assert(frame.includes("TEST-001"));
assert(frame.includes('width="1194" height="800"'));

const bom = DrawingCore.bomBox({
  x: 820,
  y: 500,
  height: 110,
  rows: [{ name: "Main D40", quantity: 1 }]
});
assert(bom.includes("Main D40"));
assert(bom.includes(">1</text>"));

const info = DrawingCore.infoBox({
  x: 180,
  y: 500,
  title: "Size note",
  content: '<text x="18" y="56">L: length</text>'
});
assert(info.includes('translate(180 500)'));
assert(info.includes("Size note"));
assert(info.includes("L: length"));

const titleBlock = DrawingCore.titleBlock({
  material: "316L",
  dateText: "2026-06-18",
  titleSvg: '<text x="614" y="78">Test product</text>',
  productLabel: "Custom product"
});
assert(titleBlock.includes("316L"));
assert(titleBlock.includes("Test product"));
assert(titleBlock.includes("Custom product"));
assert(titleBlock.includes("2026-06-18"));
assert(titleBlock.includes('x1="165" y1="0" x2="165" y2="144"'));
assert(!titleBlock.includes("1:2"));

const requirements = DrawingCore.technicalRequirements({
  lines: ["First", { text: "Second", indent: 12 }]
});
assert(requirements.includes("First"));
assert(requirements.includes("Second"));
assert(requirements.includes('x="12" y="40"'));

const horizontal = DrawingCore.horizontalDimension({
  x1: 10,
  x2: 110,
  y: 50,
  label: "L=100 mm",
  extensionStart: { fromY: 20, toY: 60 },
  extensionEnd: { fromY: 20, toY: 60 }
});
assert(horizontal.includes('x1="10" y1="50" x2="110" y2="50"'));
assert(horizontal.includes('stroke-width="1.2"'));
assert(horizontal.includes('x="60" y="40"'));
assert(horizontal.includes("L=100 mm"));

const vertical = DrawingCore.verticalDimension({
  x: 100,
  y1: 20,
  y2: 120,
  label: "H=100 mm",
  extensionTop: { fromX: 50, toX: 100 },
  extensionBottom: { fromX: 50, toX: 100 }
});
assert(vertical.includes('x1="100" y1="20" x2="100" y2="120"'));
assert(vertical.includes("rotate(-90 82 70)"));
assert(vertical.includes("H=100 mm"));

const projected45 = DrawingCore.projected45Dimension({
  centerBaseX: 100,
  centerBaseY: 100,
  endBaseX: 200,
  endBaseY: 0,
  dimensionOffset: 40,
  label: "H=140 mm"
});
assert(projected45.includes('x1="100" y1="100"'));
assert(projected45.includes('x1="200" y1="0"'));
assert(projected45.includes('stroke-width="1.2"'));
assert(projected45.includes("rotate(-45"));
assert(projected45.includes("H=140 mm"));

const fitted = DrawingCore.fitContent({
  bounds: { left: 0, right: 200, top: 0, bottom: 100 },
  box: { left: 100, right: 300, top: 100, bottom: 200 },
  content: "<rect/>"
});
assert(fitted.includes("<rect/>"));
assert(fitted.includes("scale(1.0000)"));
assert(fitted.includes("translate(100.00 100.00)"));

console.log("drawing core tests passed");
