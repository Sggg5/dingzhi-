const options = {
  productTypes: ["分水器类", "对接类", "三通类", "弯头类", "组合件"],
  materials: ["304", "316L"],
  manifoldTypes: ["单排", "双排交错", "双排对齐"],
  surfaceTreatments: ["酸洗", "喷砂", "抛光"],
  tubeSeries: {
    A: [
      { diameter: 20, thickness: 1.2 },
      { diameter: 25.4, thickness: 1.2 },
      { diameter: 32, thickness: 1.5 },
      { diameter: 40, thickness: 1.5 },
      { diameter: 50.8, thickness: 1.5 },
      { diameter: 76.1, thickness: 2 },
      { diameter: 88.9, thickness: 2 },
      { diameter: 101.6, thickness: 2 },
      { diameter: 133, thickness: 2.5 },
      { diameter: 159, thickness: 2.5 },
      { diameter: 219, thickness: 3.0 }
    ],
    B: [
      { diameter: 15, thickness: 1.5, equivalent: null },
      { diameter: 22, thickness: 1.5 },
      { diameter: 28, thickness: 1.5 },
      { diameter: 35, thickness: 1.5 },
      { diameter: 42, thickness: 1.5 },
      { diameter: 54, thickness: 1.5 },
      { diameter: 76.1, thickness: 2 },
      { diameter: 88.9, thickness: 2 },
      { diameter: 108, thickness: 2 }
    ]
  },
  branchOnlySeries: {
    A: [
      { diameter: 16, thickness: 1.0 }
    ],
    B: [
      { diameter: 18, thickness: 1.5 }
    ]
  },
  diameters: [20, 25.4, 32, 40, 50.8, 76.1, 88.9, 101.6],
  wallThickness: [1.2, 1.5, 2.0, 2.5, 3.0],
  branchCounts: [1, 20],
  spacing: Array.from({ length: 11 }, (_, index) => 120 + index * 10),
  branchHeight: [0, 40, 50, 60, 70, 80, 90, 100],
  mainFittings: ["直管", "外丝", "内丝", "双卡", "环压", "法兰", "移动螺母"],
  branchFittings: ["无配件", "直管", "外丝", "内丝", "双卡", "环压", "法兰", "移动螺母"],
  tailFittings: ["堵头", "直管", "外丝", "内丝", "双卡", "环压", "法兰", "移动螺母"],
  fittingConnections: ["无配件", "外丝", "内丝", "双卡", "环压", "插焊", "法兰", "移动螺母", "沟槽", "对焊"]
};

const pricing = {
  settingsVersion: 11,
  materialFactor: { "304": 1, "316L": 1.32 },
  tubeKgPrice: { "304": 26, "316L": 38 },
  fittingMaterialFactor: { "304": 1, "316L": 1.5 },
  fittingWeightFactor: {
    "外丝": 4.2,
    "内丝": 4.2,
    "双卡": 4.2,
    "环压": 1.8,
    "插焊": 1.8,
    "法兰": 1.8,
    "移动螺纹": 4.2,
    "移动螺母": 4.2,
    "堵头": 1.8,
    "中接": 1.8,
    "沟槽": 1.8,
    "对焊": 1.8,
    "90弯头": 1.8,
    "45弯头": 1.8
  },
  fittingWeightReferenceSteelTonPrice: 16000,
  teeStraightLengthBySeries: {
    A: { 16: 17, 20: 28, 25.4: 33, 32: 40, 40: 52, 50.8: 62, 76.1: 79, 88.9: 98, 101.6: 114, 133: 116, 159: 152, 219: 182 },
    B: { 18: 19, 22: 28, 28: 33, 35: 40, 42: 52, 54: 62, 76.1: 79, 88.9: 98, 108: 114 }
  },
  elbowCenterHeightBySeries: {
    A: { 16: 24, 20: 30, 25.4: 38.1, 32: 48, 40: 60, 50.8: 76.2, 76.1: 95.125, 88.9: 111.125, 101.6: 127, 133: 133, 159: 159, 219: 219 },
    B: { 18: 27, 22: 33, 28: 42, 35: 52.5, 42: 63, 54: 81, 76.1: 114.15, 88.9: 133.35, 108: 162 }
  },
  fittingLengthByDiameter: {
    "外丝": { 16: 27.5, 20: 26, 25.4: 34, 32: 37.4, 40: 37.8, 50.8: 43, 76.1: 50, 88.9: 50.8, 101.6: 59 },
    "内丝": { 16: 25.5, 20: 26, 25.4: 30.2, 32: 32, 40: 31.4, 50.8: 29.4, 76.1: 36, 88.9: 42, 101.6: 54.5 },
    "双卡": { 16: 30.5, 20: 33, 25.4: 41, 32: 48, 40: 58, 50.8: 68, 76.1: 79, 88.9: 82.5, 101.6: 95 },
    "环压": { 16: 33.5, 20: 36, 25.4: 41, 32: 44.5, 40: 51, 50.8: 63, 76.1: 78, 88.9: 54, 101.6: 92 },
    "法兰": { 16: 11, 20: 13, 25.4: 13, 32: 14, 40: 15, 50.8: 15, 76.1: 17, 88.9: 17, 101.6: 19, 133: 19, 159: 21, 219: 21 },
    "移动螺纹": { 16: 18, 20: 18, 25.4: 19, 32: 19.2, 40: 19.4, 50.8: 23.8 },
    "移动螺母": { 16: 18, 20: 18, 25.4: 19, 32: 19.2, 40: 19.4, 50.8: 23.8 },
    "堵头": { 16: 10, 20: 10, 25.4: 10, 32: 10, 40: 10, 50.8: 10, 76.1: 10, 88.9: 10, 101.6: 10, 133: 76, 159: 89, 219: 102 },
    "中接": { 16: 20, 20: 20, 25.4: 20, 32: 20, 40: 20, 50.8: 20, 76.1: 20, 88.9: 20, 101.6: 20, 133: 127, 159: 140, 219: 154 },
    "沟槽": { 76.1: 70, 88.9: 70, 101.6: 70, 133: 66, 159: 67, 219: 87 },
    "对焊": { 76.1: 70, 88.9: 70, 101.6: 70, 133: 66, 159: 67, 219: 87 }
  },
  fittingLengthBySeries: {
    A: {
      "外丝": { 16: 27.5, 20: 26, 25.4: 34, 32: 37.4, 40: 37.8, 50.8: 43, 76.1: 50, 88.9: 50.8, 101.6: 59 },
      "内丝": { 16: 25.5, 20: 26, 25.4: 30.2, 32: 32, 40: 31.4, 50.8: 29.4, 76.1: 36, 88.9: 42, 101.6: 54.5 },
      "双卡": { 16: 30.5, 20: 33, 25.4: 41, 32: 48, 40: 58, 50.8: 68, 76.1: 79, 88.9: 82.5, 101.6: 95 },
      "环压": { 16: 33.5, 20: 36, 25.4: 41, 32: 44.5, 40: 51, 50.8: 63, 76.1: 78, 88.9: 54, 101.6: 92 },
      "法兰": { 16: 11, 20: 13, 25.4: 13, 32: 14, 40: 15, 50.8: 15, 76.1: 17, 88.9: 17, 101.6: 19, 133: 19, 159: 21, 219: 21 },
      "移动螺纹": { 16: 18, 20: 18, 25.4: 19, 32: 19.2, 40: 19.4, 50.8: 23.8 },
      "移动螺母": { 16: 18, 20: 18, 25.4: 19, 32: 19.2, 40: 19.4, 50.8: 23.8 },
      "堵头": { 16: 10, 20: 10, 25.4: 10, 32: 10, 40: 10, 50.8: 10, 76.1: 10, 88.9: 10, 101.6: 10, 133: 76, 159: 89, 219: 102 },
      "中接": { 16: 20, 20: 20, 25.4: 20, 32: 20, 40: 20, 50.8: 20, 76.1: 20, 88.9: 20, 101.6: 20, 133: 127, 159: 140, 219: 154 },
      "沟槽": { 76.1: 70, 88.9: 70, 101.6: 70, 133: 66, 159: 67, 219: 87 },
      "对焊": { 76.1: 70, 88.9: 70, 101.6: 70, 133: 66, 159: 67, 219: 87 }
    },
    B: {
      "外丝": { 18: 27.5, 22: 26, 28: 30, 35: 35, 42: 38.6, 54: 37, 76.1: 50, 88.9: 50.8, 108: 59 },
      "内丝": { 18: 25.5, 22: 26, 28: 24.3, 35: 32, 42: 31.4, 54: 38.4, 76.1: 36, 88.9: 42, 108: 54.5 },
      "双卡": { 18: 30.5, 22: 33, 28: 41, 35: 48, 42: 58, 54: 68, 76.1: 79, 88.9: 82.5, 108: 95 },
      "环压": {},
      "法兰": { 18: 11, 22: 13, 28: 13, 35: 14, 42: 15, 54: 15, 76.1: 17, 88.9: 17, 108: 19 },
      "移动螺纹": { 18: 18, 22: 18, 28: 19, 35: 19.2, 42: 19.4, 54: 23.8 },
      "移动螺母": { 18: 18, 22: 18, 28: 19, 35: 19.2, 42: 19.4, 54: 23.8 },
      "堵头": { 18: 10, 22: 10, 28: 10, 35: 10, 42: 10, 54: 10, 76.1: 10, 88.9: 10, 108: 10 },
      "中接": { 18: 20, 22: 20, 28: 20, 35: 20, 42: 20, 54: 20, 76.1: 20, 88.9: 20, 108: 20 }
    }
  },
  processBaseForTwoBranches: 6.82,
  processPerExtraBranch: 1.81,
  heightProcessPerBranch: 1,
  combination: {
    teeBodyBaseProcess: 6.82,
    branchChainProcessPerSegment: 1,
    managementProcessFactor: 2.14
  },
  dockingProcessByDiameter: {
    "外丝": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.35, 40: 0.40, 50.8: 0.43, 76.1: 1.08, 88.9: 1.20, 101.6: 1.35, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.35, 42: 0.40, 54: 0.43, 108: 1.35 },
    "内丝": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.35, 40: 0.40, 50.8: 0.43, 76.1: 1.08, 88.9: 1.20, 101.6: 1.35, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.35, 42: 0.40, 54: 0.43, 108: 1.35 },
    "双卡": { 16: 0.27, 20: 0.28, 25.4: 0.31, 32: 0.33, 40: 0.40, 50.8: 0.41, 76.1: 1.02, 88.9: 1.14, 101.6: 1.34, 18: 0.27, 22: 0.28, 28: 0.31, 35: 0.33, 42: 0.40, 54: 0.41, 108: 1.34 },
    "环压": { 16: 0.27, 20: 0.28, 25.4: 0.31, 32: 0.33, 40: 0.40, 50.8: 0.41, 76.1: 1.02, 88.9: 1.14, 101.6: 1.34, 18: 0.27, 22: 0.28, 28: 0.31, 35: 0.33, 42: 0.40, 54: 0.41, 108: 1.34 },
    "法兰": { 16: 2.26, 20: 2.29, 25.4: 2.34, 32: 2.73, 40: 2.78, 50.8: 2.85, 76.1: 3.22, 88.9: 3.33, 101.6: 3.44, 133: 19.75, 159: 23.25, 219: 39.50, 18: 2.26, 22: 2.29, 28: 2.34, 35: 2.73, 42: 2.78, 54: 2.85, 108: 3.44 },
    "移动螺母": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.35, 40: 0.40, 50.8: 0.43, 76.1: 0.63, 88.9: 0.70, 101.6: 0.79, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.35, 42: 0.40, 54: 0.43, 108: 0.79 },
    "堵头": { 16: 0.25, 20: 0.26, 25.4: 0.30, 32: 0.32, 40: 0.38, 50.8: 0.41, 76.1: 1.13, 88.9: 1.25, 101.6: 1.44, 133: 5.00, 159: 5.00, 219: 5.00, 18: 0.25, 22: 0.26, 28: 0.30, 35: 0.32, 42: 0.38, 54: 0.41, 108: 1.44 },
    "沟槽": { 76.1: 3.00, 88.9: 4.00, 101.6: 5.00, 133: 10.00, 159: 10.00, 219: 10.00, 108: 5.00 },
    "对焊": { 16: 0, 20: 0, 25.4: 0, 32: 0, 40: 0, 50.8: 0, 76.1: 0, 88.9: 0, 101.6: 0, 133: 0, 159: 0, 219: 0, 18: 0, 22: 0, 28: 0, 35: 0, 42: 0, 54: 0, 108: 0 }
  },
  elbowProcessByDiameter: {
    "外丝": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.44, 50.8: 0.49, 76.1: 1.13, 88.9: 1.31, 101.6: 1.52, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.44, 54: 0.49, 108: 1.52 },
    "内丝": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.44, 50.8: 0.49, 76.1: 1.13, 88.9: 1.31, 101.6: 1.52, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.44, 54: 0.49, 108: 1.52 },
    "双卡": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.42, 50.8: 0.48, 76.1: 1.08, 88.9: 1.25, 101.6: 1.48, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.42, 54: 0.48, 108: 1.48 },
    "环压": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.42, 50.8: 0.48, 76.1: 1.08, 88.9: 1.25, 101.6: 1.48, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.42, 54: 0.48, 108: 1.48 },
    "法兰": { 16: 5.65, 20: 5.71, 25.4: 5.86, 32: 6.82, 40: 6.96, 50.8: 7.11, 76.1: 16.10, 88.9: 19.00, 101.6: 21.50, 133: 34.00, 159: 41.00, 219: 64.50, 18: 5.65, 22: 5.71, 28: 5.86, 35: 6.82, 42: 6.96, 54: 7.11, 108: 21.50 },
    "移动螺母": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.44, 50.8: 0.49, 76.1: 1.13, 88.9: 1.31, 101.6: 1.52, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.44, 54: 0.49, 108: 1.52 },
    "堵头": { 16: 0.25, 20: 0.26, 25.4: 0.30, 32: 0.32, 40: 0.38, 50.8: 0.41, 76.1: 1.13, 88.9: 1.25, 101.6: 1.44, 133: 5.00, 159: 5.00, 219: 5.00, 18: 0.25, 22: 0.26, 28: 0.30, 35: 0.32, 42: 0.38, 54: 0.41, 108: 1.44 },
    "沟槽": { 76.1: 3.00, 88.9: 4.00, 101.6: 5.00, 133: 10.00, 159: 10.00, 219: 10.00, 108: 5.00 },
    "对焊": { 16: 0, 20: 0, 25.4: 0, 32: 0, 40: 0, 50.8: 0, 76.1: 0, 88.9: 0, 101.6: 0, 133: 0, 159: 0, 219: 0, 18: 0, 22: 0, 28: 0, 35: 0, 42: 0, 54: 0, 108: 0 }
  },
  teeProcessByDiameter: {
    "外丝": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.44, 50.8: 0.49, 76.1: 1.13, 88.9: 1.31, 101.6: 1.52, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.44, 54: 0.49, 108: 1.52 },
    "内丝": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.44, 50.8: 0.49, 76.1: 1.13, 88.9: 1.31, 101.6: 1.52, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.44, 54: 0.49, 108: 1.52 },
    "双卡": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.42, 50.8: 0.48, 76.1: 1.08, 88.9: 1.25, 101.6: 1.48, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.42, 54: 0.48, 108: 1.48 },
    "环压": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.42, 50.8: 0.48, 76.1: 1.08, 88.9: 1.25, 101.6: 1.48, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.42, 54: 0.48, 108: 1.48 },
    "法兰": { 16: 2.26, 20: 2.29, 25.4: 2.34, 32: 2.73, 40: 2.78, 50.8: 2.85, 76.1: 3.22, 88.9: 3.33, 101.6: 3.44, 133: 19.75, 159: 23.25, 219: 39.50, 18: 2.26, 22: 2.29, 28: 2.34, 35: 2.73, 42: 2.78, 54: 2.85, 108: 3.44 },
    "移动螺母": { 16: 0.28, 20: 0.29, 25.4: 0.32, 32: 0.36, 40: 0.44, 50.8: 0.49, 76.1: 1.13, 88.9: 1.31, 101.6: 1.52, 18: 0.28, 22: 0.29, 28: 0.32, 35: 0.36, 42: 0.44, 54: 0.49, 108: 1.52 },
    "堵头": { 16: 0.25, 20: 0.26, 25.4: 0.30, 32: 0.32, 40: 0.38, 50.8: 0.41, 76.1: 1.13, 88.9: 1.25, 101.6: 1.44, 133: 5.00, 159: 5.00, 219: 5.00, 18: 0.25, 22: 0.26, 28: 0.30, 35: 0.32, 42: 0.38, 54: 0.41, 108: 1.44 },
    "沟槽": { 76.1: 3.00, 88.9: 4.00, 101.6: 5.00, 133: 10.00, 159: 10.00, 219: 10.00, 108: 5.00 },
    "对焊": { 16: 0, 20: 0, 25.4: 0, 32: 0, 40: 0, 50.8: 0, 76.1: 0, 88.9: 0, 101.6: 0, 133: 0, 159: 0, 219: 0, 18: 0, 22: 0, 28: 0, 35: 0, 42: 0, 54: 0, 108: 0 }
  },
  annealingPerKg: 1.2,
  managementPerKg: 4.13,
  packagingPerKg: 0.938,
  surfaceTreatmentPerKg: { "酸洗": 0, "喷砂": 1, "抛光": 1 },
  materialTaxDivisor: 1.13,
  fittingTaxDivisor: 1.13,
  fittingByDiameter: {
    "外丝": { 16: 1.92, 20: 2.65, 25.4: 4.2, 32: 6.63, 40: 7.99, 50.8: 11.83, 76.1: 26.15, 88.9: 27.8, 101.6: 52.8 },
    "内丝": { 16: 1.88, 20: 2.56, 25.4: 4.09, 32: 7.57, 40: 7.52, 50.8: 10.55, 76.1: 23.9, 88.9: 32, 101.6: 47.2 },
    "双卡": { 16: 0.428931, 20: 0.724106, 25.4: 1.07897, 32: 2.029109, 40: 3.078094, 50.8: 4.660822, 76.1: 10.03244, 88.9: 12.03591, 101.6: 16.66083 },
    "环压": { 16: 0.73, 20: 1.10, 25.4: 1.68, 32: 3.03, 40: 4.18, 50.8: 4.68, 76.1: 18.38, 88.9: 23.68, 101.6: 27.52 },
    "法兰": { 16: 17, 20: 22, 25.4: 29, 32: 31, 40: 38, 50.8: 42, 76.1: 61, 88.9: 70, 101.6: 86, 133: 116, 159: 173, 219: 217 },
    "移动螺母": { 16: 3.02, 20: 3.94, 25.4: 5.65, 32: 7.89, 40: 9.58, 50.8: 13.72 },
    "堵头": { 16: 0.41, 20: 0.51, 25.4: 0.62, 32: 0.98, 40: 1.20, 50.8: 1.37, 76.1: 1.82, 88.9: 2.97, 101.6: 3.61, 133: 30.40, 159: 37.80, 219: 59.40 },
    "沟槽": { 76.1: 8.23, 88.9: 10.22, 101.6: 15.03, 133: 15.20, 159: 18.90, 219: 29.70 },
    "对焊": { 16: 0, 20: 0, 25.4: 0, 32: 0, 40: 0, 50.8: 0, 76.1: 0, 88.9: 0, 101.6: 0, 133: 0, 159: 0, 219: 0 },
    "90弯头": { 16: 1.77, 20: 2.61, 25.4: 3.44, 32: 6.29, 40: 8.30, 50.8: 12.10, 76.1: 39.21, 88.9: 52.97, 101.6: 64.54, 133: 76.90, 159: 98.60, 219: 188.00 },
    "45弯头": { 16: 1.67, 20: 2.31, 25.4: 3.20, 32: 6.07, 40: 8.11, 50.8: 12.81, 76.1: 28.41, 88.9: 39.32, 101.6: 46.60, 133: 98.60, 159: 126.20, 219: 245.00 }
  },
  fittingBySeries: {
    A: {
      "外丝": { 16: 1.92, 20: 2.65, 25.4: 4.2, 32: 6.63, 40: 7.99, 50.8: 11.83, 76.1: 26.15, 88.9: 27.8, 101.6: 52.8 },
      "内丝": { 16: 1.88, 20: 2.56, 25.4: 4.09, 32: 7.57, 40: 7.52, 50.8: 10.55, 76.1: 23.9, 88.9: 32, 101.6: 47.2 },
      "双卡": { 16: 0.428931, 20: 0.724106374, 25.4: 1.078969853, 32: 2.029108529, 40: 3.078094029, 50.8: 4.660822025, 76.1: 10.03244479, 88.9: 12.0359147, 101.6: 16.66082708 },
      "环压": { 16: 0.73, 20: 1.10, 25.4: 1.68, 32: 3.03, 40: 4.18, 50.8: 4.68, 76.1: 18.38, 88.9: 23.68, 101.6: 27.52 },
      "法兰": { 16: 17, 20: 22, 25.4: 29, 32: 31, 40: 38, 50.8: 42, 76.1: 61, 88.9: 70, 101.6: 86, 133: 116, 159: 173, 219: 217 },
      "移动螺纹": { 16: 3.02, 20: 3.94, 25.4: 5.65, 32: 7.89, 40: 9.58, 50.8: 13.72 },
      "移动螺母": { 16: 3.02, 20: 3.94, 25.4: 5.65, 32: 7.89, 40: 9.58, 50.8: 13.72 },
      "堵头": { 16: 0.41, 20: 0.51, 25.4: 0.62, 32: 0.98, 40: 1.20, 50.8: 1.37, 76.1: 1.82, 88.9: 2.97, 101.6: 3.61, 133: 30.40, 159: 37.80, 219: 59.40 },
      "沟槽": { 76.1: 8.23, 88.9: 10.22, 101.6: 15.03, 133: 15.20, 159: 18.90, 219: 29.70 },
      "对焊": { 16: 0, 20: 0, 25.4: 0, 32: 0, 40: 0, 50.8: 0, 76.1: 0, 88.9: 0, 101.6: 0, 133: 0, 159: 0, 219: 0 },
      "90弯头": { 16: 1.77, 20: 2.61, 25.4: 3.44, 32: 6.29, 40: 8.30, 50.8: 12.10, 76.1: 39.21, 88.9: 52.97, 101.6: 64.54, 133: 76.90, 159: 98.60, 219: 188.00 },
      "45弯头": { 16: 1.67, 20: 2.31, 25.4: 3.20, 32: 6.07, 40: 8.11, 50.8: 12.81, 76.1: 28.41, 88.9: 39.32, 101.6: 46.60, 133: 98.60, 159: 126.20, 219: 245.00 }
    },
    B: {
      "外丝": { 18: 1.92, 22: 2.65, 28: 4.2, 35: 6.63, 42: 7.99, 54: 11.83, 76.1: 26.15, 88.9: 27.8, 108: 52.8 },
      "内丝": { 18: 1.88, 22: 2.56, 28: 4.09, 35: 7.57, 42: 7.52, 54: 10.55, 76.1: 23.9, 88.9: 32, 108: 47.2 },
      "双卡": { 18: 0.820514, 22: 0.81824, 28: 1.219236, 35: 2.292893, 42: 3.478246, 54: 5.266729, 76.1: 11.33666, 88.9: 13.60058, 108: 18.82673 },
      "环压": {},
      "法兰": { 18: 19, 22: 22, 28: 29, 35: 32, 42: 38, 54: 42, 76.1: 61, 88.9: 70, 108: 86 },
      "移动螺纹": { 18: 3.02, 22: 3.94, 28: 5.65, 35: 7.89, 42: 9.58, 54: 13.72 },
      "移动螺母": { 18: 3.02, 22: 3.94, 28: 5.65, 35: 7.89, 42: 9.58, 54: 13.72 },
      "堵头": { 18: 0.41, 22: 0.51, 28: 0.62, 35: 0.98, 42: 1.20, 54: 1.37, 76.1: 1.82, 88.9: 2.97, 108: 3.61 },
      "沟槽": { 108: 15.03 },
      "对焊": { 18: 0, 22: 0, 28: 0, 35: 0, 42: 0, 54: 0, 76.1: 0, 88.9: 0, 108: 0 },
      "90弯头": { 18: 2.58, 22: 2.99, 28: 4.27, 35: 7.71, 42: 10.73, 54: 16.45, 76.1: 39.21, 88.9: 52.97, 108: 71.67 },
      "45弯头": { 18: 2.53, 22: 2.84, 28: 4.09, 35: 6.76, 42: 8.71, 54: 12.67, 76.1: 28.41, 88.9: 39.32, 108: 52.47 }
    }
  }
};

const insertWeldFactor = 0.75;

function scaledNumberTable(source, factor) {
  return Object.fromEntries(Object.entries(source || {}).map(([key, value]) => [key, Number((Number(value) * factor).toFixed(4))]));
}

function cloneDiameterValue(table, sourceDiameter, targetDiameter) {
  if (!table || table[targetDiameter] !== undefined || table[sourceDiameter] === undefined) return;
  table[targetDiameter] = table[sourceDiameter];
}

function cloneDiameterAcrossRows(rows, sourceDiameter, targetDiameter) {
  Object.values(rows || {}).forEach(row => cloneDiameterValue(row, sourceDiameter, targetDiameter));
}

function installGerman15Defaults(target) {
  cloneDiameterValue(target.teeStraightLengthBySeries?.B, 18, 15);
  cloneDiameterValue(target.elbowCenterHeightBySeries?.B, 18, 15);
  cloneDiameterAcrossRows(target.fittingLengthBySeries?.B, 18, 15);
  cloneDiameterAcrossRows(target.fittingBySeries?.B, 18, 15);
  cloneDiameterAcrossRows(target.dockingProcessByDiameter, 18, 15);
  cloneDiameterAcrossRows(target.teeProcessByDiameter, 18, 15);
  cloneDiameterAcrossRows(target.elbowProcessByDiameter, 18, 15);
}

function installInsertWeldDefaults(target) {
  target.fittingByDiameter["插焊"] = scaledNumberTable(target.fittingByDiameter["环压"], insertWeldFactor);
  target.fittingBySeries.A["插焊"] = scaledNumberTable(target.fittingBySeries.A["环压"], insertWeldFactor);
  target.fittingLengthByDiameter["插焊"] = scaledNumberTable(target.fittingLengthByDiameter["环压"], insertWeldFactor);
  target.fittingLengthBySeries.A["插焊"] = scaledNumberTable(target.fittingLengthBySeries.A["环压"], insertWeldFactor);
  target.dockingProcessByDiameter["插焊"] = { ...target.dockingProcessByDiameter["环压"] };
  target.teeProcessByDiameter["插焊"] = { ...target.teeProcessByDiameter["环压"] };
  target.elbowProcessByDiameter["插焊"] = { ...target.elbowProcessByDiameter["环压"] };
}

installGerman15Defaults(pricing);
installInsertWeldDefaults(pricing);
const defaultPricing = JSON.parse(JSON.stringify(pricing));
const settingsStorageKey = "manifoldQuotePricingV1";
let settingsRecoveryNotice = "";
const steelPriceRatio316 = 1.65;
const defaultSteelTonPrice = { "304": 16000, "316L": 16000 * steelPriceRatio316 };
const tubeSeriesLabel = { A: "国标", B: "德标" };
const updatedRingPressA = { 20: 1.10, 25.4: 1.68, 32: 3.03, 40: 4.18, 50.8: 4.68, 76.1: 18.38, 88.9: 23.68, 101.6: 27.52 };
let settingsUnlocked = false;
let settingsDirty = false;
let activeSettingsCategory = "manifold";
let activeSettingsSection = "dimensions";
let drawingInfoPanelsVisible = true;
let dimensionOverrides = {};

const doubleCardISeries = {
  16: { dn: 15, d2: 22.2, r: 2.2, l1: 23, la: 8 },
  18: { dn: 15, d2: 26.2, r: 2.6, l1: 23, la: 8 },
  20: { dn: 20, d2: 27.9, r: 2.6, l1: 26, la: 10 },
  25.4: { dn: 25, d2: 33.8, r: 2.7, l1: 32, la: 10 },
  32: { dn: 32, d2: 44.0, r: 3.5, l1: 38, la: 12 },
  40: { dn: 40, d2: 53.5, r: 4.0, l1: 46, la: 13 },
  50.8: { dn: 50, d2: 66.5, r: 4.5, l1: 56, la: 15 },
  76.1: { dn: 65, d2: 94.7, r: 5.6, l1: 60, la: 19 },
  88.9: { dn: 80, d2: 109.5, r: 6.4, l1: 70, la: 20 },
  101.6: { dn: 100, d2: 126.4, r: 7.2, l1: 82, la: 23 }
};

const ringPressISeries = {
  16: { dn: 15, d2: 17.9, l1: 10.5, l2: 23 },
  18: { dn: 15, d2: 17.9, l1: 10.5, l2: 23 },
  20: { dn: 20, d2: 22.2, l1: 11, l2: 25 },
  25.4: { dn: 25, d2: 27.9, l1: 12, l2: 32 },
  32: { dn: 32, d2: 34.5, l1: 12, l2: 35 },
  40: { dn: 40, d2: 43.0, l1: 18, l2: 42 },
  50.8: { dn: 50, d2: 54.0, l1: 18, l2: 43 },
  76.1: { dn: 65, d2: 80.2, l1: 19, l2: 60 },
  88.9: { dn: 80, d2: 93.4, l1: 19, l2: 72 },
  101.6: { dn: 100, d2: 106.3, l1: 19, l2: 78 }
};

const drawingColors = {
  pipeFill: DrawingCore.CAD_STANDARD.colors.pipeFill,
  fittingFill: DrawingCore.CAD_STANDARD.colors.fittingFill,
  capFill: DrawingCore.CAD_STANDARD.colors.capFill,
  stroke: DrawingCore.CAD_STANDARD.colors.object,
  fittingStroke: DrawingCore.CAD_STANDARD.colors.fitting,
  objectLineWidth: DrawingCore.CAD_STANDARD.line.visibleHeavy,
  secondaryLineWidth: DrawingCore.CAD_STANDARD.line.visible,
  fittingLineWidth: DrawingCore.CAD_STANDARD.line.visible,
  dimension: DrawingCore.CAD_STANDARD.colors.dimension,
  centerLine: DrawingCore.CAD_STANDARD.colors.center,
  centerLineWidth: DrawingCore.CAD_STANDARD.line.center,
  centerLineDash: DrawingCore.CAD_STANDARD.dimension.centerDash,
  labelFontSize: DrawingCore.CAD_STANDARD.text.label,
  bodyLabelFontSize: DrawingCore.CAD_STANDARD.text.dimension,
  dimensionFontSize: DrawingCore.CAD_STANDARD.text.dimensionEmphasis,
  totalDimensionFontSize: DrawingCore.CAD_STANDARD.text.dimensionTotal,
  infoFontSize: DrawingCore.CAD_STANDARD.text.info,
  smallFontSize: DrawingCore.CAD_STANDARD.text.small,
  label: DrawingCore.CAD_STANDARD.colors.label,
  mutedLabel: DrawingCore.CAD_STANDARD.colors.mutedLabel
};

let fields = {};

function bindFields() {
  fields = {
    customerName: document.querySelector("#customerName"),
    quoteNo: document.querySelector("#quoteNo"),
    productCode: document.querySelector("#productCode"),
    productType: document.querySelector("#productType"),
    material: document.querySelector("#material"),
    tubeSeries: document.querySelector("#tubeSeries"),
    manifoldType: document.querySelector("#manifoldType"),
    mainDiameter: document.querySelector("#mainDiameter"),
    wallThickness: document.querySelector("#wallThickness"),
    mainPositiveTolerance: document.querySelector("#mainPositiveTolerance"),
    branchDiameter: document.querySelector("#branchDiameter"),
    branchThickness: document.querySelector("#branchThickness"),
    branchPositiveTolerance: document.querySelector("#branchPositiveTolerance"),
    branchCount: document.querySelector("#branchCount"),
    branchSpacing: document.querySelector("#branchSpacing"),
    branchHeight: document.querySelector("#branchHeight"),
    inletAllowance: document.querySelector("#inletAllowance"),
    tailAllowance: document.querySelector("#tailAllowance"),
    mainFitting: document.querySelector("#mainFitting"),
    mainFittingDiameter: document.querySelector("#mainFittingDiameter"),
    mainAdapterEnabled: document.querySelector("#mainAdapterEnabled"),
    branchFitting: document.querySelector("#branchFitting"),
    tailFitting: document.querySelector("#tailFitting"),
    tailFittingDiameter: document.querySelector("#tailFittingDiameter"),
    tailAdapterEnabled: document.querySelector("#tailAdapterEnabled"),
    customBranches: document.querySelector("#customBranches"),
    branchEditor: document.querySelector("#branchEditor"),
    branchRows: document.querySelector("#branchRows"),
    quantity: document.querySelector("#quantity"),
    surfaceTreatment: document.querySelector("#surfaceTreatment"),
    difficultyFactor: document.querySelector("#difficultyFactor"),
    steelTonPrice: document.querySelector("#steelTonPrice"),
    profitRate: document.querySelector("#profitRate"),
    taxRate: document.querySelector("#taxRate"),
    freight: document.querySelector("#freight"),
    productDiameter: document.querySelector("#productDiameter"),
    productThickness: document.querySelector("#productThickness"),
    productDiameterA: document.querySelector("#productDiameterA"),
    productThicknessA: document.querySelector("#productThicknessA"),
    productDiameterB: document.querySelector("#productDiameterB"),
    productThicknessB: document.querySelector("#productThicknessB"),
    productMiddleA: document.querySelector("#productMiddleA"),
    productMiddleLengthA: document.querySelector("#productMiddleLengthA"),
    productMiddleLengthAWrap: document.querySelector("#productMiddleLengthAWrap"),
    productMiddleB: document.querySelector("#productMiddleB"),
    productMiddleLengthB: document.querySelector("#productMiddleLengthB"),
    productMiddleLengthBWrap: document.querySelector("#productMiddleLengthBWrap"),
    productHasMiddle: document.querySelector("#productHasMiddle"),
    productMiddleDiameter: document.querySelector("#productMiddleDiameter"),
    productMiddleThickness: document.querySelector("#productMiddleThickness"),
    productMiddlePanel: document.querySelector("#productMiddlePanel"),
    productMiddleCount: document.querySelector("#productMiddleCount"),
    productMiddleRows: document.querySelector("#productMiddleRows"),
    productTotalLength: document.querySelector("#productTotalLength"),
    productLength: document.querySelector("#productLength"),
    productAngle: document.querySelector("#productAngle"),
    productFittingA: document.querySelector("#productFittingA"),
    productFittingB: document.querySelector("#productFittingB"),
    elbowBodyDiameter: document.querySelector("#elbowBodyDiameter"),
    elbowBodyThickness: document.querySelector("#elbowBodyThickness"),
    elbowDiameterA: document.querySelector("#elbowDiameterA"),
    elbowThicknessA: document.querySelector("#elbowThicknessA"),
    elbowFittingA: document.querySelector("#elbowFittingA"),
    elbowMiddleA: document.querySelector("#elbowMiddleA2"),
    elbowMiddleLengthA: document.querySelector("#elbowMiddleLengthA"),
    elbowMiddleLengthAWrap: document.querySelector("#elbowMiddleLengthAWrap"),
    elbowDiameterB: document.querySelector("#elbowDiameterB"),
    elbowThicknessB: document.querySelector("#elbowThicknessB"),
    elbowFittingB: document.querySelector("#elbowFittingB"),
    elbowMiddleB: document.querySelector("#elbowMiddleB2"),
    elbowMiddleLengthB: document.querySelector("#elbowMiddleLengthB"),
    elbowMiddleLengthBWrap: document.querySelector("#elbowMiddleLengthBWrap"),
    teeDiameterA: document.querySelector("#teeDiameterA"),
    teeThicknessA: document.querySelector("#teeThicknessA"),
    teeFittingA: document.querySelector("#teeFittingA"),
    teeMiddleA: document.querySelector("#teeMiddleA"),
    teeDiameterB: document.querySelector("#teeDiameterB"),
    teeThicknessB: document.querySelector("#teeThicknessB"),
    teeFittingB: document.querySelector("#teeFittingB"),
    teeMiddleB: document.querySelector("#teeMiddleB"),
    teeMiddleLengthB: document.querySelector("#teeMiddleLengthB"),
    teeMiddleLengthBWrap: document.querySelector("#teeMiddleLengthBWrap"),
    teeDiameterC: document.querySelector("#teeDiameterC"),
    teeThicknessC: document.querySelector("#teeThicknessC"),
    teeFittingC: document.querySelector("#teeFittingC"),
    teeMiddleC: document.querySelector("#teeMiddleC"),
    teeBodyDiameter: document.querySelector("#teeBodyDiameter"),
    teeBodyThickness: document.querySelector("#teeBodyThickness"),
    teeBodyLength: document.querySelector("#teeBodyLength"),
    productGenericFittingA: document.querySelector("#productGenericFittingA"),
    productGenericFittingB: document.querySelector("#productGenericFittingB"),
    productFittingC: document.querySelector("#productFittingC"),
    productProcessFactor: document.querySelector("#productProcessFactor"),
    combinationSection: document.querySelector("#combinationSection"),
    combinationAddType: document.querySelector("#combinationAddType"),
    combinationAdd: document.querySelector("#combinationAdd"),
    combinationFittingA: document.querySelector("#combinationFittingA"),
    combinationFittingB: document.querySelector("#combinationFittingB"),
    combinationRows: document.querySelector("#combinationRows")
  };
  const missing = Object.entries(fields).filter(([, element]) => !element).map(([name]) => name);
  if (missing.length) {
    throw new Error(`页面初始化失败，缺少控件: ${missing.join(", ")}`);
  }
}

let quoteItems = [];
const quoteListStorageKey = "manifoldQuoteListV1";
const quotePriceColumnDefinitions = {
  factoryCost: { label: "成本", amountLabel: "成本金额", valueKey: "factoryCost", totalKey: "factoryCostTotal" },
  discountedPrice: { label: "面价折后", amountLabel: "折后金额", valueKey: "discountedPrice", totalKey: "discountedPriceTotal" },
  unitPrice: { label: "面价", amountLabel: "面价金额", valueKey: "unitPrice", totalKey: "totalPrice" }
};
let quotePriceColumns = ["unitPrice"];
let dockingMiddleTouched = false;
let lastDockingDiameterPair = "";
let teeBodyLengthTouched = false;

function persistQuoteList() {
  try {
    localStorage.setItem(
      quoteListStorageKey,
      QuoteListStorageCore.serialize(quoteItems, quotePriceColumns)
    );
  } catch (error) {
    console.warn("报价清单保存失败", error);
  }
}

function restoreQuoteList() {
  const raw = localStorage.getItem(quoteListStorageKey);
  if (!raw) return;
  try {
    const saved = QuoteListStorageCore.deserialize(raw, Object.keys(quotePriceColumnDefinitions));
    if (!saved) throw new Error("invalid quote list");
    quoteItems = saved.items;
    quotePriceColumns = saved.columns;
    document.querySelectorAll("[data-quote-price-column]").forEach(input => {
      input.checked = quotePriceColumns.includes(input.dataset.quotePriceColumn);
    });
  } catch (error) {
    // Keep a recoverable copy instead of silently deleting a damaged draft.
    localStorage.setItem(`${quoteListStorageKey}:backup:${Date.now()}`, raw);
    localStorage.removeItem(quoteListStorageKey);
    console.warn("报价清单恢复失败，已保留备份", error);
  }
}

async function copyPlainText(value) {
  const text = String(value ?? "").trim();
  if (!text || text === "\u5f85\u786e\u8ba4") return false;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

function showCopyToast(text) {
  let toast = document.querySelector("#copyToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "copyToast";
    toast.className = "copy-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showCopyToast.timer);
  showCopyToast.timer = setTimeout(() => toast.classList.remove("show"), 1200);
}

function bindCopyTarget(element, valueProvider, successText) {
  if (!element) return;
  element.classList.add("copyable-value");
  element.tabIndex = 0;
  element.setAttribute("role", "button");
  element.title = "\u70b9\u51fb\u590d\u5236";
  const copy = async () => {
    try {
      if (await copyPlainText(valueProvider())) showCopyToast(successText);
    } catch (_error) {
      showCopyToast("\u590d\u5236\u5931\u8d25");
    }
  };
  element.addEventListener("click", copy);
  element.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    copy();
  });
}

function bindCopyActions() {
  bindCopyTarget(fields.productCode, () => fields.productCode.value, "\u4ea7\u54c1\u7f16\u7801\u5df2\u590d\u5236");
  ["factoryCost", "discountedPrice", "unitPrice", "totalPrice"].forEach(id => {
    const element = document.querySelector(`#${id}`);
    bindCopyTarget(element, () => element.textContent.replace(/[^\d.-]/g, ""), "\u4ef7\u683c\u5df2\u590d\u5236");
  });
}

function formatNumber(value) {
  return Number(value).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function money(value) {
  return `¥${formatNumber(value)}`;
}

function formatFactor(value) {
  return Number(value).toFixed(2);
}

function drawingLengthValue(value) {
  return DimensionCore.drawingLengthValue(value);
}

function drawingLengthTolerance(diameter) {
  return DimensionCore.drawingLengthTolerance(diameter);
}

function drawingLengthText(value, prefix = "L=") {
  return DimensionCore.drawingLengthText(value, prefix);
}

function drawingTotalLengthText(value, diameter, prefix = "L=") {
  return DimensionCore.drawingTotalLengthText(value, diameter, prefix);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function fillSelect(select, values, formatter = value => value) {
  if (!select || select.tagName !== "SELECT") return;
  const current = select.value;
  select.innerHTML = "";
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = formatter(value);
    select.appendChild(option);
  });
  if (values.map(String).includes(current)) {
    select.value = current;
  }
}

function fittingLabel(name) {
  return name === "堵头" ? "管帽盖" : name;
}

const { mergeFittingSeries } = SettingsCore;

function loadPricingSettings() {
  const rawSettings = localStorage.getItem(settingsStorageKey);
  if (!rawSettings) return;
  try {
    const saved = JSON.parse(rawSettings);
    if (saved) {
      Object.assign(pricing, saved);
      pricing.fittingMaterialFactor = { ...defaultPricing.fittingMaterialFactor, ...saved.fittingMaterialFactor };
      pricing.fittingWeightFactor = { ...defaultPricing.fittingWeightFactor, ...saved.fittingWeightFactor };
      pricing.teeStraightLengthBySeries = {
        A: { ...defaultPricing.teeStraightLengthBySeries.A, ...saved.teeStraightLengthBySeries?.A },
        B: { ...defaultPricing.teeStraightLengthBySeries.B, ...saved.teeStraightLengthBySeries?.B }
      };
      pricing.elbowCenterHeightBySeries = {
        A: { ...defaultPricing.elbowCenterHeightBySeries.A, ...saved.elbowCenterHeightBySeries?.A },
        B: { ...defaultPricing.elbowCenterHeightBySeries.B, ...saved.elbowCenterHeightBySeries?.B }
      };
      pricing.tubeKgPrice = { ...defaultPricing.tubeKgPrice, ...saved.tubeKgPrice };
      pricing.surfaceTreatmentPerKg = { ...defaultPricing.surfaceTreatmentPerKg, ...saved.surfaceTreatmentPerKg };
      pricing.combination = { ...defaultPricing.combination, ...saved.combination };
      pricing.dockingProcessByDiameter = mergeFittingSeries(defaultPricing.dockingProcessByDiameter, saved.dockingProcessByDiameter);
      pricing.elbowProcessByDiameter = mergeFittingSeries(defaultPricing.elbowProcessByDiameter, saved.elbowProcessByDiameter);
      pricing.teeProcessByDiameter = mergeFittingSeries(defaultPricing.teeProcessByDiameter, saved.teeProcessByDiameter);
      pricing.fittingLengthByDiameter = mergeFittingSeries(defaultPricing.fittingLengthByDiameter, saved.fittingLengthByDiameter);
      pricing.fittingLengthBySeries = {
        A: mergeFittingSeries(defaultPricing.fittingLengthBySeries.A, saved.fittingLengthBySeries?.A),
        B: mergeFittingSeries(defaultPricing.fittingLengthBySeries.B, saved.fittingLengthBySeries?.B)
      };
      pricing.fittingByDiameter = mergeFittingSeries(defaultPricing.fittingByDiameter, saved.fittingByDiameter);
      pricing.managementPerKg = saved.managementPerKg ?? defaultPricing.managementPerKg;
      delete pricing.managementProcessFactor;
      pricing.fittingBySeries = {
        A: mergeFittingSeries(defaultPricing.fittingBySeries.A, saved.fittingBySeries?.A),
        B: mergeFittingSeries(defaultPricing.fittingBySeries.B, saved.fittingBySeries?.B)
      };
      if (saved.settingsVersion !== defaultPricing.settingsVersion) {
        const previousVersion = saved.settingsVersion ?? "unknown";
        localStorage.setItem(`${settingsStorageKey}:backup:${previousVersion}`, JSON.stringify(saved));
        pricing.settingsVersion = defaultPricing.settingsVersion;
      }
    }
  } catch (error) {
    // Keep the original value for recovery instead of silently losing a price table.
    localStorage.setItem(`${settingsStorageKey}:backup:invalid:${Date.now()}`, rawSettings);
    localStorage.removeItem(settingsStorageKey);
    Object.keys(pricing).forEach(key => delete pricing[key]);
    Object.assign(pricing, JSON.parse(JSON.stringify(defaultPricing)));
    settingsRecoveryNotice = "本机价格设置读取失败，已备份原始数据并恢复默认值。请在设置中导入最近导出的价格表。";
    console.warn("价格设置读取失败，已备份并恢复默认值", error);
  }
}

function savePricingSettings() {
  pricing.settingsVersion = defaultPricing.settingsVersion;
  localStorage.setItem(settingsStorageKey, JSON.stringify(pricing));
  settingsDirty = false;
  const status = document.querySelector("#settingsSaveStatus");
  if (status) status.textContent = "价格已保存到本机";
}

function markSettingsDirty() {
  settingsDirty = true;
  const status = document.querySelector("#settingsSaveStatus");
  if (status) status.textContent = "价格已修改，记得保存";
}

function openSettingsPanel() {
  const panel = document.querySelector("#settingsPanel");
  panel.hidden = false;
  switchSettingsCategory(activeSettingsCategory);
  switchSettingsSection(activeSettingsSection);
  document.querySelector("#toggleSettings").innerHTML = "<span>⚙</span>隐藏设置";
}

function closeSettingsPanel() {
  const panel = document.querySelector("#settingsPanel");
  panel.hidden = true;
  document.querySelector("#toggleSettings").innerHTML = "<span>⚙</span>设置";
}

function toggleSidebar() {
  document.body.classList.toggle("sidebar-collapsed");
}

function openSettingsPasswordModal() {
  const modal = document.querySelector("#settingsPasswordModal");
  const input = document.querySelector("#settingsPasswordInput");
  const error = document.querySelector("#settingsPasswordError");
  modal.hidden = false;
  error.hidden = true;
  input.value = "";
  setTimeout(() => input.focus(), 0);
}

function closeSettingsPasswordModal() {
  document.querySelector("#settingsPasswordModal").hidden = true;
}

function confirmSettingsPassword() {
  const input = document.querySelector("#settingsPasswordInput");
  const error = document.querySelector("#settingsPasswordError");
  if (input.value !== "Franta") {
    error.hidden = false;
    input.select();
    return;
  }
  settingsUnlocked = true;
  closeSettingsPasswordModal();
  openSettingsPanel();
}

function defaultWallThickness(diameter) {
  return CatalogCore.defaultWallThickness(options, currentTubeSeries(), diameter);
}

function seriesDiameters() {
  return CatalogCore.seriesDiameters(options, currentTubeSeries());
}

function equivalentSeriesDiameter(diameter, targetSeries) {
  return CatalogCore.equivalentSeriesDiameter(options, diameter, targetSeries);
}

function closestDiameter(diameter, values) {
  return CatalogCore.closestDiameter(diameter, values);
}

function stableSeriesDiameter(currentDiameter, values, targetSeries) {
  return CatalogCore.stableSeriesDiameter(options, currentDiameter, values, targetSeries);
}

function seriesThicknesses() {
  return CatalogCore.seriesThicknesses(options, currentTubeSeries());
}

function branchOptions(mainDiameter) {
  return CatalogCore.branchOptions(options, currentTubeSeries(), mainDiameter);
}

function fittingSettingDiameters(series) {
  return CatalogCore.fittingSettingDiameters(options, series);
}

function currentTubeSeries() {
  return fields.tubeSeries?.value || "A";
}

function fittingPriceDiameter(diameter, series = currentTubeSeries()) {
  return QuoteCore.fittingPriceDiameter(diameter, series, pricing, options.tubeSeries);
}

function fittingSeriesTable(series = currentTubeSeries()) {
  return QuoteCore.fittingSeriesTable(series, pricing);
}

function availableFittings(fittingNames, diameter, series = currentTubeSeries()) {
  const priceDiameter = fittingPriceDiameter(diameter, series);
  const table = fittingSeriesTable(series);
  return CatalogCore.availableFittings(fittingNames, priceDiameter, table);
}

function teeAvailableFittings(diameter) {
  return ProductSelectionCore.teeFittingOptions(diameter, options, availableFittings);
}

function elbowAvailableFittings(diameter) {
  return ProductSelectionCore.elbowFittingOptions(diameter, options, availableFittings);
}

function isNoFitting(fittingName) {
  return CatalogCore.isNoFitting(fittingName);
}

function isRingPressLike(fittingName) {
  return CatalogCore.isRingPressLike(fittingName);
}

function fittingCost(fittingName, diameter, material, series = currentTubeSeries()) {
  return QuoteCore.fittingCost({
    fittingName,
    diameter,
    material,
    series,
    pricing,
    tubeSeries: options.tubeSeries,
    isNoFitting
  });
}

function fittingCostDetail(fittingName, diameter, material, series = currentTubeSeries()) {
  if (isNoFitting(fittingName)) {
    return { fittingName, lookupFittingName: fittingName, priceDiameter: diameter, taxIncludedPrice: 0, taxDivisor: 1, materialFactor: 0, cost: 0 };
  }
  const lookupFittingName = QuoteCore.costLookupFittingName(fittingName);
  const table = fittingSeriesTable(series);
  const priceDiameter = fittingPriceDiameter(diameter, series);
  const taxIncludedPrice = Number(table[lookupFittingName]?.[priceDiameter]) || 0;
  const taxDivisor = Math.max(1, Number(pricing.fittingTaxDivisor) || 1);
  const materialFactor = Number(pricing.fittingMaterialFactor[material]) || 0;
  return {
    fittingName,
    lookupFittingName,
    priceDiameter,
    taxIncludedPrice,
    taxDivisor,
    materialFactor,
    cost: taxIncludedPrice / taxDivisor * materialFactor
  };
}

function tableValueExists(value) {
  return value !== undefined && value !== null && value !== "" && value !== "无" && Number(value) > 0;
}

function fittingValidationDetail(fittingName, diameter, material, series = currentTubeSeries()) {
  if (isNoFitting(fittingName)) return null;
  const lookupFittingName = QuoteCore.costLookupFittingName(fittingName);
  const table = fittingSeriesTable(series);
  const priceDiameter = fittingPriceDiameter(diameter, series);
  const taxIncludedPrice = table?.[lookupFittingName]?.[priceDiameter];
  const length = QuoteCore.fittingLengthMm({
    fittingName,
    diameter,
    series,
    pricing,
    standardDiameters: processStandardDiameters,
    isNoFitting
  });
  const weightFactor = pricing.fittingWeightFactor?.[lookupFittingName];
  const materialFactor = pricing.fittingMaterialFactor?.[material];
  return { fittingName, lookupFittingName, priceDiameter, taxIncludedPrice, length, weightFactor, materialFactor };
}

function pushUniqueIssue(issues, issue) {
  const key = `${issue.type}|${issue.item}|${issue.detail}`;
  if (issues.some(item => `${item.type}|${item.item}|${item.detail}` === key)) return;
  issues.push(issue);
}

function validateFittingItem(issues, item, config, options = {}) {
  if (!item || isNoFitting(item.fitting)) return;
  const detail = fittingValidationDetail(item.fitting, item.diameter, config.material, config.tubeSeries);
  const label = `${item.label || ""}${item.label ? " " : ""}${fittingLabel(item.fitting)} D${item.diameter}`;
  if (!detail || !tableValueExists(detail.taxIncludedPrice)) {
    pushUniqueIssue(issues, {
      type: "配件价格",
      item: label,
      detail: `系列${config.tubeSeries} 表格规格 D${detail?.priceDiameter ?? item.diameter} 未配置含税价格`
    });
  }
  if (options.length !== false && item.length !== false && !tableValueExists(detail?.length)) {
    pushUniqueIssue(issues, {
      type: "配件长度",
      item: label,
      detail: "未配置配件长度，图纸总长和尺寸界限可能不准确"
    });
  }
  if (options.weight !== false && !tableValueExists(detail?.weightFactor)) {
    pushUniqueIssue(issues, {
      type: "重量系数",
      item: label,
      detail: "未配置配件重量系数，退火、包材和制造管理重量可能不准确"
    });
  }
  if (!tableValueExists(detail?.materialFactor)) {
    pushUniqueIssue(issues, {
      type: "材质系数",
      item: `${config.material} ${label}`,
      detail: "未配置当前材质的配件系数"
    });
  }
}

function validateProcessItem(issues, processType, item, config) {
  if (!item || isNoFitting(item.fitting)) return;
  const detail = processCostDetail(processType, item.fitting, item.diameter);
  if (!tableValueExists(detail.processCost)) {
    pushUniqueIssue(issues, {
      type: "加工费",
      item: `${productKindName(config.productType)} ${item.label || ""}${item.label ? " " : ""}${fittingLabel(item.fitting)} D${item.diameter}`,
      detail: `加工费表规格 D${detail.processDiameter} 未配置有效取值`
    });
  }
}

function finalizeCost(subtotal, config) {
  return QuoteCore.finalizeCost(subtotal, config, pricing.fittingTaxDivisor);
}

function fittingTheoreticalWeightKg(fittingName, diameter, material, steelTonPrice, series = currentTubeSeries()) {
  return QuoteCore.fittingTheoreticalWeightKg({
    fittingName,
    diameter,
    material,
    steelTonPrice,
    series,
    pricing,
    tubeSeries: options.tubeSeries,
    isNoFitting
  });
}

function heatTreatmentFittingWeightKg(fittingName, diameter, material, steelTonPrice, series = currentTubeSeries()) {
  return QuoteCore.heatTreatmentFittingWeightKg({
    fittingName,
    diameter,
    material,
    steelTonPrice,
    series,
    pricing,
    tubeSeries: options.tubeSeries,
    isNoFitting
  });
}

const processStandardDiameters = [16, 20, 25.4, 32, 40, 50.8, 76.1, 88.9, 101.6, 133, 159, 219, 15, 18, 22, 28, 35, 42, 54, 108];

function dockingProcessCost(fittingName, diameter) {
  return QuoteCore.processCost({
    fittingName,
    diameter,
    processTable: pricing.dockingProcessByDiameter,
    standardDiameters: processStandardDiameters,
    isNoFitting,
    fallbackProcessTable: pricing.elbowProcessByDiameter,
    fallbackFittingName: "双卡"
  });
}

function teeProcessCost(fittingName, diameter) {
  return QuoteCore.processCost({
    fittingName,
    diameter,
    processTable: pricing.teeProcessByDiameter,
    standardDiameters: processStandardDiameters,
    isNoFitting,
    fallbackProcessTable: pricing.elbowProcessByDiameter,
    fallbackFittingName: "双卡"
  });
}

function elbowProcessCost(fittingName, diameter) {
  return QuoteCore.processCost({
    fittingName,
    diameter,
    processTable: pricing.elbowProcessByDiameter,
    standardDiameters: processStandardDiameters,
    isNoFitting,
    fallbackProcessTable: pricing.elbowProcessByDiameter,
    fallbackFittingName: "双卡"
  });
}

function nearestProcessDiameter(diameter) {
  const numericDiameter = Number(diameter);
  if (processStandardDiameters.includes(numericDiameter)) return numericDiameter;
  return processStandardDiameters.reduce((best, item) =>
    Math.abs(item - numericDiameter) < Math.abs(best - numericDiameter) ? item : best
  , processStandardDiameters[0]);
}

function processCostDetail(processType, fittingName, diameter) {
  const tableMap = {
    docking: pricing.dockingProcessByDiameter,
    tee: pricing.teeProcessByDiameter,
    elbow: pricing.elbowProcessByDiameter
  };
  if (isNoFitting(fittingName)) {
    return { fittingName, lookupFittingName: fittingName, processDiameter: diameter, processCost: 0, tableCost: 0, fallbackUsed: false, fallbackCost: 0 };
  }
  const lookupFittingName = QuoteCore.costLookupFittingName(fittingName);
  const processDiameter = nearestProcessDiameter(diameter);
  const tableCost = Number(tableMap[processType]?.[lookupFittingName]?.[processDiameter]) || 0;
  const fallbackUsed = !tableCost && fittingName === "对焊";
  const fallbackCost = fallbackUsed
    ? Number(pricing.elbowProcessByDiameter?.["双卡"]?.[processDiameter]) || 0
    : 0;
  const processCost = tableCost || fallbackCost;
  return { fittingName, lookupFittingName, processDiameter, processCost, tableCost, fallbackUsed, fallbackCost };
}

function fittingLengthMm(fittingName, diameter, series = currentTubeSeries()) {
  return QuoteCore.fittingLengthMm({
    fittingName,
    diameter,
    series,
    pricing,
    standardDiameters: processStandardDiameters,
    isNoFitting
  });
}

function dockingMiddleLengthMm(config) {
  return DimensionCore.dockingMiddleLengthMm(config, fittingLengthMm);
}

function dockingTotalLengthMm(config) {
  return DimensionCore.dockingTotalLengthMm(config, fittingLengthMm);
}

function teeMiddleLengthMm(type, diameter, series = currentTubeSeries()) {
  return DimensionCore.teeMiddleLengthMm(type, diameter, series, fittingLengthMm);
}

function teeBMiddleVisualLengthMm(config) {
  return DimensionCore.teeBMiddleVisualLengthMm(config);
}

function elbowMiddleLengthMm(type, length, diameter, series = currentTubeSeries()) {
  return DimensionCore.elbowMiddleLengthMm(type, length, diameter, series, fittingLengthMm);
}

function compressedStraightVisualLength(length) {
  return DimensionCore.compressedStraightVisualLength(length);
}

function teeHorizontalTotalLengthMm(config) {
  return DimensionCore.teeHorizontalTotalLengthMm(config, fittingLengthMm);
}

function applyDockingTotalLengthRequirement() {
  if (fields.productType.value !== "对接类") return;
  if (fields.productMiddleA || fields.productMiddleB) return;
  const totalLength = Number(fields.productTotalLength.value);
  if (!totalLength || totalLength <= 0 || !fields.productHasMiddle.checked) return;

  const fixedLength = fittingLengthMm(fields.productFittingA.value, Number(fields.productDiameterA.value))
    + fittingLengthMm(fields.productFittingB.value, Number(fields.productDiameterB.value));
  let reducerLength = 0;
  const rows = Array.from(fields.productMiddleRows.querySelectorAll(".middle-row"));
  const straightRows = [];
  rows.forEach(row => {
    const type = row.querySelector("[data-middle-type]")?.value;
    if (type === "中接") {
      reducerLength += fittingLengthMm("中接", Math.max(Number(fields.productDiameterA.value), Number(fields.productDiameterB.value)));
    } else {
      straightRows.push(row);
    }
  });
  if (straightRows.length === 0) return;

  const straightLength = Math.max(0, totalLength - fixedLength - reducerLength);
  straightRows.forEach((row, index) => {
    const visibleLengthInput = row.querySelector("input[data-middle-length]:not([type='hidden'])");
    const hiddenLengthInput = row.querySelector("input[type='hidden'][data-middle-length]");
    const value = index === 0 ? straightLength : 0;
    if (visibleLengthInput) visibleLengthInput.value = String(Math.round(value * 100) / 100);
    if (hiddenLengthInput) hiddenLengthInput.value = String(Math.round(value * 100) / 100);
  });
}

function isManifoldType(productType = fields.productType?.value) {
  return !productType || productType === "分水器类";
}

function productKindName(productType) {
  return String(productType || "分水器类").replace("类", "");
}

function productDefaultLength(productType, diameter, angle) {
  return DimensionCore.productDefaultLength({
    productType,
    diameter,
    angle,
    series: fields.tubeSeries?.value || "A",
    pricing
  });
}

function syncProductMode() {
  const productType = fields.productType.value;
  const mode = ProductModeCore.state(productType);
  document.querySelectorAll("[data-manifold-section], [data-manifold-field]").forEach(element => {
    element.hidden = !mode.manifoldMode;
  });
  document.querySelector("#fittingSection").hidden = mode.fittingSectionHidden;
  fields.combinationSection.hidden = !mode.combinationMode;
  document.querySelectorAll("[data-docking-field]").forEach(element => {
    element.hidden = !mode.dockingMode;
  });
  document.querySelectorAll("[data-elbow-field]").forEach(element => {
    element.hidden = ProductModeCore.elbowFieldHidden(mode, element.hasAttribute("data-docking-field"));
  });
  document.querySelectorAll(".docking-total-field, .docking-middle-switch, .docking-middle-panel").forEach(element => {
    element.hidden = mode.dockingOnlyHidden;
  });
  document.querySelectorAll("[data-tee-field]").forEach(element => {
    element.hidden = mode.teeHidden;
  });
  document.querySelectorAll("[data-generic-product-field]").forEach(element => {
    element.hidden = ProductModeCore.genericProductFieldHidden(mode, element.hasAttribute("data-elbow-field"));
  });
  const productLengthLabel = document.querySelector("#productLengthWrap span");
  if (productLengthLabel) {
    productLengthLabel.textContent = mode.productLengthLabel;
  }
  document.querySelector("#productFittingCWrap").hidden = true;
  document.querySelector("#productAngleWrap").hidden = mode.angleHidden;
  document.querySelectorAll("[data-product-type]").forEach(button => {
    button.classList.toggle("active", button.dataset.productType === productType);
  });
  const mobileProductType = document.querySelector("#mobileProductType");
  if (mobileProductType && mobileProductType.value !== productType) {
    mobileProductType.value = productType;
  }
}

function syncMaterialSteelPrice(changedId) {
  const currentMaterial = fields.material.value;
  const nextPrice = MaterialPriceCore.nextSteelTonPrice({
    changedId,
    previousMaterial: fields.material.dataset.previousValue || "304",
    currentMaterial,
    currentSteelPrice: fields.steelTonPrice.value,
    ratio316: steelPriceRatio316,
    defaultSteelTonPrice
  });
  if (nextPrice !== null) fields.steelTonPrice.value = String(nextPrice);
  if (changedId === "material") fields.material.dataset.previousValue = currentMaterial;
}

function syncElbowMiddleLengthFields() {
  [
    { select: fields.elbowMiddleA, input: fields.elbowMiddleLengthA, wrap: fields.elbowMiddleLengthAWrap },
    { select: fields.elbowMiddleB, input: fields.elbowMiddleLengthB, wrap: fields.elbowMiddleLengthBWrap }
  ].forEach(({ select, input, wrap }) => {
    if (!select || !input || !wrap) return;
    const state = MiddleFieldCore.elbowMiddleLengthFieldState(select.value, input.value);
    wrap.hidden = state.hidden;
    input.disabled = state.disabled;
    input.value = state.value;
  });
}

function syncTeeMiddleLengthFields() {
  if (!fields.teeMiddleB || !fields.teeMiddleLengthB || !fields.teeMiddleLengthBWrap) return;
  const state = MiddleFieldCore.teeBMiddleLengthFieldState(fields.teeMiddleB.value, fields.teeMiddleLengthB.value);
  fields.teeMiddleLengthBWrap.hidden = state.hidden;
  fields.teeMiddleLengthB.disabled = state.disabled;
  fields.teeMiddleLengthB.value = state.value;
}

function syncDockingSideMiddleLengthFields() {
  [
    { select: fields.productMiddleA, input: fields.productMiddleLengthA, wrap: fields.productMiddleLengthAWrap },
    { select: fields.productMiddleB, input: fields.productMiddleLengthB, wrap: fields.productMiddleLengthBWrap }
  ].forEach(({ select, input, wrap }) => {
    if (!select || !input || !wrap) return;
    const state = MiddleFieldCore.straightLengthFieldState(select.value, input.value, 20);
    wrap.hidden = state.hidden;
    input.disabled = state.disabled;
    input.value = state.value;
  });
}

function getProductConfig() {
  const productType = fields.productType.value;
  if (productType === "对接类") return getDockingConfig();
  if (productType === "组合件") return getCombinationConfig();

  const teeMode = productType === "三通类";
  const elbowMode = productType === "弯头类";
  const diameterA = teeMode ? Number(fields.teeDiameterA.value) : elbowMode ? Number(fields.elbowDiameterA.value) : Number(fields.productDiameter.value);
  const diameterB = teeMode ? Number(fields.teeDiameterB.value) : elbowMode ? Number(fields.elbowDiameterB.value) : diameterA;
  const diameterC = teeMode ? Number(fields.teeDiameterC.value) : diameterA;
  const bodyDiameter = teeMode ? Number(fields.teeBodyDiameter.value) : elbowMode ? Number(fields.elbowBodyDiameter.value) : Math.max(diameterA, diameterB, diameterC);
  const thicknessA = teeMode ? Number(fields.teeThicknessA.value) : elbowMode ? Number(fields.elbowThicknessA.value) : Number(fields.productThickness.value);
  const thicknessB = teeMode ? Number(fields.teeThicknessB.value) : elbowMode ? Number(fields.elbowThicknessB.value) : thicknessA;
  const thicknessC = teeMode ? Number(fields.teeThicknessC.value) : thicknessA;
  const bodyThickness = teeMode ? Number(fields.teeBodyThickness.value) : elbowMode ? Number(fields.elbowBodyThickness.value) : Math.max(thicknessA || 0, thicknessB || 0, thicknessC || 0);
  const bodyLength = teeMode
    ? Math.max(1, Number(fields.teeBodyLength.value) || productDefaultLength(productType, bodyDiameter))
    : Math.max(1, Number(fields.productLength.value) || productDefaultLength(productType, bodyDiameter));
  const diameter = teeMode ? bodyDiameter : Math.max(diameterA, diameterB, diameterC);
  const thickness = elbowMode ? bodyThickness : Math.max(thicknessA, thicknessB, thicknessC);
  return {
    productType,
    customerName: fields.customerName.value.trim() || "未填写",
    quoteNo: fields.quoteNo.value.trim(),
    material: fields.material.value,
    tubeSeries: fields.tubeSeries.value,
    diameter,
    thickness,
    diameterA,
    diameterB,
    diameterC,
    thicknessA,
    thicknessB,
    thicknessC,
    length: bodyLength,
    bodyDiameter,
    bodyThickness,
    bodyLength,
    angle: Number(fields.productAngle.value) || 90,
    fittingA: teeMode ? fields.teeFittingA.value : elbowMode ? fields.elbowFittingA.value : fields.productGenericFittingA.value,
    fittingB: teeMode ? fields.teeFittingB.value : elbowMode ? fields.elbowFittingB.value : fields.productGenericFittingB.value,
    fittingC: teeMode ? fields.teeFittingC.value : fields.productFittingC.value,
    middleA: teeMode ? fields.teeMiddleA.value : elbowMode ? fields.elbowMiddleA.value : "直管",
    middleB: teeMode ? fields.teeMiddleB.value : elbowMode ? fields.elbowMiddleB.value : "直管",
    middleC: teeMode ? fields.teeMiddleC.value : "直管",
    middleLengthA: elbowMode ? Math.max(0, Number(fields.elbowMiddleLengthA.value) || 0) : 0,
    middleLengthB: teeMode ? Math.max(0, Number(fields.teeMiddleLengthB.value) || 0) : elbowMode ? Math.max(0, Number(fields.elbowMiddleLengthB.value) || 0) : 0,
    processFactor: Math.max(0, Number(fields.productProcessFactor.value) || 1),
    quantity: Math.max(1, Number(fields.quantity.value) || 1),
    surfaceTreatment: fields.surfaceTreatment.value,
    difficultyFactorInput: fields.difficultyFactor.dataset.manual === "true" ? fields.difficultyFactor.value.trim() : "",
    dimensionOverrides,
    steelTonPrice: Math.max(0, Number(fields.steelTonPrice.value) || 0),
    costRate: Math.max(0.01, Number(fields.profitRate.value) || 68) / 100,
    faceDiscountRate: Math.max(0.01, Number(fields.taxRate.value) || 17) / 100,
    freight: Math.max(0, Number(fields.freight.value) || 0)
  };
}

function readCombinationRows() {
  return Array.from(fields.combinationRows.querySelectorAll(".combination-row")).map((row, index) => ({
    id: row.dataset.id || `component-${index + 1}`,
    type: row.querySelector("[data-combination-type]").value,
    diameter: Number(row.querySelector("[data-combination-diameter]").value),
    thickness: Number(row.querySelector("[data-combination-thickness]").value),
    length: Math.max(1, Number(row.querySelector("[data-combination-length]").value) || 1),
    branchLength: Math.max(1, Number(row.querySelector("[data-combination-branch-length]")?.value) || 60),
    branchDiameter: Number(row.querySelector("[data-combination-branch-diameter]")?.value) || Number(row.querySelector("[data-combination-diameter]").value),
    branchThickness: Number(row.querySelector("[data-combination-branch-thickness]")?.value) || Number(row.querySelector("[data-combination-thickness]").value),
    branchFittingDiameter: Number(row.querySelector("[data-combination-branch-fitting-diameter]")?.value) || Number(row.querySelector("[data-combination-branch-diameter]")?.value) || Number(row.querySelector("[data-combination-diameter]").value),
    branchFitting: row.querySelector("[data-combination-branch-fitting]")?.value || "外丝",
    branchMiddle: row.querySelector("[data-combination-branch-middle]")?.value || "无",
    branchMiddleLength: Math.max(1, Number(row.querySelector("[data-combination-branch-middle-length]")?.value) || 50),
    branchComponents: Array.from(row.querySelectorAll(".combination-branch-component")).map((branchRow, branchIndex) => ({
      id: branchRow.dataset.id || `branch-component-${branchIndex + 1}`,
      type: branchRow.querySelector("[data-branch-component-type]").value,
      diameter: Number(branchRow.querySelector("[data-branch-component-diameter]").value),
      thickness: Number(branchRow.querySelector("[data-branch-component-thickness]").value),
      length: Math.max(1, Number(branchRow.querySelector("[data-branch-component-length]").value) || 1),
      direction: branchRow.querySelector("[data-branch-component-direction]").value
    })),
    direction: row.querySelector("[data-combination-direction]").value
  }));
}

function getCombinationConfig() {
  return {
    productType: "组合件",
    customerName: fields.customerName.value.trim() || "未填写",
    quoteNo: fields.quoteNo.value.trim(),
    material: fields.material.value,
    tubeSeries: fields.tubeSeries.value,
    fittingA: fields.combinationFittingA.value,
    fittingB: fields.combinationFittingB.value,
    components: readCombinationRows(),
    dimensionOverrides,
    quantity: Math.max(1, Number(fields.quantity.value) || 1),
    surfaceTreatment: fields.surfaceTreatment.value,
    difficultyFactorInput: "",
    steelTonPrice: Math.max(0, Number(fields.steelTonPrice.value) || 0),
    costRate: Math.max(0.01, Number(fields.profitRate.value) || 68) / 100,
    faceDiscountRate: Math.max(0.01, Number(fields.taxRate.value) || 17) / 100,
    freight: Math.max(0, Number(fields.freight.value) || 0)
  };
}

function combinationDefaultLength(type, diameter) {
  if (type === "45°弯头") return productDefaultLength("弯头类", diameter, 45);
  if (type === "90°弯头") return productDefaultLength("弯头类", diameter, 90);
  if (type === "三通") return productDefaultLength("三通类", diameter);
  return 100;
}

function combinationRowHtml(component, index) {
  const diameters = fittingSettingDiameters(currentTubeSeries());
  const thicknesses = seriesThicknesses();
  const diameter = diameters.includes(Number(component.diameter)) ? Number(component.diameter) : diameters[0];
  const thickness = thicknesses.includes(Number(component.thickness)) ? Number(component.thickness) : defaultWallThickness(diameter);
  const branchDiameter = diameters.includes(Number(component.branchDiameter)) ? Number(component.branchDiameter) : diameter;
  const branchThickness = thicknesses.includes(Number(component.branchThickness)) ? Number(component.branchThickness) : defaultWallThickness(branchDiameter);
  const branchFittingDiameter = diameters.includes(Number(component.branchFittingDiameter)) ? Number(component.branchFittingDiameter) : branchDiameter;
  const branchFittings = availableFittings(options.fittingConnections, branchFittingDiameter);
  const branchFitting = branchFittings.includes(component.branchFitting) ? component.branchFitting : branchFittings[0];
  const branchComponentRows = component.branchComponents.map((branchComponent, branchIndex) => combinationBranchRowHtml(
    branchComponent, branchIndex, diameters, thicknesses
  )).join("");
  const teeFields = component.type === "三通" ? `<div class="combination-tee-fields">
      <strong>支口</strong>
      <label><span>支口外径 mm</span>${selectHtml(diameters, branchDiameter, "data-combination-branch-diameter")}</label>
      <label><span>支口壁厚 mm</span>${selectHtml(thicknesses, branchThickness, "data-combination-branch-thickness")}</label>
      <label><span>支口长度 mm</span><input data-combination-branch-length type="number" min="1" step="1" value="${component.branchLength}"></label>
      <label><span>配件外径 mm</span>${selectHtml(diameters, branchFittingDiameter, "data-combination-branch-fitting-diameter")}</label>
      <label><span>支口配件</span>${selectHtml(branchFittings, branchFitting, "data-combination-branch-fitting", fittingLabel)}</label>
      <label><span>中间段</span>${selectHtml(["无", "直管", "中接"], component.branchMiddle, "data-combination-branch-middle")}</label>
      <label class="${component.branchMiddle === "直管" ? "" : "is-disabled"}"><span>直管长度 mm</span><input data-combination-branch-middle-length type="number" min="1" step="1" value="${component.branchMiddleLength}" ${component.branchMiddle === "直管" ? "" : "disabled"}></label>
      <div class="combination-branch-chain">
        <div class="combination-branch-chain-head">
          <div><strong>支路组件</strong><span>位于支口与末端配件之间</span></div>
          ${selectHtml(CombinationCore.BRANCH_TYPES, "直管", "data-branch-add-type")}
          <button type="button" class="secondary-button" data-combination-branch-add>添加</button>
        </div>
        <div class="combination-branch-list">${branchComponentRows || '<p class="combination-branch-empty">暂未添加，支口直接连接末端配件</p>'}</div>
      </div>
    </div>` : "";
  return `<div class="combination-row" data-id="${component.id}" data-type="${component.type}">
    <div class="combination-row-head">
      <span class="combination-index">${index + 1}</span>
      ${selectHtml(CombinationCore.TYPES, component.type, "data-combination-type")}
      <div class="combination-actions">
        <button type="button" data-combination-move="up" title="前移" aria-label="前移">↑</button>
        <button type="button" data-combination-move="down" title="后移" aria-label="后移">↓</button>
        <button type="button" data-combination-remove title="删除" aria-label="删除">×</button>
      </div>
    </div>
    <div class="combination-main-fields">
      <label><span>外径 mm</span>${selectHtml(diameters, diameter, "data-combination-diameter")}</label>
      <label><span>壁厚 mm</span>${selectHtml(thicknesses, thickness, "data-combination-thickness")}</label>
      <label><span>长度/中心高 mm</span><input data-combination-length type="number" min="1" step="1" value="${component.length}"></label>
      <label><span>转向/支口方向</span>${selectHtml(["左", "右"], component.direction, "data-combination-direction")}</label>
    </div>
    ${teeFields}
  </div>`;
}

function combinationBranchRowHtml(component, index, diameters, thicknesses) {
  const diameter = diameters.includes(Number(component.diameter)) ? Number(component.diameter) : diameters[0];
  const thickness = thicknesses.includes(Number(component.thickness)) ? Number(component.thickness) : defaultWallThickness(diameter);
  return `<div class="combination-branch-component" data-id="${component.id}">
    <div class="combination-branch-component-head">
      <span>${index + 1}</span>
      ${selectHtml(CombinationCore.BRANCH_TYPES, component.type, "data-branch-component-type")}
      <div class="combination-actions">
        <button type="button" data-branch-component-move="up" title="前移">↑</button>
        <button type="button" data-branch-component-move="down" title="后移">↓</button>
        <button type="button" data-branch-component-remove title="删除">×</button>
      </div>
    </div>
    <div class="combination-branch-component-fields">
      <label><span>外径 mm</span>${selectHtml(diameters, diameter, "data-branch-component-diameter")}</label>
      <label><span>壁厚 mm</span>${selectHtml(thicknesses, thickness, "data-branch-component-thickness")}</label>
      <label><span>长度/中心高 mm</span><input data-branch-component-length type="number" min="1" step="1" value="${component.length}"></label>
      <label><span>弯头方向</span>${selectHtml(["左", "右"], component.direction, "data-branch-component-direction")}</label>
    </div>
  </div>`;
}

function renderCombinationRows(items) {
  const components = CombinationCore.normalizeComponents(items);
  fields.combinationRows.innerHTML = components.map(combinationRowHtml).join("");
}

function syncCombinationRules(changedId) {
  if (!fields.combinationRows.children.length) renderCombinationRows();
  if (changedId === "tubeSeries") {
    renderCombinationRows(readCombinationRows().map(item => ({
      ...item,
      diameter: equivalentSeriesDiameter(item.diameter, fields.tubeSeries.value) || item.diameter,
      branchDiameter: equivalentSeriesDiameter(item.branchDiameter, fields.tubeSeries.value) || item.branchDiameter,
      branchFittingDiameter: equivalentSeriesDiameter(item.branchFittingDiameter, fields.tubeSeries.value) || item.branchFittingDiameter,
      branchComponents: item.branchComponents.map(branchComponent => ({
        ...branchComponent,
        diameter: equivalentSeriesDiameter(branchComponent.diameter, fields.tubeSeries.value) || branchComponent.diameter
      }))
    })));
  }
  const components = readCombinationRows();
  const diameterA = components[0]?.diameter || 40;
  const diameterB = components[components.length - 1]?.diameter || diameterA;
  fillSelect(fields.combinationFittingA, availableFittings(options.fittingConnections, diameterA));
  fillSelect(fields.combinationFittingB, availableFittings(options.fittingConnections, diameterB));
}

function getDockingConfig() {
  const diameterA = Number(fields.productDiameterA.value);
  const diameterB = Number(fields.productDiameterB.value);
  const middlePipeDiameter = Number(fields.productMiddleDiameter.value) || Math.max(diameterA, diameterB);
  const middlePipeThickness = Number(fields.productMiddleThickness.value) || defaultWallThickness(middlePipeDiameter);
  const thicknessA = Number(fields.productThicknessA.value);
  const thicknessB = Number(fields.productThicknessB.value);
  const middleItems = readDockingMiddleRows();
  const directLength = middleItems
    .filter(item => item.type === "直管")
    .reduce((sum, item) => sum + item.length, 0);
  const adapterItems = middleItems.filter(item => item.type === "中接");
  const joinMode = middleItems.length === 0 ? "无中间" : middleItems.length === 1 ? middleItems[0].type : "组合";
  return {
    productType: "对接类",
    customerName: fields.customerName.value.trim() || "未填写",
    quoteNo: fields.quoteNo.value.trim(),
    material: fields.material.value,
    tubeSeries: fields.tubeSeries.value,
    diameterA,
    diameterB,
    thicknessA,
    thicknessB,
    middlePipeDiameter,
    middlePipeThickness,
    diameter: Math.max(diameterA, diameterB),
    thickness: Math.max(thicknessA, thicknessB),
    length: directLength,
    joinMode,
    middleFitting: adapterItems[0]?.fitting || "直管",
    middleItems,
    totalLengthRequirement: Math.max(0, Number(fields.productTotalLength.value) || 0),
    fittingA: fields.productFittingA.value,
    fittingB: fields.productFittingB.value,
    processFactor: Math.max(0, Number(fields.productProcessFactor.value) || 1),
    quantity: Math.max(1, Number(fields.quantity.value) || 1),
    surfaceTreatment: fields.surfaceTreatment.value,
    difficultyFactorInput: fields.difficultyFactor.dataset.manual === "true" ? fields.difficultyFactor.value.trim() : "",
    steelTonPrice: Math.max(0, Number(fields.steelTonPrice.value) || 0),
    costRate: Math.max(0.01, Number(fields.profitRate.value) || 68) / 100,
    faceDiscountRate: Math.max(0.01, Number(fields.taxRate.value) || 17) / 100,
    freight: Math.max(0, Number(fields.freight.value) || 0)
  };
}

function readDockingMiddleRows() {
  const middleDiameter = Number(fields.productMiddleDiameter.value)
    || Math.max(Number(fields.productDiameterA.value), Number(fields.productDiameterB.value));
  const middleThickness = Number(fields.productMiddleThickness.value) || defaultWallThickness(middleDiameter);
  const rows = [];
  const sideItem = (type, length) => {
    if (!type || type === "无") return null;
    return {
      type,
      fitting: type === "中接" ? "中接" : "直管",
      diameter: middleDiameter,
      thickness: middleThickness,
      length: type === "直管" ? Math.max(0, Number(length) || 0) : 0
    };
  };
  const sideA = sideItem(fields.productMiddleA?.value, fields.productMiddleLengthA?.value);
  const sideB = sideItem(fields.productMiddleB?.value, fields.productMiddleLengthB?.value);
  if (sideA) rows.push(sideA);
  const fixedLength = fittingLengthMm(fields.productFittingA.value, Number(fields.productDiameterA.value))
    + fittingLengthMm(fields.productFittingB.value, Number(fields.productDiameterB.value));
  const sideItems = [sideA, sideB].filter(Boolean);
  const reducerLength = sideItems
    .filter(item => item.type === "中接")
    .reduce((sum, item) => sum + fittingLengthMm("中接", Math.max(middleDiameter, Number(fields.productDiameterA.value), Number(fields.productDiameterB.value))), 0);
  const sideStraightLength = sideItems
    .filter(item => item.type === "直管")
    .reduce((sum, item) => sum + item.length, 0);
  const totalLengthRequirement = Math.max(0, Number(fields.productTotalLength.value) || 0);
  const centerStraightLength = Math.max(0, totalLengthRequirement - fixedLength - reducerLength - sideStraightLength);
  if (centerStraightLength > 0) {
    rows.push({
      type: "直管",
      fitting: "直管",
      diameter: middleDiameter,
      thickness: middleThickness,
      length: centerStraightLength
    });
  }
  if (sideB) rows.push(sideB);
  return rows;
}

function setDockingMiddleType(row, type) {
  const select = row?.querySelector?.("[data-middle-type]");
  if (!select) return;
  select.value = type;
  const lengthLabel = Array.from(row.querySelectorAll("label")).find(label => label.querySelector("[data-middle-length]"));
  const hiddenLength = row.querySelector("input[type='hidden'][data-middle-length]");
  if (lengthLabel) lengthLabel.hidden = type === "中接";
  if (hiddenLength) hiddenLength.disabled = type === "直管";
}

function syncDockingMiddleRows() {
  fields.productMiddlePanel.hidden = !fields.productHasMiddle.checked;
  if (!fields.productHasMiddle.checked) {
    fields.productMiddleRows.innerHTML = "";
    return;
  }
  if (Number(fields.productMiddleCount.value) === 0) {
    fields.productMiddleCount.value = "1";
  }
  const count = clamp(Math.round(Number(fields.productMiddleCount.value) || 1), 1, 3);
  fields.productMiddleCount.value = String(count);
  const existing = readDockingMiddleRows();
  fields.productMiddleRows.style.setProperty("--middle-count", Math.max(1, count));
  fields.productMiddleRows.innerHTML = Array.from({ length: count }, (_, index) => {
    const old = existing[index] || {};
    const type = old.type || "直管";
    const length = old.length || productDefaultLength("对接类", Math.max(Number(fields.productDiameterA.value), Number(fields.productDiameterB.value)));
    return `
      <div class="middle-row">
        <strong>中间 ${index + 1}</strong>
        <label>
          <span>类型</span>
          <select data-middle-type>
            <option value="直管" ${type === "直管" ? "selected" : ""}>直管</option>
            <option value="中接" ${type === "中接" ? "selected" : ""}>中接</option>
          </select>
        </label>
        <label ${type === "中接" ? "hidden" : ""}>
          <span>直管长度 mm</span>
          <input data-middle-length type="number" min="0" step="1" value="${length}">
        </label>
        <input data-middle-length type="hidden" value="${length}" ${type === "直管" ? "disabled" : ""}>
      </div>
    `;
  }).join("");
  fields.productMiddleRows.querySelectorAll("select,input").forEach(control => {
    control.addEventListener("input", scheduleUpdate);
    control.addEventListener("change", scheduleUpdate);
  });
}

function syncProductRules(changedId, skipDockingMiddleRows = false) {
  syncMaterialSteelPrice(changedId);

  const diameters = fittingSettingDiameters(fields.tubeSeries.value);
  const thicknesses = seriesThicknesses();
  const previousDiameters = {
    product: Number(fields.productDiameter.value),
    productA: Number(fields.productDiameterA.value),
    productB: Number(fields.productDiameterB.value),
    productMiddle: Number(fields.productMiddleDiameter.value),
    teeBody: Number(fields.teeBodyDiameter.value),
    teeA: Number(fields.teeDiameterA.value),
    teeB: Number(fields.teeDiameterB.value),
    teeC: Number(fields.teeDiameterC.value),
    elbowBody: Number(fields.elbowBodyDiameter.value),
    elbowA: Number(fields.elbowDiameterA.value),
    elbowB: Number(fields.elbowDiameterB.value)
  };
  const stableDiameter = value => stableSeriesDiameter(value, diameters, fields.tubeSeries.value);

  fillSelect(fields.productDiameterA, diameters);
  fillSelect(fields.productDiameterB, diameters);
  fillSelect(fields.productMiddleDiameter, diameters);
  fillSelect(fields.productThicknessA, thicknesses);
  fillSelect(fields.productThicknessB, thicknesses);
  fillSelect(fields.productMiddleThickness, thicknesses);
  if (changedId === "tubeSeries" || !fields.productDiameterA.value) {
    fields.productDiameterA.value = String(stableDiameter(previousDiameters.productA));
  }
  if (changedId === "tubeSeries" || !fields.productDiameterB.value) {
    fields.productDiameterB.value = String(stableDiameter(previousDiameters.productB));
  }
  if (changedId === "tubeSeries" || !fields.productMiddleDiameter.value) {
    fields.productMiddleDiameter.value = String(stableDiameter(previousDiameters.productMiddle));
  }
  if (changedId === "productDiameterA" || changedId === "tubeSeries" || !fields.productThicknessA.value) {
    fields.productThicknessA.value = String(defaultWallThickness(Number(fields.productDiameterA.value)));
  }
  if (changedId === "productDiameterB" || changedId === "tubeSeries" || !fields.productThicknessB.value) {
    fields.productThicknessB.value = String(defaultWallThickness(Number(fields.productDiameterB.value)));
  }
  if (changedId === "productMiddleDiameter" || changedId === "tubeSeries" || !fields.productMiddleThickness.value) {
    fields.productMiddleThickness.value = String(defaultWallThickness(Number(fields.productMiddleDiameter.value)));
  }
  fillSelect(fields.productFittingA, availableFittings(options.fittingConnections, Number(fields.productDiameterA.value)));
  fillSelect(fields.productFittingB, availableFittings(options.fittingConnections, Number(fields.productDiameterB.value)));
  if (fields.productType.value === "对接类" && !skipDockingMiddleRows) {
    fillSelect(fields.productMiddleA, ["无", "直管", "中接"]);
    fillSelect(fields.productMiddleB, ["无", "直管", "中接"]);
    const middleDiameter = Number(fields.productMiddleDiameter.value);
    const middleThickness = Number(fields.productMiddleThickness.value) || defaultWallThickness(middleDiameter);
    const middleAuto = ProductFormRulesCore.dockingSideMiddleAutoState({
      diameterA: fields.productDiameterA.value,
      thicknessA: fields.productThicknessA.value,
      diameterB: fields.productDiameterB.value,
      thicknessB: fields.productThicknessB.value,
      middleDiameter,
      middleThickness,
      changedId,
      touched: dockingMiddleTouched,
      currentMiddleA: fields.productMiddleA.value,
      currentMiddleB: fields.productMiddleB.value
    });
    if (middleAuto.changed) {
      fields.productMiddleA.value = middleAuto.middleA;
      fields.productMiddleB.value = middleAuto.middleB;
    }
    syncDockingSideMiddleLengthFields();
  }
  applyDockingTotalLengthRequirement();

  fillSelect(fields.productDiameter, diameters);
  if (changedId === "tubeSeries" || !fields.productDiameter.value) {
    fields.productDiameter.value = String(stableDiameter(previousDiameters.product));
  }
  fillSelect(fields.productThickness, thicknesses);
  if (changedId === "productDiameter" || changedId === "tubeSeries" || !fields.productThickness.value) {
    fields.productThickness.value = String(defaultWallThickness(Number(fields.productDiameter.value)));
  }
  if (fields.productType.value === "弯头类" && (changedId === "productDiameter" || changedId === "tubeSeries")) {
    fields.productDiameterA.value = fields.productDiameter.value;
    fields.productDiameterB.value = fields.productDiameter.value;
    fields.productThicknessA.value = fields.productThickness.value;
    fields.productThicknessB.value = fields.productThickness.value;
  }
  if (!fields.productLength.value || changedId === "productDiameter" || changedId === "productAngle" || changedId === "productType") {
    fields.productLength.value = String(productDefaultLength(fields.productType.value, Number(fields.productDiameter.value), fields.productAngle?.value));
  }
  const productDiameter = Number(fields.productDiameter.value);
  fillSelect(fields.productGenericFittingA, availableFittings(options.fittingConnections, productDiameter));
  fillSelect(fields.productGenericFittingB, availableFittings(options.fittingConnections, productDiameter));
  fillSelect(fields.productFittingC, availableFittings(options.fittingConnections, productDiameter));

  [
    { suffix: "A", diameter: fields.teeDiameterA, thickness: fields.teeThicknessA, fitting: fields.teeFittingA },
    { suffix: "B", diameter: fields.teeDiameterB, thickness: fields.teeThicknessB, fitting: fields.teeFittingB },
    { suffix: "C", diameter: fields.teeDiameterC, thickness: fields.teeThicknessC, fitting: fields.teeFittingC }
  ].forEach(({ suffix, diameter, thickness, fitting }) => {
    const previousDiameter = previousDiameters[`tee${suffix}`];
    fillSelect(diameter, diameters);
    if (changedId === "tubeSeries" || !diameter.value) {
      diameter.value = String(stableDiameter(previousDiameter));
    }
    fillSelect(thickness, thicknesses);
    if (changedId === `teeDiameter${suffix}` || changedId === "tubeSeries" || !thickness.value) {
      thickness.value = String(defaultWallThickness(Number(diameter.value)));
    }
    fillSelect(fitting, teeAvailableFittings(Number(diameter.value)));
  });

  if (fields.productType.value === "弯头类") {
    fillSelect(fields.elbowBodyDiameter, diameters);
    if (changedId === "tubeSeries" || !fields.elbowBodyDiameter.value) {
      fields.elbowBodyDiameter.value = String(stableDiameter(previousDiameters.elbowBody));
    }
    fillSelect(fields.elbowBodyThickness, thicknesses);
    if (changedId === "elbowBodyDiameter" || changedId === "tubeSeries" || !fields.elbowBodyThickness.value) {
      fields.elbowBodyThickness.value = String(defaultWallThickness(Number(fields.elbowBodyDiameter.value)));
    }
    [
      { suffix: "A", diameter: fields.elbowDiameterA, thickness: fields.elbowThicknessA, fitting: fields.elbowFittingA },
      { suffix: "B", diameter: fields.elbowDiameterB, thickness: fields.elbowThicknessB, fitting: fields.elbowFittingB }
    ].forEach(({ suffix, diameter, thickness, fitting }) => {
      const previousDiameter = previousDiameters[`elbow${suffix}`];
      fillSelect(diameter, diameters);
      if (changedId === "tubeSeries" || changedId === "elbowBodyDiameter" || !diameter.value) {
        diameter.value = changedId === "tubeSeries" ? String(stableDiameter(previousDiameter)) : fields.elbowBodyDiameter.value;
      }
      fillSelect(thickness, thicknesses);
      if (changedId === `elbowDiameter${suffix}` || changedId === "elbowBodyDiameter" || changedId === "tubeSeries" || !thickness.value) {
        thickness.value = String(defaultWallThickness(Number(diameter.value)));
      }
      fillSelect(fitting, elbowAvailableFittings(Number(diameter.value)));
    });
    fillSelect(fields.elbowMiddleA, ["无", "直管", "中接"]);
    fillSelect(fields.elbowMiddleB, ["无", "直管", "中接"]);
    const bodyDiameter = Number(fields.elbowBodyDiameter.value);
    fields.elbowMiddleA.value = ProductFormRulesCore.elbowSideMiddleValue({
      changedId,
      side: "A",
      sideDiameter: fields.elbowDiameterA.value,
      bodyDiameter,
      currentMiddle: fields.elbowMiddleA.value
    });
    fields.elbowMiddleB.value = ProductFormRulesCore.elbowSideMiddleValue({
      changedId,
      side: "B",
      sideDiameter: fields.elbowDiameterB.value,
      bodyDiameter,
      currentMiddle: fields.elbowMiddleB.value
    });
    if (!fields.productLength.value || changedId === "elbowBodyDiameter" || changedId === "productAngle" || changedId === "productType") {
      fields.productLength.value = String(productDefaultLength("弯头类", bodyDiameter, fields.productAngle.value));
    }
  }

  fillSelect(fields.teeBodyDiameter, diameters);
  if (changedId === "tubeSeries" || !fields.teeBodyDiameter.value) {
    const maxTeeDiameter = Math.max(Number(fields.teeDiameterA.value) || 0, Number(fields.teeDiameterB.value) || 0, Number(fields.teeDiameterC.value) || 0);
    const teeBodyDiameter = Number(previousDiameters.teeBody || maxTeeDiameter);
    fields.teeBodyDiameter.value = String(diameters.includes(teeBodyDiameter) ? teeBodyDiameter : closestDiameter(teeBodyDiameter, diameters));
  }
  fillSelect(fields.teeBodyThickness, thicknesses);
  if (changedId === "teeBodyDiameter" || changedId === "tubeSeries" || !fields.teeBodyThickness.value) {
    fields.teeBodyThickness.value = String(defaultWallThickness(Number(fields.teeBodyDiameter.value)));
  }
  if (changedId === "teeBodyDiameter" || changedId === "tubeSeries" || (!fields.teeBodyLength.value && !teeBodyLengthTouched)) {
    fields.teeBodyLength.value = String(productDefaultLength("三通类", Number(fields.teeBodyDiameter.value)));
    teeBodyLengthTouched = false;
  }
  if (fields.productType.value === "三通类") {
    const bodyDiameter = Number(fields.teeBodyDiameter.value);
    if (changedId === "teeBodyDiameter" || changedId === "tubeSeries") {
      [
        { field: fields.teeDiameterA, previous: previousDiameters.teeA },
        { field: fields.teeDiameterB, previous: previousDiameters.teeB },
        { field: fields.teeDiameterC, previous: previousDiameters.teeC }
      ].forEach(({ field, previous }) => {
        field.value = String(changedId === "tubeSeries" ? stableDiameter(previous) : bodyDiameter);
      });
      [
        { diameter: fields.teeDiameterA, thickness: fields.teeThicknessA },
        { diameter: fields.teeDiameterB, thickness: fields.teeThicknessB },
        { diameter: fields.teeDiameterC, thickness: fields.teeThicknessC }
      ].forEach(({ diameter, thickness }) => {
        thickness.value = String(defaultWallThickness(Number(diameter.value)));
      });
      fillSelect(fields.teeFittingA, teeAvailableFittings(Number(fields.teeDiameterA.value)));
      fillSelect(fields.teeFittingB, teeAvailableFittings(Number(fields.teeDiameterB.value)));
      fillSelect(fields.teeFittingC, teeAvailableFittings(Number(fields.teeDiameterC.value)));
      fields.teeMiddleA.value = "无";
      fields.teeMiddleB.value = "无";
      fields.teeMiddleC.value = "无";
    }
    fields.teeMiddleA.value = ProductFormRulesCore.teeSideMiddleValue({
      changedId,
      side: "A",
      sideDiameter: fields.teeDiameterA.value,
      bodyDiameter,
      currentMiddle: fields.teeMiddleA.value
    });
    fields.teeMiddleC.value = ProductFormRulesCore.teeSideMiddleValue({
      changedId,
      side: "C",
      sideDiameter: fields.teeDiameterC.value,
      bodyDiameter,
      currentMiddle: fields.teeMiddleC.value
    });
    const teeBMiddle = ProductFormRulesCore.teeBMiddleForFitting({
      changedId,
      fittingB: fields.teeFittingB.value,
      currentMiddleB: fields.teeMiddleB.value,
      currentLengthB: fields.teeMiddleLengthB.value
    });
    fields.teeMiddleB.value = teeBMiddle.middleB;
    fields.teeMiddleLengthB.value = teeBMiddle.lengthB;
  }
}

function readBranchRows() {
  return Array.from(fields.branchRows.querySelectorAll(".branch-row")).map((row, index, rows) => {
    const fitting = row.querySelector("[data-branch-fitting]").value;
    return {
      diameter: Number(row.querySelector("[data-branch-diameter]").value),
      thickness: Number(row.querySelector("[data-branch-thickness]").value),
      positiveTolerance: row.querySelector("[data-branch-positive]").checked,
      fitting,
      height: normalizeBranchHeight(fitting, Number(row.querySelector("[data-branch-height]").value), 0),
      side: row.querySelector("[data-branch-side]")?.value === "下" ? "下" : row.querySelector("[data-branch-side]")?.value === "上" ? "上" : "",
      spacingAfter: index < rows.length - 1 ? Number(row.querySelector("[data-branch-spacing]").value) : 0
    };
  });
}

function uniformBranches(count) {
  return Array.from({ length: count }, (_, index) => ({
    diameter: Number(fields.branchDiameter.value),
    thickness: Number(fields.branchThickness.value),
    positiveTolerance: fields.branchPositiveTolerance.checked,
    fitting: fields.branchFitting.value,
    height: Number(fields.branchHeight.value),
    side: "",
    spacingAfter: index < count - 1 ? Number(fields.branchSpacing.value) : 0
  }));
}

function getConfig() {
  if (!isManifoldType()) return ConfigCore.normalizeConfig(getProductConfig());

  const branchCount = Number(fields.branchCount.value);
  const branches = fields.customBranches.checked ? readBranchRows() : uniformBranches(branchCount);

  return ConfigCore.normalizeConfig({
    customerName: fields.customerName.value.trim() || "未填写",
    quoteNo: fields.quoteNo.value.trim(),
    material: fields.material.value,
    tubeSeries: fields.tubeSeries.value,
    manifoldType: fields.manifoldType.value,
    mainDiameter: Number(fields.mainDiameter.value),
    wallThickness: Number(fields.wallThickness.value),
    mainPositiveTolerance: fields.mainPositiveTolerance.checked,
    branchDiameter: Number(fields.branchDiameter.value),
    branchThickness: Number(fields.branchThickness.value),
    branchPositiveTolerance: fields.branchPositiveTolerance.checked,
    branchCount,
    branchSpacing: Number(fields.branchSpacing.value),
    branchHeight: Number(fields.branchHeight.value),
    inletAllowance: Math.max(0, Number(fields.inletAllowance.value) || 0),
    tailAllowance: Math.max(0, Number(fields.tailAllowance.value) || 0),
    mainFitting: fields.mainFitting.value,
    mainFittingDiameter: Number(fields.mainFittingDiameter.value),
    mainAdapterEnabled: fields.mainAdapterEnabled.checked,
    branchFitting: fields.branchFitting.value,
    tailFitting: fields.tailFitting.value,
    tailFittingDiameter: Number(fields.tailFittingDiameter.value),
    tailAdapterEnabled: fields.tailAdapterEnabled.checked,
    customBranches: fields.customBranches.checked,
    branches,
    quantity: Math.max(1, Number(fields.quantity.value) || 1),
    surfaceTreatment: fields.surfaceTreatment.value,
    difficultyFactorInput: fields.difficultyFactor.dataset.manual === "true" ? fields.difficultyFactor.value.trim() : "",
    steelTonPrice: Math.max(0, Number(fields.steelTonPrice.value) || 0),
    costRate: Math.max(0.01, Number(fields.profitRate.value) || 68) / 100,
    faceDiscountRate: Math.max(0.01, Number(fields.taxRate.value) || 17) / 100,
    freight: Math.max(0, Number(fields.freight.value) || 0)
  });
}

function calculate(config) {
  if (config.productType === "组合件") return calculateCombination(config);
  if (config.productType === "对接类") return calculateDocking(config);
  if (config.productType === "三通类") return calculateTee(config);
  if (config.productType === "弯头类") return calculateElbow(config);
  if (!isManifoldType(config.productType)) {
    throw new Error(`不支持的产品类型：${config.productType}`);
  }

  const result = ProductQuoteCore.calculateManifold(config, pricing, {
    branchLayout: LayoutCore.branchLayout,
    finalizeCost,
    elbowProcessCost,
    fittingCost,
    ...quoteTubeHelpers(),
    weightWallThickness: QuoteCore.weightWallThickness
  });
  return withQuoteValidation(config, result, CostDetailCore.manifoldRows(config, result, pricing, costDetailHelpers()));
}

function singleCombinationReference(config) {
  const components = CombinationCore.normalizeComponents(config.components);
  if (components.length !== 1) return null;
  const component = components[0];
  const common = {
    ...config,
    processFactor: 1,
    difficultyFactorInput: ""
  };
  const quoteHelpers = {
    dockingProcessCost,
    elbowProcessCost,
    finalizeCost,
    fittingCost,
    fittingTheoreticalWeightKg,
    heatTreatmentFittingWeightKg,
    teeProcessCost,
    ...quoteTubeHelpers()
  };

  if (component.type === "直管") {
    const referenceConfig = {
      ...common,
      productType: "对接类",
      diameter: component.diameter,
      thickness: component.thickness,
      diameterA: component.diameter,
      thicknessA: component.thickness,
      diameterB: component.diameter,
      thicknessB: component.thickness,
      middleItems: [{ type: "直管", length: component.length }]
    };
    const result = ProductQuoteCore.calculateDocking(referenceConfig, pricing, quoteHelpers);
    return { referenceConfig, result, type: "对接类", costRows: CostDetailCore.dockingRows(referenceConfig, result, pricing, costDetailHelpers()) };
  }

  if (component.type === "45°弯头" || component.type === "90°弯头") {
    const referenceConfig = {
      ...common,
      productType: "弯头类",
      angle: component.type === "45°弯头" ? 45 : 90,
      length: component.length,
      bodyDiameter: component.diameter,
      bodyThickness: component.thickness,
      diameterA: component.diameter,
      thicknessA: component.thickness,
      diameterB: component.diameter,
      thicknessB: component.thickness,
      middleA: "无",
      middleB: "无",
      middleLengthA: 0,
      middleLengthB: 0
    };
    const result = ProductQuoteCore.calculateElbow(referenceConfig, pricing, quoteHelpers);
    return { referenceConfig, result, type: "弯头类", costRows: CostDetailCore.elbowRows(referenceConfig, result, pricing, costDetailHelpers()) };
  }

  const noBranchChain = (component.branchComponents || []).length === 0;
  const isStandardTee = component.type === "三通" && noBranchChain && component.branchMiddle !== "中接"
    && component.branchDiameter === component.branchFittingDiameter;
  if (isStandardTee) {
    const referenceConfig = {
      ...common,
      productType: "三通类",
      bodyDiameter: component.diameter,
      bodyThickness: component.thickness,
      bodyLength: component.length,
      diameterA: component.diameter,
      thicknessA: component.thickness,
      diameterB: component.branchDiameter,
      thicknessB: component.branchThickness,
      diameterC: component.diameter,
      thicknessC: component.thickness,
      fittingA: config.fittingA,
      fittingB: component.branchFitting,
      fittingC: config.fittingB,
      middleA: "无",
      middleB: component.branchMiddle,
      middleC: "无",
      middleLengthB: component.branchMiddle === "直管" ? component.branchMiddleLength : 0
    };
    const result = ProductQuoteCore.calculateTee(referenceConfig, pricing, quoteHelpers);
    return { referenceConfig, result, type: "三通类", costRows: CostDetailCore.teeRows(referenceConfig, result, pricing, costDetailHelpers()) };
  }
  return null;
}

function calculateCombination(config) {
  const reference = singleCombinationReference(config);
  const result = CombinationCore.calculate(config, pricing, {
    dockingProcessCost,
    elbowProcessCost,
    finalizeCost,
    fittingCost,
    fittingTheoreticalWeightKg,
    heatTreatmentFittingWeightKg,
    isNoFitting,
    teeProcessCost,
    ...quoteTubeHelpers()
  });
  if (reference) {
    const combined = {
      ...result,
      ...reference.result,
      geometry: result.geometry,
      bomRows: result.bomRows,
      costRows: [["单组件标准计价", `当前仅含 1 个组件，已按${reference.type}的材料、加工、退火、管理及包材规则计算`, ""], ...reference.costRows],
      pricingReferenceType: reference.type
    };
    return withQuoteValidation(config, combined, combined.costRows);
  }
  return withQuoteValidation(config, result, CostDetailCore.combinationRows(config, result, pricing, {
      ...costDetailHelpers(),
      teeProcessCost,
      ...quoteTubeHelpers()
    }));
}

function calculateElbow(config) {
  const result = ProductQuoteCore.calculateElbow(config, pricing, {
    elbowProcessCost,
    finalizeCost,
    fittingCost,
    fittingTheoreticalWeightKg,
    heatTreatmentFittingWeightKg,
    ...quoteTubeHelpers()
  });
  return withQuoteValidation(config, result, CostDetailCore.elbowRows(config, result, pricing, costDetailHelpers()));
}

function calculateTee(config) {
  const result = ProductQuoteCore.calculateTee(config, pricing, {
    finalizeCost,
    fittingCost,
    fittingTheoreticalWeightKg,
    heatTreatmentFittingWeightKg,
    teeProcessCost,
    ...quoteTubeHelpers()
  });
  return withQuoteValidation(config, result, CostDetailCore.teeRows(config, result, pricing, costDetailHelpers()));
}

function calculateDocking(config) {
  const result = ProductQuoteCore.calculateDocking(config, pricing, {
    dockingProcessCost,
    finalizeCost,
    fittingCost,
    fittingTheoreticalWeightKg,
    heatTreatmentFittingWeightKg,
    ...quoteTubeHelpers()
  });
  return withQuoteValidation(config, result, CostDetailCore.dockingRows(config, result, pricing, costDetailHelpers()));
}

function costDetailHelpers() {
  return { fittingCost, fittingCostDetail, fittingLabel, formatFactor, formatNumber, isNoFitting, money, processCostDetail };
}

function quoteTubeHelpers() {
  return {
    tubeMaterialCost: (weightKg, steelTonPrice) => QuoteCore.tubeMaterialCost(weightKg, steelTonPrice, pricing.materialTaxDivisor),
    tubeWeightKg: QuoteCore.tubeWeightKg
  };
}

function teeMiddleFittingItems(config) {
  const items = [];
  if (config.middleA === "中接") items.push({ label: "A端中接", fitting: "中接", diameter: Math.max(config.bodyDiameter || config.diameter, config.diameterA) });
  if (config.middleB === "中接") items.push({ label: "B端中接", fitting: "中接", diameter: Math.max(config.bodyDiameter || config.diameter, config.diameterB) });
  if (config.middleC === "中接") items.push({ label: "C端中接", fitting: "中接", diameter: Math.max(config.bodyDiameter || config.diameter, config.diameterC) });
  return items;
}

function elbowMiddleFittingItems(config) {
  const bodyDiameter = config.bodyDiameter || config.diameter;
  return [
    config.middleA === "中接" ? { label: "A端中接", fitting: "中接", diameter: Math.max(bodyDiameter, config.diameterA) } : null,
    config.middleB === "中接" ? { label: "B端中接", fitting: "中接", diameter: Math.max(bodyDiameter, config.diameterB) } : null
  ].filter(Boolean);
}

function productFittingItems(config) {
  if (isManifoldType(config.productType)) {
    const mainFittingDiameter = config.mainFittingDiameter || config.mainDiameter;
    const tailFittingDiameter = config.tailFittingDiameter || config.mainDiameter;
    return [
      { label: "进水端", fitting: config.mainFitting, diameter: mainFittingDiameter },
      config.mainAdapterEnabled ? { label: "进水端中接", fitting: "中接", diameter: Math.max(config.mainDiameter, mainFittingDiameter) } : null,
      { label: "末尾", fitting: config.tailFitting, diameter: tailFittingDiameter },
      config.tailAdapterEnabled ? { label: "末尾中接", fitting: "中接", diameter: Math.max(config.mainDiameter, tailFittingDiameter) } : null,
      ...(config.branches || []).map((branch, index) => ({ label: `${index + 1}路`, fitting: branch.fitting, diameter: branch.diameter }))
    ].filter(Boolean);
  }
  if (config.productType === "对接类") {
    return [
      { label: "A端", fitting: config.fittingA, diameter: config.diameterA },
      { label: "B端", fitting: config.fittingB, diameter: config.diameterB },
      ...(config.middleItems || [])
        .filter(item => item.type === "中接")
        .map((item, index) => ({ label: `中间${index + 1}`, fitting: "中接", diameter: config.diameter || Math.max(config.diameterA, config.diameterB) }))
    ];
  }
  if (config.productType === "三通类") {
    return [
      { label: "A端", fitting: config.fittingA, diameter: config.diameterA },
      { label: "B端", fitting: config.fittingB, diameter: config.diameterB },
      { label: "C端", fitting: config.fittingC, diameter: config.diameterC },
      ...teeMiddleFittingItems(config)
    ];
  }
  if (config.productType === "弯头类") {
    return [
      { label: "弯头体", fitting: Number(config.angle) === 45 ? "45弯头" : "90弯头", diameter: config.bodyDiameter || config.diameter, length: false },
      { label: "A端", fitting: config.fittingA, diameter: config.diameterA },
      { label: "B端", fitting: config.fittingB, diameter: config.diameterB },
      ...elbowMiddleFittingItems(config)
    ];
  }
  if (config.productType === "组合件") {
    const components = CombinationCore.normalizeComponents(config.components || []);
    const firstDiameter = components[0]?.diameter || 40;
    const lastDiameter = components[components.length - 1]?.diameter || firstDiameter;
    const items = [
      { label: "A端", fitting: config.fittingA, diameter: firstDiameter },
      { label: "B端", fitting: config.fittingB, diameter: lastDiameter }
    ];
    components.forEach((component, index) => {
      if (component.type === "45°弯头" || component.type === "90°弯头") {
        items.push({ label: `${index + 1}段`, fitting: component.type === "45°弯头" ? "45弯头" : "90弯头", diameter: component.diameter, length: false });
      }
      if (component.type === "三通") {
        items.push({ label: `${index + 1}段支口`, fitting: component.branchFitting, diameter: component.branchFittingDiameter });
        if (component.branchMiddle === "中接") {
          const branchOutlet = component.branchComponents?.[component.branchComponents.length - 1];
          items.push({ label: `${index + 1}段支口中接`, fitting: "中接", diameter: Math.max(branchOutlet?.diameter || component.branchDiameter, component.branchFittingDiameter) });
        }
        (component.branchComponents || []).forEach((branchComponent, branchIndex) => {
          if (branchComponent.type === "45°弯头" || branchComponent.type === "90°弯头") {
            items.push({ label: `${index + 1}.${branchIndex + 1}支路`, fitting: branchComponent.type === "45°弯头" ? "45弯头" : "90弯头", diameter: branchComponent.diameter, length: false });
          }
        });
      }
    });
    return items;
  }
  return [];
}

function productProcessItems(config) {
  if (config.productType === "对接类") {
    return {
      type: "docking",
      items: [
        { label: "A端", fitting: config.fittingA, diameter: config.diameterA },
        { label: "B端", fitting: config.fittingB, diameter: config.diameterB },
        ...(config.middleItems || [])
          .filter(item => item.type === "中接")
          .map((item, index) => ({ label: `中间${index + 1}`, fitting: "中接", diameter: config.diameter || Math.max(config.diameterA, config.diameterB) }))
      ]
    };
  }
  if (config.productType === "三通类") {
    return {
      type: "tee",
      items: [
        { label: "A端", fitting: config.fittingA, diameter: config.diameterA },
        { label: "B端", fitting: config.fittingB, diameter: config.diameterB },
        { label: "C端", fitting: config.fittingC, diameter: config.diameterC },
        ...teeMiddleFittingItems(config)
      ]
    };
  }
  if (config.productType === "弯头类") {
    return {
      type: "elbow",
      items: [
        { label: "A端", fitting: config.fittingA, diameter: config.diameterA },
        { label: "B端", fitting: config.fittingB, diameter: config.diameterB },
        ...elbowMiddleFittingItems(config)
      ]
    };
  }
  if (config.productType === "组合件") {
    return { type: "", items: [] };
  }
  return { type: "", items: [] };
}

function combinationProcessGroups(config) {
  const components = CombinationCore.normalizeComponents(config.components || []);
  const firstDiameter = components[0]?.diameter || 40;
  const lastDiameter = components[components.length - 1]?.diameter || firstDiameter;
  const groups = [{
    type: "docking",
    items: [
      { label: "A端", fitting: config.fittingA, diameter: firstDiameter },
      { label: "B端", fitting: config.fittingB, diameter: lastDiameter }
    ]
  }];
  const teeItems = [];
  const weldItems = [];
  components.forEach((component, index) => {
    if (index < components.length - 1) {
      weldItems.push({
        label: `${index + 1}-${index + 2}连接点`,
        fitting: "对焊",
        diameter: Math.max(component.diameter || 0, components[index + 1]?.diameter || 0)
      });
    }
    if (component.type === "三通") {
      teeItems.push({ label: `${index + 1}段支口`, fitting: component.branchFitting, diameter: component.branchFittingDiameter });
      if (component.branchMiddle === "中接") {
        const branchOutlet = component.branchComponents?.[component.branchComponents.length - 1];
        teeItems.push({ label: `${index + 1}段支口中接`, fitting: "中接", diameter: Math.max(branchOutlet?.diameter || component.branchDiameter, component.branchFittingDiameter) });
      }
    }
  });
  if (teeItems.length) groups.push({ type: "tee", items: teeItems });
  if (weldItems.length) groups.push({ type: "elbow", items: weldItems });
  return groups;
}

function quoteValidationIssues(config) {
  const issues = [];
  productFittingItems(config).forEach(item => validateFittingItem(issues, item, config));
  const processGroups = config.productType === "组合件"
    ? combinationProcessGroups(config)
    : [productProcessItems(config)];
  processGroups.forEach(process => {
    process.items.forEach(item => validateProcessItem(issues, process.type, item, config));
  });
  if (!tableValueExists(pricing.fittingTaxDivisor)) {
    pushUniqueIssue(issues, { type: "含税系数", item: "通用设置", detail: "成本含税系数未配置" });
  }
  if (!tableValueExists(pricing.materialTaxDivisor)) {
    pushUniqueIssue(issues, { type: "去税系数", item: "通用设置", detail: "材料去税系数未配置" });
  }
  return issues;
}

function quoteIssueRows(issues) {
  if (!issues.length) return [];
  return [
    ["报价数据检查", `发现 ${issues.length} 项数据风险，请先核对设置表。`, "", { warning: true }],
    ...issues.map(issue => [`风险：${issue.type}`, issue.detail, issue.item, { warning: true }])
  ];
}

function withQuoteValidation(config, result, costRows) {
  const quoteIssues = quoteValidationIssues(config);
  return {
    ...result,
    quoteIssues,
    costRows: [...quoteIssueRows(quoteIssues), ...(costRows || result.costRows || [])]
  };
}

function selectHtml(values, selected, attrName, formatter = value => value) {
  return `<select ${attrName}>${values.map(value => `
    <option value="${value}" ${String(value) === String(selected) ? "selected" : ""}>${formatter(value)}</option>
  `).join("")}</select>`;
}

function normalizeBranchHeight(fitting, height, fallbackHeight) {
  const value = Number.isFinite(height) ? Math.max(0, height) : Math.max(0, Number(fallbackHeight) || 0);
  if (fitting === "直管" && value < 40) return 40;
  return value;
}

function syncBranchRows() {
  fields.branchEditor.hidden = !fields.customBranches.checked;
  if (!fields.customBranches.checked) return;

  const count = Number(fields.branchCount.value);
  const allowedDiameters = branchOptions(Number(fields.mainDiameter.value));
  const thicknesses = seriesThicknesses();
  const existing = readBranchRows();
  const rows = Array.from({ length: count }, (_, index) => {
    const old = existing[index] || {};
    const diameter = allowedDiameters.includes(old.diameter) ? old.diameter : Number(fields.branchDiameter.value);
    const thickness = thicknesses.includes(old.thickness) ? old.thickness : Number(fields.branchThickness.value);
    const positiveTolerance = old.positiveTolerance ?? fields.branchPositiveTolerance.checked;
    const branchFittings = availableFittings(options.branchFittings, diameter);
    const fallbackFitting = branchFittings.includes(fields.branchFitting.value) ? fields.branchFitting.value : branchFittings[0];
    const fitting = branchFittings.includes(old.fitting) ? old.fitting : fallbackFitting;
    const height = normalizeBranchHeight(fitting, old.height, Number(fields.branchHeight.value));
    const side = old.side === "下" ? "下" : old.side === "上" ? "上" : "自动";
    const spacingAfter = Number(old.spacingAfter) || Number(fields.branchSpacing.value);

    return `
      <div class="branch-row">
        <strong>${index + 1}</strong>
        ${selectHtml(allowedDiameters, diameter, "data-branch-diameter")}
        ${selectHtml(thicknesses, thickness, "data-branch-thickness")}
        <label class="mini-check"><input data-branch-positive type="checkbox" ${positiveTolerance ? "checked" : ""}><span>+0.05</span></label>
        ${selectHtml(branchFittings, fitting, "data-branch-fitting")}
        <input data-branch-height type="number" min="${fitting === "直管" ? 40 : 0}" step="1" list="branchHeightOptions" value="${height}">
        ${selectHtml(["自动", "上", "下"], side, "data-branch-side")}
        <input data-branch-spacing type="text" inputmode="decimal" value="${index < count - 1 ? spacingAfter : ""}" ${index === count - 1 ? "disabled" : ""}>
      </div>
    `;
  }).join("");

  fields.branchRows.innerHTML = rows;
  fields.branchRows.querySelectorAll("select,input").forEach(control => {
    control.addEventListener("input", scheduleUpdate);
    control.addEventListener("change", scheduleUpdate);
  });
}

function syncRules(changedId) {
  if (fields.manifoldType.value === "双排") {
    fields.manifoldType.value = "双排交错";
  }

  const currentBranch = Number(fields.branchDiameter.value);
  const currentMain = Number(fields.mainDiameter.value);
  const diameters = seriesDiameters();
  const thicknesses = seriesThicknesses();
  fillSelect(fields.mainDiameter, diameters);
  if (!diameters.includes(currentMain)) {
    fields.mainDiameter.value = String(equivalentSeriesDiameter(currentMain, fields.tubeSeries.value) || diameters[diameters.length - 1]);
  }
  fillSelect(fields.wallThickness, thicknesses);
  fillSelect(fields.branchThickness, thicknesses);
  if (changedId === "tubeSeries" || !thicknesses.includes(Number(fields.wallThickness.value))) {
    fields.wallThickness.value = String(defaultWallThickness(Number(fields.mainDiameter.value)));
  }
  const mainDiameter = Number(fields.mainDiameter.value);
  const branches = branchOptions(mainDiameter);
  const previousMainFittingDiameter = Number(fields.mainFittingDiameter.value) || mainDiameter;
  const previousTailFittingDiameter = Number(fields.tailFittingDiameter.value) || mainDiameter;
  fillSelect(fields.mainFittingDiameter, diameters);
  fillSelect(fields.tailFittingDiameter, diameters);
  if (changedId === "mainDiameter") {
    fields.mainFittingDiameter.value = String(mainDiameter);
    fields.tailFittingDiameter.value = String(mainDiameter);
  } else {
    fields.mainFittingDiameter.value = String(diameters.includes(previousMainFittingDiameter) ? previousMainFittingDiameter : mainDiameter);
    fields.tailFittingDiameter.value = String(diameters.includes(previousTailFittingDiameter) ? previousTailFittingDiameter : mainDiameter);
  }
  const mainFittingDiameter = Number(fields.mainFittingDiameter.value);
  const tailFittingDiameter = Number(fields.tailFittingDiameter.value);
  const mainFittings = availableFittings(options.mainFittings, mainFittingDiameter);
  const tailFittings = availableFittings(options.tailFittings, tailFittingDiameter);
  fillSelect(fields.mainFitting, mainFittings);
  fillSelect(fields.tailFitting, tailFittings, fittingLabel);
  const canUseMainAdapter = mainFittingDiameter !== mainDiameter && fields.mainFitting.value !== "直管";
  const canUseTailAdapter = tailFittingDiameter !== mainDiameter && fields.tailFitting.value !== "直管";
  fields.mainAdapterEnabled.disabled = !canUseMainAdapter;
  fields.tailAdapterEnabled.disabled = !canUseTailAdapter;
  if (!canUseMainAdapter) fields.mainAdapterEnabled.checked = false;
  if (!canUseTailAdapter) fields.tailAdapterEnabled.checked = false;
  fillSelect(fields.branchDiameter, branches, value => `${value}`);
  if (!branches.includes(currentBranch)) {
    const mappedBranch = equivalentSeriesDiameter(currentBranch, fields.tubeSeries.value);
    fields.branchDiameter.value = String(branches.includes(mappedBranch) ? mappedBranch : branches[0]);
    fields.branchThickness.value = String(defaultWallThickness(Number(fields.branchDiameter.value)));
  }
  const branchDiameter = Number(fields.branchDiameter.value);
  if (changedId === "tubeSeries" || !thicknesses.includes(Number(fields.branchThickness.value))) {
    fields.branchThickness.value = String(defaultWallThickness(branchDiameter));
  }
  const branchFittings = availableFittings(options.branchFittings, branchDiameter);
  fillSelect(fields.branchFitting, branchFittings);
  if (fields.branchFitting.value === "直管" && Number(fields.branchHeight.value) < 40) {
    fields.branchHeight.value = "40";
  }

  if (changedId === "mainDiameter") {
    fields.wallThickness.value = String(defaultWallThickness(mainDiameter));
  }

  if (changedId === "branchDiameter") {
    fields.branchThickness.value = String(defaultWallThickness(branchDiameter));
  }

  syncMaterialSteelPrice(changedId);

  const count = Math.min(20, Math.max(1, Number(fields.branchCount.value) || 1));
  fields.branchCount.value = count;
}

function pipeVisualDiameter(diameter) {
  return Math.max(14, diameter * 0.72);
}

function fittingVisualDependencies() {
  return {
    doubleCardISeries,
    fittingLengthMm,
    fittingPriceDiameter,
    isNoFitting,
    isRingPressLike,
    ringPressISeries
  };
}

function fittingRendererDependencies() {
  return {
    buttWeldPath, capPath, doubleCardPath, doubleCardVisualSize, drawingColors, flangePath,
    flangeVisualWidth, groovePath, innerThreadPath, isNoFitting, isRingPressLike,
    outerThreadPath, ringPressPath, ringPressVisualSize, threadVisualWidth
  };
}

function branchFittingRendererDependencies() {
  return {
    buttWeldPath, doubleCardPath, doubleCardVisualSize, drawingColors, groovePath,
    innerThreadBranchVisualSize, innerThreadPath, outerThreadBranchVisualSize,
    outerThreadPath, ringPressPath, ringPressVisualSize
  };
}

function branchFittingSize(branch, branchWidth) {
  return BranchFittingRenderer.size(branch, branchWidth, branchFittingRendererDependencies());
}

function branchFittingSeatOffset(branch, fittingHeight) {
  return BranchFittingRenderer.seatOffset(branch, fittingHeight);
}

function branchFittingSvg(branch, x, y, branchWidth) {
  return BranchFittingRenderer.render(branch, x, y, branchWidth, branchFittingRendererDependencies());
}

function inletFittingSvg(config, mainLeft, y, height) {
  return FittingRenderer.inlet(config, mainLeft, y, height, fittingRendererDependencies());
}

function tailFittingSvg(config, mainRight, y, height) {
  return FittingRenderer.tail(config, mainRight, y, height, fittingRendererDependencies());
}

function threadVisualLengthFactor(diameter) {
  return FittingVisualCore.threadVisualLengthFactor(diameter);
}

function threadVisualWidth(fitting, diameter, height) {
  return FittingVisualCore.threadVisualWidth(fitting, diameter, height);
}

function inlineFittingSvg(fitting, diameter, x, y, height, side = "left") {
  return FittingRenderer.inline(fitting, diameter, x, y, height, side, fittingRendererDependencies());
}

function verticalInlineFittingSvg(fitting, diameter, x, y, height, side = "top") {
  return FittingRenderer.verticalInline(fitting, diameter, x, y, height, side, fittingRendererDependencies());
}

function inlineFittingLength(fitting, diameter, height) {
  return FittingVisualCore.inlineFittingLength(fitting, diameter, height, fittingVisualDependencies());
}

function inlineFittingEnvelopeHeight(fitting, diameter, height) {
  return FittingVisualCore.inlineFittingEnvelopeHeight(fitting, diameter, height, fittingVisualDependencies());
}




function flangePath(x, y, width, height, fill, stroke) {
  return FittingDrawing.flange(x, y, width, height, fill, stroke, drawingColors.fittingLineWidth);
}

function flangeVisualWidth(diameter, height) {
  return FittingVisualCore.flangeVisualWidth(diameter, height, fittingLengthMm);
}

function reducerSegmentSvg(leftX, rightX, y, leftHeight, rightHeight) {
  return FittingDrawing.reducer(leftX, rightX, y, leftHeight, rightHeight, drawingColors.pipeFill, drawingColors.stroke, drawingColors.objectLineWidth);
}




function elbowRoundBodySvg(startX, startY, endX, endY, width, angle) {
  return ProductGeometryCore.elbowRoundBody(startX, startY, endX, endY, width, angle, drawingColors);
}

function dockingMiddleAssembly(config, leftX, rightX, y) {
  return DockingMiddleRenderer.render(config, leftX, rightX, y, {
    clamp, dockingMiddleLengthMm, drawingColors, drawingLengthText, fittingLengthMm,
    pipeVisualDiameter, productDefaultLength
  });
}

function capPath(x, y, width, height, fill, stroke) {
  return FittingDrawing.cap(x, y, width, height, fill, stroke, drawingColors.objectLineWidth);
}

function tailFittingLength(config, height) {
  return FittingVisualCore.tailFittingLength(config, height, fittingVisualDependencies());
}

function inletFittingLength(config, height) {
  return FittingVisualCore.inletFittingLength(config, height, fittingVisualDependencies());
}

function doubleCardVisualSize(diameter) {
  return FittingVisualCore.doubleCardVisualSize(diameter, fittingVisualDependencies());
}

function ringPressVisualSize(diameter) {
  return FittingVisualCore.ringPressVisualSize(diameter, fittingVisualDependencies());
}

function groovePath(x, y, width, height, fill, stroke) {
  return FittingDrawing.groove(x, y, width, height, fill, stroke, drawingColors.objectLineWidth);
}

function buttWeldPath(x, y, width, height, fill, stroke) {
  return FittingDrawing.buttWeld(x, y, width, height, fill, stroke, drawingColors.objectLineWidth);
}

function outerThreadBranchVisualSize(branch) {
  return FittingVisualCore.outerThreadBranchVisualSize(branch.diameter, pipeVisualDiameter);
}

function innerThreadBranchVisualSize(branch) {
  return FittingVisualCore.innerThreadBranchVisualSize(branch.diameter, pipeVisualDiameter);
}

function doubleCardPath(x, y, width, height, diameter, fill, stroke) {
  return FittingDrawing.doubleCard(x, y, width, height, fill, stroke, drawingColors.objectLineWidth);
}

function ringPressPath(x, y, width, height, fill, stroke) {
  return FittingDrawing.ringPress(x, y, width, height, fill, stroke, drawingColors.objectLineWidth);
}

function innerThreadPath(x, y, width, height, fill, stroke) {
  return FittingDrawing.innerThread(x, y, width, height, fill, stroke, drawingColors.objectLineWidth);
}

function outerThreadPath(x, y, width, height, fill, stroke) {
  return FittingDrawing.outerThread(x, y, width, height, fill, stroke, drawingColors.objectLineWidth);
}

function draw(config, result) {
  if (config.productType === "组合件") {
    document.querySelector("#drawing").innerHTML = CombinationDrawing.render(config, result, {
      DrawingCore, drawingColors, drawingTotalLengthText, fittingLabel, fittingLengthMm,
      inlineFittingLength, inlineFittingSvg, isNoFitting, showInfoPanels: drawingInfoPanelsVisible,
      svgTextLines, tubeSeriesLabel
    });
    return;
  }
  if (!isManifoldType(config.productType)) {
    drawProduct(config, result);
    return;
  }
  document.querySelector("#drawing").innerHTML = ManifoldDrawing.render(config, result, {
    DrawingCore, branchFittingSeatOffset, branchFittingSize, branchFittingSvg, branchLayout: LayoutCore.branchLayout,
    drawingBomRows, drawingColors, drawingLengthText, drawingTotalLengthText, fittingLabel,
    inletFittingLength, inletFittingSvg, pipeVisualDiameter, reducerSegmentSvg, svgTextLines, tailFittingLength,
    tailFittingSvg, titleBranchSummary, tubeSeriesLabel,
    showInfoPanels: drawingInfoPanelsVisible
  });
}

function svgPointFromPointer(svg, event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: event.clientX, y: event.clientY };
  return point.matrixTransform(matrix.inverse());
}

function draggableDimensionOffset(group) {
  const match = String(group.getAttribute("transform") || "").match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
  return {
    dx: match ? Number(match[1]) || 0 : 0,
    dy: match ? Number(match[2]) || 0 : 0
  };
}

function constrainedDimensionDelta(group, dx, dy) {
  const axis = group.dataset.dimensionAxis || "free";
  if (axis === "x") return { dx, dy: 0 };
  if (axis === "y") return { dx: 0, dy };
  if (axis === "normal45") {
    const unit = 1 / Math.sqrt(2);
    const projection = dx * unit + dy * unit;
    return { dx: projection * unit, dy: projection * unit };
  }
  if (axis === "vector") {
    const vx = Number(group.dataset.dimensionVx) || 0;
    const vy = Number(group.dataset.dimensionVy) || 0;
    const length = Math.hypot(vx, vy) || 1;
    const ux = vx / length;
    const uy = vy / length;
    const projection = dx * ux + dy * uy;
    return { dx: projection * ux, dy: projection * uy };
  }
  return { dx, dy };
}

function installDimensionDrag() {
  const svg = document.querySelector("#drawing");
  if (!svg || svg.dataset.dimensionDragBound === "true") return;
  svg.dataset.dimensionDragBound = "true";
  let dragState = null;

  svg.addEventListener("pointerdown", event => {
    const group = event.target.closest?.("[data-dimension-id]");
    if (!group || !svg.contains(group)) return;
    event.preventDefault();
    const startPoint = svgPointFromPointer(svg, event);
    const startOffset = draggableDimensionOffset(group);
    dragState = {
      group,
      id: group.dataset.dimensionId,
      pointerId: event.pointerId,
      startPoint,
      startOffset
    };
    group.classList.add("is-dragging");
    group.setPointerCapture?.(event.pointerId);
  });

  svg.addEventListener("pointermove", event => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const point = svgPointFromPointer(svg, event);
    const rawDx = point.x - dragState.startPoint.x;
    const rawDy = point.y - dragState.startPoint.y;
    const delta = constrainedDimensionDelta(dragState.group, rawDx, rawDy);
    const dx = dragState.startOffset.dx + delta.dx;
    const dy = dragState.startOffset.dy + delta.dy;
    dragState.group.setAttribute("transform", `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);
  });

  const finishDrag = event => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const offset = draggableDimensionOffset(dragState.group);
    dimensionOverrides = {
      ...dimensionOverrides,
      [dragState.id]: {
        dx: Math.round(offset.dx * 10) / 10,
        dy: Math.round(offset.dy * 10) / 10
      }
    };
    dragState.group.classList.remove("is-dragging");
    dragState.group.releasePointerCapture?.(event.pointerId);
    dragState = null;
  };

  svg.addEventListener("pointerup", finishDrag);
  svg.addEventListener("pointercancel", finishDrag);
}

function drawProduct(config, result) {
  const svg = document.querySelector("#drawing");
  const titleEndSpec = (diameter, fitting) => `${diameter}${isNoFitting(fitting) ? "" : fittingLabel(fitting)}`;
  const title = config.productType === "对接类"
    ? `${titleEndSpec(config.diameterA, config.fittingA)}x${titleEndSpec(config.diameterB, config.fittingB)} 对接`
    : config.productType === "弯头类"
    ? `${titleEndSpec(config.diameterA, config.fittingA)}x${titleEndSpec(config.diameterB, config.fittingB)} 弯头`
    : `${titleEndSpec(config.diameterA, config.fittingA)}x${titleEndSpec(config.diameterB, config.fittingB)}x${titleEndSpec(config.diameterC, config.fittingC)} 三通`;
  const middleItems = config.middleItems || [];
  const middleSummary = middleItems.length === 0
    ? "无中间"
    : middleItems.map((item, index) => item.type === "中接" ? `${index + 1}:中接` : `${index + 1}:直管${drawingLengthText(item.length, "")}`).join("  ");
  const connectionText = config.productType === "对接类"
    ? `A:${config.fittingA}  中间:${middleSummary}  B:${config.fittingB}`
    : config.productType === "三通类"
    ? `A:${config.fittingA}  B:${config.fittingB}  C:${config.fittingC}`
    : `A:${config.fittingA}  B:${config.fittingB}`;
  const infoBoxY = 505;
  const infoBoxWidth = 300;
  const bomRows = productDrawingBomRows(config);
  const productInfoBoxHeight = Math.max(110, 54 + bomRows.length * 14);
  const bomFontSize = bomRows.length > 6 ? 10 : 11;
  const drawing = {
    "对接类": DockingDrawing.render(config, {
      DrawingCore,
      clamp,
      dockingMiddleAssembly,
      dockingTotalLengthMm,
      drawingColors,
      drawingTotalLengthText,
      fittingLabel,
      inlineFittingLength,
      inlineFittingSvg,
      isNoFitting,
      pipeVisualDiameter,
      showInfoPanels: drawingInfoPanelsVisible
    }),
    "弯头类": ElbowDrawing.render(config, {
      DrawingCore, compressedStraightVisualLength, drawingColors, drawingTotalLengthText,
      elbowMiddleLengthMm, elbowRoundBodySvg, fittingLabel, inlineFittingEnvelopeHeight,
      inlineFittingLength, inlineFittingSvg, isNoFitting, pipeVisualDiameter, reducerSegmentSvg,
      showInfoPanels: drawingInfoPanelsVisible
    }),
    "三通类": TeeDrawing.render(config, {
      DrawingCore, clamp, compressedStraightVisualLength, drawingColors, drawingTotalLengthText,
      fittingLabel, inlineFittingLength, inlineFittingSvg, isNoFitting, pipeVisualDiameter,
      reducerSegmentSvg, teeBMiddleVisualLengthMm, teeHorizontalTotalLengthMm, teeMiddleLengthMm,
      verticalInlineFittingSvg,
      showInfoPanels: drawingInfoPanelsVisible
    })
  }[config.productType];
  const layer = DrawingCore.layer;

  svg.innerHTML = `
    <defs>
      ${DrawingCore.arrowMarker(drawingColors.dimension)}
    </defs>
    ${layer("frame", DrawingCore.engineeringFrame(config.quoteNo))}

    ${drawing}

    <g data-layer="info" style="${drawingInfoPanelsVisible ? "" : "display:none"}">
    ${DrawingCore.infoBox({
      x: 180,
      y: infoBoxY,
      width: infoBoxWidth,
      height: productInfoBoxHeight,
      title: "尺寸说明",
      content: productDimensionNotes(config)
    })}
    ${DrawingCore.infoBox({
      x: 500,
      y: infoBoxY,
      width: infoBoxWidth,
      height: productInfoBoxHeight,
      title: "技术参数",
      content: `
        <text x="18" y="58" font-size="${drawingColors.infoFontSize}" fill="${drawingColors.label}">材质：不锈钢 ${config.material}</text>
        <text x="18" y="82" font-size="${drawingColors.infoFontSize}" fill="${drawingColors.label}">${connectionText}</text>
        <text x="18" y="104" font-size="${drawingColors.infoFontSize}" fill="${drawingColors.label}">单位：mm</text>
      `
    })}
    ${DrawingCore.bomBox({
      x: 820,
      y: infoBoxY,
      width: infoBoxWidth,
      height: productInfoBoxHeight,
      rows: bomRows,
      labelColor: drawingColors.label,
      lineHeight: Math.min(14, Math.max(10, (productInfoBoxHeight - 56) / Math.max(1, bomRows.length))),
      fontSize: bomFontSize
    })}
    </g>

    ${layer("notes", DrawingCore.technicalRequirements({
      lines: [
        "1、管件不得有气孔、夹渣、缩松等影响其强度的缺陷:",
        "3、未注公差按国标GB/T 19928.2；",
        "4、未注尺寸公差按国标GB/T1804-2000m:",
        "5、交货时酸洗钝化后表面应清洁无氧化皮。"
      ]
    }))}

    ${layer("titleblock", DrawingCore.titleBlock({
      material: config.material,
      titleSvg: svgTextLines(title, 613.5, 72, { maxChars: 22, lineHeight: 16, fontSize: 14, multiLineOffset: 3 }),
      productLabel: "国标定制产品",
      productCode: config.productCode
    }))}
  `;
}

function renderSpec(config, result) {
  const items = DisplayCore.specItems(config, result, {
    drawingLengthText,
    fittingLabel,
    formatFactor,
    formatNumber,
    isManifoldType,
    spacingSpec: LayoutCore.spacingSpec
  });
  items.splice(2, 0, ["\u4ea7\u54c1\u7f16\u7801", config.productCode || "\u5f85\u786e\u8ba4"]);

  document.querySelector("#specList").innerHTML = items.map(([key, value]) => `
    <div>
      <dt>${key}</dt>
      <dd>${value || "自动生成"}</dd>
    </div>
  `).join("");
}

function renderCost(result) {
  document.querySelector("#costRows").innerHTML = DisplayCore.costRowsDisplay(result.costRows, money).map(row => `
    <tr class="${row.warning ? "cost-warning-row" : ""}">
      <td>${row.name}</td>
      <td>${row.note}</td>
      <td>${row.detail}</td>
      <td>${row.amount}</td>
    </tr>
  `).join("");
}

function titleBranchSummary(config) {
  return DrawingContentCore.titleBranchSummary(config);
}

function drawingBomRows(config) {
  return DrawingContentCore.manifoldBomRows(config, { fittingLabel });
}

function productDrawingBomRows(config) {
  return DrawingContentCore.productBomRows(config, { drawingLengthValue, fittingLabel, isNoFitting, productKindName });
}

function productDimensionNotes(config) {
  return DrawingContentCore.productDimensionNotes(config, { drawingLengthText })
    .map((line, index) => `<text x="18" y="${56 + index * 22}" font-size="${drawingColors.infoFontSize}" fill="${drawingColors.label}">${line}</text>`)
    .join("");
}

function svgTextLines(text, x, y, options = {}) {
  const maxChars = options.maxChars || 16;
  const lineHeight = options.lineHeight || 16;
  const fontSize = options.fontSize || 13;
  const anchor = options.anchor || "middle";
  const maxWidth = options.maxWidth || 0;
  const fitThreshold = options.fitThreshold || 15;
  const multiLineOffset = options.multiLineOffset || 0;
  const lines = [];
  let current = "";

  for (const char of text) {
    const next = current + char;
    if (current && next.length > maxChars) {
      lines.push(current);
      current = char;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  if (lines.length === 2 && lines[1].length <= 4 && lines[0].length > lines[1].length * 2) {
    const joined = lines.join("");
    const middle = Math.ceil(joined.length / 2);
    const breakCandidates = [];
    for (let index = 1; index < joined.length; index += 1) {
      const previous = joined[index - 1];
      const currentChar = joined[index];
      if (previous === "+" || previous === "x" || previous === "X" || previous === " " || currentChar === " ") {
        breakCandidates.push(index);
      }
    }
    const splitAt = breakCandidates.length
      ? breakCandidates.reduce((best, value) => Math.abs(value - middle) < Math.abs(best - middle) ? value : best, breakCandidates[0])
      : middle;
    lines.splice(0, lines.length, joined.slice(0, splitAt).trim(), joined.slice(splitAt).trim());
  }

  const centerY = y + (lines.length > 1 ? multiLineOffset : 0);
  const startY = centerY - (lines.length - 1) * lineHeight / 2;
  return lines.map((line, index) => (
    `<text x="${x}" y="${startY + index * lineHeight}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${fontSize}" fill="#111"${maxWidth && line.length >= fitThreshold ? ` textLength="${maxWidth}" lengthAdjust="spacingAndGlyphs"` : ""}>${line}</text>`
  )).join("");
}

function quoteItemName(config) {
  return DisplayCore.quoteItemName(config, {
    drawingLengthValue,
    fittingLabel,
    isManifoldType,
    productKindName,
    tubeSeriesLabel
  });
}

function topProductTitle(config) {
  return DisplayCore.topProductTitle(config);
}

function selectedQuotePriceColumns() {
  const selected = Array.from(document.querySelectorAll("[data-quote-price-column]"))
    .filter(input => input.checked)
    .map(input => input.dataset.quotePriceColumn)
    .filter(key => quotePriceColumnDefinitions[key]);
  return selected.length ? selected : ["unitPrice"];
}

function syncQuotePriceColumnState() {
  quotePriceColumns = selectedQuotePriceColumns();
}

function quoteListTotalValue(item, columnKey) {
  const definition = quotePriceColumnDefinitions[columnKey] || quotePriceColumnDefinitions.unitPrice;
  if (Number.isFinite(Number(item[definition.totalKey]))) return Number(item[definition.totalKey]);
  return (Number(item[definition.valueKey]) || 0) * (Number(item.quantity) || 0);
}

function quoteListPrimaryColumn() {
  if (quotePriceColumns.includes("unitPrice")) return "unitPrice";
  if (quotePriceColumns.includes("discountedPrice")) return "discountedPrice";
  return quotePriceColumns[0] || "unitPrice";
}

function addQuoteItem() {
  const config = getConfig();
  const productCodeResult = ProductCodeCore.generate(config);
  config.productCode = productCodeResult.code;
  config.productCodeResult = productCodeResult;
  const result = calculate(config);
  quoteItems.push({
    id: Date.now(),
    name: quoteItemName(config),
    quantity: config.quantity,
    factoryCost: result.factoryCost ?? result.subtotal ?? 0,
    factoryCostTotal: (result.factoryCost ?? result.subtotal ?? 0) * config.quantity,
    discountedPrice: result.discountedPrice,
    discountedPriceTotal: result.discountedPrice * config.quantity,
    unitPrice: result.unitPrice,
    totalPrice: result.unitPrice * config.quantity,
    config,
    result
  });
  persistQuoteList();
  renderQuoteList();
}

function removeQuoteItem(id) {
  quoteItems = quoteItems.filter(item => item.id !== id);
  persistQuoteList();
  renderQuoteList();
}

function renderQuoteList() {
  syncQuotePriceColumnState();
  const primaryColumn = quoteListPrimaryColumn();
  const total = quoteItems.reduce((sum, item) => sum + quoteListTotalValue(item, primaryColumn), 0);
  document.querySelector("#quoteListTotal").textContent = `${quoteItems.length} 项，合计 ${money(total)}`;
  document.querySelector("#quoteListHeadRow").innerHTML = `
    <th>规格</th>
    <th>数量</th>
    ${quotePriceColumns.map(columnKey => {
      const definition = quotePriceColumnDefinitions[columnKey];
      return `<th>${definition.label}</th><th>${definition.amountLabel}</th>`;
    }).join("")}
    <th></th>
  `;
  document.querySelector("#quoteListRows").innerHTML = quoteItems.length === 0
    ? `<tr><td colspan="${3 + quotePriceColumns.length * 2}">暂无报价项目</td></tr>`
    : quoteItems.map(item => `
      <tr>
        <td class="quote-spec">
          <code>${item.config.productCode || "\u5f85\u786e\u8ba4"}</code>
          <div>${item.name}</div>
        </td>
        <td class="quote-number">${item.quantity}</td>
        ${quotePriceColumns.map(columnKey => {
          const definition = quotePriceColumnDefinitions[columnKey];
          return `
            <td class="quote-money">${money(item[definition.valueKey] || 0)}</td>
            <td class="quote-money">${money(quoteListTotalValue(item, columnKey))}</td>
          `;
        }).join("")}
        <td class="quote-action-cell"><button class="tiny-button" type="button" data-remove-item="${item.id}">删除</button></td>
      </tr>
    `).join("");

  document.querySelectorAll("[data-remove-item]").forEach(button => {
    button.addEventListener("click", () => removeQuoteItem(Number(button.dataset.removeItem)));
  });
}

function downloadText(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  downloadBlob(filename, blob);
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function serializedDrawingSvg() {
  const source = document.querySelector("#drawing").cloneNode(true);
  source.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(source);
}

function drawingFileName(extension) {
  return ExportCore.drawingFileName(fields.quoteNo.value, extension);
}

function drawingSize() {
  const svg = document.querySelector("#drawing");
  const viewBox = svg.viewBox?.baseVal;
  if (viewBox?.width && viewBox?.height) {
    return { width: viewBox.width, height: viewBox.height };
  }
  const rect = svg.getBoundingClientRect();
  return { width: Math.max(1, rect.width), height: Math.max(1, rect.height) };
}

function exportDrawingPng() {
  const svgText = serializedDrawingSvg();
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();
  const size = drawingSize();
  const scale = 2;

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(size.width * scale);
    canvas.height = Math.round(size.height * scale);
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob => {
      if (blob) downloadBlob(drawingFileName("png"), blob);
    }, "image/png");
  };

  image.onerror = () => {
    URL.revokeObjectURL(url);
    window.alert("PNG 导出失败，请检查图纸是否正常显示。");
  };

  image.src = url;
}

function exportDrawingPdf() {
  const printWindow = window.open("", "_blank", "width=1200,height=850");
  if (!printWindow) {
    window.alert("请允许弹出窗口后再导出 PDF。");
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${fields.quoteNo.value || "drawing"}</title>
        <style>
          @page { size: A4 landscape; margin: 8mm; }
          * { box-sizing: border-box; }
          body { margin: 0; background: #fff; font-family: "Microsoft YaHei", Arial, sans-serif; }
          svg { width: 100%; height: auto; display: block; }
        </style>
      </head>
      <body>${serializedDrawingSvg()}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 300);
}

function exportQuoteListCsv() {
  downloadText(
    ExportCore.quoteListFileName(fields.quoteNo.value),
    ExportCore.quoteListCsv(quoteItems, formatNumber, selectedQuotePriceColumns()),
    "text/csv;charset=utf-8"
  );
}

function exportNxParamsJson() {
  const config = getConfig();
  const productCodeResult = ProductCodeCore.generate(config);
  config.productCode = productCodeResult.code;
  config.productCodeResult = productCodeResult;
  const result = calculate(config);
  const params = NxParamExportCore.buildParams(config, result, {
    productCodeCore: ProductCodeCore,
    dockingTotalLengthMm,
    teeHorizontalTotalLengthMm,
    outputOptions: {
      sourceQuoteNo: config.quoteNo || fields.quoteNo.value,
      schemaVersion: 1
    }
  });
  downloadText(
    NxParamExportCore.fileName(params),
    NxParamExportCore.jsonText(params),
    "application/json;charset=utf-8"
  );
}

function exportSettingsExcel() {
  const rows = [
    ["配置路径", "数值"],
    ...SettingsCore.flatten(SettingsCore.clone(pricing)).map(row => [row.path, row.value])
  ];
  downloadText(
    ExportCore.datedSettingsFileName(),
    ExportCore.settingsWorkbookXml(rows, SettingsCore.escapeXml),
    "application/vnd.ms-excel;charset=utf-8"
  );
}

function importSettingsExcelFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const xmlText = String(reader.result || "");
      const doc = new DOMParser().parseFromString(xmlText, "text/xml");
      if (doc.querySelector("parsererror")) throw new Error("invalid xml");
      const rows = Array.from(doc.getElementsByTagName("Row"));
      if (rows.length < 2) throw new Error("empty settings file");
      const nextPricing = SettingsCore.clone(pricing);
      let changedCount = 0;
      let skippedCount = 0;
      rows.slice(1).forEach(row => {
        const cells = Array.from(row.getElementsByTagName("Data")).map(cell => cell.textContent || "");
        if (!cells[0]) return;
        const path = JSON.parse(cells[0]);
        if (SettingsCore.setValueByPath(nextPricing, defaultPricing, path, SettingsCore.parseCellValue(cells[1]))) {
          changedCount += 1;
        } else {
          skippedCount += 1;
        }
      });
      if (changedCount === 0) throw new Error("no valid settings");
      Object.keys(pricing).forEach(key => delete pricing[key]);
      Object.assign(pricing, nextPricing);
      savePricingSettings();
      renderSettings();
      update();
      const status = document.querySelector("#settingsSaveStatus");
      if (status) status.textContent = `已导入 ${changedCount} 项设置${skippedCount ? `，忽略 ${skippedCount} 项无效路径` : ""}`;
    } catch (error) {
      window.alert("导入失败：请使用本系统导出的 Excel 设置文件。");
    }
  };
  reader.readAsText(file, "utf-8");
}

function renderSettings() {
  Object.entries(SettingsRenderCore.BASIC_SETTING_PATHS).forEach(([id, path]) => {
    const input = document.querySelector(`#${id}`);
    if (!input) return;
    input.value = SettingsRenderCore.valueAtPath(pricing, path);
    input.oninput = () => {
      const value = Math.max(0, Number(input.value) || 0);
      SettingsRenderCore.setValueAtPath(pricing, path, value);
      markSettingsDirty();
      update();
    };
  });
  if (settingsRecoveryNotice) {
    const status = document.querySelector("#settingsSaveStatus");
    if (status) status.textContent = settingsRecoveryNotice;
  }

  const head = document.querySelector("#settingsFittingHead");
  const rows = document.querySelector("#settingsFittingRows");
  const renderOptions = { getDiameters: fittingSettingDiameters, tubeSeriesLabel };
  head.innerHTML = SettingsRenderCore.seriesHeadHtml("配件", renderOptions);
  rows.innerHTML = SettingsRenderCore.fittingPriceRowsHtml({ pricing, ...renderOptions });

  rows.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      const series = input.dataset.fittingSeries;
      const name = input.dataset.fittingName;
      const diameter = input.dataset.fittingDiameter;
      const value = input.value === "" ? undefined : Math.max(0, Number(input.value) || 0);
      pricing.fittingBySeries[series][name] ||= {};
      if (value === undefined) {
        delete pricing.fittingBySeries[series][name][diameter];
      } else {
        pricing.fittingBySeries[series][name][diameter] = value;
      }
      markSettingsDirty();
      update();
    });
  });

  renderFittingLengthSettings();
  renderDockingProcessSettings();
  renderTeeSettings();
  renderElbowSettings();
}

function renderFittingLengthSettings() {
  const head = document.querySelector("#settingsFittingLengthHead");
  const rows = document.querySelector("#settingsFittingLengthRows");
  if (!head || !rows) return;
  const renderOptions = { getDiameters: fittingSettingDiameters, tubeSeriesLabel };
  head.innerHTML = SettingsRenderCore.seriesHeadHtml("配件长度", renderOptions);
  rows.innerHTML = SettingsRenderCore.fittingLengthRowsHtml({ pricing, ...renderOptions });

  rows.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      const series = input.dataset.fittingLengthSeries;
      const name = input.dataset.fittingLengthName;
      const diameter = input.dataset.fittingLengthDiameter;
      const value = input.value === "" ? undefined : Math.max(0, Number(input.value) || 0);
      pricing.fittingLengthBySeries[series] ||= {};
      pricing.fittingLengthBySeries[series][name] ||= {};
      if (value === undefined) {
        delete pricing.fittingLengthBySeries[series][name][diameter];
      } else {
        pricing.fittingLengthBySeries[series][name][diameter] = value;
      }
      markSettingsDirty();
      update();
    });
  });
}

function renderDockingProcessSettings() {
  const head = document.querySelector("#settingsDockingProcessHead");
  const rows = document.querySelector("#settingsDockingProcessRows");
  if (!head || !rows) return;
  const diameters = SettingsRenderCore.PRODUCT_PROCESS_DIAMETERS;
  const fittingNames = SettingsRenderCore.PRODUCT_PROCESS_FITTINGS;
  head.innerHTML = SettingsRenderCore.processHeadHtml("对接类加工费", diameters);
  rows.innerHTML = SettingsRenderCore.processRowsHtml({
    pricing,
    pricingKey: "dockingProcessByDiameter",
    diameters,
    fittingNames,
    dataset: "docking"
  });

  rows.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      const name = input.dataset.dockingProcessName;
      const diameter = input.dataset.dockingProcessDiameter;
      const value = Math.max(0, Number(input.value) || 0);
      pricing.dockingProcessByDiameter[name] ||= {};
      pricing.dockingProcessByDiameter[name][diameter] = value;
      markSettingsDirty();
      update();
    });
  });
}

function renderTeeSettings() {
  renderTeeLengthSettings();
  renderProcessSettingsTable({
    headSelector: "#settingsTeeProcessHead",
    rowsSelector: "#settingsTeeProcessRows",
    pricingKey: "teeProcessByDiameter",
    title: "三通类加工费",
    diameters: SettingsRenderCore.PRODUCT_PROCESS_DIAMETERS,
    fittingNames: SettingsRenderCore.PRODUCT_PROCESS_FITTINGS
  });
}

function renderElbowSettings() {
  renderElbowHeightSettings();
  renderProcessSettingsTable({
    headSelector: "#settingsElbowProcessHead",
    rowsSelector: "#settingsElbowProcessRows",
    pricingKey: "elbowProcessByDiameter",
    title: "弯头类加工费",
    diameters: SettingsRenderCore.PRODUCT_PROCESS_DIAMETERS,
    fittingNames: SettingsRenderCore.PRODUCT_PROCESS_FITTINGS
  });
}

function renderTeeLengthSettings() {
  const head = document.querySelector("#settingsTeeLengthHead");
  const rows = document.querySelector("#settingsTeeLengthRows");
  if (!head || !rows) return;
  const renderOptions = { getDiameters: fittingSettingDiameters, tubeSeriesLabel };
  head.innerHTML = SettingsRenderCore.seriesHeadHtml("类型", renderOptions);
  rows.innerHTML = SettingsRenderCore.singleSeriesValueRowsHtml({
    rowTitle: "三通直管长度",
    pricing,
    pricingKey: "teeStraightLengthBySeries",
    dataPrefix: "tee-length",
    step: "0.1",
    ...renderOptions
  });
  rows.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      const series = input.dataset.teeLengthSeries;
      const diameter = input.dataset.teeLengthDiameter;
      const value = input.value === "" ? undefined : Math.max(0, Number(input.value) || 0);
      pricing.teeStraightLengthBySeries[series] ||= {};
      if (value === undefined) {
        delete pricing.teeStraightLengthBySeries[series][diameter];
      } else {
        pricing.teeStraightLengthBySeries[series][diameter] = value;
      }
      markSettingsDirty();
      update();
    });
  });
}

function renderElbowHeightSettings() {
  const head = document.querySelector("#settingsElbowHeightHead");
  const rows = document.querySelector("#settingsElbowHeightRows");
  if (!head || !rows) return;
  const renderOptions = { getDiameters: fittingSettingDiameters, tubeSeriesLabel };
  head.innerHTML = SettingsRenderCore.seriesHeadHtml("类型", renderOptions);
  rows.innerHTML = SettingsRenderCore.singleSeriesValueRowsHtml({
    rowTitle: "弯头中心高度",
    pricing,
    pricingKey: "elbowCenterHeightBySeries",
    dataPrefix: "elbow-height",
    step: "0.001",
    ...renderOptions
  });
  rows.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      const series = input.dataset.elbowHeightSeries;
      const diameter = input.dataset.elbowHeightDiameter;
      const value = input.value === "" ? undefined : Math.max(0, Number(input.value) || 0);
      pricing.elbowCenterHeightBySeries[series] ||= {};
      if (value === undefined) {
        delete pricing.elbowCenterHeightBySeries[series][diameter];
      } else {
        pricing.elbowCenterHeightBySeries[series][diameter] = value;
      }
      markSettingsDirty();
      update();
    });
  });
}

function renderProcessSettingsTable({ headSelector, rowsSelector, pricingKey, title, diameters = [16, 20, 25.4, 32, 40, 50.8, 76.1, 88.9, 101.6], fittingNames = ["外丝", "内丝", "双卡", "环压", "法兰", "移动螺母", "堵头"] }) {
  const head = document.querySelector(headSelector);
  const rows = document.querySelector(rowsSelector);
  if (!head || !rows) return;
  head.innerHTML = SettingsRenderCore.processHeadHtml(title, diameters);
  rows.innerHTML = SettingsRenderCore.processRowsHtml({ pricing, pricingKey, diameters, fittingNames });

  rows.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      const key = input.dataset.processTable;
      const name = input.dataset.processName;
      const diameter = input.dataset.processDiameter;
      const value = Math.max(0, Number(input.value) || 0);
      pricing[key][name] ||= {};
      pricing[key][name][diameter] = value;
      markSettingsDirty();
      update();
    });
  });
}

function switchSettingsCategory(category) {
  activeSettingsCategory = category;
  document.querySelectorAll("[data-settings-category]").forEach(button => {
    button.classList.toggle("active", SettingsRenderCore.isActiveSettingCategory(button.dataset.settingsCategory, category));
  });
  document.querySelectorAll("[data-settings-product]").forEach(block => {
    const active = SettingsRenderCore.isActiveSettingCategory(block.dataset.settingsProduct, category);
    block.hidden = !active;
    block.classList.toggle("active", active);
  });
}

function switchSettingsSection(section) {
  activeSettingsSection = section;
  document.querySelectorAll("[data-settings-section]").forEach(button => {
    button.classList.toggle("active", SettingsRenderCore.isActiveSettingSection(button.dataset.settingsSection, section));
  });
  document.querySelectorAll("[data-settings-section-panel]").forEach(panel => {
    const active = SettingsRenderCore.isActiveSettingSection(panel.dataset.settingsSectionPanel, section);
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
}

let scheduledUpdateFrame = null;

function scheduleUpdate() {
  if (scheduledUpdateFrame !== null) return;
  const scheduleFrame = window.requestAnimationFrame || (callback => setTimeout(callback, 0));
  scheduledUpdateFrame = scheduleFrame(() => {
    scheduledUpdateFrame = null;
    update();
  });
}

function update() {
  const active = document.activeElement;
  const isBranchFreeInput = active?.matches?.("[data-branch-spacing], [data-branch-height], [data-branch-positive]");
  const isDockingMiddleFreeInput = active?.matches?.("[data-middle-length], #productProcessFactor");
  syncProductMode();
  if (isManifoldType()) {
    syncRules(active?.id);
  } else if (fields.productType.value === "组合件") {
    syncCombinationRules(active?.id);
  } else {
    syncProductRules(active?.id, isDockingMiddleFreeInput);
  }
  syncElbowMiddleLengthFields();
  syncTeeMiddleLengthFields();
  if (isManifoldType() && !isBranchFreeInput) {
    syncBranchRows();
  }
  const config = getConfig();
  const productCodeResult = ProductCodeCore.generate(config);
  config.productCode = productCodeResult.code;
  config.productCodeResult = productCodeResult;
  const result = calculate(config);

  if (fields.difficultyFactor.dataset.manual !== "true" && document.activeElement !== fields.difficultyFactor) {
    fields.difficultyFactor.value = formatFactor(result.autoDifficultyFactor);
  }

  document.querySelector("#factoryCost").textContent = money(result.factoryCost ?? result.subtotal);
  document.querySelector("#unitPrice").textContent = money(result.unitPrice);
  document.querySelector("#discountedPrice").textContent = money(result.discountedPrice);
  document.querySelector("#totalPrice").textContent = money(result.totalPrice);
  fields.productCode.value = productCodeResult.code || "\u5f85\u786e\u8ba4";
  fields.productCode.closest("label").dataset.status = productCodeResult.status;
  fields.productCode.title = productCodeResult.message;
  document.querySelector("#productCodeStatus").textContent = productCodeResult.valid
    ? `\u7f16\u7801\u6709\u6548 \u00b7 ${productCodeResult.ruleId}`
    : productCodeResult.message;
  document.querySelector("#topProductTitle").textContent = topProductTitle(config);
  document.querySelector("#topMaterialBadge").textContent = `${config.material} 不锈钢`;
  document.querySelector("#topSeriesBadge").textContent = tubeSeriesLabel[config.tubeSeries] || config.tubeSeries || "国标";
  const ruleText = isManifoldType(config.productType)
    ? (config.branchDiameter <= config.mainDiameter ? "规则正常" : "支管过大")
    : `${productKindName(config.productType)}参数`;
  document.querySelector("#ruleStatus").textContent = result.quoteIssues?.length
    ? `数据风险 ${result.quoteIssues.length} 项`
    : ruleText;
  document.querySelector("#drawingScale").textContent = isManifoldType(config.productType)
    ? (config.customBranches ? `${config.branchCount} 路独立预览` : `${config.branchCount} 路预览`)
    : `${productKindName(config.productType)}预览`;

  draw(config, result);
  installDimensionDrag();
  renderSpec(config, result);
  renderCost(result);
  renderQuoteList();
}

function init() {
  bindFields();
  bindCopyActions();
  loadPricingSettings();
  fields.customerName.value = "福兰特定制产品";
  fields.quoteNo.value = `分水-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-001`;
  fields.productType.value = "分水器类";
  fillSelect(fields.material, options.materials);
  fillSelect(fields.manifoldType, options.manifoldTypes);
  fillSelect(fields.surfaceTreatment, options.surfaceTreatments);
  fillSelect(fields.tubeSeries, Object.keys(options.tubeSeries), value => tubeSeriesLabel[value] || `系列${value}`);
  fields.tubeSeries.value = "A";
  fillSelect(fields.mainDiameter, seriesDiameters());
  fillSelect(fields.wallThickness, seriesThicknesses());
  fillSelect(fields.branchDiameter, branchOptions(40), value => `${value}`);
  fillSelect(fields.branchThickness, seriesThicknesses());
  document.querySelector("#branchHeightOptions").innerHTML = options.branchHeight.map(value => `<option value="${value}">${value === 0 ? "不加高" : `${value}`}</option>`).join("");
  fillSelect(fields.mainFitting, options.mainFittings);
  fillSelect(fields.mainFittingDiameter, seriesDiameters());
  fillSelect(fields.branchFitting, options.branchFittings);
  fillSelect(fields.tailFitting, options.tailFittings, fittingLabel);
  fillSelect(fields.tailFittingDiameter, seriesDiameters());
  fillSelect(fields.productDiameter, fittingSettingDiameters("A"));
  fillSelect(fields.productThickness, seriesThicknesses());
  fillSelect(fields.productDiameterA, fittingSettingDiameters("A"));
  fillSelect(fields.productThicknessA, seriesThicknesses());
  fillSelect(fields.productDiameterB, fittingSettingDiameters("A"));
  fillSelect(fields.productMiddleDiameter, fittingSettingDiameters("A"));
  fillSelect(fields.productThicknessB, seriesThicknesses());
  fillSelect(fields.productMiddleThickness, seriesThicknesses());
  fillSelect(fields.productFittingA, options.fittingConnections);
  fillSelect(fields.productFittingB, options.fittingConnections);
  fillSelect(fields.productMiddleA, ["无", "直管", "中接"]);
  fillSelect(fields.productMiddleB, ["无", "直管", "中接"]);
  fillSelect(fields.teeDiameterA, fittingSettingDiameters("A"));
  fillSelect(fields.teeThicknessA, seriesThicknesses());
  fillSelect(fields.teeFittingA, options.fittingConnections);
  fillSelect(fields.teeDiameterB, fittingSettingDiameters("A"));
  fillSelect(fields.teeThicknessB, seriesThicknesses());
  fillSelect(fields.teeFittingB, options.fittingConnections);
  fillSelect(fields.teeDiameterC, fittingSettingDiameters("A"));
  fillSelect(fields.teeThicknessC, seriesThicknesses());
  fillSelect(fields.teeFittingC, options.fittingConnections);
  fillSelect(fields.teeBodyDiameter, fittingSettingDiameters("A"));
  fillSelect(fields.teeBodyThickness, seriesThicknesses());
  fillSelect(fields.elbowBodyDiameter, fittingSettingDiameters("A"));
  fillSelect(fields.elbowBodyThickness, seriesThicknesses());
  fillSelect(fields.elbowDiameterA, fittingSettingDiameters("A"));
  fillSelect(fields.elbowThicknessA, seriesThicknesses());
  fillSelect(fields.elbowFittingA, options.fittingConnections);
  fillSelect(fields.elbowMiddleA, ["无", "直管", "中接"]);
  fillSelect(fields.elbowDiameterB, fittingSettingDiameters("A"));
  fillSelect(fields.elbowThicknessB, seriesThicknesses());
  fillSelect(fields.elbowFittingB, options.fittingConnections);
  fillSelect(fields.elbowMiddleB, ["无", "直管", "中接"]);
  fillSelect(fields.productGenericFittingA, options.fittingConnections);
  fillSelect(fields.productGenericFittingB, options.fittingConnections);
  fillSelect(fields.productFittingC, options.fittingConnections);
  fillSelect(fields.combinationFittingA, options.fittingConnections);
  fillSelect(fields.combinationFittingB, options.fittingConnections);
  renderCombinationRows();

  fields.material.value = "304";
  fields.material.dataset.previousValue = "304";
  fields.manifoldType.value = "单排";
  fields.mainDiameter.value = "40";
  fields.branchDiameter.value = "20";
  fields.wallThickness.value = String(defaultWallThickness(40));
  fields.branchThickness.value = String(defaultWallThickness(20));
  fields.mainPositiveTolerance.checked = false;
  fields.branchPositiveTolerance.checked = false;
  fields.mainFitting.value = "外丝";
  fields.mainFittingDiameter.value = "40";
  fields.mainAdapterEnabled.checked = false;
  fields.branchFitting.value = "外丝";
  fields.tailFitting.value = "堵头";
  fields.tailFittingDiameter.value = "40";
  fields.tailAdapterEnabled.checked = false;
  fields.productDiameter.value = "40";
  fields.productThickness.value = String(defaultWallThickness(40));
  fields.productDiameterA.value = "40";
  fields.productThicknessA.value = String(defaultWallThickness(40));
  fields.productDiameterB.value = "40";
  fields.productMiddleDiameter.value = "40";
  fields.productThicknessB.value = String(defaultWallThickness(40));
  fields.productMiddleThickness.value = String(defaultWallThickness(40));
  fields.productMiddleA.value = "无";
  fields.productMiddleLengthA.value = "20";
  fields.productMiddleB.value = "无";
  fields.productMiddleLengthB.value = "20";
  fields.teeDiameterA.value = "40";
  fields.teeThicknessA.value = String(defaultWallThickness(40));
  fields.teeFittingA.value = "外丝";
  fields.teeMiddleA.value = "无";
  fields.teeDiameterB.value = "40";
  fields.teeThicknessB.value = String(defaultWallThickness(40));
  fields.teeFittingB.value = "外丝";
  fields.teeMiddleB.value = "无";
  fields.teeMiddleLengthB.value = "50";
  fields.teeDiameterC.value = "40";
  fields.teeThicknessC.value = String(defaultWallThickness(40));
  fields.teeFittingC.value = "外丝";
  fields.teeMiddleC.value = "无";
  fields.teeBodyDiameter.value = "40";
  fields.teeBodyThickness.value = String(defaultWallThickness(40));
  fields.teeBodyLength.value = String(productDefaultLength("三通类", 40));
  fields.elbowBodyDiameter.value = "40";
  fields.elbowBodyThickness.value = String(defaultWallThickness(40));
  fields.elbowDiameterA.value = "40";
  fields.elbowThicknessA.value = String(defaultWallThickness(40));
  fields.elbowFittingA.value = "外丝";
  fields.elbowMiddleA.value = "无";
  fields.elbowMiddleLengthA.value = "20";
  fields.elbowDiameterB.value = "40";
  fields.elbowThicknessB.value = String(defaultWallThickness(40));
  fields.elbowFittingB.value = "外丝";
  fields.elbowMiddleB.value = "无";
  fields.elbowMiddleLengthB.value = "20";
  teeBodyLengthTouched = false;
  fields.productTotalLength.value = "";
  fields.productHasMiddle.checked = false;
  fields.productMiddleCount.value = "1";
  dockingMiddleTouched = false;
  lastDockingDiameterPair = "";
  fields.productAngle.value = "90";
  fields.productLength.value = String(productDefaultLength("弯头类", 40, fields.productAngle.value));
  fields.productFittingA.value = "外丝";
  fields.productFittingB.value = "外丝";
  fields.productGenericFittingA.value = "外丝";
  fields.productGenericFittingB.value = "外丝";
  fields.productFittingC.value = "外丝";
  fields.combinationFittingA.value = "外丝";
  fields.combinationFittingB.value = "外丝";
  fields.productProcessFactor.value = "1";
  fields.branchHeight.value = "0";
  fields.branchCount.value = "4";
  fields.branchSpacing.value = "180";
  fields.inletAllowance.value = "100";
  fields.tailAllowance.value = "40";
  document.querySelector("#spacingOptions").innerHTML = options.spacing.map(value => `<option value="${value}"></option>`).join("");
  fields.quantity.value = "1";
  fields.surfaceTreatment.value = "酸洗";
  fields.difficultyFactor.value = "";
  fields.difficultyFactor.dataset.manual = "false";
  fields.steelTonPrice.value = String(defaultSteelTonPrice["304"]);
  fields.profitRate.value = "68";
  fields.taxRate.value = "17";
  fields.freight.value = "0";
  restoreQuoteList();

  Object.values(fields).forEach(field => {
    field.addEventListener("input", scheduleUpdate);
    field.addEventListener("change", scheduleUpdate);
  });
  [
    fields.productHasMiddle,
    fields.productMiddleCount,
    fields.productMiddleA,
    fields.productMiddleLengthA,
    fields.productMiddleB,
    fields.productMiddleLengthB
  ].filter(Boolean).forEach(field => {
    field.addEventListener("input", () => {
      dockingMiddleTouched = true;
    });
    field.addEventListener("change", () => {
      dockingMiddleTouched = true;
    });
  });
  fields.productMiddleRows.addEventListener("input", event => {
    if (event.target.matches("[data-middle-type], [data-middle-length]")) {
      dockingMiddleTouched = true;
    }
  });
  fields.productMiddleRows.addEventListener("change", event => {
    if (event.target.matches("[data-middle-type], [data-middle-length]")) {
      dockingMiddleTouched = true;
    }
  });
  fields.combinationAdd.addEventListener("click", () => {
    const items = readCombinationRows();
    const diameter = items[items.length - 1]?.diameter || 40;
    const type = fields.combinationAddType.value;
    items.push(CombinationCore.normalizeComponent({
      type,
      diameter,
      thickness: items[items.length - 1]?.thickness || 1.5,
      length: combinationDefaultLength(type, diameter)
    }, items.length));
    dimensionOverrides = {};
    renderCombinationRows(items);
    update();
  });
  fields.combinationRows.addEventListener("click", event => {
    const row = event.target.closest(".combination-row");
    if (!row) return;
    const items = readCombinationRows();
    const index = Array.from(fields.combinationRows.children).indexOf(row);
    const branchRow = event.target.closest(".combination-branch-component");
    if (event.target.closest("[data-combination-branch-add]")) {
      const type = row.querySelector("[data-branch-add-type]").value;
      const previous = items[index].branchComponents[items[index].branchComponents.length - 1];
      const diameter = previous?.diameter || items[index].branchDiameter;
      const thickness = previous?.thickness || items[index].branchThickness;
      items[index].branchComponents.push(CombinationCore.normalizeBranchComponent({
        type, diameter, thickness, length: combinationDefaultLength(type, diameter)
      }, items[index].branchComponents.length, diameter, thickness));
    } else if (branchRow) {
      const branchIndex = Array.from(row.querySelectorAll(".combination-branch-component")).indexOf(branchRow);
      if (event.target.closest("[data-branch-component-remove]")) {
        items[index].branchComponents.splice(branchIndex, 1);
      } else if (event.target.closest('[data-branch-component-move="up"]') && branchIndex > 0) {
        [items[index].branchComponents[branchIndex - 1], items[index].branchComponents[branchIndex]] = [items[index].branchComponents[branchIndex], items[index].branchComponents[branchIndex - 1]];
      } else if (event.target.closest('[data-branch-component-move="down"]') && branchIndex < items[index].branchComponents.length - 1) {
        [items[index].branchComponents[branchIndex + 1], items[index].branchComponents[branchIndex]] = [items[index].branchComponents[branchIndex], items[index].branchComponents[branchIndex + 1]];
      } else {
        return;
      }
    } else if (event.target.closest("[data-combination-remove]")) {
      if (items.length <= 1) return;
      items.splice(index, 1);
    } else if (event.target.closest('[data-combination-move="up"]') && index > 0) {
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
    } else if (event.target.closest('[data-combination-move="down"]') && index < items.length - 1) {
      [items[index + 1], items[index]] = [items[index], items[index + 1]];
    } else {
      return;
    }
    dimensionOverrides = {};
    renderCombinationRows(items);
    update();
  });
  fields.combinationRows.addEventListener("change", event => {
    const row = event.target.closest(".combination-row");
    const branchRow = event.target.closest(".combination-branch-component");
    if (row && event.target.matches("[data-combination-type]")) {
      const type = event.target.value;
      const diameter = Number(row.querySelector("[data-combination-diameter]").value) || 40;
      row.querySelector("[data-combination-length]").value = combinationDefaultLength(type, diameter);
    }
    if (row && event.target.matches("[data-combination-diameter]")) {
      const type = row.querySelector("[data-combination-type]").value;
      if (type !== "直管") {
        row.querySelector("[data-combination-length]").value = combinationDefaultLength(type, Number(event.target.value));
      }
    }
    if (branchRow && event.target.matches("[data-branch-component-type]")) {
      const type = event.target.value;
      const diameter = Number(branchRow.querySelector("[data-branch-component-diameter]").value) || 40;
      branchRow.querySelector("[data-branch-component-length]").value = combinationDefaultLength(type, diameter);
    }
    if (branchRow && event.target.matches("[data-branch-component-diameter]")) {
      const type = branchRow.querySelector("[data-branch-component-type]").value;
      if (type !== "直管") branchRow.querySelector("[data-branch-component-length]").value = combinationDefaultLength(type, Number(event.target.value));
    }
    if (event.target.matches("[data-combination-type], [data-combination-branch-diameter], [data-combination-branch-fitting-diameter], [data-combination-branch-middle], [data-branch-component-type]")) {
      renderCombinationRows(readCombinationRows());
    }
    update();
  });
  fields.teeBodyLength.addEventListener("input", () => {
    teeBodyLengthTouched = fields.teeBodyLength.value.trim() !== "";
  });
  document.querySelectorAll("[data-product-type]").forEach(button => {
    button.addEventListener("click", () => {
      fields.productType.value = button.dataset.productType;
      fields.quoteNo.value = `${productKindName(fields.productType.value).slice(0, 2).toUpperCase()}-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-001`;
      fields.difficultyFactor.dataset.manual = "false";
      fields.difficultyFactor.value = "";
      fields.productLength.value = "";
      dockingMiddleTouched = false;
      lastDockingDiameterPair = "";
      teeBodyLengthTouched = false;
      dimensionOverrides = {};
      update();
    });
  });
  document.querySelector("#mobileProductType")?.addEventListener("change", event => {
    fields.productType.value = event.target.value;
    fields.quoteNo.value = `${productKindName(fields.productType.value).slice(0, 2).toUpperCase()}-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-001`;
    fields.difficultyFactor.dataset.manual = "false";
    fields.difficultyFactor.value = "";
    fields.productLength.value = "";
    dockingMiddleTouched = false;
    lastDockingDiameterPair = "";
    teeBodyLengthTouched = false;
    dimensionOverrides = {};
    update();
  });
  fields.difficultyFactor.addEventListener("input", () => {
    fields.difficultyFactor.dataset.manual = fields.difficultyFactor.value.trim() === "" ? "false" : "true";
  });
  fields.difficultyFactor.addEventListener("blur", () => {
    if (fields.difficultyFactor.value.trim() === "") {
      fields.difficultyFactor.dataset.manual = "false";
      update();
    }
  });

  document.querySelector("#printQuote")?.addEventListener("click", () => window.print());
  document.querySelector("#newQuote").addEventListener("click", () => {
    quoteItems = [];
    persistQuoteList();
    dimensionOverrides = {};
    fields.quoteNo.value = `FSQ-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-001`;
    update();
  });
  document.querySelector("#saveQuote").addEventListener("click", () => {
    document.querySelector(".saved-state").textContent = "已保存";
  });
  document.querySelector("#exportDrawingPng").addEventListener("click", exportDrawingPng);
  document.querySelector("#exportDrawingPdf").addEventListener("click", exportDrawingPdf);
  document.querySelector("#exportList").addEventListener("click", exportQuoteListCsv);
  document.querySelector("#exportNxParams")?.addEventListener("click", exportNxParamsJson);
  document.querySelector("#toggleDrawingInfoPanels")?.addEventListener("click", () => {
    drawingInfoPanelsVisible = !drawingInfoPanelsVisible;
    document.querySelector("#toggleDrawingInfoPanels").textContent = drawingInfoPanelsVisible ? "\u9690\u85cf\u8bf4\u660e" : "\u663e\u793a\u8bf4\u660e";
    update();
  });
  document.querySelector("#addQuoteItem").addEventListener("click", addQuoteItem);
  document.querySelector("#clearQuoteItems").addEventListener("click", () => {
    quoteItems = [];
    persistQuoteList();
    renderQuoteList();
  });
  document.querySelectorAll("[data-quote-price-column]").forEach(input => {
    input.addEventListener("change", () => {
      const checkedCount = Array.from(document.querySelectorAll("[data-quote-price-column]")).filter(item => item.checked).length;
      if (!checkedCount) input.checked = true;
      renderQuoteList();
      persistQuoteList();
    });
  });
  document.querySelectorAll("[data-settings-category]").forEach(button => {
    button.addEventListener("click", () => {
      switchSettingsCategory(button.dataset.settingsCategory);
    });
  });
  document.querySelectorAll("[data-settings-section]").forEach(button => {
    button.addEventListener("click", () => {
      switchSettingsSection(button.dataset.settingsSection);
    });
  });
  document.querySelector("#closeSettings")?.addEventListener("click", closeSettingsPanel);
  document.querySelector(".sidebar-collapse")?.addEventListener("click", toggleSidebar);
  document.querySelector("#toggleSettings").addEventListener("click", () => {
    const panel = document.querySelector("#settingsPanel");
    if (panel.hidden && !settingsUnlocked) {
      openSettingsPasswordModal();
      return;
    }
    if (panel.hidden) {
      openSettingsPanel();
    } else {
      closeSettingsPanel();
    }
  });
  document.querySelector("#confirmSettingsPassword").addEventListener("click", confirmSettingsPassword);
  document.querySelector("#settingsPasswordInput").addEventListener("keydown", event => {
    if (event.key === "Enter") confirmSettingsPassword();
    if (event.key === "Escape") closeSettingsPasswordModal();
  });
  document.querySelector("#cancelSettingsPassword").addEventListener("click", closeSettingsPasswordModal);
  document.querySelector("#closeSettingsPassword").addEventListener("click", closeSettingsPasswordModal);
  document.querySelector("#settingsPasswordModal").addEventListener("click", event => {
    if (event.target.id === "settingsPasswordModal") closeSettingsPasswordModal();
  });
  document.querySelector("#saveSettings").addEventListener("click", savePricingSettings);
  document.querySelector("#exportSettingsExcel")?.addEventListener("click", exportSettingsExcel);
  document.querySelector("#importSettingsExcel")?.addEventListener("click", () => {
    document.querySelector("#importSettingsExcelFile")?.click();
  });
  document.querySelector("#importSettingsExcelFile")?.addEventListener("change", event => {
    importSettingsExcelFile(event.target.files?.[0]);
    event.target.value = "";
  });
  document.querySelector("#resetSettings").addEventListener("click", () => {
    Object.keys(pricing).forEach(key => delete pricing[key]);
    Object.assign(pricing, JSON.parse(JSON.stringify(defaultPricing)));
    savePricingSettings();
    renderSettings();
    const status = document.querySelector("#settingsSaveStatus");
    if (status) status.textContent = "已恢复默认价格";
    update();
  });
  document.querySelectorAll("[data-toggle-section]").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.querySelector(`#${button.dataset.toggleSection}`);
      if (!target) return;
      target.hidden = !target.hidden;
      button.textContent = target.hidden ? "展开" : "隐藏";
    });
  });

  renderSettings();
  update();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
