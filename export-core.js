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

  const quotePriceColumnDefinitions = {
    factoryCost: { label: "成本", amountLabel: "成本金额", valueKey: "factoryCost", totalKey: "factoryCostTotal" },
    discountedPrice: { label: "面价折后", amountLabel: "折后金额", valueKey: "discountedPrice", totalKey: "discountedPriceTotal" },
    unitPrice: { label: "面价", amountLabel: "面价金额", valueKey: "unitPrice", totalKey: "totalPrice" }
  };

  function quoteListTotalValue(item, columnKey) {
    const definition = quotePriceColumnDefinitions[columnKey] || quotePriceColumnDefinitions.unitPrice;
    if (Number.isFinite(Number(item[definition.totalKey]))) return Number(item[definition.totalKey]);
    return (Number(item[definition.valueKey]) || 0) * (Number(item.quantity) || 0);
  }

  function quoteListCsv(quoteItems, formatNumber, columns = ["unitPrice"]) {
    const activeColumns = columns.filter(column => quotePriceColumnDefinitions[column]);
    const priceColumns = activeColumns.length ? activeColumns : ["unitPrice"];
    const rows = [[
      "产品编码",
      "规格",
      "数量",
      ...priceColumns.flatMap(column => [quotePriceColumnDefinitions[column].label, quotePriceColumnDefinitions[column].amountLabel])
    ]];
    quoteItems.forEach(item => {
      rows.push([
        item.config?.productCode || "待确认",
        item.name,
        item.quantity,
        ...priceColumns.flatMap(column => {
          const definition = quotePriceColumnDefinitions[column];
          return [formatNumber(item[definition.valueKey] || 0), formatNumber(quoteListTotalValue(item, column))];
        })
      ]);
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
