(function exposeFittingDrawing(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.FittingDrawing = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createFittingDrawing() {
  function flange(x, y, width, height, fill, stroke) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  }

  function reducer(leftX, rightX, y, leftHeight, rightHeight, fill, stroke) {
    return `
      <path d="M ${leftX} ${y - leftHeight / 2}
        L ${rightX} ${y - rightHeight / 2}
        L ${rightX} ${y + rightHeight / 2}
        L ${leftX} ${y + leftHeight / 2}
        Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
    `;
  }

  function groove(x, y, width, height, fill, stroke) {
    const notchWidth = Math.max(8, width * 0.22);
    const notchDepth = Math.max(5, height * 0.06);
    const notchLeft = x + (width - notchWidth) / 2;
    const notchRight = notchLeft + notchWidth;
    return `
      <path d="M ${x} ${y}
        L ${notchLeft} ${y}
        L ${notchLeft} ${y + notchDepth}
        L ${notchRight} ${y + notchDepth}
        L ${notchRight} ${y}
        L ${x + width} ${y}
        L ${x + width} ${y + height}
        L ${notchRight} ${y + height}
        L ${notchRight} ${y + height - notchDepth}
        L ${notchLeft} ${y + height - notchDepth}
        L ${notchLeft} ${y + height}
        L ${x} ${y + height}
        Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
    `;
  }

  function buttWeld(x, y, width, height, fill, stroke) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="0" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  }

  function cap(x, y, width, height, fill, stroke) {
    const px = value => x + (value - 50) / 85 * width;
    const py = value => y + (value - 20) / 380 * height;
    return `
      <path d="M ${px(50)} ${py(20)}
        L ${px(80)} ${py(20)}
        C ${px(112)} ${py(20)} ${px(135)} ${py(45)} ${px(135)} ${py(78)}
        L ${px(135)} ${py(342)}
        C ${px(135)} ${py(375)} ${px(112)} ${py(400)} ${px(80)} ${py(400)}
        L ${px(50)} ${py(400)}
        Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    `;
  }

  function doubleCard(x, y, width, height, fill, stroke) {
    return `
      <path d="M ${x} ${y + height * 0.107}
        L ${x + width * 0.161} ${y + height * 0.107}
        C ${x + width * 0.177} ${y + height * 0.107}, ${x + width * 0.174} ${y + height * 0.088}, ${x + width * 0.187} ${y + height * 0.056}
        C ${x + width * 0.203} ${y + height * 0.012}, ${x + width * 0.229} ${y - height * 0.013}, ${x + width * 0.268} ${y - height * 0.020}
        C ${x + width * 0.306} ${y - height * 0.028}, ${x + width * 0.347} ${y - height * 0.013}, ${x + width * 0.372} ${y + height * 0.024}
        C ${x + width * 0.389} ${y + height * 0.049}, ${x + width * 0.395} ${y + height * 0.086}, ${x + width * 0.410} ${y + height * 0.105}
        C ${x + width * 0.415} ${y + height * 0.111}, ${x + width * 0.421} ${y + height * 0.111}, ${x + width * 0.429} ${y + height * 0.111}
        L ${x + width * 0.847} ${y + height * 0.111}
        L ${x + width * 0.905} ${y + height * 0.162}
        L ${x + width * 0.998} ${y + height * 0.162}
        L ${x + width * 0.998} ${y + height * 0.840}
        L ${x + width * 0.905} ${y + height * 0.840}
        L ${x + width * 0.847} ${y + height * 0.891}
        L ${x + width * 0.429} ${y + height * 0.891}
        C ${x + width * 0.415} ${y + height * 0.891}, ${x + width * 0.410} ${y + height * 0.895}, ${x + width * 0.403} ${y + height * 0.913}
        C ${x + width * 0.392} ${y + height * 0.956}, ${x + width * 0.377} ${y + height * 0.990}, ${x + width * 0.355} ${y + height * 1.012}
        C ${x + width * 0.329} ${y + height * 1.039}, ${x + width * 0.290} ${y + height * 1.047}, ${x + width * 0.253} ${y + height * 1.034}
        C ${x + width * 0.216} ${y + height * 1.021}, ${x + width * 0.189} ${y + height * 0.986}, ${x + width * 0.176} ${y + height * 0.938}
        C ${x + width * 0.168} ${y + height * 0.911}, ${x + width * 0.166} ${y + height * 0.891}, ${x + width * 0.155} ${y + height * 0.891}
        L ${x} ${y + height * 0.891}
        Z" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
    `;
  }

  function ringPress(x, y, width, height, fill, stroke) {
    return `
      <path d="M ${x} ${y}
        L ${x + width * 0.259} ${y}
        C ${x + width * 0.275} ${y}, ${x + width * 0.275} ${y + height * 0.018}, ${x + width * 0.290} ${y + height * 0.027}
        L ${x + width * 0.843} ${y + height * 0.027}
        L ${x + width * 0.906} ${y + height * 0.079}
        L ${x + width} ${y + height * 0.079}
        L ${x + width} ${y + height * 0.919}
        L ${x + width * 0.906} ${y + height * 0.919}
        L ${x + width * 0.843} ${y + height * 0.969}
        L ${x + width * 0.290} ${y + height * 0.969}
        C ${x + width * 0.275} ${y + height * 0.978}, ${x + width * 0.275} ${y + height}, ${x + width * 0.259} ${y + height}
        L ${x} ${y + height}
        Z" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
    `;
  }

  function innerThread(x, y, width, height, fill, stroke) {
    return `
      <path d="M ${x + width * 0.05} ${y}
        L ${x + width * 0.68} ${y}
        L ${x + width * 0.86} ${y + height * 0.18}
        L ${x + width} ${y + height * 0.18}
        L ${x + width} ${y + height * 0.82}
        L ${x + width * 0.86} ${y + height * 0.82}
        L ${x + width * 0.68} ${y + height}
        L ${x + width * 0.05} ${y + height}
        L ${x} ${y + height * 0.93}
        L ${x} ${y + height * 0.07}
        Z" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
    `;
  }

  function outerThread(x, y, width, height, fill, stroke) {
    const px = value => x + (value - 190) / 573 * width;
    const py = value => y + (value - 78) / 676 * height;
    return `
      <path d="M ${px(208)} ${py(150)}
        L ${px(190)} ${py(167)} L ${px(190)} ${py(665)} L ${px(208)} ${py(682)}
        L ${px(502)} ${py(697)} L ${px(509)} ${py(701)} L ${px(526)} ${py(754)}
        L ${px(680)} ${py(754)} L ${px(700)} ${py(686)} L ${px(763)} ${py(684)}
        L ${px(763)} ${py(148)} L ${px(700)} ${py(147)} L ${px(696)} ${py(140)}
        L ${px(696)} ${py(126)} L ${px(680)} ${py(78)} L ${px(526)} ${py(78)}
        L ${px(509)} ${py(131)} L ${px(502)} ${py(135)}
        Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    `;
  }

  return { buttWeld, cap, doubleCard, flange, groove, innerThread, outerThread, reducer, ringPress };
});
