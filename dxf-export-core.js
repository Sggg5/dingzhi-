(function exposeDxfExportCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DxfExportCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createDxfExportCore() {
  const DEFAULT_LAYERS = [
    { name: "0", color: 7, lineType: "CONTINUOUS" },
    { name: "01_OUTLINE", color: 7, lineType: "CONTINUOUS" },
    { name: "02_THIN", color: 7, lineType: "CONTINUOUS" },
    { name: "03_CENTER", color: 1, lineType: "CENTER2" },
    { name: "04_HIDDEN", color: 6, lineType: "DASHED2" },
    { name: "05_HATCH", color: 2, lineType: "CONTINUOUS" },
    { name: "06_TEXT", color: 3, lineType: "CONTINUOUS" },
    { name: "07_DIMENSION", color: 4, lineType: "CONTINUOUS" },
    { name: "08_SYMBOL", color: 7, lineType: "CONTINUOUS" },
    { name: "09_PHANTOM", color: 6, lineType: "PHANTOM4" },
    { name: "10_OUTLINE_HIDDEN", color: 7, lineType: "DASHED2" },
    { name: "11_SECTION", color: 5, lineType: "CONTINUOUS" },
    { name: "12_FRAME", color: 7, lineType: "CONTINUOUS" },
    { name: "13_NO_PLOT", color: 5, lineType: "CONTINUOUS" }
  ];

  function number(value) {
    const result = Number(value) || 0;
    return Number(result.toFixed(4)).toString();
  }

  function text(value) {
    // R12 does not read UTF-8 text directly. AutoCAD-compatible \U+XXXX
    // escapes preserve Chinese characters without requiring the browser to
    // encode a Blob as GBK.
    return Array.from(String(value || "").replace(/[\r\n]+/g, " ")).map(character => {
      if (character === "\\") return "\\\\";
      const code = character.codePointAt(0);
      return code > 0x7e ? `\\U+${code.toString(16).toUpperCase().padStart(4, "0")}` : character;
    }).join("");
  }

  function pair(code, value) {
    // CRLF is deliberately used here. Several workshop CAD viewers are stricter
    // than AutoCAD about DXF line endings.
    return `${code}\r\n${value}\r\n`;
  }

  function lineType(name, description, pattern = []) {
    return [
      pair(0, "LTYPE"), pair(2, name), pair(70, 0), pair(3, description), pair(72, 65),
      pair(73, pattern.length), pair(40, pattern.reduce((sum, value) => sum + Math.abs(value), 0)),
      ...pattern.flatMap(value => [pair(49, value), pair(74, 0)])
    ];
  }

  function lineTypeTable() {
    const types = [
      lineType("CONTINUOUS", "Solid line"),
      lineType("CENTER2", "Center dash dot", [12, -3, 1, -3]),
      lineType("DASHED2", "Dashed", [6, -3]),
      lineType("PHANTOM4", "Phantom dash double dot", [12, -2, 1, -2, 1, -2])
    ];
    return [
      pair(0, "TABLE"), pair(2, "LTYPE"), pair(70, types.length),
      ...types.flat(),
      pair(0, "ENDTAB")
    ].join("");
  }

  function textStyleTable() {
    return [
      pair(0, "TABLE"), pair(2, "STYLE"), pair(70, 1),
      pair(0, "STYLE"), pair(2, "STANDARD"), pair(70, 0), pair(40, 0), pair(41, 1),
      // These two files are included with the local ZWCAD Mechanical install.
      // GBCBIG supplies Chinese glyphs while txt.shx remains the Latin font.
      pair(50, 0), pair(71, 0), pair(42, 2.5), pair(3, "txt.shx"), pair(4, "GBCBIG.SHX"),
      pair(0, "ENDTAB")
    ].join("");
  }

  function layerTable(layers) {
    const extraLayers = (layers || []).filter(Boolean).map(name => ({ name, color: 7, lineType: "CONTINUOUS" }));
    const namedLayers = new Map(DEFAULT_LAYERS.map(layer => [layer.name, layer]));
    extraLayers.forEach(layer => {
      if (!namedLayers.has(layer.name)) namedLayers.set(layer.name, layer);
    });
    const specs = [...namedLayers.values()];
    return [
      pair(0, "TABLE"), pair(2, "LAYER"), pair(70, specs.length),
      ...specs.flatMap(layer => [pair(0, "LAYER"), pair(2, layer.name), pair(70, 0), pair(62, layer.color), pair(6, layer.lineType)]),
      pair(0, "ENDTAB")
    ].join("");
  }

  function entityDxf(entity) {
    const layer = entity.layer || "01_OUTLINE";
    if (entity.type === "LINE") {
      return [pair(0, "LINE"), pair(8, layer), pair(10, number(entity.x1)), pair(20, number(entity.y1)), pair(11, number(entity.x2)), pair(21, number(entity.y2))].join("");
    }
    if (entity.type === "CIRCLE") {
      return [pair(0, "CIRCLE"), pair(8, layer), pair(10, number(entity.x)), pair(20, number(entity.y)), pair(40, number(entity.r))].join("");
    }
    if (entity.type === "ARC") {
      return [
        pair(0, "ARC"), pair(8, layer), pair(10, number(entity.x)), pair(20, number(entity.y)),
        pair(40, number(entity.r)), pair(50, number(entity.startAngle)), pair(51, number(entity.endAngle))
      ].join("");
    }
    if (entity.type === "POLYLINE") {
      const points = entity.points || [];
      if (points.length < 2) return "";
      return [
        // R12 POLYLINE/VERTEX is deliberately used instead of LWPOLYLINE.
        // It is accepted by older AutoCAD, ZWCAD and workshop CAD viewers.
        pair(0, "POLYLINE"), pair(8, layer), pair(66, 1), pair(70, entity.closed ? 1 : 0),
        ...points.flatMap(point => [pair(0, "VERTEX"), pair(8, layer), pair(10, number(point.x)), pair(20, number(point.y)), pair(30, 0)]),
        pair(0, "SEQEND")
      ].join("");
    }
    if (entity.type === "TEXT") {
      const angle = Number(entity.angle) || 0;
      return [
        pair(0, "TEXT"), pair(8, layer), pair(10, number(entity.x)), pair(20, number(entity.y)),
        pair(40, number(entity.height || 3)), pair(1, text(entity.text)), pair(7, "STANDARD"),
        pair(50, number(angle)), pair(72, entity.align === "center" ? 1 : 0), pair(73, 0),
        ...(entity.align === "center" ? [pair(11, number(entity.x)), pair(21, number(entity.y))] : [])
      ].join("");
    }
    return "";
  }

  function document(entities) {
    const items = (entities || []).filter(Boolean);
    const layers = items.map(item => item.layer).filter(Boolean);
    return [
      pair(0, "SECTION"), pair(2, "HEADER"),
      // R12 is the broadest compatible DXF dialect for the factory CAD tools.
      pair(9, "$ACADVER"), pair(1, "AC1009"),
      pair(9, "$DWGCODEPAGE"), pair(3, "ANSI_936"),
      pair(9, "$INSUNITS"), pair(70, 4),
      pair(9, "$MEASUREMENT"), pair(70, 1),
      // Mechanical drawing defaults. They are consumed automatically once
      // native DIMENSION entities are added, and also give manual dimensioning
      // in ZWCAD a consistent starting standard.
      pair(9, "$CLAYER"), pair(8, "01_OUTLINE"),
      pair(9, "$LTSCALE"), pair(40, 1),
      pair(9, "$TEXTSIZE"), pair(40, 3.5),
      pair(9, "$DIMASZ"), pair(40, 2.5),
      pair(9, "$DIMTXT"), pair(40, 3.5),
      pair(9, "$DIMCLRD"), pair(70, 4),
      pair(9, "$DIMCLRT"), pair(70, 3),
      // Fixed A3 landscape bounds make older CAD viewers open the drawing in view.
      pair(9, "$EXTMIN"), pair(10, 0), pair(20, 0), pair(30, 0),
      pair(9, "$EXTMAX"), pair(10, 420), pair(20, 297), pair(30, 0),
      pair(9, "$LIMMIN"), pair(10, 0), pair(20, 0),
      pair(9, "$LIMMAX"), pair(10, 420), pair(20, 297),
      pair(0, "ENDSEC"),
      pair(0, "SECTION"), pair(2, "TABLES"), lineTypeTable(), textStyleTable(), layerTable(layers), pair(0, "ENDSEC"),
      pair(0, "SECTION"), pair(2, "BLOCKS"), pair(0, "ENDSEC"),
      pair(0, "SECTION"), pair(2, "ENTITIES"),
      items.map(entityDxf).join(""),
      pair(0, "ENDSEC"), pair(0, "EOF")
    ].join("");
  }

  return { DEFAULT_LAYERS, document, entityDxf, number, text };
});
