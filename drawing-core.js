(function exposeDrawingCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.DrawingCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createDrawingCore() {
  function arrowMarker(color, id = "arrow") {
    return `
      <marker id="${id}" markerWidth="12" markerHeight="6" viewBox="0 0 12 6" refX="12" refY="3" orient="auto-start-reverse">
        <path d="M 12 3 L 0 0 L 0 6 Z" fill="${color}"></path>
      </marker>
    `;
  }

  function engineeringFrame(quoteNo = "") {
    return `
      <rect x="3" y="35" width="1194" height="800" fill="#fff" stroke="#111" stroke-width="1.2"/>
      <rect x="104" y="51" width="1072" height="768" fill="none" stroke="#111" stroke-width="2.2"/>
      <line x1="600" y1="35" x2="600" y2="68" stroke="#111" stroke-width="2.2"/>
      <line x1="600" y1="819" x2="600" y2="835" stroke="#111" stroke-width="2.2"/>
      <text x="300" y="50" text-anchor="middle" font-size="16" fill="#111">1</text>
      <text x="900" y="50" text-anchor="middle" font-size="16" fill="#111">2</text>
      <text x="300" y="832" text-anchor="middle" font-size="16" fill="#111">1</text>
      <text x="900" y="832" text-anchor="middle" font-size="16" fill="#111">2</text>
      <line x1="104" y1="95" x2="345" y2="95" stroke="#111" stroke-width="1"/>
      <line x1="345" y1="51" x2="345" y2="95" stroke="#111" stroke-width="1"/>
      <text x="225" y="80" text-anchor="middle" font-size="16" fill="#111">${quoteNo}</text>
      <line x1="3" y1="380" x2="126" y2="380" stroke="#111" stroke-width="1"/>
      <line x1="3" y1="398" x2="104" y2="398" stroke="#111" stroke-width="1"/>
      <line x1="3" y1="445" x2="104" y2="445" stroke="#111" stroke-width="1"/>
      <line x1="3" y1="485" x2="104" y2="485" stroke="#111" stroke-width="1"/>
      <line x1="3" y1="525" x2="104" y2="525" stroke="#111" stroke-width="1"/>
      <line x1="3" y1="590" x2="104" y2="590" stroke="#111" stroke-width="1"/>
      <line x1="3" y1="655" x2="104" y2="655" stroke="#111" stroke-width="1"/>
      <line x1="3" y1="725" x2="104" y2="725" stroke="#111" stroke-width="1"/>
      <line x1="104" y1="380" x2="126" y2="380" stroke="#111" stroke-width="2"/>
      <text x="52" y="260" text-anchor="middle" font-size="16" fill="#111">A</text>
      <text x="1187" y="260" text-anchor="middle" font-size="16" fill="#111">A</text>
      <text x="1187" y="605" text-anchor="middle" font-size="16" fill="#111">B</text>
      <text x="52" y="392" text-anchor="middle" font-size="14" fill="#111">借用件登记</text>
      <text x="52" y="426" text-anchor="middle" font-size="14" fill="#111">描 图</text>
      <text x="52" y="468" text-anchor="middle" font-size="14" fill="#111">校 描</text>
      <text x="52" y="545" text-anchor="middle" font-size="14" fill="#111">旧底图总号</text>
      <text x="52" y="625" text-anchor="middle" font-size="14" fill="#111">签 字</text>
      <text x="52" y="692" text-anchor="middle" font-size="14" fill="#111">日 期</text>
    `;
  }

  function bomBox(options) {
    const {
      x,
      y,
      width = 300,
      height,
      rows = [],
      labelColor = "#173d3a",
      accentColor = "#0f766e",
      borderColor = "#cbd8d5",
      dividerColor = "#aebbb7",
      lineHeight = Math.min(15, Math.max(10, (height - 56) / Math.max(1, rows.length))),
      fontSize = rows.length > 6 ? 10 : 11
    } = options;
    const quantityX = width - 56;
    const rowSvg = rows.map((row, index) => {
      const rowY = 60 + index * lineHeight;
      return `
        <text x="24" y="${rowY}" font-size="${fontSize}" fill="${labelColor}">${row.name}</text>
        <text x="${quantityX}" y="${rowY}" text-anchor="middle" font-size="${fontSize}" font-weight="700" fill="${labelColor}">${row.quantity}</text>
      `;
    }).join("");
    return `
      <g transform="translate(${x} ${y})">
        <rect x="0" y="0" width="${width}" height="${height}" rx="8" fill="#fff" stroke="${borderColor}"/>
        <text x="18" y="28" font-size="16" font-weight="700" fill="${accentColor}">BOM 清单</text>
        <text x="${quantityX}" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="${labelColor}">数量</text>
        <line x1="18" y1="42" x2="${width - 18}" y2="42" stroke="${dividerColor}"/>
        ${rowSvg}
      </g>
    `;
  }

  function infoBox(options) {
    const {
      x,
      y,
      width = 300,
      height = 110,
      title,
      content = "",
      accentColor = "#0f766e",
      borderColor = "#cbd8d5"
    } = options;
    return `
      <g transform="translate(${x} ${y})">
        <rect x="0" y="0" width="${width}" height="${height}" rx="8" fill="#fff" stroke="${borderColor}"/>
        <text x="18" y="28" font-size="16" font-weight="700" fill="${accentColor}">${title}</text>
        ${content}
      </g>
    `;
  }

  function titleBlock(options) {
    const {
      x = 454,
      y = 675,
      material = "",
      titleSvg = "",
      productLabel = "国标定制产品"
    } = options;
    return `
      <g transform="translate(${x} ${y})">
        <rect x="0" y="0" width="722" height="144" fill="#fff" stroke="#111" stroke-width="2"/>
        <line x1="260" y1="0" x2="260" y2="144" stroke="#111" stroke-width="2"/>
        <line x1="505" y1="0" x2="505" y2="144" stroke="#111" stroke-width="2"/>
        <line x1="0" y1="21" x2="260" y2="21" stroke="#111"/>
        <line x1="0" y1="42" x2="260" y2="42" stroke="#111"/>
        <line x1="0" y1="63" x2="260" y2="63" stroke="#111"/>
        <line x1="0" y1="84" x2="260" y2="84" stroke="#111" stroke-width="2"/>
        <line x1="0" y1="114" x2="260" y2="114" stroke="#111" stroke-width="2"/>
        <line x1="30" y1="0" x2="30" y2="84" stroke="#111"/>
        <line x1="60" y1="0" x2="60" y2="144" stroke="#111" stroke-width="2"/>
        <line x1="165" y1="0" x2="165" y2="84" stroke="#111"/>
        <line x1="215" y1="0" x2="215" y2="144" stroke="#111" stroke-width="2"/>
        <line x1="260" y1="84" x2="505" y2="84" stroke="#111" stroke-width="2"/>
        <line x1="260" y1="114" x2="505" y2="114" stroke="#111"/>
        <line x1="342" y1="84" x2="342" y2="144" stroke="#111"/>
        <line x1="424" y1="84" x2="424" y2="144" stroke="#111"/>
        <line x1="505" y1="48" x2="722" y2="48" stroke="#111" stroke-width="2"/>
        <line x1="505" y1="96" x2="722" y2="96" stroke="#111" stroke-width="2"/>
        <text x="15" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#111">标记</text>
        <text x="45" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#111">处数</text>
        <text x="112.5" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#111">更改文件号</text>
        <text x="190" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#111">签字</text>
        <text x="237.5" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#111">日期</text>
        <text x="16" y="102" font-size="12" fill="#111">设计</text>
        <text x="95" y="102" font-size="12" fill="#111">FRANTA</text>
        <text x="16" y="134" font-size="12" fill="#111">审核</text>
        <text x="95" y="134" font-size="12" fill="#111">FRANTA</text>
        <text x="382" y="56" text-anchor="middle" font-size="24" fill="#111">${material}</text>
        <text x="301" y="103" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#111">图样标记</text>
        <text x="383" y="103" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#111">重量</text>
        <text x="465" y="103" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#111">比例</text>
        <text x="465" y="129" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#111">1:2</text>
        <text x="289" y="129" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#111">共</text>
        <text x="313" y="129" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#111">页</text>
        <text x="448" y="129" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#111">第</text>
        <text x="482" y="129" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#111">页</text>
        <text x="614" y="30" text-anchor="middle" font-size="16" fill="#111">浙江福兰特有限公司</text>
        ${titleSvg}
        <text x="614" y="126" text-anchor="middle" font-size="15" fill="#111">${productLabel}</text>
      </g>
    `;
  }

  function technicalRequirements(options) {
    const { x = 132, y = 675, lines = [] } = options;
    return `
      <g transform="translate(${x} ${y})">
        <text x="0" y="0" font-size="14" font-weight="700" fill="#111">技术要求:</text>
        ${lines.map((line, index) => `<text x="${line.indent || 0}" y="${20 + index * 20}" font-size="12" fill="#111">${line.text || line}</text>`).join("")}
      </g>
    `;
  }

  function horizontalDimension(options) {
    const {
      x1,
      x2,
      y,
      label = "",
      color = "#6f6a61",
      labelColor = color,
      lineWidth = 1,
      extensionStart,
      extensionEnd,
      labelY = y - 10,
      fontSize = 13,
      fontWeight = 400,
      markerId = "arrow"
    } = options;
    const startExtension = extensionStart
      ? `<line x1="${x1}" y1="${extensionStart.fromY}" x2="${x1}" y2="${extensionStart.toY}" stroke="${color}" stroke-width="1"/>`
      : "";
    const endExtension = extensionEnd
      ? `<line x1="${x2}" y1="${extensionEnd.fromY}" x2="${x2}" y2="${extensionEnd.toY}" stroke="${color}" stroke-width="1"/>`
      : "";
    return `
      ${startExtension}
      ${endExtension}
      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="${lineWidth}" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      ${label ? `<text x="${(x1 + x2) / 2}" y="${labelY}" text-anchor="middle" font-size="${fontSize}" font-weight="${fontWeight}" fill="${labelColor}">${label}</text>` : ""}
    `;
  }

  function verticalDimension(options) {
    const {
      x,
      y1,
      y2,
      label = "",
      color = "#6f6a61",
      labelColor = color,
      lineWidth = 1,
      extensionTop,
      extensionBottom,
      labelOffset = -18,
      fontSize = 16,
      fontWeight = 400,
      markerId = "arrow"
    } = options;
    const topExtension = extensionTop
      ? `<line x1="${extensionTop.fromX}" y1="${y1}" x2="${extensionTop.toX}" y2="${y1}" stroke="${color}" stroke-width="1"/>`
      : "";
    const bottomExtension = extensionBottom
      ? `<line x1="${extensionBottom.fromX}" y1="${y2}" x2="${extensionBottom.toX}" y2="${y2}" stroke="${color}" stroke-width="1"/>`
      : "";
    const labelX = x + labelOffset;
    const labelY = (y1 + y2) / 2;
    return `
      ${topExtension}
      ${bottomExtension}
      <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="${lineWidth}" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      ${label ? `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="${fontSize}" font-weight="${fontWeight}" fill="${labelColor}" transform="rotate(-90 ${labelX} ${labelY})">${label}</text>` : ""}
    `;
  }

  function projected45Dimension(options) {
    const {
      centerBaseX,
      centerBaseY,
      endBaseX,
      endBaseY,
      dimensionOffset,
      label = "",
      labelOffset = 12,
      color = "#6f6a61",
      labelColor = color,
      lineWidth = 1,
      fontSize = 16,
      fontWeight = 400,
      fontFamily = "Microsoft YaHei, Arial, sans-serif",
      markerId = "arrow"
    } = options;
    const unit = 1 / Math.sqrt(2);
    const x1 = centerBaseX + dimensionOffset * unit;
    const y1 = centerBaseY + dimensionOffset * unit;
    const projectedLength = (endBaseX - centerBaseX) * unit + (centerBaseY - endBaseY) * unit;
    const x2 = x1 + projectedLength * unit;
    const y2 = y1 - projectedLength * unit;
    const labelX = (x1 + x2) / 2 - labelOffset * unit;
    const labelY = (y1 + y2) / 2 - labelOffset * unit;
    const textAngle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    return `
      <line x1="${centerBaseX}" y1="${centerBaseY}" x2="${x1}" y2="${y1}" stroke="${color}" stroke-width="1"/>
      <line x1="${endBaseX}" y1="${endBaseY}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1"/>
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${lineWidth}" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      ${label ? `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="${fontSize}" font-weight="${fontWeight}" font-family="${fontFamily}" fill="${labelColor}" transform="rotate(${textAngle} ${labelX} ${labelY})">${label}</text>` : ""}
    `;
  }

  return { arrowMarker, bomBox, engineeringFrame, horizontalDimension, infoBox, projected45Dimension, technicalRequirements, titleBlock, verticalDimension };
});
