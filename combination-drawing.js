(function exposeCombinationDrawing(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.CombinationDrawing = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createCombinationDrawing() {
  const DIMENSION = {
    baseOffset: 27,
    laneGap: 18,
    objectGap: 0,
    extensionOverrun: 5,
    textGap: 11,
    fontSize: 11
  };

  function pathData(points, mapPoint) {
    return points.map((point, index) => {
      const mapped = mapPoint(point);
      return `${index ? "L" : "M"}${mapped.x.toFixed(2)} ${mapped.y.toFixed(2)}`;
    }).join(" ");
  }

  function pointAt(point, heading, distance) {
    return {
      x: point.x + Math.cos(heading) * distance,
      y: point.y + Math.sin(heading) * distance
    };
  }

  function readableAngle(angle) {
    let value = angle * 180 / Math.PI;
    if (value > 90 || value < -90) value += 180;
    return value;
  }

  function isElbowType(type) {
    const value = String(type || "");
    return value.includes("弯头") || value.includes("45") || value.includes("90");
  }

  function circleCenter(pointA, pointB, pointC) {
    const denominator = 2 * (pointA.x * (pointB.y - pointC.y)
      + pointB.x * (pointC.y - pointA.y)
      + pointC.x * (pointA.y - pointB.y));
    if (Math.abs(denominator) < 0.01) return null;
    const squareA = pointA.x ** 2 + pointA.y ** 2;
    const squareB = pointB.x ** 2 + pointB.y ** 2;
    const squareC = pointC.x ** 2 + pointC.y ** 2;
    return {
      x: (squareA * (pointB.y - pointC.y) + squareB * (pointC.y - pointA.y) + squareC * (pointA.y - pointB.y)) / denominator,
      y: (squareA * (pointC.x - pointB.x) + squareB * (pointA.x - pointC.x) + squareC * (pointB.x - pointA.x)) / denominator
    };
  }

  function render(config, result, helpers) {
    const {
      DrawingCore, drawingColors, drawingTotalLengthText, fittingLabel, fittingLengthMm,
      inlineFittingLength, inlineFittingSvg, isNoFitting, showInfoPanels = true,
      svgTextLines, tubeSeriesLabel
    } = helpers;
    const geometry = result.geometry;
    const components = geometry.components;
    const startDiameter = components[0]?.diameter || 40;
    const endDiameter = components[components.length - 1]?.diameter || startDiameter;
    const dimensionOffsets = config.dimensionOverrides || {};
    const dimensionOffset = id => dimensionOffsets[id] || { dx: 0, dy: 0 };

    const worldEnvelope = [];
    geometry.segments.forEach(segment => worldEnvelope.push(...segment.points));
    geometry.branches.forEach(branch => worldEnvelope.push(...branch.points));
    const includeWorldFitting = ({ point, heading, diameter, fitting, reverse = false }) => {
      if (isNoFitting(fitting)) return;
      const direction = reverse ? heading + Math.PI : heading;
      worldEnvelope.push(pointAt(point, direction, fittingLengthMm(fitting, diameter, config.tubeSeries)));
    };
    includeWorldFitting({ point: geometry.start, heading: 0, diameter: startDiameter, fitting: config.fittingA, reverse: true });
    includeWorldFitting({ point: geometry.end, heading: geometry.endHeading, diameter: endDiameter, fitting: config.fittingB });
    geometry.branchEnds.forEach(branchEnd => includeWorldFitting({
      point: branchEnd.point,
      heading: branchEnd.heading,
      diameter: branchEnd.component.branchFittingDiameter,
      fitting: branchEnd.component.branchFitting
    }));

    const xs = worldEnvelope.map(point => point.x);
    const ys = worldEnvelope.map(point => point.y);
    const worldBounds = {
      left: Math.min(...xs), right: Math.max(...xs),
      top: Math.min(...ys), bottom: Math.max(...ys)
    };
    const box = showInfoPanels
      ? { left: 195, right: 1105, top: 130, bottom: 375 }
      : { left: 165, right: 1135, top: 120, bottom: 520 };
    const width = Math.max(1, worldBounds.right - worldBounds.left);
    const height = Math.max(1, worldBounds.bottom - worldBounds.top);
    const scale = Math.min((box.right - box.left) / width, (box.bottom - box.top) / height, 2.05);
    const drawingWidth = width * scale;
    const drawingHeight = height * scale;
    const offsetX = (box.left + box.right - drawingWidth) / 2 - worldBounds.left * scale;
    const offsetY = (box.top + box.bottom - drawingHeight) / 2 - worldBounds.top * scale;
    const mapPoint = point => ({ x: offsetX + point.x * scale, y: offsetY + point.y * scale });
    const drawingCenter = { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 };

    const lineMetrics = (pointA, pointB) => {
      const dx = pointB.x - pointA.x;
      const dy = pointB.y - pointA.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 3) return null;
      const unit = { x: dx / distance, y: dy / distance };
      let normal = { x: -unit.y, y: unit.x };
      const middle = { x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 };
      const radial = { x: middle.x - drawingCenter.x, y: middle.y - drawingCenter.y };
      const dot = radial.x * normal.x + radial.y * normal.y;
      if (dot < -1 || (Math.abs(dot) <= 1 && normal.y < 0)) normal = { x: -normal.x, y: -normal.y };
      return { distance, unit, normal, middle };
    };

    const componentDimensionNormal = (pointA, pointB) => {
      const metrics = lineMetrics(pointA, pointB);
      if (!metrics) return { x: 0, y: 1 };
      // Overall height is reserved on the right side of the drawing.  Keep
      // vertical component dimensions in their own left-side annotation lane.
      if (Math.abs(pointB.y - pointA.y) > Math.abs(pointB.x - pointA.x) * 1.15) {
        return { x: -1, y: 0 };
      }
      return metrics.normal;
    };

    const pointInBox = (point, box) => point.x >= box.left && point.x <= box.right
      && point.y >= box.top && point.y <= box.bottom;
    const boxOverlaps = (first, second) => first.left <= second.right && first.right >= second.left
      && first.top <= second.bottom && first.bottom >= second.top;
    const orientation = (first, second, third) => (second.x - first.x) * (third.y - first.y)
      - (second.y - first.y) * (third.x - first.x);
    const segmentsIntersect = (firstStart, firstEnd, secondStart, secondEnd) => {
      const firstA = orientation(firstStart, firstEnd, secondStart);
      const firstB = orientation(firstStart, firstEnd, secondEnd);
      const secondA = orientation(secondStart, secondEnd, firstStart);
      const secondB = orientation(secondStart, secondEnd, firstEnd);
      return firstA * firstB <= 0 && secondA * secondB <= 0;
    };
    const segmentHitsBox = (startPoint, endPoint, box) => {
      if (pointInBox(startPoint, box) || pointInBox(endPoint, box)) return true;
      const corners = [
        { x: box.left, y: box.top }, { x: box.right, y: box.top },
        { x: box.right, y: box.bottom }, { x: box.left, y: box.bottom }
      ];
      return corners.some((corner, index) => segmentsIntersect(startPoint, endPoint, corner, corners[(index + 1) % corners.length]));
    };

    const leaderOccupied = [];
    const drawingObstacles = [...geometry.segments, ...geometry.branches].map(source => {
      const mappedPoints = source.points.map(mapPoint);
      const halfWidth = Math.max(6, Math.min(39, (source.diameter || source.component?.diameter || 40) * scale * 0.21)) + 6;
      return {
        source,
        box: {
          left: Math.min(...mappedPoints.map(point => point.x)) - halfWidth,
          right: Math.max(...mappedPoints.map(point => point.x)) + halfWidth,
          top: Math.min(...mappedPoints.map(point => point.y)) - halfWidth,
          bottom: Math.max(...mappedPoints.map(point => point.y)) + halfWidth
        }
      };
    });

    const linearDimension = (pointA, pointB, label, options = {}) => {
      const metrics = lineMetrics(pointA, pointB);
      if (!metrics) return "";
      const normal = options.normal || metrics.normal;
      const halfWidth = Number(options.halfWidth) || 0;
      const lane = Number(options.lane) || 0;
      const offset = halfWidth + DIMENSION.baseOffset + lane * DIMENSION.laneGap;
      const start = { x: pointA.x + normal.x * offset, y: pointA.y + normal.y * offset };
      const end = { x: pointB.x + normal.x * offset, y: pointB.y + normal.y * offset };
      const extensionStartDistance = Number.isFinite(options.extensionStartDistance)
        ? Number(options.extensionStartDistance)
        : halfWidth + DIMENSION.objectGap;
      const extensionEndDistance = Number.isFinite(options.extensionEndDistance)
        ? Number(options.extensionEndDistance)
        : halfWidth + DIMENSION.objectGap;
      const extensionLineEnd = offset + DIMENSION.extensionOverrun;
      const textX = metrics.middle.x + normal.x * (offset + DIMENSION.textGap);
      const textY = metrics.middle.y + normal.y * (offset + DIMENSION.textGap);
      const angle = readableAngle(Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x));
      const dimensionId = options.dimensionId || "";
      const offsetValue = dimensionOffset(dimensionId);
      const wrapperStart = dimensionId
        ? `<g class="combination-dimension draggable-dimension" data-dimension-id="${dimensionId}" data-dimension-axis="vector" data-dimension-vx="${normal.x.toFixed(6)}" data-dimension-vy="${normal.y.toFixed(6)}" transform="translate(${Number(offsetValue.dx) || 0} ${Number(offsetValue.dy) || 0})">`
        : `<g class="combination-dimension">`;
      return `${wrapperStart}
        <g fill="none" stroke="${drawingColors.dimension}" stroke-width="1">
          <line x1="${pointA.x + normal.x * extensionStartDistance}" y1="${pointA.y + normal.y * extensionStartDistance}" x2="${pointA.x + normal.x * extensionLineEnd}" y2="${pointA.y + normal.y * extensionLineEnd}"/>
          <line x1="${pointB.x + normal.x * extensionEndDistance}" y1="${pointB.y + normal.y * extensionEndDistance}" x2="${pointB.x + normal.x * extensionLineEnd}" y2="${pointB.y + normal.y * extensionLineEnd}"/>
          <line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
        </g>
        <text x="${textX}" y="${textY}" transform="rotate(${angle} ${textX} ${textY})" text-anchor="middle" dominant-baseline="middle" font-size="${DIMENSION.fontSize}" fill="${drawingColors.label}">${label}</text>
      </g>`;
    };

    const dimensionBottom = (pointA, pointB, options = {}) => {
      const metrics = lineMetrics(pointA, pointB);
      if (!metrics) return -Infinity;
      const normal = options.normal || metrics.normal;
      const halfWidth = Number(options.halfWidth) || 0;
      const lane = Number(options.lane) || 0;
      const offset = halfWidth + DIMENSION.baseOffset + lane * DIMENSION.laneGap;
      const lineBottom = Math.max(pointA.y + normal.y * offset, pointB.y + normal.y * offset);
      const labelBottom = metrics.middle.y + normal.y * (offset + DIMENSION.textGap) + DIMENSION.fontSize;
      return Math.max(lineBottom, labelBottom);
    };

    const dimensionReservation = (pointA, pointB, options = {}) => {
      const metrics = lineMetrics(pointA, pointB);
      if (!metrics) return null;
      const normal = options.normal || metrics.normal;
      const halfWidth = Number(options.halfWidth) || 0;
      const lane = Number(options.lane) || 0;
      const offset = halfWidth + DIMENSION.baseOffset + lane * DIMENSION.laneGap;
      const start = { x: pointA.x + normal.x * offset, y: pointA.y + normal.y * offset };
      const end = { x: pointB.x + normal.x * offset, y: pointB.y + normal.y * offset };
      const text = {
        x: metrics.middle.x + normal.x * (offset + DIMENSION.textGap),
        y: metrics.middle.y + normal.y * (offset + DIMENSION.textGap)
      };
      return {
        left: Math.min(start.x, end.x, text.x - 42) - 5,
        right: Math.max(start.x, end.x, text.x + 42) + 5,
        top: Math.min(start.y, end.y, text.y - 9) - 5,
        bottom: Math.max(start.y, end.y, text.y + 9) + 5
      };
    };

    const reservedDimensionBoxes = [];
    geometry.segments.filter(segment => !isElbowType(segment.component.type)).forEach(segment => {
      const startPoint = mapPoint(segment.points[0]);
      const endPoint = mapPoint(segment.points[segment.points.length - 1]);
      const halfWidth = Math.max(6, Math.min(39, segment.component.diameter * scale * 0.21));
      const reservation = dimensionReservation(startPoint, endPoint, { halfWidth, normal: componentDimensionNormal(startPoint, endPoint) });
      if (reservation) reservedDimensionBoxes.push(reservation);
    });
    geometry.branches.forEach(branch => {
      const isElbowChain = branch.role === "chain" && isElbowType(branch.branchComponent?.type);
      if (isElbowChain) return;
      const startPoint = mapPoint(branch.points[0]);
      const endPoint = mapPoint(branch.points[branch.points.length - 1]);
      const diameter = branch.branchComponent?.diameter || branch.component.branchDiameter || branch.diameter;
      const halfWidth = Math.max(6, Math.min(39, diameter * scale * 0.21));
      const lane = branch.role === "straight" || branch.role === "adapter" ? 1 : 0;
      const reservation = dimensionReservation(startPoint, endPoint, { halfWidth, lane });
      if (reservation) reservedDimensionBoxes.push(reservation);
    });

    const elbowLeader = (segment, label, lane = 0) => {
      const points = segment.points;
      if (!points || points.length < 3) return "";
      const midpoint = mapPoint(points[Math.floor(points.length / 2)]);
      let outward = { x: midpoint.x - drawingCenter.x, y: midpoint.y - drawingCenter.y };
      const outwardLength = Math.hypot(outward.x, outward.y) || 1;
      outward = { x: outward.x / outwardLength, y: outward.y / outwardLength };
      const halfWidth = Math.max(6, Math.min(39, segment.component.diameter * scale * 0.21));
      // Arrow head touches the outer contour.  The leader then uses a 45°
      // shoulder and a horizontal landing, following the normal CAD callout form.
      const anchor = {
        x: midpoint.x + outward.x * (halfWidth + 2),
        y: midpoint.y + outward.y * (halfWidth + 2)
      };
      const naturalSide = outward.x >= 0 ? 1 : -1;
      const startPoint = mapPoint(points[0]);
      const endPoint = mapPoint(points[points.length - 1]);
      const isFortyFiveElbow = String(segment.component.type || "").includes("45");
      const preferredFortyFiveSide = endPoint.x >= startPoint.x ? -1 : 1;
      const preferredFortyFiveVertical = outward.y >= 0 ? 1 : -1;
      const candidates = [-1, 1].flatMap(vertical => [naturalSide, -naturalSide].flatMap(side => [1, 1.6, 2.2].map(multiplier => {
        const shoulder = (26 + lane * 14) * multiplier;
        const knee = {
          x: anchor.x + side * shoulder,
          y: anchor.y + vertical * shoulder
        };
        const landingEnd = { x: knee.x + side * 42, y: knee.y };
        const labelBox = {
          left: Math.min(knee.x, landingEnd.x) - 8,
          right: Math.max(knee.x, landingEnd.x) + 8,
          top: knee.y + (vertical > 0 ? 4 : -22),
          bottom: knee.y + (vertical > 0 ? 22 : -4)
        };
        const hitsDrawing = drawingObstacles.some(obstacle => obstacle.source !== segment
          && (segmentHitsBox(anchor, knee, obstacle.box) || segmentHitsBox(knee, landingEnd, obstacle.box) || boxOverlaps(labelBox, obstacle.box)));
        const hitsDimension = reservedDimensionBoxes.some(box => segmentHitsBox(anchor, knee, box)
          || segmentHitsBox(knee, landingEnd, box) || boxOverlaps(labelBox, box));
        const overlapsLeader = leaderOccupied.some(box => boxOverlaps(labelBox, box));
        const fortyFivePreference = isFortyFiveElbow
          ? (side !== preferredFortyFiveSide ? 90 : 0) + (vertical !== preferredFortyFiveVertical ? 70 : 0)
          : 0;
        return { side, vertical, knee, landingEnd, labelBox, score: (hitsDrawing ? 1000 : 0) + (hitsDimension ? 800 : 0) + (overlapsLeader ? 500 : 0) + fortyFivePreference + (vertical > 0 ? 12 : 0) + (side !== naturalSide ? 4 : 0) + multiplier };
      })));
      const choice = candidates.sort((first, second) => first.score - second.score)[0];
      leaderOccupied.push(choice.labelBox);
      const textX = (choice.knee.x + choice.landingEnd.x) / 2;
      const textY = choice.knee.y + (choice.vertical > 0 ? 14 : -5);
      return `<g class="combination-elbow-leader" fill="none" stroke="${drawingColors.dimension}" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter">
        <polyline points="${choice.landingEnd.x},${choice.landingEnd.y} ${choice.knee.x},${choice.knee.y} ${anchor.x},${anchor.y}" marker-end="url(#arrow)"/>
        <text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="${choice.vertical > 0 ? "hanging" : "auto"}" font-size="${DIMENSION.fontSize}" fill="${drawingColors.label}" stroke="none">${label}</text>
      </g>`;
    };

    const lineIntersection = (pointA, unitA, pointB, unitB) => {
      const cross = unitA.x * unitB.y - unitA.y * unitB.x;
      if (Math.abs(cross) < 0.001) return null;
      const dx = pointB.x - pointA.x;
      const dy = pointB.y - pointA.y;
      const t = (dx * unitB.y - dy * unitB.x) / cross;
      return { x: pointA.x + unitA.x * t, y: pointA.y + unitA.y * t };
    };

    const unitBetween = (from, to) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.hypot(dx, dy) || 1;
      return { x: dx / length, y: dy / length };
    };

    const dimensionLengthText = (length, diameter) =>
      drawingTotalLengthText(length, diameter).replace(/^L=/, "");

    const elbowSegmentDimension = (segment, label, options = {}) => {
      const points = segment.points;
      const dimensionComponent = segment.branchComponent || segment.component;
      if (!String(dimensionComponent.type || "").includes("45") || !points || points.length < 3) {
        return elbowLeader(segment, label, options.lane || 0);
      }
      const mappedPoints = points.map(mapPoint);
      const startPoint = mappedPoints[0];
      const secondPoint = mappedPoints[1];
      const endPoint = mappedPoints[mappedPoints.length - 1];
      const beforeEndPoint = mappedPoints[mappedPoints.length - 2];
      const startUnit = unitBetween(startPoint, secondPoint);
      const endUnit = unitBetween(beforeEndPoint, endPoint);
      const tangentCorner = lineIntersection(startPoint, startUnit, endPoint, endUnit) || {
        x: (startPoint.x + endPoint.x) / 2,
        y: (startPoint.y + endPoint.y) / 2
      };
      const endBase = options.extendEnd
        ? { x: endPoint.x + endUnit.x * options.extendEnd, y: endPoint.y + endUnit.y * options.extendEnd }
        : endPoint;
      const halfWidth = Math.max(6, Math.min(39, dimensionComponent.diameter * scale * 0.21));
      return linearDimension(tangentCorner, endBase, label, {
        halfWidth,
        lane: options.lane || 0,
        dimensionId: options.dimensionId,
        normal: componentDimensionNormal(tangentCorner, endBase)
      });
    };

    const segmentSvg = geometry.segments.map(segment => {
      const strokeWidth = Math.max(12, Math.min(78, segment.component.diameter * scale * 0.42));
      const d = pathData(segment.points, mapPoint);
      return `<path d="${d}" fill="none" stroke="${drawingColors.stroke}" stroke-width="${strokeWidth + 4}" stroke-linecap="butt" stroke-linejoin="round"/>
        <path d="${d}" fill="none" stroke="${drawingColors.pipeFill}" stroke-width="${strokeWidth}" stroke-linecap="butt" stroke-linejoin="round"/>
        <path d="${d}" fill="none" stroke="${drawingColors.center || "#8a918f"}" stroke-width="0.9" stroke-dasharray="10 4 2 4"/>`;
    }).join("");
    const branchSvg = geometry.branches.map(branch => {
      const strokeWidth = Math.max(12, Math.min(78, branch.diameter * scale * 0.42));
      const d = pathData(branch.points, mapPoint);
      return `<path d="${d}" fill="none" stroke="${drawingColors.stroke}" stroke-width="${strokeWidth + 4}" stroke-linecap="butt" stroke-linejoin="round"/>
        <path d="${d}" fill="none" stroke="${drawingColors.pipeFill}" stroke-width="${strokeWidth}" stroke-linecap="butt" stroke-linejoin="round"/>
        <path d="${d}" fill="none" stroke="${drawingColors.center || "#8a918f"}" stroke-width="0.9" stroke-dasharray="10 4 2 4"/>`;
    }).join("");

    // Threaded, double-card and ring-press fittings intentionally overlap the
    // pipe by 6px to avoid a visible drawing gap.  Local pipe dimensions must
    // start at that visible pipe edge instead of the hidden geometric joint.
    const fittingPipeOverlap = fitting => ["外丝", "内丝", "双卡", "环压", "插焊"].includes(fitting) ? 6 : 0;
    const shiftTowards = (point, target, distance) => {
      const dx = target.x - point.x;
      const dy = target.y - point.y;
      const length = Math.hypot(dx, dy) || 1;
      return { x: point.x + dx / length * distance, y: point.y + dy / length * distance };
    };
    const isSingleElbow = geometry.segments.length === 1
      && !geometry.branches.length
      && isElbowType(geometry.segments[0]?.component?.type);
    const isSingleFortyFiveElbow = isSingleElbow
      && String(geometry.segments[0]?.component?.type || "").includes("45");
    const isSingleNinetyElbow = isSingleElbow && !isSingleFortyFiveElbow;
    const singleElbowComponent = isSingleElbow ? geometry.segments[0].component : null;
    const singleElbowPipeHeight = singleElbowComponent
      ? Math.max(12, Math.min(78, singleElbowComponent.diameter * scale * 0.42))
      : 0;
    const singleElbowAHeight = singleElbowComponent
      ? singleElbowComponent.length + inlineFittingLength(config.fittingA, singleElbowComponent.diameter, singleElbowPipeHeight)
      : 0;
    const singleElbowBHeight = singleElbowComponent
      ? singleElbowComponent.length + inlineFittingLength(config.fittingB, singleElbowComponent.diameter, singleElbowPipeHeight)
      : 0;

    const adjacentElbowDimensionRules = index => {
      const previousSegment = geometry.segments[index - 1];
      const nextSegment = geometry.segments[index + 1];
      return {
        // Adjacent elbow dimensions start extension lines from the centerline
        // tangent point, not from the hidden joint covered by the elbow body.
        extensionStartDistance: previousSegment && isElbowType(previousSegment.component.type) ? 0 : undefined,
        extensionEndDistance: nextSegment && isElbowType(nextSegment.component.type) ? 0 : undefined
      };
    };

    const mainSegmentDimensionSpec = (segment, index) => {
      let startPoint = mapPoint(segment.points[0]);
      let endPoint = mapPoint(segment.points[segment.points.length - 1]);
      if (isElbowType(segment.component.type)) {
        if (isSingleNinetyElbow) return null;
        const dimensionLength = isSingleFortyFiveElbow
          ? singleElbowBHeight
          : segment.component.length;
        const dimensionText = dimensionLengthText(dimensionLength, segment.component.diameter);
        const label = isSingleFortyFiveElbow
          ? `H=${dimensionText}`
          : `${index + 1}  H=${dimensionText}`;
        const endExtend = index === geometry.segments.length - 1
          ? inlineFittingLength(config.fittingB, segment.component.diameter, Math.max(12, Math.min(78, segment.component.diameter * scale * 0.42)))
          : 0;
        return {
          kind: "elbow",
          segment,
          label,
          options: {
            lane: isSingleFortyFiveElbow ? 1 : 0,
            dimensionId: `combination-main-${index + 1}`,
            extendEnd: endExtend
          }
        };
      }
      if (index === 0) {
        startPoint = shiftTowards(startPoint, endPoint, fittingPipeOverlap(config.fittingA));
      }
      if (index === geometry.segments.length - 1) {
        endPoint = shiftTowards(endPoint, startPoint, fittingPipeOverlap(config.fittingB));
      }
      const halfWidth = Math.max(6, Math.min(39, segment.component.diameter * scale * 0.21));
      const isSingleStraight = geometry.segments.length === 1 && !geometry.branches.length;
      return {
        kind: "linear",
        startPoint,
        endPoint,
        label: `${index + 1}  L=${Math.ceil(segment.component.length)} mm`,
        options: {
          halfWidth,
          dimensionId: `combination-main-${index + 1}`,
          // A single straight component also has an overall dimension below it.
          // Keep its local pipe-length dimension above the pipe so large fittings
          // cannot force both labels into the same lower annotation lane.
          normal: isSingleStraight ? { x: 0, y: -1 } : componentDimensionNormal(startPoint, endPoint),
          ...adjacentElbowDimensionRules(index)
        }
      };
    };

    const renderDimensionSpec = spec => {
      if (!spec) return "";
      if (spec.kind === "elbow") {
        return elbowSegmentDimension(spec.segment, spec.label, spec.options);
      }
      return linearDimension(spec.startPoint, spec.endPoint, spec.label, spec.options);
    };

    const componentDimensionSvg = geometry.segments
      .map((segment, index) => renderDimensionSpec(mainSegmentDimensionSpec(segment, index)))
      .join("");

    const branchDimensionSpec = branch => {
      const startPoint = mapPoint(branch.points[0]);
      const endPoint = mapPoint(branch.points[branch.points.length - 1]);
      const parentIndex = components.indexOf(branch.component) + 1;
      const itemLabel = `${parentIndex}.${branch.branchIndex + 1}`;
      if (isElbowType(branch.branchComponent.type)) {
        const dimensionText = dimensionLengthText(branch.branchComponent.length, branch.branchComponent.diameter);
        return {
          kind: "elbow",
          segment: branch,
          label: `${itemLabel}  H=${dimensionText}`,
          options: {
            lane: 1,
            dimensionId: `combination-branch-${parentIndex}-${branch.branchIndex + 1}`
          }
        };
      }
      const halfWidth = Math.max(6, Math.min(39, branch.branchComponent.diameter * scale * 0.21));
      return {
        kind: "linear",
        startPoint,
        endPoint,
        label: `${itemLabel}  L=${Math.ceil(branch.branchComponent.length)}`,
        options: {
          halfWidth,
          dimensionId: `combination-branch-${parentIndex}-${branch.branchIndex + 1}`
        }
      };
    };

    const branchComponentDimensionSvg = geometry.branches
      .filter(branch => branch.role === "chain")
      .map(branch => renderDimensionSpec(branchDimensionSpec(branch)))
      .join("");

    const start = mapPoint(geometry.start);
    const end = mapPoint(geometry.end);
    const endpoint = (point, heading, diameter, fitting, side) => {
      if (isNoFitting(fitting)) return "";
      const pipeHeight = Math.max(12, Math.min(78, diameter * scale * 0.42));
      const angle = heading * 180 / Math.PI;
      const labelX = point.x + (side === "left" ? -18 : 18);
      const specPoint = pointAt(
        point,
        side === "left" ? heading + Math.PI : heading,
        inlineFittingLength(fitting, diameter, pipeHeight) + 20
      );
      return `<g transform="rotate(${angle} ${point.x} ${point.y})">
        ${inlineFittingSvg(fitting, diameter, point.x, point.y, pipeHeight, side)}
        <text x="${labelX}" y="${point.y + 4}" text-anchor="middle" font-size="11" fill="${drawingColors.label}">${side === "left" ? "A" : "B"}端</text>
      </g>
      <text x="${specPoint.x}" y="${specPoint.y - 4}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="${drawingColors.label}">${diameter} ${fittingLabel(fitting)}</text>`;
    };
    const branchEndpointSvg = geometry.branchEnds.map(branchEnd => {
      const component = branchEnd.component;
      const point = mapPoint(branchEnd.point);
      const diameter = component.branchFittingDiameter;
      const fitting = component.branchFitting;
      if (isNoFitting(fitting)) return "";
      const pipeHeight = Math.max(12, Math.min(78, diameter * scale * 0.42));
      const angle = branchEnd.heading * 180 / Math.PI;
      const labelPoint = pointAt(point, branchEnd.heading, inlineFittingLength(fitting, diameter, pipeHeight) + 18);
      const centerLabelX = point.x + Math.max(8, inlineFittingLength(fitting, diameter, pipeHeight) * 0.45);
      return `<g transform="rotate(${angle} ${point.x} ${point.y})">
        ${inlineFittingSvg(fitting, diameter, point.x, point.y, pipeHeight, "right")}
        <text x="${centerLabelX}" y="${point.y + 4}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="${drawingColors.label}">支口</text>
      </g>
      <text x="${labelPoint.x}" y="${labelPoint.y}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="${drawingColors.label}">${diameter} ${fittingLabel(fitting)}</text>`;
    }).join("");

    const visualEnvelope = [];
    const includeVisualPipe = source => {
      const diameter = source.diameter || source.component?.diameter || 40;
      const halfWidth = Math.max(6, Math.min(39, diameter * scale * 0.21)) + 2;
      source.points.map(mapPoint).forEach(point => {
        visualEnvelope.push(
          { x: point.x - halfWidth, y: point.y - halfWidth },
          { x: point.x + halfWidth, y: point.y + halfWidth }
        );
      });
    };
    geometry.segments.forEach(includeVisualPipe);
    geometry.branches.forEach(includeVisualPipe);
    const includeVisualFitting = ({ point, heading, diameter, fitting, reverse = false }) => {
      if (isNoFitting(fitting)) return null;
      const direction = reverse ? heading + Math.PI : heading;
      const mapped = mapPoint(point);
      const pipeHeight = Math.max(12, Math.min(78, diameter * scale * 0.42));
      const outer = pointAt(mapped, direction, inlineFittingLength(fitting, diameter, pipeHeight));
      visualEnvelope.push(outer);
      return outer;
    };
    const startOuter = includeVisualFitting({ point: geometry.start, heading: 0, diameter: startDiameter, fitting: config.fittingA, reverse: true });
    const endOuter = includeVisualFitting({ point: geometry.end, heading: geometry.endHeading, diameter: endDiameter, fitting: config.fittingB });
    const branchVisualOuters = geometry.branchEnds.map(branchEnd => includeVisualFitting({
      point: branchEnd.point,
      heading: branchEnd.heading,
      diameter: branchEnd.component.branchFittingDiameter,
      fitting: branchEnd.component.branchFitting
    }));

    const localDimensions = [];

    geometry.branchEnds.forEach((branchEnd, branchEndIndex) => {
      const component = branchEnd.component;
      const parentIndex = components.indexOf(component) + 1;
      const bodySegment = geometry.branches.find(branch => branch.component === component && branch.role === "body");
      if (!bodySegment) return;
      const branchStart = mapPoint(bodySegment.points[0]);
      const branchBodyEnd = mapPoint(bodySegment.points[bodySegment.points.length - 1]);
      const bodyHalfWidth = Math.max(6, Math.min(39, component.branchDiameter * scale * 0.21));
      localDimensions.push(linearDimension(branchStart, branchBodyEnd, `${parentIndex}  支高 H=${Math.ceil(component.branchLength)}`, {
        halfWidth: bodyHalfWidth,
        dimensionId: `combination-tee-branch-${parentIndex}`
      }));
      const middleSegment = geometry.branches.find(branch => branch.component === component && (branch.role === "straight" || branch.role === "adapter"));
      const branchOutletDiameter = component.branchComponents[component.branchComponents.length - 1]?.diameter || component.branchDiameter;
      if (middleSegment) {
        const middleStart = mapPoint(middleSegment.points[0]);
        const middleEnd = mapPoint(middleSegment.points[middleSegment.points.length - 1]);
        const middleLength = component.branchMiddle === "直管"
          ? component.branchMiddleLength
          : fittingLengthMm("中接", Math.max(branchOutletDiameter, component.branchFittingDiameter), config.tubeSeries);
        const middleHalfWidth = Math.max(6, Math.min(39, Math.max(branchOutletDiameter, component.branchFittingDiameter) * scale * 0.21));
        localDimensions.push(linearDimension(middleStart, middleEnd, `${component.branchMiddle} ${Math.ceil(middleLength)}`, {
          halfWidth: middleHalfWidth,
          lane: 1,
          dimensionId: `combination-tee-middle-${parentIndex}`
        }));
      }
    });

    const componentDimensionBottoms = geometry.segments
      .filter(segment => !isElbowType(segment.component.type))
      .map(segment => {
        const startPoint = mapPoint(segment.points[0]);
        const endPoint = mapPoint(segment.points[segment.points.length - 1]);
        const halfWidth = Math.max(6, Math.min(39, segment.component.diameter * scale * 0.21));
        return dimensionBottom(startPoint, endPoint, { halfWidth, normal: componentDimensionNormal(startPoint, endPoint) });
      });
    const branchDimensionBottoms = geometry.branches.map(branch => {
      const startPoint = mapPoint(branch.points[0]);
      const endPoint = mapPoint(branch.points[branch.points.length - 1]);
      const diameter = branch.branchComponent?.diameter || branch.component.branchDiameter || branch.diameter;
      const halfWidth = Math.max(6, Math.min(39, diameter * scale * 0.21));
      const lane = branch.role === "straight" || branch.role === "adapter" ? 1 : 0;
      return dimensionBottom(startPoint, endPoint, { halfWidth, lane });
    });

    const visualXs = visualEnvelope.map(point => point.x);
    const visualYs = visualEnvelope.map(point => point.y);
    const minVisualX = Math.min(...visualXs);
    const maxVisualX = Math.max(...visualXs);
    const minVisualY = Math.min(...visualYs);
    const maxVisualY = Math.max(...visualYs);
    const worldWidth = worldBounds.right - worldBounds.left;
    const worldHeight = worldBounds.bottom - worldBounds.top;
    const centerHeight = geometry.bounds.bottom - geometry.bounds.top;
    const centerMinY = offsetY + geometry.bounds.top * scale;
    const centerMaxY = offsetY + geometry.bounds.bottom * scale;
    const maxDiameter = Math.max(...components.flatMap(component => [component.diameter, component.branchDiameter || 0]));
    const maxDimensionHalfWidth = Math.max(6, Math.min(39, maxDiameter * scale * 0.21));
    const localDimensionDepth = maxDimensionHalfWidth + DIMENSION.baseOffset + DIMENSION.laneGap + DIMENSION.textGap;
    // Hidden info panels still leave the technical note and title block in the
    // lower frame area. Keep the expanded drawing and its overall dimension out
    // of that reserved band so the dimension line does not run through it.
    const annotationBottom = Math.max(maxVisualY, ...componentDimensionBottoms, ...branchDimensionBottoms,
      ...leaderOccupied.map(box => box.bottom));
    const overallDimensionLimit = showInfoPanels ? 458 : 610;
    const overallBaseGap = showInfoPanels ? 84 : 118;
    const calculatedOverallY = Math.max(
      maxVisualY + Math.max(overallBaseGap, localDimensionDepth + 34),
      annotationBottom + DIMENSION.laneGap + 30
    );
    const overallY = showInfoPanels
      ? Math.min(overallDimensionLimit, calculatedOverallY)
      : Math.min(overallDimensionLimit, Math.max(600, calculatedOverallY));
    const singleElbowDimensionEnd = (() => {
      if (!isSingleElbow) return null;
      const points = geometry.segments[0].points.map(mapPoint);
      const startPoint = points[0];
      const secondPoint = points[1];
      const endPoint = points[points.length - 1];
      const beforeEndPoint = points[points.length - 2];
      const tangentCorner = lineIntersection(
        startPoint,
        unitBetween(startPoint, secondPoint),
        endPoint,
        unitBetween(beforeEndPoint, endPoint)
      );
      return tangentCorner || { x: (startPoint.x + endPoint.x) / 2, y: (startPoint.y + endPoint.y) / 2 };
    })();
    const singleElbowDimensionSpec = isSingleElbow ? {
      centerPoint: singleElbowDimensionEnd,
      horizontalStartX: startOuter?.x ?? minVisualX,
      horizontalEndX: singleElbowDimensionEnd?.x ?? maxVisualX,
      horizontalY: maxVisualY + Math.max(30, maxDimensionHalfWidth + 18),
      horizontalLabel: `H=${dimensionLengthText(singleElbowAHeight, maxDiameter)}`,
      verticalLabel: `H=${dimensionLengthText(singleElbowBHeight, maxDiameter)}`
    } : null;
    const overallLabel = isSingleElbow
      ? singleElbowDimensionSpec.horizontalLabel
      : `总长 ${drawingTotalLengthText(worldWidth, maxDiameter)}`;
    const overallDimensionY = isSingleElbow
      ? singleElbowDimensionSpec.horizontalY
      : overallY;
    const overallDimensions = [DrawingCore.horizontalDimension({
      x1: isSingleElbow ? singleElbowDimensionSpec.horizontalStartX : minVisualX,
      x2: isSingleElbow ? singleElbowDimensionSpec.horizontalEndX : maxVisualX,
      y: overallDimensionY,
      extensionStart: { fromY: maxVisualY, toY: overallDimensionY + 5 },
      extensionEnd: { fromY: maxVisualY, toY: overallDimensionY + 5 },
      label: overallLabel,
      color: drawingColors.dimension, labelColor: drawingColors.label,
      lineWidth: 1.35, labelY: overallDimensionY - 11,
      dimensionId: "combination-total",
      offset: dimensionOffset("combination-total")
    })];
    if (isSingleNinetyElbow && singleElbowDimensionSpec?.centerPoint) {
      const overallX = Math.min(1160, maxVisualX + 45);
      overallDimensions.push(DrawingCore.verticalDimension({
        x: overallX,
        y1: endOuter?.y ?? centerMinY,
        y2: singleElbowDimensionSpec.centerPoint.y,
        extensionTop: { fromX: maxVisualX, toX: overallX + 5 },
        extensionBottom: { fromX: singleElbowDimensionSpec.centerPoint.x, toX: overallX + 5 },
        label: singleElbowDimensionSpec.verticalLabel,
        color: drawingColors.dimension,
        labelColor: drawingColors.label,
        lineWidth: 1.35,
        labelOffset: -15,
        dimensionId: "combination-elbow-b",
        offset: dimensionOffset("combination-elbow-b")
      }));
    } else if (!isSingleElbow && centerHeight > Math.max(10, maxDiameter * 0.25)) {
      const overallX = Math.min(1160, maxVisualX + 62);
      overallDimensions.push(DrawingCore.verticalDimension({
        x: overallX, y1: centerMinY, y2: centerMaxY,
        extensionTop: { fromX: maxVisualX, toX: overallX + 5 },
        extensionBottom: { fromX: maxVisualX, toX: overallX + 5 },
        label: `总高 H=${Math.ceil(centerHeight)} mm`,
        color: drawingColors.dimension, labelColor: drawingColors.label,
        lineWidth: 1.35, labelOffset: 15,
        dimensionId: "combination-total-height",
        offset: dimensionOffset("combination-total-height")
      }));
    }

    const title = `${components.length}段 组合件`;
    const infoHeight = Math.min(150, Math.max(110, 54 + result.bomRows.length * 12));
    const bomFontSize = result.bomRows.length > 9 ? 8 : 10;
    const bomLineHeight = Math.min(13, Math.max(7, (infoHeight - 56) / Math.max(1, result.bomRows.length)));
    const layer = DrawingCore.layer || ((name, body, attributes = "") => `<g data-layer="${name}"${attributes ? ` ${attributes}` : ""}>${body || ""}</g>`);
    return `
      <defs>${DrawingCore.arrowMarker(drawingColors.dimension)}</defs>
      ${layer("frame", DrawingCore.engineeringFrame(config.quoteNo))}
      ${layer("object", `${segmentSvg}${branchSvg}${branchEndpointSvg}${endpoint(start, 0, startDiameter, config.fittingA, "left")}${endpoint(end, geometry.endHeading, endDiameter, config.fittingB, "right")}`)}
      ${layer("dimension", `${componentDimensionSvg}${branchComponentDimensionSvg}${localDimensions.join("")}${overallDimensions.join("")}`)}
      ${showInfoPanels ? DrawingCore.infoBox({ x: 180, y: 470, width: 300, height: infoHeight, title: "尺寸说明", content: `<text x="18" y="58" font-size="13" fill="${drawingColors.label}">总尺寸包含A、B端及支口配件</text><text x="18" y="82" font-size="13" fill="${drawingColors.label}">H：中心高　L：直线长度　单位：mm</text>` }) : ""}
      ${showInfoPanels ? DrawingCore.infoBox({ x: 500, y: 470, width: 300, height: infoHeight, title: "技术参数", content: `<text x="18" y="58" font-size="13" fill="${drawingColors.label}">材质：不锈钢 ${config.material}</text><text x="18" y="82" font-size="13" fill="${drawingColors.label}">组件：${components.length} 段</text><text x="18" y="104" font-size="13" fill="${drawingColors.label}">单位：mm</text>` }) : ""}
      ${showInfoPanels ? DrawingCore.bomBox({ x: 820, y: 470, width: 300, height: infoHeight, rows: result.bomRows, labelColor: drawingColors.label, lineHeight: bomLineHeight, fontSize: bomFontSize }) : ""}
      ${DrawingCore.technicalRequirements({ y: 625, lines: ["1、组合件各接口应贴合，不得留有可见间隙；", "2、组件方向以图示为准；", "3、未注尺寸公差按GB/T1804-2000m。"] })}
      ${DrawingCore.titleBlock({ y: 675, material: config.material, titleSvg: svgTextLines(title, 613.5, 72, { maxChars: 22, lineHeight: 16, fontSize: 14 }), productLabel: `${tubeSeriesLabel[config.tubeSeries] || ""}组合定制产品` })}
    `;
  }

  return { render };
});
