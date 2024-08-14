import { Point } from 'pixi.js';
import robustPointInPolygon from 'robust-point-in-polygon';
import { Vector2, Vector3 } from 'three';
import { twoDStore } from '../2d/2dStore';
import { MeasurementUnits, WallMouseSnap } from '../model/constance';
import { Corner } from '../model/corner';
import { Wall } from '../model/wall';

const pixelsPerCm = 0.5;
const cmPerPixel = 1.0 / pixelsPerCm;
const decimal = 1000;
export class Measure {
  static cmToPixel(cm: number) {
    return cm * pixelsPerCm;
  }
  static pixelToCm(pixel: number) {
    return pixel * cmPerPixel;
  }
  static MousePixelToCm(point: Point) {
    return new Vector2(this.pixelToCm(point.x), this.pixelToCm(point.y));
  }
  static VectorCmToPixel(Vector: Vector2) {
    return new Vector2(this.cmToPixel(Vector.x), this.cmToPixel(Vector.y));
  }
  static VectorPixelToCm(Vector: Vector2) {
    return new Vector2(this.pixelToCm(Vector.x), this.pixelToCm(Vector.y));
  }
  static Vector3PixelToCm(Vector: Vector3) {
    return new Vector3(
      this.pixelToCm(Vector.x),
      this.pixelToCm(Vector.y),
      this.pixelToCm(Vector.z)
    );
  }
  static Vector3CmToPixel(Vector: Vector3) {
    return new Vector3(
      this.cmToPixel(Vector.x),
      this.cmToPixel(Vector.y),
      this.cmToPixel(Vector.z)
    );
  }
  static roundOff(value: number, decimals: number) {
    return Math.round(decimals * value) / decimals;
  }
  static angleOfMiddlePoint(
    CornerStart: Corner,
    CornerMiddle: Corner,
    CornerEnd: Corner
  ) {
    const dirMidToStart = CornerStart.coordinate
      .clone()
      .sub(CornerMiddle.coordinate);
    const dirMidToEnd = CornerEnd.coordinate
      .clone()
      .sub(CornerMiddle.coordinate);
    return dirMidToStart.angleTo(dirMidToEnd);
  }
  static isClockwise(points: Corner[]) {
    // make positive
    const tSubX = Math.min(0, Math.min(...points.map((p) => p.coordinate.x)));
    const tSubY = Math.min(0, Math.min(...points.map((p) => p.coordinate.y)));

    // Translate points to make them positive
    const tNewPoints = points.map((p) => ({
      x: p.coordinate.x - tSubX,
      y: p.coordinate.y - tSubY,
    }));

    // determine CW/CCW, based on:
    // http://stackoverflow.com/questions/1165647
    let tSum = 0;
    for (let tI = 0; tI < tNewPoints.length; tI++) {
      const tC1 = tNewPoints[tI];
      let tC2;
      if (tI == tNewPoints.length - 1) {
        tC2 = tNewPoints[0];
      } else {
        tC2 = tNewPoints[tI + 1];
      }
      tSum += (tC2.x - tC1.x) * (tC2.y + tC1.y);
    }
    return tSum >= 0;
  }
  static getMiddlePoint(point1: Vector2, point2: Vector2) {
    const middleX = (point1.x + point2.x) / 2;
    const middleY = (point1.y + point2.y) / 2;

    // Create a new Vector2 object representing the middle point
    const middlePoint = new Vector2(middleX, middleY);

    return middlePoint;
  }

  static cmToMeasureUnit(cm: number, power = 1) {
    switch (twoDStore.getStore().getValue('MeasurementUnit')) {
      case 'feet':
        return `${this.roundOff(
          cm * Math.pow(0.032808416666669996953, power),
          2
        )}"`;

      case 'inch':
        return `${
          Math.round(decimal * (cm * Math.pow(0.3937, power))) / decimal
        } inch`;
      // return inches + '\'';
      case 'mm':
        return `${
          Math.round(decimal * (cm * Math.pow(10, power))) / decimal
        } mm`;
      // return '' + mm + 'mm';
      case 'cm':
        return `${Math.round(decimal * cm) / decimal} cm`;
      // return '' + Math.round(decimal * cm) / decimal + 'cm';
      case 'm':
        return ` ${
          Math.round(decimal * (cm * Math.pow(0.01, power))) / decimal
        } m`;
      case 'dm':
        return `${
          Math.round(decimal * (cm * Math.pow(0.1, power))) / decimal
        } dm`; // Adding support for decimeters
      default:
        return '';
    }
  }
  static UnitToCm(value: number, fromUnit: MeasurementUnits): number {
    switch (fromUnit) {
      case 'feet':
        return value * 30.48; // 1 foot = 30.48 cm
      case 'm':
        return value * 100; // 1 m = 100 cm
      case 'mm':
        return value * 0.1; // 1 mm = 0.1 cm
      case 'cm':
        return value; // No conversion needed
      case 'inch':
        return value * 2.54; // 1 inch = 2.54 cm
      case 'dm':
        return value * 10; // 1 dm = 10 cm
      default:
        throw new Error('Invalid length unit');
    }
  }

  static cmToUnit(cm: number, toUnit: MeasurementUnits): number {
    switch (toUnit) {
      case 'feet':
        return cm / 30.48; // 1 foot = 30.48 cm
      case 'm':
        return cm / 100; // 1 m = 100 cm
      case 'mm':
        return cm * 10; // 1 mm = 0.1 cm
      case 'cm':
        return cm; // No conversion needed
      case 'inch':
        return cm / 2.54; // 1 inch = 2.54 cm
      case 'dm':
        return cm / 10; // 1 dm = 10 cm
      default:
        throw new Error('Invalid length unit');
    }
  }
  static distance(start: Vector2, end: Vector2) {
    return Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
  }
  static distanceV3(start: Vector3, end: Vector3) {
    return Math.sqrt(
      Math.pow(end.x - start.x, 2) +
        Math.pow(end.y - start.y, 2) +
        Math.pow(end.z - start.z, 2)
    );
  }

  static SnapCoordinate(currentMouseLocation: Point) {
    // use with pixi event
    let x, y;
    x = Measure.pixelToCm(currentMouseLocation.x);
    y = Measure.pixelToCm(currentMouseLocation.y);
    const isSnap = twoDStore.getStore().getValue('snapToGrid');
    const snapTolerance = twoDStore
      .getStore()
      .getValue('gridSpacing_snapTolerance');

    if (isSnap) {
      x =
        Math.floor(
          (Math.round(x / snapTolerance) * snapTolerance) / snapTolerance
        ) * snapTolerance;
      y =
        Math.floor(
          (Math.round(y / snapTolerance) * snapTolerance) / snapTolerance
        ) * snapTolerance;
    }
    return { x, y };
  }
  static SnapDirVector(dirVector: Vector2) {
    const isSnap = twoDStore.getStore().getValue('snapToGrid');
    const snapTolerance = twoDStore
      .getStore()
      .getValue('gridSpacing_snapTolerance');

    if (isSnap) {
      dirVector.x =
        Math.floor(
          (Math.round(dirVector.x / snapTolerance) * snapTolerance) /
            snapTolerance
        ) * snapTolerance;
      dirVector.y =
        Math.floor(
          (Math.round(dirVector.y / snapTolerance) * snapTolerance) /
            snapTolerance
        ) * snapTolerance;
    }
    return dirVector;
  }
  static scaleFunction(lowerLimit: number) {
    const scale = twoDStore.getStore().getValue('gridScale');
    return Math.max(lowerLimit, lowerLimit / scale);
  }

  static isPointOnLineSegment(
    point: Vector2,
    startPoint: Vector2,
    endPoint: Vector2
  ): boolean {
    // Calculate vectors
    const lineVector = endPoint.clone().sub(startPoint);
    const pointVector = point.clone().sub(startPoint);

    // Calculate cross product
    const crossProduct = lineVector.cross(pointVector);

    // Check if the point is collinear with the line segment
    if (Math.abs(crossProduct) > Number.EPSILON + 0.001) {
      return false; // Not collinear
    }

    // Check if the point is within the bounding box of the line segment
    const minX = Math.min(startPoint.x, endPoint.x);
    const maxX = Math.max(startPoint.x, endPoint.x);
    const minY = Math.min(startPoint.y, endPoint.y);
    const maxY = Math.max(startPoint.y, endPoint.y);

    return (
      point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
    );
  }

  static pointDistanceFromLine(point: Vector2, start: Vector2, end: Vector2) {
    const tPoint = this.closestPointOnLine(point, start, end);
    const tDx = point.x - tPoint.x;
    const tDy = point.y - tPoint.y;
    return Math.sqrt(tDx * tDx + tDy * tDy);
  }

  static closestPointOnLine(point: Vector2, start: Vector2, end: Vector2) {
    // Inspired by: http://stackoverflow.com/a/6853926
    const tA = point.x - start.x;
    const tB = point.y - start.y;
    const tC = end.x - start.x;
    const tD = end.y - start.y;

    const tDot = tA * tC + tB * tD;
    const tLenSq = tC * tC + tD * tD;
    const tParam = tDot / tLenSq;

    let tXx, tYy;

    if (tParam < 0 || (start.x === end.x && start.y === end.y)) {
      tXx = start.x;
      tYy = start.y;
    } else if (tParam > 1) {
      tXx = end.x;
      tYy = end.y;
    } else {
      tXx = start.x + tParam * tC;
      tYy = start.y + tParam * tD;
    }

    return new Vector2(tXx, tYy);
  }
  static checkPointisInsidePolygon(point: Vector2, polygon: Vector2[]) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    type Point = [number, number];
    const roomPoint = polygon.map((corner) => [corner.x, corner.y] as Point);
    const pointIn = [point.x, point.y] as Point;
    //on egde or inside return true
    const result = robustPointInPolygon(roomPoint, pointIn);
    if (result == -1) {
      return true;
    } else return false;
  }
  static lineLineIntersect(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2) {
    function tCCW(p1: Vector2, p2: Vector2, p3: Vector2) {
      return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
    }

    if (
      tCCW(p1, p3, p4) !== tCCW(p2, p3, p4) &&
      tCCW(p1, p2, p3) !== tCCW(p1, p2, p4)
    ) {
      const denom =
        (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
      if (denom === 0) {
        return null; // Lines are parallel
      }
      const intersectX =
        ((p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) -
          (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)) /
        denom;
      const intersectY =
        ((p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) -
          (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)) /
        denom;
      return new Vector2(intersectX, intersectY);
    }

    return null; // No intersection
  }
  static lineLineIntersectNoBound(
    p1: Vector2,
    p2: Vector2,
    p3: Vector2,
    p4: Vector2
  ): Vector2 | null {
    const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (denom === 0) {
      return null; // Lines are parallel
    }
    const intersectX =
      ((p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) -
        (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)) /
      denom;
    const intersectY =
      ((p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) -
        (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)) /
      denom;
    return new Vector2(intersectX, intersectY);
  }

  static polygonInPolygon(polygon1: Vector2[], polygon2: Vector2[]): boolean {
    for (let i = 0; i < polygon1.length; i++) {
      const next = (i + 1) % polygon1.length;
      const edge1Start = polygon1[i];
      const edge1End = polygon1[next];

      for (let j = 0; j < polygon2.length; j++) {
        const next2 = (j + 1) % polygon2.length;
        const edge2Start = polygon2[j];
        const edge2End = polygon2[next2];

        if (
          this.lineLineIntersect(edge1Start, edge1End, edge2Start, edge2End)
        ) {
          return false; // Polygons intersect, not contained
        }
      }
    }
    if (this.checkPointisInsidePolygon(polygon1[0], polygon2)) {
      return true; // One of the vertices of polygon1 is inside polygon2, not contained
    } else {
      return false; // No intersections and no vertices of polygon1 are inside polygon2, contained
    }
  }

  static checkIfMouseIsNearAWall(mousePoint: Vector2, walls: Wall[]) {
    let minDis = Infinity;
    let wallRef: Wall | undefined = undefined;
    for (const wall of walls) {
      const distant = this.pointDistanceFromLine(
        mousePoint,
        wall.associateCorners[0].coordinate,
        wall.associateCorners[1].coordinate
      );

      if (distant < minDis) {
        minDis = distant;
        wallRef = wall;
      }
    }
    if (minDis < WallMouseSnap) {
      return wallRef;
    }
  }

  static isLookDown(dirCam: Vector3) {
    return (
      Math.abs(dirCam.dot(new Vector3(1, 0, 0))) <= 0.001 &&
      Math.abs(dirCam.dot(new Vector3(0, 0, 1))) <= 0.001
    );
  }
}
