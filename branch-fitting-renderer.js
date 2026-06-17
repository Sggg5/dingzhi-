(function exposeBranchFittingRenderer(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.BranchFittingRenderer = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createBranchFittingRenderer() {
  function size(branch, branchWidth, h) {
    if (branch.fitting === "直管") return { width: branchWidth, height: 0 };
    if (branch.fitting === "双卡") {
      const visual = h.doubleCardVisualSize(branch.diameter);
      return { width: visual.height, height: visual.width };
    }
    if (branch.fitting === "环压") {
      const visual = h.ringPressVisualSize(branch.diameter);
      return { width: visual.height, height: visual.width };
    }
    if (branch.fitting === "内丝") return h.innerThreadBranchVisualSize(branch);
    if (branch.fitting === "外丝") {
      const visual = h.outerThreadBranchVisualSize(branch);
      return { width: visual.height, height: visual.width };
    }
    return { width: branchWidth + 16, height: 28 };
  }

  function seatOffset() {
    return 0;
  }

  function rotated(path, x, centerY) {
    return `<g transform="rotate(90 ${x} ${centerY})">${path}</g>`;
  }

  function render(branch, x, y, branchWidth, h) {
    const colors = h.drawingColors;
    if (branch.fitting === "直管") return "";
    if (branch.fitting === "双卡") {
      const visual = h.doubleCardVisualSize(branch.diameter);
      const centerY = y + visual.width / 2;
      return rotated(h.doubleCardPath(x - visual.width / 2, centerY - visual.height / 2, visual.width, visual.height, branch.diameter, colors.fittingFill, colors.stroke), x, centerY);
    }
    if (branch.fitting === "环压") {
      const visual = h.ringPressVisualSize(branch.diameter);
      const centerY = y + visual.width / 2;
      return rotated(h.ringPressPath(x - visual.width / 2, centerY - visual.height / 2, visual.width, visual.height, colors.fittingFill, colors.stroke), x, centerY);
    }
    if (branch.fitting === "内丝") {
      const visual = h.innerThreadBranchVisualSize(branch);
      const width = visual.height;
      const height = visual.width;
      const centerY = y + visual.height / 2;
      return rotated(h.innerThreadPath(x - width / 2, centerY - height / 2, width, height, colors.fittingFill, colors.stroke), x, centerY);
    }
    if (branch.fitting === "外丝") {
      const visual = h.outerThreadBranchVisualSize(branch);
      const centerY = y + visual.width / 2;
      return rotated(h.outerThreadPath(x - visual.width / 2, centerY - visual.height / 2, visual.width, visual.height, colors.fittingFill, colors.stroke), x, centerY);
    }
    if (branch.fitting === "沟槽" || branch.fitting === "对焊") {
      const visualHeight = branchWidth;
      const width = Math.max(34, visualHeight * 0.34);
      const centerY = y + width / 2;
      const path = branch.fitting === "沟槽" ? h.groovePath : h.buttWeldPath;
      return rotated(path(x - width / 2, centerY - visualHeight / 2, width, visualHeight, colors.fittingFill, colors.stroke), x, centerY);
    }
    return `<rect x="${x - branchWidth / 2 - 8}" y="${y}" width="${branchWidth + 16}" height="28" rx="3" fill="${colors.fittingFill}" stroke="${colors.fittingStroke}" stroke-width="2"/>`;
  }

  return { render, seatOffset, size };
});
