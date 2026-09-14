(function exposeQuoteHistoryStorageCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.QuoteHistoryStorageCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createQuoteHistoryStorageCore() {
  const VERSION = 1;
  const MAX_ENTRIES = 30;

  function snapshotItem(item) {
    return {
      id: Number(item.id) || Date.now(),
      name: String(item.name || "未命名报价"),
      quantity: Math.max(1, Number(item.quantity) || 1),
      factoryCost: Number(item.factoryCost) || 0,
      factoryCostTotal: Number(item.factoryCostTotal) || 0,
      discountedPrice: Number(item.discountedPrice) || 0,
      discountedPriceTotal: Number(item.discountedPriceTotal) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      totalPrice: Number(item.totalPrice) || 0,
      config: item.config || {},
      result: { quoteIssues: item.result?.quoteIssues || [] }
    };
  }

  function createEntry({ config, result, items, columns, pricingVersion, pricingTrace }) {
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      savedAt: new Date().toISOString(),
      quoteNo: String(config.quoteNo || "未编号"),
      productCode: String(config.productCode || "待确认"),
      productName: String(config.productType || "产品"),
      material: String(config.material || "304"),
      tubeSeries: String(config.tubeSeries || "A"),
      steelTonPrice: Number(config.steelTonPrice) || 0,
      pricingVersion: Number(pricingVersion) || 0,
      pricingRevision: Number(pricingTrace?.revision) || 0,
      pricingFingerprint: String(pricingTrace?.fingerprint || ""),
      // A saved quotation must retain the actual pricing table it used. The
      // quote list itself keeps only a lightweight revision reference.
      pricingSnapshot: pricingTrace?.snapshot ? JSON.parse(JSON.stringify(pricingTrace.snapshot)) : null,
      config,
      result: {
        factoryCost: Number(result.factoryCost ?? result.subtotal) || 0,
        discountedPrice: Number(result.discountedPrice) || 0,
        unitPrice: Number(result.unitPrice) || 0,
        totalPrice: Number(result.totalPrice) || 0,
        quoteIssues: result.quoteIssues || []
      },
      columns: Array.isArray(columns) ? columns : ["unitPrice"],
      items: (Array.isArray(items) ? items : []).map(snapshotItem)
    };
  }

  function serialize(entries) {
    return JSON.stringify({ version: VERSION, entries: (Array.isArray(entries) ? entries : []).slice(0, MAX_ENTRIES) });
  }

  function deserialize(text) {
    if (!text) return [];
    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.entries)) return [];
    return parsed.entries.filter(entry => entry && typeof entry === "object" && entry.config).slice(0, MAX_ENTRIES);
  }

  return { VERSION, MAX_ENTRIES, createEntry, deserialize, serialize };
});
