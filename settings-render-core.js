(function (global) {
  const PRODUCT_PROCESS_DIAMETERS = [16, 20, 25.4, 32, 40, 50.8, 76.1, 88.9, 101.6, 133, 159, 219, 18, 22, 28, 35, 42, 54, 108];
  const PRODUCT_PROCESS_FITTINGS = ["外丝", "内丝", "双卡", "单卡", "环压", "插焊", "法兰", "移动螺母", "堵头", "沟槽", "对焊"];
  const SETTING_SERIES = ["A", "B"];
  const BASIC_SETTING_PATHS = {
    settingProcessBase: ["processBaseForTwoBranches"],
    settingProcessExtra: ["processPerExtraBranch"],
    settingHeightProcess: ["heightProcessPerBranch"],
    settingCombinationTeeBaseProcess: ["combination", "teeBodyBaseProcess"],
    settingCombinationBranchSegmentProcess: ["combination", "branchChainProcessPerSegment"],
    settingCombinationManagementFactor: ["combination", "managementProcessFactor"],
    settingAnnealing: ["annealingPerKg"],
    settingManagement: ["managementPerKg"],
    settingPackaging: ["packagingPerKg"],
    settingSurfacePickling: ["surfaceTreatmentPerKg", "酸洗"],
    settingSurfaceSandblast: ["surfaceTreatmentPerKg", "喷砂"],
    settingSurfacePolish: ["surfaceTreatmentPerKg", "抛光"],
    setting316FittingFactor: ["fittingMaterialFactor", "316L"],
    settingFittingWeightReferenceSteel: ["fittingWeightReferenceSteelTonPrice"],
    settingMaterialTax: ["materialTaxDivisor"],
    settingFittingTax: ["fittingTaxDivisor"]
  };

  function seriesColumns({ series = SETTING_SERIES, getDiameters, tubeSeriesLabel }) {
    return series.flatMap(item => getDiameters(item).map(diameter => ({
      series: item,
      diameter,
      label: `${tubeSeriesLabel[item] || `系列${item}`}<br>${diameter}`
    })));
  }

  function seriesHeadHtml(title, options) {
    const columns = seriesColumns(options);
    return `
    <tr>
      <th>${title}</th>
      ${columns.map(column => `<th>${column.label}</th>`).join("")}
    </tr>
  `;
  }

  function fittingLengthRowsHtml({ pricing, getDiameters, tubeSeriesLabel }) {
    const fittingNames = Array.from(new Set([
      ...Object.keys(pricing.fittingLengthBySeries.A),
      ...Object.keys(pricing.fittingLengthBySeries.B)
    ]));
    return seriesMatrixRowsHtml({
      pricing,
      pricingKey: "fittingLengthBySeries",
      rowNames: fittingNames,
      getDiameters,
      tubeSeriesLabel,
      dataPrefix: "fitting-length",
      nameDataset: "name",
      step: "0.1"
    });
  }

  function fittingPriceRowsHtml({ pricing, getDiameters, tubeSeriesLabel }) {
    const fittingNames = Array.from(new Set([
      ...Object.keys(pricing.fittingBySeries.A),
      ...Object.keys(pricing.fittingBySeries.B)
    ]));
    return seriesMatrixRowsHtml({
      pricing,
      pricingKey: "fittingBySeries",
      rowNames: fittingNames,
      getDiameters,
      tubeSeriesLabel,
      dataPrefix: "fitting",
      nameDataset: "name",
      step: "0.000001"
    });
  }

  function seriesMatrixRowsHtml({ pricing, pricingKey, rowNames, getDiameters, tubeSeriesLabel, dataPrefix, nameDataset = "name", step, placeholder = "无" }) {
    const columns = seriesColumns({ getDiameters, tubeSeriesLabel });
    return rowNames.map(name => `
    <tr>
      <th>${name}</th>
      ${columns.map(({ series, diameter }) => {
        const value = pricing[pricingKey]?.[series]?.[name]?.[diameter];
        return `<td><input data-${dataPrefix}-series="${series}" data-${dataPrefix}-${nameDataset}="${name}" data-${dataPrefix}-diameter="${diameter}" type="number" min="0" step="${step}" value="${value ?? ""}" placeholder="${placeholder}"></td>`;
      }).join("")}
    </tr>
  `).join("");
  }

  function singleSeriesValueRowsHtml({ rowTitle, pricing, pricingKey, dataPrefix, getDiameters, tubeSeriesLabel, step }) {
    const columns = seriesColumns({ getDiameters, tubeSeriesLabel });
    return `
    <tr>
      <th>${rowTitle}</th>
      ${columns.map(({ series, diameter }) => {
        const value = pricing[pricingKey]?.[series]?.[diameter];
        return `<td><input data-${dataPrefix}-series="${series}" data-${dataPrefix}-diameter="${diameter}" type="number" min="0" step="${step}" value="${value ?? ""}" placeholder="无"></td>`;
      }).join("")}
    </tr>
  `;
  }

  function processHeadHtml(title, diameters) {
    return `
    <tr>
      <th>${title}</th>
      ${diameters.map(diameter => `<th>${diameter}</th>`).join("")}
    </tr>
  `;
  }

  function processRowsHtml({ pricing, pricingKey, diameters, fittingNames, dataset = "process" }) {
    return fittingNames.map(name => `
    <tr>
      <th>${name}</th>
      ${diameters.map(diameter => {
        const value = pricing[pricingKey]?.[name]?.[diameter];
        return dataset === "docking"
          ? `<td><input data-docking-process-name="${name}" data-docking-process-diameter="${diameter}" type="number" min="0" step="0.01" value="${value ?? ""}"></td>`
          : `<td><input data-process-table="${pricingKey}" data-process-name="${name}" data-process-diameter="${diameter}" type="number" min="0" step="0.01" value="${value ?? ""}"></td>`;
      }).join("")}
    </tr>
  `).join("");
  }

  function valueAtPath(source, path) {
    return path.reduce((cursor, key) => cursor?.[key], source);
  }

  function setValueAtPath(target, path, value) {
    const parent = path.slice(0, -1).reduce((cursor, key) => {
      cursor[key] ||= {};
      return cursor[key];
    }, target);
    parent[path[path.length - 1]] = value;
  }

  function isActiveSettingCategory(elementCategory, activeCategory) {
    return elementCategory === activeCategory;
  }

  function isActiveSettingSection(elementSection, activeSection) {
    return elementSection === activeSection;
  }

  const api = {
    BASIC_SETTING_PATHS,
    PRODUCT_PROCESS_DIAMETERS,
    PRODUCT_PROCESS_FITTINGS,
    SETTING_SERIES,
    seriesHeadHtml,
    fittingPriceRowsHtml,
    fittingLengthRowsHtml,
    singleSeriesValueRowsHtml,
    processHeadHtml,
    processRowsHtml,
    valueAtPath,
    setValueAtPath,
    isActiveSettingCategory,
    isActiveSettingSection
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.SettingsRenderCore = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
