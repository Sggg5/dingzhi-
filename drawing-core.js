(function exposeDrawingCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.DrawingCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createDrawingCore() {
  const CAD_STANDARD = {
    colors: {
      object: "#293f3b",
      fitting: "#4a4033",
      dimension: "#6f6a61",
      center: "#8b928e",
      label: "#263d39",
      mutedLabel: "#5f625d",
      pipeFill: "#e8eceb",
      fittingFill: "#f4f1e8",
      capFill: "#d9dfdd"
    },
    line: {
      visible: 2,
      visibleHeavy: 3,
      dimension: 1.2,
      extension: 1,
      center: 1
    },
    text: {
      label: 13,
      dimension: 13,
      dimensionEmphasis: 13,
      dimensionTotal: 13,
      info: 13,
      title: 16,
      small: 11
    },
    dimension: {
      arrowWidth: 12,
      arrowHeight: 6,
      labelOffset: 10,
      extensionOvershoot: 12,
      centerDash: "7 6"
    },
    frame: {
      stroke: "#111",
      fill: "#fff",
      outerLine: 1.2,
      borderLine: 2.2,
      tableLine: 1,
      heavyTableLine: 2,
      indexFont: 16,
      sideFont: 14,
      titleBlockLine: 2,
      titleFont: 16,
      titleProductFont: 15,
      titleMetaFont: 12,
      titleSmallFont: 11,
      materialFont: 24,
      technicalTitleFont: 14,
      technicalFont: 12,
      cardRadius: 8,
      cardTitleFont: 16,
      cardQuantityFont: 12
    }
  };

  function arrowMarker(color, id = "arrow") {
    const markerWidth = CAD_STANDARD.dimension.arrowWidth;
    const markerHeight = CAD_STANDARD.dimension.arrowHeight;
    const refX = markerWidth;
    const refY = markerHeight / 2;
    return `
      <marker id="${id}" markerWidth="${markerWidth}" markerHeight="${markerHeight}" viewBox="0 0 ${markerWidth} ${markerHeight}" refX="${refX}" refY="${refY}" orient="auto-start-reverse">
        <path d="M ${markerWidth} ${refY} L 0 0 L 0 ${markerHeight} Z" fill="${color}"></path>
      </marker>
    `;
  }

  function centerLine(x1, y1, x2, y2, options = {}) {
    const color = options.color || CAD_STANDARD.colors.center;
    const lineWidth = options.lineWidth || CAD_STANDARD.line.center;
    const dash = options.dash || CAD_STANDARD.dimension.centerDash;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${lineWidth}" stroke-dasharray="${dash}"/>`;
  }

  function engineeringFrame(quoteNo = "") {
    const f = CAD_STANDARD.frame;
    return `
      <rect x="3" y="35" width="1194" height="800" fill="${f.fill}" stroke="${f.stroke}" stroke-width="${f.outerLine}"/>
      <rect x="104" y="51" width="1072" height="768" fill="none" stroke="${f.stroke}" stroke-width="${f.borderLine}"/>
      <line x1="600" y1="35" x2="600" y2="68" stroke="${f.stroke}" stroke-width="${f.borderLine}"/>
      <line x1="600" y1="819" x2="600" y2="835" stroke="${f.stroke}" stroke-width="${f.borderLine}"/>
      <text x="300" y="50" text-anchor="middle" font-size="${f.indexFont}" fill="${f.stroke}">1</text>
      <text x="900" y="50" text-anchor="middle" font-size="${f.indexFont}" fill="${f.stroke}">2</text>
      <text x="300" y="832" text-anchor="middle" font-size="${f.indexFont}" fill="${f.stroke}">1</text>
      <text x="900" y="832" text-anchor="middle" font-size="${f.indexFont}" fill="${f.stroke}">2</text>
      <line x1="104" y1="95" x2="345" y2="95" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <line x1="345" y1="51" x2="345" y2="95" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <text x="225" y="80" text-anchor="middle" font-size="${f.indexFont}" fill="${f.stroke}">${quoteNo}</text>
      <line x1="3" y1="380" x2="126" y2="380" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <line x1="3" y1="398" x2="104" y2="398" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <line x1="3" y1="445" x2="104" y2="445" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <line x1="3" y1="485" x2="104" y2="485" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <line x1="3" y1="525" x2="104" y2="525" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <line x1="3" y1="590" x2="104" y2="590" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <line x1="3" y1="655" x2="104" y2="655" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <line x1="3" y1="725" x2="104" y2="725" stroke="${f.stroke}" stroke-width="${f.tableLine}"/>
      <line x1="104" y1="380" x2="126" y2="380" stroke="${f.stroke}" stroke-width="${f.heavyTableLine}"/>
      <text x="52" y="260" text-anchor="middle" font-size="${f.indexFont}" fill="${f.stroke}">A</text>
      <text x="1187" y="260" text-anchor="middle" font-size="${f.indexFont}" fill="${f.stroke}">A</text>
      <text x="1187" y="605" text-anchor="middle" font-size="${f.indexFont}" fill="${f.stroke}">B</text>
      <text x="52" y="392" text-anchor="middle" font-size="${f.sideFont}" fill="${f.stroke}">借用件登记</text>
      <text x="52" y="426" text-anchor="middle" font-size="${f.sideFont}" fill="${f.stroke}">描 图</text>
      <text x="52" y="468" text-anchor="middle" font-size="${f.sideFont}" fill="${f.stroke}">校 描</text>
      <text x="52" y="545" text-anchor="middle" font-size="${f.sideFont}" fill="${f.stroke}">旧底图总号</text>
      <text x="52" y="625" text-anchor="middle" font-size="${f.sideFont}" fill="${f.stroke}">签 字</text>
      <text x="52" y="692" text-anchor="middle" font-size="${f.sideFont}" fill="${f.stroke}">日 期</text>
    `;
  }

  function bomBox(options) {
    const f = CAD_STANDARD.frame;
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
        <rect x="0" y="0" width="${width}" height="${height}" rx="${f.cardRadius}" fill="${f.fill}" stroke="${borderColor}"/>
        <text x="18" y="28" font-size="${f.cardTitleFont}" font-weight="700" fill="${accentColor}">BOM 清单</text>
        <text x="${quantityX}" y="28" text-anchor="middle" font-size="${f.cardQuantityFont}" font-weight="700" fill="${labelColor}">数量</text>
        <line x1="18" y1="42" x2="${width - 18}" y2="42" stroke="${dividerColor}"/>
        ${rowSvg}
      </g>
    `;
  }

  function infoBox(options) {
    const f = CAD_STANDARD.frame;
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
        <rect x="0" y="0" width="${width}" height="${height}" rx="${f.cardRadius}" fill="${f.fill}" stroke="${borderColor}"/>
        <text x="18" y="28" font-size="${f.cardTitleFont}" font-weight="700" fill="${accentColor}">${title}</text>
        ${content}
      </g>
    `;
  }

  function defaultDateText() {
    const date = new Date();
    const pad = value => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function titleBlock(options) {
    const f = CAD_STANDARD.frame;
    const {
      x = 454,
      y = 675,
      material = "",
      titleSvg = "",
      productLabel = "国标定制产品",
      dateText = defaultDateText()
    } = options;
    return `
      <g transform="translate(${x} ${y})">
        <rect x="0" y="0" width="722" height="144" fill="${f.fill}" stroke="${f.stroke}" stroke-width="${f.titleBlockLine}"/>
        <line x1="260" y1="0" x2="260" y2="144" stroke="${f.stroke}" stroke-width="${f.titleBlockLine}"/>
        <line x1="505" y1="0" x2="505" y2="144" stroke="${f.stroke}" stroke-width="${f.titleBlockLine}"/>
        <line x1="0" y1="21" x2="260" y2="21" stroke="${f.stroke}"/>
        <line x1="0" y1="42" x2="260" y2="42" stroke="${f.stroke}"/>
        <line x1="0" y1="63" x2="260" y2="63" stroke="${f.stroke}"/>
        <line x1="0" y1="84" x2="260" y2="84" stroke="${f.stroke}" stroke-width="${f.titleBlockLine}"/>
        <line x1="0" y1="114" x2="260" y2="114" stroke="${f.stroke}" stroke-width="${f.titleBlockLine}"/>
        <line x1="30" y1="0" x2="30" y2="84" stroke="${f.stroke}"/>
        <line x1="60" y1="0" x2="60" y2="144" stroke="${f.stroke}" stroke-width="${f.titleBlockLine}"/>
        <line x1="165" y1="0" x2="165" y2="144" stroke="${f.stroke}"/>
        <line x1="260" y1="84" x2="505" y2="84" stroke="${f.stroke}" stroke-width="${f.titleBlockLine}"/>
        <line x1="260" y1="114" x2="505" y2="114" stroke="${f.stroke}"/>
        <line x1="342" y1="84" x2="342" y2="144" stroke="${f.stroke}"/>
        <line x1="424" y1="84" x2="424" y2="144" stroke="${f.stroke}"/>
        <line x1="505" y1="48" x2="722" y2="48" stroke="${f.stroke}" stroke-width="${f.titleBlockLine}"/>
        <line x1="505" y1="96" x2="722" y2="96" stroke="${f.stroke}" stroke-width="${f.titleBlockLine}"/>
        <text x="15" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleSmallFont}" fill="${f.stroke}">标记</text>
        <text x="45" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleSmallFont}" fill="${f.stroke}">处数</text>
        <text x="112.5" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleSmallFont}" fill="${f.stroke}">更改文件号</text>
        <text x="190" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleSmallFont}" fill="${f.stroke}">签字</text>
        <text x="237.5" y="73.5" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleSmallFont}" fill="${f.stroke}">日期</text>
        <text x="16" y="102" font-size="${f.titleMetaFont}" fill="${f.stroke}">设计</text>
        <text x="95" y="102" font-size="${f.titleMetaFont}" fill="${f.stroke}">FRANTA</text>
        <text x="212.5" y="102" text-anchor="middle" font-size="${f.titleSmallFont}" fill="${f.stroke}">${dateText}</text>
        <text x="16" y="134" font-size="${f.titleMetaFont}" fill="${f.stroke}">审核</text>
        <text x="95" y="134" font-size="${f.titleMetaFont}" fill="${f.stroke}">FRANTA</text>
        <text x="212.5" y="134" text-anchor="middle" font-size="${f.titleSmallFont}" fill="${f.stroke}">${dateText}</text>
        <text x="382" y="56" text-anchor="middle" font-size="${f.materialFont}" fill="${f.stroke}">${material}</text>
        <text x="301" y="103" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleMetaFont}" fill="${f.stroke}">图样标记</text>
        <text x="383" y="103" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleMetaFont}" fill="${f.stroke}">重量</text>
        <text x="465" y="103" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleMetaFont}" fill="${f.stroke}">比例</text>
        <text x="289" y="129" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleMetaFont}" fill="${f.stroke}">共</text>
        <text x="313" y="129" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleMetaFont}" fill="${f.stroke}">页</text>
        <text x="448" y="129" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleMetaFont}" fill="${f.stroke}">第</text>
        <text x="482" y="129" text-anchor="middle" dominant-baseline="middle" font-size="${f.titleMetaFont}" fill="${f.stroke}">页</text>
        <text x="614" y="30" text-anchor="middle" font-size="${f.titleFont}" fill="${f.stroke}">浙江福兰特有限公司</text>
        ${titleSvg}
        <text x="614" y="126" text-anchor="middle" font-size="${f.titleProductFont}" fill="${f.stroke}">${productLabel}</text>
      </g>
    `;
  }

  function technicalRequirements(options) {
    const f = CAD_STANDARD.frame;
    const { x = 132, y = 675, lines = [] } = options;
    return `
      <g transform="translate(${x} ${y})">
        <text x="0" y="0" font-size="${f.technicalTitleFont}" font-weight="700" fill="${f.stroke}">技术要求:</text>
        ${lines.map((line, index) => `<text x="${line.indent || 0}" y="${20 + index * 20}" font-size="${f.technicalFont}" fill="${f.stroke}">${line.text || line}</text>`).join("")}
      </g>
    `;
  }

  function horizontalDimension(options) {
    const {
      x1,
      x2,
      y,
      label = "",
      dimensionId = "",
      dragAxis = "y",
      offset = {},
      color = CAD_STANDARD.colors.dimension,
      labelColor = color,
      lineWidth = CAD_STANDARD.line.dimension,
      extensionLineWidth = CAD_STANDARD.line.extension,
      extensionStart,
      extensionEnd,
      labelY = y - CAD_STANDARD.dimension.labelOffset,
      fontSize = CAD_STANDARD.text.dimension,
      fontWeight = 400,
      markerId = "arrow"
    } = options;
    const dx = Number(offset.dx) || 0;
    const dy = Number(offset.dy) || 0;
    const wrapperStart = dimensionId
      ? `<g data-dimension-id="${dimensionId}" data-dimension-axis="${dragAxis}" class="draggable-dimension" transform="translate(${dx} ${dy})">`
      : "";
    const wrapperEnd = dimensionId ? "</g>" : "";
    const startExtension = extensionStart
      ? `<line x1="${x1}" y1="${extensionStart.fromY}" x2="${x1}" y2="${extensionStart.toY}" stroke="${color}" stroke-width="${extensionLineWidth}"/>`
      : "";
    const endExtension = extensionEnd
      ? `<line x1="${x2}" y1="${extensionEnd.fromY}" x2="${x2}" y2="${extensionEnd.toY}" stroke="${color}" stroke-width="${extensionLineWidth}"/>`
      : "";
    return `
      ${wrapperStart}
      ${startExtension}
      ${endExtension}
      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="${lineWidth}" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      ${label ? `<text x="${(x1 + x2) / 2}" y="${labelY}" text-anchor="middle" font-size="${fontSize}" font-weight="${fontWeight}" fill="${labelColor}">${label}</text>` : ""}
      ${wrapperEnd}
    `;
  }

  function verticalDimension(options) {
    const {
      x,
      y1,
      y2,
      label = "",
      dimensionId = "",
      dragAxis = "x",
      offset = {},
      color = CAD_STANDARD.colors.dimension,
      labelColor = color,
      lineWidth = CAD_STANDARD.line.dimension,
      extensionLineWidth = CAD_STANDARD.line.extension,
      extensionTop,
      extensionBottom,
      labelOffset = -18,
      fontSize = CAD_STANDARD.text.dimension,
      fontWeight = 400,
      markerId = "arrow"
    } = options;
    const dx = Number(offset.dx) || 0;
    const dy = Number(offset.dy) || 0;
    const wrapperStart = dimensionId
      ? `<g data-dimension-id="${dimensionId}" data-dimension-axis="${dragAxis}" class="draggable-dimension" transform="translate(${dx} ${dy})">`
      : "";
    const wrapperEnd = dimensionId ? "</g>" : "";
    const topExtension = extensionTop
      ? `<line x1="${extensionTop.fromX}" y1="${y1}" x2="${extensionTop.toX}" y2="${y1}" stroke="${color}" stroke-width="${extensionLineWidth}"/>`
      : "";
    const bottomExtension = extensionBottom
      ? `<line x1="${extensionBottom.fromX}" y1="${y2}" x2="${extensionBottom.toX}" y2="${y2}" stroke="${color}" stroke-width="${extensionLineWidth}"/>`
      : "";
    const labelX = x + labelOffset;
    const labelY = (y1 + y2) / 2;
    return `
      ${wrapperStart}
      ${topExtension}
      ${bottomExtension}
      <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="${lineWidth}" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      ${label ? `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="${fontSize}" font-weight="${fontWeight}" fill="${labelColor}" transform="rotate(-90 ${labelX} ${labelY})">${label}</text>` : ""}
      ${wrapperEnd}
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
      dimensionId = "",
      dragAxis = "normal45",
      offset = {},
      labelOffset = 12,
      color = "#6f6a61",
      labelColor = color,
      lineWidth = CAD_STANDARD.line.dimension,
      extensionLineWidth = CAD_STANDARD.line.extension,
      fontSize = CAD_STANDARD.text.dimensionEmphasis,
      fontWeight = 400,
      fontFamily = "Microsoft YaHei, Arial, sans-serif",
      markerId = "arrow"
    } = options;
    const dx = Number(offset.dx) || 0;
    const dy = Number(offset.dy) || 0;
    const wrapperStart = dimensionId
      ? `<g data-dimension-id="${dimensionId}" data-dimension-axis="${dragAxis}" class="draggable-dimension" transform="translate(${dx} ${dy})">`
      : "";
    const wrapperEnd = dimensionId ? "</g>" : "";
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
      ${wrapperStart}
      <line x1="${centerBaseX}" y1="${centerBaseY}" x2="${x1}" y2="${y1}" stroke="${color}" stroke-width="${extensionLineWidth}"/>
      <line x1="${endBaseX}" y1="${endBaseY}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${extensionLineWidth}"/>
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${lineWidth}" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      ${label ? `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="${fontSize}" font-weight="${fontWeight}" font-family="${fontFamily}" fill="${labelColor}" transform="rotate(${textAngle} ${labelX} ${labelY})">${label}</text>` : ""}
      ${wrapperEnd}
    `;
  }

  function fitContent(options) {
    const {
      bounds,
      box,
      content = "",
      minScale = 0.55,
      maxScale = 1,
      fitOnlyOnOverflow = false
    } = options;
    const width = Math.max(1, bounds.right - bounds.left);
    const height = Math.max(1, bounds.bottom - bounds.top);
    const boxWidth = Math.max(1, box.right - box.left);
    const boxHeight = Math.max(1, box.bottom - box.top);
    if (fitOnlyOnOverflow
      && bounds.left >= box.left
      && bounds.right <= box.right
      && bounds.top >= box.top
      && bounds.bottom <= box.bottom) {
      return content;
    }
    const scale = Math.max(minScale, Math.min(maxScale, boxWidth / width, boxHeight / height));
    const sourceCenterX = (bounds.left + bounds.right) / 2;
    const sourceCenterY = (bounds.top + bounds.bottom) / 2;
    const targetCenterX = (box.left + box.right) / 2;
    const targetCenterY = (box.top + box.bottom) / 2;
    const translateX = targetCenterX - sourceCenterX * scale;
    const translateY = targetCenterY - sourceCenterY * scale;
    return `<g data-layer-group="fitted" transform="translate(${translateX.toFixed(2)} ${translateY.toFixed(2)}) scale(${scale.toFixed(4)})">${content}</g>`;
  }

  function layer(name, content, attributes = "") {
    const body = Array.isArray(content) ? content.filter(Boolean).join("") : String(content || "");
    if (!body.trim()) return "";
    const extra = attributes ? ` ${attributes}` : "";
    return `<g data-layer="${name}"${extra}>${body}</g>`;
  }

  return { CAD_STANDARD, arrowMarker, bomBox, centerLine, engineeringFrame, fitContent, horizontalDimension, infoBox, layer, projected45Dimension, technicalRequirements, titleBlock, verticalDimension };
});
