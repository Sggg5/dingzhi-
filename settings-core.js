(function exposeSettingsCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.SettingsCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createSettingsCore() {
  const forbiddenPathKeys = new Set(["__proto__", "prototype", "constructor"]);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeFittingSeries(defaultSeries, savedSeries = {}) {
    const names = new Set([
      ...Object.keys(defaultSeries || {}),
      ...Object.keys(savedSeries || {})
    ]);
    return Array.from(names).reduce((merged, name) => {
      merged[name] = {
        ...(defaultSeries?.[name] || {}),
        ...(savedSeries?.[name] || {})
      };
      return merged;
    }, {});
  }

  function flatten(value, path = [], rows = []) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.keys(value).forEach(key => flatten(value[key], [...path, key], rows));
      return rows;
    }
    rows.push({
      path: JSON.stringify(path),
      value: value ?? ""
    });
    return rows;
  }

  function parseCellValue(value) {
    const text = String(value ?? "").trim();
    if (text === "") return undefined;
    if (text === "true") return true;
    if (text === "false") return false;
    if (text === "null") return null;
    const numberValue = Number(text);
    return Number.isFinite(numberValue) ? numberValue : text;
  }

  function escapeXml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
  }

  function isAllowedPath(template, path) {
    if (!Array.isArray(path) || path.length === 0) return false;
    let templateCursor = template;
    for (const key of path) {
      if (typeof key !== "string" || forbiddenPathKeys.has(key)) return false;
      if (!templateCursor || typeof templateCursor !== "object" || !Object.prototype.hasOwnProperty.call(templateCursor, key)) return false;
      templateCursor = templateCursor[key];
    }
    return true;
  }

  function setValueByPath(target, template, path, value) {
    if (!isAllowedPath(template, path)) return false;
    let cursor = target;
    path.slice(0, -1).forEach(key => {
      cursor[key] ||= {};
      cursor = cursor[key];
    });
    const lastKey = path[path.length - 1];
    if (value === undefined) {
      delete cursor[lastKey];
    } else {
      cursor[lastKey] = value;
    }
    return true;
  }

  return {
    clone,
    escapeXml,
    flatten,
    isAllowedPath,
    mergeFittingSeries,
    parseCellValue,
    setValueByPath
  };
});
