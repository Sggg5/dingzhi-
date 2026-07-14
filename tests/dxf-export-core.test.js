const assert = require("assert");
const DxfExportCore = require("../dxf-export-core");

const dxf = DxfExportCore.document([
  { type: "LINE", layer: "12_FRAME", x1: 0, y1: 0, x2: 420, y2: 0 },
  { type: "POLYLINE", layer: "01_OUTLINE", closed: true, points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }] },
  { type: "ARC", layer: "01_OUTLINE", x: 30, y: 30, r: 12, startAngle: 180, endAngle: 270 },
  { type: "TEXT", layer: "06_TEXT", x: 20, y: 30, height: 3.5, align: "center", text: "D40 外丝" }
]);

assert(dxf.includes("$INSUNITS\r\n70\r\n4"));
assert(dxf.includes("$CLAYER\r\n8\r\n01_OUTLINE"));
assert(dxf.includes("$DIMCLRD\r\n70\r\n4"));
assert(dxf.includes("$DIMCLRT\r\n70\r\n3"));
assert(dxf.includes("$EXTMAX\r\n10\r\n420\r\n20\r\n297"));
assert(dxf.includes("AC1009"));
assert(dxf.includes("POLYLINE"));
assert(dxf.includes("VERTEX"));
assert(dxf.includes("ARC\r\n8\r\n01_OUTLINE\r\n10\r\n30\r\n20\r\n30\r\n40\r\n12\r\n50\r\n180\r\n51\r\n270"));
assert(dxf.includes("D40 \\U+5916\\U+4E1D"));
assert(dxf.includes("12_FRAME"));
assert(dxf.includes("CONTINUOUS"));
assert(dxf.includes("CENTER2"));
assert(dxf.includes("DASHED2"));
assert(dxf.includes("PHANTOM4"));
assert(dxf.includes("STANDARD"));
assert(dxf.includes("GBCBIG.SHX"));
assert(dxf.includes("03_CENTER\r\n70\r\n0\r\n62\r\n1\r\n6\r\nCENTER2"));
assert(dxf.includes("06_TEXT\r\n70\r\n0\r\n62\r\n3\r\n6\r\nCONTINUOUS"));
assert(dxf.includes("07_DIMENSION\r\n70\r\n0\r\n62\r\n4\r\n6\r\nCONTINUOUS"));
assert.strictEqual(DxfExportCore.text("分水器"), "\\U+5206\\U+6C34\\U+5668");
assert.strictEqual(DxfExportCore.text("A\\B\nC"), "A\\\\B C");
console.log("dxf export core tests passed");
