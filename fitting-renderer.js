(function exposeFittingRenderer(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.FittingRenderer = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createFittingRenderer() {
  const profileCore = typeof globalThis !== "undefined" ? globalThis.FittingProfileCore : null;
  const cadProfileData = typeof globalThis !== "undefined" ? globalThis.CadProfileData : null;
  const leftProfileOrigin = (datumX, width, fitting) => profileCore
    ? profileCore.leftProfileOrigin(datumX, width, fitting)
    : datumX - width + 6;

  function cadProfileOutline(fitting, diameter, datumX, y, visualHeight, colors) {
    const profile = cadProfileData && cadProfileData.enabled && cadProfileData.getProfile(fitting, diameter);
    if (!profile) return "";
    const scale = visualHeight / profile.bounds.height;
    const visualWidth = profile.bounds.width * scale;
    const originX = leftProfileOrigin(datumX, visualWidth, fitting);
    const drawEntity = (entity) => {
      if (entity.type === "LINE") {
        return `<line x1="${entity.x1}" y1="${entity.y1}" x2="${entity.x2}" y2="${entity.y2}"/>`;
      }
      const start = entity.startAngle * Math.PI / 180;
      const end = entity.endAngle * Math.PI / 180;
      const x1 = entity.cx + entity.radius * Math.cos(start);
      const y1 = entity.cy + entity.radius * Math.sin(start);
      const x2 = entity.cx + entity.radius * Math.cos(end);
      const y2 = entity.cy + entity.radius * Math.sin(end);
      const span = Math.abs(entity.endAngle - entity.startAngle) % 360;
      const largeArc = span > 180 ? 1 : 0;
      // The group mirrors the DXF Y-axis into SVG, so sweep is reversed.
      return `<path d="M ${x1} ${y1} A ${entity.radius} ${entity.radius} 0 ${largeArc} 0 ${x2} ${y2}"/>`;
    };
    return `<g class="cad-profile cad-profile-${fitting}" transform="translate(${originX} ${y + visualHeight / 2}) scale(${scale} ${-scale})" fill="none" stroke="${colors.fittingStroke}" stroke-width="${(colors.fittingLineWidth || 2) / scale}" stroke-linejoin="round" stroke-linecap="round">${profile.entities.map(drawEntity).join("")}</g>`;
  }

  function inlet(config, mainLeft, y, height, h) {
    const fitting = config.mainFitting;
    const diameter = config.mainFittingDiameter || config.mainDiameter;
    const colors = h.drawingColors;
    if (fitting === "直管") return "";
    if (fitting === "堵头") {
      const width = Math.max(14, height * 0.21);
      return `<g transform="translate(${mainLeft * 2} 0) scale(-1 1)">${h.capPath(mainLeft, y - height / 2, width, height, colors.capFill, colors.stroke)}</g>`;
    }
    if (fitting === "法兰") {
      const width = h.flangeVisualWidth(diameter, height);
      const visualHeight = Math.max(height * 1.7, 64);
      return h.flangePath(mainLeft - width, y - visualHeight / 2, width, visualHeight, colors.fittingFill, colors.fittingStroke);
    }
    if (fitting === "双卡") {
      const base = h.doubleCardVisualSize(diameter);
      const visualHeight = Math.max(base.height, height / 0.76);
      const cadOutline = cadProfileOutline(fitting, diameter, mainLeft, y, visualHeight, colors);
      if (cadOutline) return cadOutline;
      return h.doubleCardPath(leftProfileOrigin(mainLeft, base.width, fitting), y - visualHeight / 2, base.width, visualHeight, diameter, colors.fittingFill, colors.fittingStroke);
    }
    if (h.isRingPressLike(fitting)) {
      const base = h.ringPressVisualSize(diameter);
      const visualHeight = Math.max(base.height, height);
      const width = Math.max(base.width, visualHeight * (base.width / base.height));
      return h.ringPressPath(leftProfileOrigin(mainLeft, width, fitting), y - visualHeight / 2, width, visualHeight, colors.fittingFill, colors.fittingStroke);
    }
    if (fitting === "内丝" || fitting === "外丝") {
      const visualHeight = height / 0.76;
      const width = h.threadVisualWidth(fitting, diameter, height);
      const cadOutline = cadProfileOutline(fitting, diameter, mainLeft, y, visualHeight, colors);
      if (cadOutline) return cadOutline;
      const path = fitting === "内丝" ? h.innerThreadPath : h.outerThreadPath;
      return path(leftProfileOrigin(mainLeft, width, fitting), y - visualHeight / 2, width, visualHeight, colors.fittingFill, colors.fittingStroke);
    }
    if (fitting === "沟槽" || fitting === "对焊") {
      const width = Math.max(34, height * 0.34);
      const path = fitting === "沟槽" ? h.groovePath : h.buttWeldPath;
      return path(mainLeft - width, y - height / 2, width, height, colors.fittingFill, colors.fittingStroke);
    }
    return `<rect x="${mainLeft - 42}" y="${y - height / 2 - 9}" width="42" height="${height + 18}" rx="4" fill="${colors.fittingFill}" stroke="${colors.fittingStroke}" stroke-width="${colors.fittingLineWidth || 2}"/>`;
  }

  function tail(config, mainRight, y, height, h) {
    if (config.tailFitting === "直管") return "";
    if (config.tailFitting === "堵头") {
      return h.capPath(mainRight, y - height / 2, Math.max(14, height * 0.21), height, h.drawingColors.capFill, h.drawingColors.stroke);
    }
    return `<g transform="translate(${mainRight * 2} 0) scale(-1 1)">${inlet({ ...config, mainFitting: config.tailFitting, mainFittingDiameter: config.tailFittingDiameter || config.mainDiameter }, mainRight, y, height, h)}</g>`;
  }

  function inline(fitting, diameter, x, y, height, side, h) {
    if (h.isNoFitting(fitting)) return "";
    return side === "right"
      ? tail({ mainDiameter: diameter, mainFitting: "直管", tailFitting: fitting }, x, y, height, h)
      : inlet({ mainDiameter: diameter, mainFitting: fitting }, x, y, height, h);
  }

  function verticalInline(fitting, diameter, x, y, height, side, h) {
    if (h.isNoFitting(fitting)) return "";
    const angle = side === "bottom" ? -90 : 90;
    return `<g transform="rotate(${angle} ${x} ${y})">${inline(fitting, diameter, x, y, height, "left", h)}</g>`;
  }

  return { inlet, inline, tail, verticalInline };
});
