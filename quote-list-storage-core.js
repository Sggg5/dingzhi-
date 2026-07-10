(function exposeQuoteListStorageCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.QuoteListStorageCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createQuoteListStorageCore() {
  const VERSION = 1;
  const MAX_ITEMS = 200;

  function normalizeColumns(columns, allowedColumns = []) {
    const allowed = new Set(allowedColumns);
    const normalized = Array.from(new Set(Array.isArray(columns) ? columns : []))
      .filter(column => allowed.has(column));
    return normalized.length ? normalized : ["unitPrice"];
  }

  function normalizeItem(item) {
    if (!item || typeof item !== "object" || !item.config || !item.result) return null;
    const id = Number(item.id);
    if (!Number.isFinite(id)) return null;
    return {
      ...item,
      id,
      name: String(item.name || "未命名报价"),
      quantity: Math.max(1, Number(item.quantity) || 1)
    };
  }

  function serialize(items, columns) {
    return JSON.stringify({
      version: VERSION,
      savedAt: new Date().toISOString(),
      columns,
      items: (Array.isArray(items) ? items : []).slice(-MAX_ITEMS)
    });
  }

  function deserialize(text, allowedColumns = []) {
    if (!text) return null;
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.items)) return null;
    return {
      version: Number(parsed.version) || 0,
      savedAt: String(parsed.savedAt || ""),
      columns: normalizeColumns(parsed.columns, allowedColumns),
      items: parsed.items.map(normalizeItem).filter(Boolean).slice(-MAX_ITEMS)
    };
  }

  return { VERSION, MAX_ITEMS, deserialize, normalizeColumns, normalizeItem, serialize };
});
