(function exposeMiddleFieldCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.MiddleFieldCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createMiddleFieldCore() {
  function straightLengthFieldState(type, currentValue, defaultLength) {
    const enabled = type === "直管";
    const value = enabled && String(currentValue || "").trim() === "" ? String(defaultLength) : String(currentValue ?? "");
    return { enabled, hidden: !enabled, disabled: !enabled, value };
  }

  function elbowMiddleLengthFieldState(type, currentValue) {
    return straightLengthFieldState(type, currentValue, 20);
  }

  function teeBMiddleLengthFieldState(type, currentValue) {
    return straightLengthFieldState(type, currentValue, 50);
  }

  return { elbowMiddleLengthFieldState, straightLengthFieldState, teeBMiddleLengthFieldState };
});
