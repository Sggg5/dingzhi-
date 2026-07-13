(function exposeSettingsPasswordCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.SettingsPasswordCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createSettingsPasswordCore() {
  function validateNewPassword(value) {
    const password = String(value || "");
    if (password.length < 6) return "新密码至少需要 6 位";
    if (password.length > 128) return "新密码不能超过 128 位";
    return "";
  }

  async function hash(value, cryptoApi = globalThis.crypto) {
    const text = String(value || "");
    if (!cryptoApi?.subtle || typeof TextEncoder === "undefined") return `plain:${text}`;
    const bytes = new TextEncoder().encode(text);
    const digest = await cryptoApi.subtle.digest("SHA-256", bytes);
    const hex = Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
    return `sha256:${hex}`;
  }

  return { hash, validateNewPassword };
});
