(function (global) {
  function drawingFileName(quoteNo, extension) {
    return `${quoteNo || "drawing"}.${extension}`;
  }

  function quoteListFileName(quoteNo) {
    return `${quoteNo || "quote-list"}.csv`;
  }

  function csvEscape(value) {
    return `"${String(value).replaceAll('"', '""')}"`;
  }

  function quoteListCsv(quoteItems, formatNumber) {
    const rows = [["规格", "数量", "面价", "面价金额"]];
    quoteItems.forEach(item => {
      rows.push([item.name, item.quantity, formatNumber(item.unitPrice), formatNumber(item.totalPrice)]);
    });
    return `\ufeff${rows.map(row => row.map(csvEscape).join(",")).join("\n")}`;
  }

  function settingsWorkbookXml(rows, escapeXml) {
    const rowXml = rows.map(row => `
    <Row>
      <Cell><Data ss:Type="String">${escapeXml(row[0])}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(row[1])}</Data></Cell>
    </Row>
  `).join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="设置数据">
    <Table>${rowXml}</Table>
  </Worksheet>
</Workbook>`;
  }

  function datedSettingsFileName(date = new Date()) {
    const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
    return `定制产品报价设置-${stamp}.xls`;
  }

  const api = {
    csvEscape,
    datedSettingsFileName,
    drawingFileName,
    quoteListCsv,
    quoteListFileName,
    settingsWorkbookXml
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.ExportCore = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
