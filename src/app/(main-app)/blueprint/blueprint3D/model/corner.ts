import { nanoid } from 'nanoid';
import { Vector2 } from 'three';
import { CornerView } from '../2d/graphics-elements/cornerView';
// import { ObjectModify } from '../helper/objectModifyManager';
import { WallEgdeUpdate } from '../3d/graphics-element/room/wallView3D';
import { Measure } from '../helper/measure';
import { Wall } from './wall';
export class Corner {
  public coordinate: Vector2; //incm
  public id: string;
  public associateWalls: Wall[];
  private _view?: CornerView;
  constructor(x: number, y: number, id?: string) {
    this.coordinate = new Vector2(x, y);
    this.id = id || nanoid(10);
    this.associateWalls = [];
  }
  // createObjectModify() {
  //   const cornerObjectModify: ObjectModify = {
  //     type: 'corner',
  //     id: { value: this.coordinate.x, display: 'change' },
  //     x_coordinate: { value: this.coordinate.x, display: 'change' },
  //     y_coordinate: { value: this.coordinate.y, display: 'change' },
  //   };
  //   return cornerObjectModify;
  // }
  // applyObjectModify(cornerObjectModify: ObjectModify) {
  //   this.coordinate.x = cornerObjectModify.x_coordinate;
  //   this.coordinate.y = cornerObjectModify.y_coordinate;
  // }
  set view(cornerView: CornerView) {
    this._view = cornerView;
  }
  get view(): CornerView | undefined {
    return this._view;
  }
  attachWall(wall: Wall) {
    this.associateWalls.push(wall);
  }
  detachWall(wall: Wall) {
    const index = this.associateWalls.indexOf(wall);

    if (index !== -1) {
      this.associateWalls.splice(index, 1);
    }
  }
  get associateCorners() {
    const corners: Corner[] = [];
    for (const wall of this.associateWalls) {
      corners.push(
        ...wall.associateCorners.filter((corner) => corner !== this)
      );
    }
    return corners;
  }
  moveTo(
    x: number,
    y: number //cm
  ) {
    this.coordinate.x = x;
    this.coordinate.y = y;
  }
  moveToVector(
    vec: Vector2 //cm
  ) {
    this.coordinate.x = vec.x;
    this.coordinate.y = vec.y;
  }

  updateEdge() {
    if (this.associateWalls.length == 2) {
      const wall1 = this.associateWalls[0];
      const wall2 = this.associateWalls[1];
      // const wall1Thick = Measure.cmToPixel(this.associateWalls[0].thickNess);
      // const wall2Thick = Measure.cmToPixel(this.associateWalls[1].thickNess);
      const wall1StartCorner = wall1.isStartCorner(this);
      const wall2StartCorner = wall2.isStartCorner(this);
      const wall1UpdateInfo: WallEgdeUpdate = {
        inWallStart: 0,
        inWallEnd: 0,
        outWallStart: 0,
        outWallEnd: 0,
      };
      const wall2UpdateInfo: WallEgdeUpdate = {
        inWallStart: 0,
        inWallEnd: 0,
        outWallStart: 0,
        outWallEnd: 0,
      };

      const angle = wall1.wallDirection.angleTo(wall2.wallDirection);
      if (angle == 0 && angle == Math.PI) return;

      const {
        startOutWallPoint: startOutWallPoint1,
        endOutWallPoint: endOutWallPoint1,
        endInWallPoint: endInWallPoint1,
        startInWallPoint: startInWallPoint1,
      } = this.associateWalls[0].WallCorners;
      const {
        startOutWallPoint: startOutWallPoint2,
        endOutWallPoint: endOutWallPoint2,
        endInWallPoint: endInWallPoint2,
        startInWallPoint: startInWallPoint2,
      } = this.associateWalls[1].WallCorners;

      const intersectOutWall = Measure.lineLineIntersectNoBound(
        startOutWallPoint1,
        endOutWallPoint1,
        startOutWallPoint2,
        endOutWallPoint2
      );
      const intersectInWall = Measure.lineLineIntersectNoBound(
        startInWallPoint1,
        endInWallPoint1,
        startInWallPoint2,
        endInWallPoint2
      );
      if (!intersectOutWall || !intersectInWall) return;
      const isIntersectOnInWall1 = Measure.isPointOnLineSegment(
        intersectInWall,
        startInWallPoint1,
        endInWallPoint1
      );
      const isIntersectOnOutWall1 = Measure.isPointOnLineSegment(
        intersectOutWall,
        startOutWallPoint1,
        endOutWallPoint1
      );
      const isIntersectOnInWall2 = Measure.isPointOnLineSegment(
        intersectInWall,
        startInWallPoint2,
        endInWallPoint2
      );
      const isIntersectOnOutWall2 = Measure.isPointOnLineSegment(
        intersectOutWall,
        startOutWallPoint2,
        endOutWallPoint2
      );

      if (wall1StartCorner && !wall2StartCorner) {
        //outWalls
        const outDis1 = Measure.distance(intersectOutWall, startOutWallPoint1);
        wall1UpdateInfo.outWallStart = isIntersectOnOutWall1
          ? outDis1
          : -outDis1;

        const outDis2 = Measure.distance(intersectOutWall, endOutWallPoint2);
        wall2UpdateInfo.outWallEnd = isIntersectOnOutWall2 ? -outDis2 : outDis2;

        //inWalls
        const inDis1 = Measure.distance(intersectInWall, startInWallPoint1);
        wall1UpdateInfo.inWallStart = isIntersectOnInWall1 ? inDis1 : -inDis1;

        const inDis2 = Measure.distance(intersectInWall, endInWallPoint2);
        wall2UpdateInfo.inWallEnd = isIntersectOnInWall2 ? -inDis2 : inDis2;
      }
      if (!wall1StartCorner && wall2StartCorner) {
        //outWalls
        const outDis1 = Measure.distance(intersectOutWall, endOutWallPoint1);
        wall1UpdateInfo.outWallEnd = isIntersectOnOutWall1 ? -outDis1 : outDis1;

        const outDis2 = Measure.distance(intersectOutWall, startOutWallPoint2);
        wall2UpdateInfo.outWallStart = isIntersectOnOutWall2
          ? outDis2
          : -outDis2;

        //inWalls
        const inDis1 = Measure.distance(intersectInWall, endInWallPoint1);
        wall1UpdateInfo.inWallEnd = isIntersectOnInWall1 ? -inDis1 : inDis1;

        const inDis2 = Measure.distance(intersectInWall, startInWallPoint2);
        wall2UpdateInfo.inWallStart = isIntersectOnInWall2 ? inDis2 : -inDis2;
      }
      if (wall1StartCorner && wall2StartCorner) {
        //outWalls
        const outDis1 = Measure.distance(intersectOutWall, startOutWallPoint1);
        wall1UpdateInfo.outWallStart = isIntersectOnOutWall1
          ? outDis1
          : -outDis1;

        const outDis2 = Measure.distance(intersectOutWall, startOutWallPoint2);
        wall2UpdateInfo.outWallStart = isIntersectOnOutWall2
          ? outDis2
          : -outDis2;

        //inWalls
        const inDis1 = Measure.distance(intersectInWall, startInWallPoint1);
        wall1UpdateInfo.inWallStart = isIntersectOnInWall1 ? inDis1 : -inDis1;

        const inDis2 = Measure.distance(intersectInWall, startInWallPoint2);
        wall2UpdateInfo.inWallStart = isIntersectOnInWall2 ? inDis2 : -inDis2;
      }

      if (!wall1StartCorner && !wall2StartCorner) {
        //outWalls
        const outDis1 = Measure.distance(intersectOutWall, endOutWallPoint1);
        wall1UpdateInfo.outWallEnd = isIntersectOnOutWall1 ? -outDis1 : outDis1;

        const outDis2 = Measure.distance(intersectOutWall, endOutWallPoint2);
        wall2UpdateInfo.outWallEnd = isIntersectOnOutWall2 ? -outDis2 : outDis2;

        //inWalls
        const inDis1 = Measure.distance(intersectInWall, endInWallPoint1);
        wall1UpdateInfo.inWallEnd = isIntersectOnInWall1 ? -inDis1 : inDis1;

        const inDis2 = Measure.distance(intersectInWall, endInWallPoint2);
        wall2UpdateInfo.inWallEnd = isIntersectOnInWall2 ? -inDis2 : inDis2;
      }
      wall1.view3D?.updateEgde(wall1UpdateInfo);
      wall2.view3D?.updateEgde(wall2UpdateInfo);
    }
  }
}
