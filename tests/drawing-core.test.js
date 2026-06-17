const assert = require("assert");
const DrawingCore = require("../drawing-core");

const marker = DrawingCore.arrowMarker("#777");
assert(marker.includes('id="arrow"'));
assert(marker.includes('fill="#777"'));

const frame = DrawingCore.engineeringFrame("TEST-001");
assert(frame.includes("TEST-001"));
assert(frame.includes("借用件登记"));
assert(frame.includes('width="1194" height="800"'));

const bom = DrawingCore.bomBox({
  x: 820,
  y: 500,
  height: 110,
  rows: [{ name: "主管 D40", quantity: 1 }]
});
assert(bom.includes("BOM 清单"));
assert(bom.includes("主管 D40"));
assert(bom.includes(">1</text>"));

const info = DrawingCore.infoBox({
  x: 180,
  y: 500,
  title: "尺寸说明",
  content: '<text x="18" y="56">L：长度</text>'
});
assert(info.includes('translate(180 500)'));
assert(info.includes("尺寸说明"));
assert(info.includes("L：长度"));

const titleBlock = DrawingCore.titleBlock({
  material: "316L",
  titleSvg: '<text x="614" y="78">测试产品</text>',
  productLabel: "德标定制产品"
});
assert(titleBlock.includes("316L"));
assert(titleBlock.includes("测试产品"));
assert(titleBlock.includes("德标定制产品"));
assert(titleBlock.includes("浙江福兰特有限公司"));

const requirements = DrawingCore.technicalRequirements({
  lines: ["第一条", { text: "第二条", indent: 12 }]
});
assert(requirements.includes("技术要求:"));
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
