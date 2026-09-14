(function exposeFittingProfileCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.FittingProfileCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createFittingProfileCore() {
  // Connection datum is the plane marked in the source CAD profiles.  The
  // legacy SVG paths include a small shoulder beyond that plane; keeping the
  // inset here makes the assembly rule explicit and reusable.
  const CAD_PROFILE_SOURCES = Object.freeze({
    "直管": "国I 16-101.6 直管.dxf",
    "外丝": "国I 16-101.6 外丝.dxf",
    "内丝": "国I 16-101.6 内丝.dxf",
    "双卡": "国I 16-101.6 双卡.dxf",
    "环压": "国I 16-101.6 环压.dxf"
  });

  const DATUM_INSET = Object.freeze({
    "外丝": 6,
    "内丝": 6,
    "双卡": 6,
    "环压": 6,
    "插焊": 6,
    "直管": 0,
    "沟槽": 0,
    "对焊": 0,
    "法兰": 0,
    "移动螺纹": 0,
    "堵头": 0,
    "无": 0
  });

  function normalizeType(type) {
    return type === "管帽" ? "堵头" : (type || "无");
  }

  function connectionDatumInset(type) {
    return DATUM_INSET[normalizeType(type)] || 0;
  }

  function leftProfileOrigin(datumX, profileWidth, type) {
    return datumX - profileWidth + connectionDatumInset(type);
  }

  function rightProfileOrigin(datumX, type) {
    return datumX - connectionDatumInset(type);
  }

  function hasCadSource(type) {
    return Boolean(CAD_PROFILE_SOURCES[normalizeType(type)]);
  }

  return {
    CAD_PROFILE_SOURCES,
    connectionDatumInset,
    hasCadSource,
    leftProfileOrigin,
    normalizeType,
    rightProfileOrigin
  };
});
