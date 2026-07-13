(function exposeProductDraftStorageCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ProductDraftStorageCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createProductDraftStorageCore() {
  const VERSION = 1;
  const PRODUCT_TYPES = new Set(["分水器类", "对接类", "三通类", "弯头类", "组合件"]);

  function serialize(config) {
    return JSON.stringify({
      version: VERSION,
      savedAt: new Date().toISOString(),
      config
    });
  }

  function deserialize(text) {
    if (!text) return null;
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || !parsed.config || typeof parsed.config !== "object") return null;
    if (!PRODUCT_TYPES.has(parsed.config.productType)) return null;
    return {
      version: Number(parsed.version) || 0,
      savedAt: String(parsed.savedAt || ""),
      config: parsed.config
    };
  }

  return { VERSION, deserialize, serialize };
});
