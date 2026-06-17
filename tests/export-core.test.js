const assert = require("assert");
const ExportCore = require("../export-core");

assert.strictEqual(ExportCore.drawingFileName("", "png"), "drawing.png");
assert.strictEqual(ExportCore.drawingFileName("分水-001", "pdf"), "分水-001.pdf");
assert.strictEqual(ExportCore.quoteListFileName("报价-001"), "报价-001.csv");
assert.strictEqual(ExportCore.csvEscape('A"B'), '"A""B"');

const csv = ExportCore.quoteListCsv([
  { name: 'D40 "外丝"', quantity: 2, unitPrice: 12.345, totalPrice: 24.69 }
], value => Number(value).toFixed(2));
assert(csv.startsWith("\ufeff"));
assert(csv.includes('"D40 ""外丝"""'));
assert(csv.includes('"12.35"'));

const workbook = ExportCore.settingsWorkbookXml([["配置路径", "数值"], ['["a"]', "1&2"]], value => String(value).replaceAll("&", "&amp;"));
assert(workbook.includes("Excel.Sheet"));
assert(workbook.includes("1&amp;2"));
assert.strictEqual(ExportCore.datedSettingsFileName(new Date("2026-06-04T00:00:00Z")), "定制产品报价设置-20260604.xls");

console.log("export core tests passed");
