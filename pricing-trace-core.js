(function exposePricingTraceCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PricingTraceCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createPricingTraceCore() {
  const VERSION = 1;
  const MAX_ENTRIES = 50;

  function clone(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function stableJson(value) {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }

  function fingerprint(settings) {
    const text = stableJson(settings);
    let hash = 0x811c9dc5;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return `P${(hash >>> 0).toString(16).padStart(8, "0").toUpperCase()}`;
  }

  function entry(revision, settings, source, savedAt = new Date().toISOString()) {
    return {
      revision,
      fingerprint: fingerprint(settings),
      savedAt,
      source: String(source || "保存设置"),
      snapshot: clone(settings)
    };
  }

  function create(settings, source = "初始设置") {
    const first = entry(1, settings, source);
    return { version: VERSION, currentRevision: 1, nextRevision: 2, entries: [first] };
  }

  function normalize(value, settings) {
    const entries = Array.isArray(value?.entries) ? value.entries.filter(item => item && item.snapshot).slice(-MAX_ENTRIES) : [];
    if (!entries.length) return create(settings, "恢复设置");
    const normalized = {
      version: VERSION,
      currentRevision: Number(value.currentRevision) || Number(entries[entries.length - 1].revision) || 1,
      nextRevision: Math.max(Number(value.nextRevision) || 1, ...entries.map(item => (Number(item.revision) || 0) + 1)),
      entries: entries.map(item => ({
        revision: Number(item.revision) || 1,
        fingerprint: String(item.fingerprint || fingerprint(item.snapshot)),
        savedAt: String(item.savedAt || ""),
        source: String(item.source || "恢复设置"),
        snapshot: clone(item.snapshot)
      }))
    };
    const latest = normalized.entries.find(item => item.revision === normalized.currentRevision) || normalized.entries[normalized.entries.length - 1];
    if (latest.fingerprint !== fingerprint(settings)) {
      const next = entry(normalized.nextRevision, settings, "恢复设置");
      return { ...normalized, currentRevision: next.revision, nextRevision: next.revision + 1, entries: [...normalized.entries, next].slice(-MAX_ENTRIES) };
    }
    normalized.currentRevision = latest.revision;
    return normalized;
  }

  function record(trace, settings, source = "保存设置") {
    const storedCurrent = Array.isArray(trace?.entries)
      ? trace.entries.find(item => Number(item?.revision) === Number(trace.currentRevision)) || trace.entries[trace.entries.length - 1]
      : null;
    // Normalize against the stored snapshot first. This preserves the caller's
    // source (for example "保存设置") when the incoming table has changed.
    const normalized = normalize(trace, storedCurrent?.snapshot || settings);
    const current = normalized.entries.find(item => item.revision === normalized.currentRevision) || normalized.entries[normalized.entries.length - 1];
    const nextFingerprint = fingerprint(settings);
    if (current.fingerprint === nextFingerprint) return { trace: normalized, entry: current, changed: false };
    const next = entry(normalized.nextRevision, settings, source);
    const entries = [...normalized.entries, next].slice(-MAX_ENTRIES);
    return {
      trace: { ...normalized, currentRevision: next.revision, nextRevision: next.revision + 1, entries },
      entry: next,
      changed: true
    };
  }

  function current(trace, settings) {
    const normalized = normalize(trace, settings);
    return normalized.entries.find(item => item.revision === normalized.currentRevision) || normalized.entries[normalized.entries.length - 1];
  }

  return { VERSION, MAX_ENTRIES, clone, create, current, fingerprint, normalize, record, stableJson };
});
