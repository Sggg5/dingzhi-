const assert = require("assert");
const WorkspaceBackupCore = require("../workspace-backup-core");

const backup = WorkspaceBackupCore.create({
  pricing: { settingsVersion: 12 },
  pricingTrace: { currentRevision: 2, entries: [{ revision: 2, snapshot: { settingsVersion: 12 } }] },
  quoteItems: [{ id: 1 }],
  quoteColumns: ["unitPrice"],
  productDraft: { productType: "分水器类" },
  quoteHistory: [{ id: "history-1" }],
  settingsPasswordHash: "sha256:abc"
});
const restored = WorkspaceBackupCore.parse(JSON.stringify(backup));
assert.strictEqual(restored.schemaVersion, 1);
assert.strictEqual(restored.quoteList.items.length, 1);
assert.strictEqual(restored.quoteHistory.length, 1);
assert.strictEqual(restored.settingsPasswordHash, "sha256:abc");
assert.strictEqual(restored.pricingTrace.currentRevision, 2);
assert.throws(() => WorkspaceBackupCore.parse("{}"));
assert.strictEqual(WorkspaceBackupCore.fileName(new Date("2026-07-13T00:00:00Z")), "定制产品报价完整备份-20260713.json");

console.log("workspace backup core tests passed");
