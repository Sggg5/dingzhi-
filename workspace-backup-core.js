(function exposeWorkspaceBackupCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.WorkspaceBackupCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createWorkspaceBackupCore() {
  const SCHEMA_VERSION = 1;

  function create({ pricing, quoteItems, quoteColumns, productDraft, quoteHistory, settingsPasswordHash }) {
    return {
      schemaVersion: SCHEMA_VERSION,
      createdAt: new Date().toISOString(),
      pricing,
      quoteList: { items: quoteItems || [], columns: quoteColumns || ["unitPrice"] },
      productDraft: productDraft || null,
      quoteHistory: quoteHistory || [],
      settingsPasswordHash: typeof settingsPasswordHash === "string" ? settingsPasswordHash : null
    };
  }

  function parse(text) {
    const value = JSON.parse(text);
    if (!value || typeof value !== "object" || !value.pricing || typeof value.pricing !== "object") {
      throw new Error("invalid workspace backup");
    }
    if (!value.quoteList || !Array.isArray(value.quoteList.items)) value.quoteList = { items: [], columns: ["unitPrice"] };
    if (!Array.isArray(value.quoteHistory)) value.quoteHistory = [];
    if (value.settingsPasswordHash !== null && typeof value.settingsPasswordHash !== "string") value.settingsPasswordHash = null;
    return value;
  }

  function fileName(date = new Date()) {
    return `定制产品报价完整备份-${date.toISOString().slice(0, 10).replaceAll("-", "")}.json`;
  }

  return { SCHEMA_VERSION, create, fileName, parse };
});
