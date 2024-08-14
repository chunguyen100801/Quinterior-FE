import { Vector2, Vector3 } from 'three';
import { WallView } from '../2d/graphics-elements/wallView';

import { z } from 'zod';
import { Item3D } from '../3d/graphics-element/items/Item3D';
import { WallView3D } from '../3d/graphics-element/room/wallView3D';
import { Measure } from '../helper/measure';
import { ObjectModify, ObjectType } from '../helper/objectModifyManager';
import { BASE_WALL_THICKNESS, DEFAULT_WALL_HEIGHT } from './constance';
import { Corner } from './corner';
import { Room } from './room';
export class Wall {
  public thickNess: number; //in cm
  public associateCorners: Corner[];
  public wallHeight: number;
  private _view?: WallView;
  private _view3D?: WallView3D;
  public perDirectionPointOut: boolean;
  private attachRoom: Room[];
  private _wallItems: Item3D[] | undefined = [];
  constructor(associateCorners: Corner[]) {
    this.associateCorners = associateCorners;
    this.thickNess = BASE_WALL_THICKNESS;
    this.perDirectionPointOut = true;
    this.attachRoom = [];
    this.wallHeight = DEFAULT_WALL_HEIGHT; //cm
  }

  private getAssociateWalls = () => {
    return this.associateCorners
      .map((corner) => corner.associateWalls.filter((wall) => wall !== this))
      .flat();
  };
  // changeWallHeight = () => {
  //   this.getAssociateWalls().forEach(wall=>{
  //     wall
  //   })

  // };

  addWallItem = (wallItem: Item3D) => {
    this._wallItems?.push(wallItem);
  };
  removeWallItem = (wallItem: Item3D) => {
    const index = this._wallItems?.indexOf(wallItem);
    if (index != -1 && index != undefined) {
      this._wallItems?.splice(index, 1);
    }
  };

  isStartCorner(corner: Corner) {
    return this.associateCorners?.[0] === corner;
  }
  get wallItems() {
    return this._wallItems;
  }
  set wallItems(items: Item3D[] | undefined) {
    this._wallItems = items;
  }
  addAttachRoom = (room: Room) => {
    this.attachRoom.push(room);
  };
  clearAllAttachRoom = () => {
    this.attachRoom = [];
  };
  set view(WallView: WallView) {
    this._view = WallView;
  }
  get view(): WallView | undefined {
    return this._view;
  }
  set view3D(WallView3D: WallView3D | undefined) {
    this._view3D = WallView3D;
  }
  get view3D(): WallView3D | undefined {
    return this._view3D;
  }
  get wallDirection() {
    const vector = this.associateCorners[1].coordinate
      .clone()
      .sub(this.associateCorners[0].coordinate);
    return vector;
  }

  get wallDirectionNormalized() {
    return this.wallDirection.normalize().clone();
  }

  get wallDirection3() {
    const wd = this.wallDirection;
    return new Vector3(wd.x, wd.y, 0);
  }

  get wallDirectionNormalized3() {
    const wd3 = this.wallDirection3;
    return wd3.normalize();
  }

  get wallLength() {
    return Measure.distance(
      this.associateCorners[0].coordinate,
      this.associateCorners[1].coordinate
    );
  }
  public middlePoint = () => {
    return Measure.getMiddlePoint(
      this.associateCorners[0].coordinate,
      this.associateCorners[1].coordinate
    );
  };

  public middlePointV3 = () => {
    const v2 = Measure.getMiddlePoint(
      this.associateCorners[0].coordinate,
      this.associateCorners[1].coordinate
    );
    return new Vector3(v2.x, 0, v2.y);
  };
  updatePerDirectionToPointOutRoom() {
    const middlePoint = this.middlePoint();
    const roomCorners = this.attachRoom[0].corners;
    const CheckMiddlePointInRoom = Measure.checkPointisInsidePolygon(
      middlePoint.add(
        this.wallPerpendicularNormalizePointOutRoom.multiplyScalar(0.01) //move a litte inside and check if inroom
      ),
      roomCorners.map((corner) => corner.coordinate)
    );
    if (CheckMiddlePointInRoom) {
      this.perDirectionPointOut = !this.perDirectionPointOut;
    }
  }
  public isInteriorWall = () => {
    // wall is a part of interior 2 face of wall has a room
    if (this.attachRoom.length == 1) {
      return false;
    } else {
      return true;
    }
    // const middlePointOut = this.middlePoint();
    // const posOut = middlePointOut.add(
    //   this.wallPerpendicularNormalizePointOutRoom.multiplyScalar(0.01) //move a litte inside and check if inroom
    // );
    // const middlePointIn = this.middlePoint();
    // const posIn = middlePointIn.add(
    //   this.wallPerpendicularNormalizePointInRoom.multiplyScalar(0.01) //move a litte inside and check if inroom
    // );
    // let resutl = false;
    // for (const room of this.attachRoom) {
    //   const roomCorners = room.corners;
    //   const CheckMiddleInPointInRoom = Measure.checkPointisInsidePolygon(
    //     posOut,
    //     roomCorners
    //   );
    //   const CheckMiddleOutPointInRoom = Measure.checkPointisInsidePolygon(
    //     posIn,
    //     roomCorners
    //   );

    //   if (CheckMiddlePointInRoom == false) {
    //     return false;
    //   }
    // }
  };

  get wallPerpendicularNormalizePointOutRoom() {
    const direction = this.wallDirectionNormalized;
    if (this.perDirectionPointOut) {
      return new Vector2(direction.y, -direction.x); // Đối với 2D, vector vuông góc có thể được tạo bằng cách đổi dấu và hoán đổi x và y.
    } else {
      return new Vector2(-direction.y, direction.x);
    }
  }

  get wallPerpendicularNormalizePointInRoom() {
    const direction = this.wallPerpendicularNormalizePointOutRoom;

    return new Vector2(-direction.x, -direction.y); // Đối với 2D, vector vuông góc có thể được tạo bằng cách đổi dấu và hoán đổi x và y.
  }

  get wallCenter() {
    return new Vector2(
      (this.associateCorners[0].coordinate.x +
        this.associateCorners[1].coordinate.x) /
        2.0,
      (this.associateCorners[0].coordinate.y +
        this.associateCorners[1].coordinate.y) /
        2.0
    );
  }
  // public isPerpendicularToXAxsis() {
  //   return this.wallDirection.dot(new Vector2(1, 0)) == 0;
  // }

  public wallPolygon() {
    //get wall polygon project on X axis or Y axsis

    if (
      (this.wallDirection.angle() > Math.PI / 4 &&
        this.wallDirection.angle() < (3 * Math.PI) / 4) ||
      (this.wallDirection.angle() > (5 * Math.PI) / 4 &&
        this.wallDirection.angle() < (7 * Math.PI) / 4)
    ) {
      return this.wallPolygonY();
    }
    return this.wallPolygonX();
  }

  private wallPolygonX() {
    const wallHeight = this.wallHeight;
    const firstCornerX = this.associateCorners[0].coordinate.x;
    const secondCornerX = this.associateCorners[1].coordinate.x;
    const firstCorner = new Vector2(firstCornerX, 0);
    const firstCornerUp = new Vector2(firstCornerX, wallHeight);
    const secondCorner = new Vector2(secondCornerX, 0);
    const secondCornerUp = new Vector2(secondCornerX, wallHeight);
    return [firstCorner, firstCornerUp, secondCornerUp, secondCorner];
  }
  private wallPolygonY() {
    const wallHeight = this.wallHeight;
    const firstCornerY = this.associateCorners[0].coordinate.y;
    const secondCornerY = this.associateCorners[1].coordinate.y;
    const firstCorner = new Vector2(firstCornerY, 0);
    const firstCornerUp = new Vector2(firstCornerY, wallHeight);
    const secondCorner = new Vector2(secondCornerY, 0);
    const secondCornerUp = new Vector2(secondCornerY, wallHeight);
    return [firstCorner, firstCornerUp, secondCornerUp, secondCorner];
  }

  get WallCorners() {
    const wallThickNess = this.thickNess;
    const startOutWallPoint = Measure.VectorCmToPixel(
      this.associateCorners[0].coordinate
        .clone()
        .add(
          this.wallPerpendicularNormalizePointOutRoom.multiplyScalar(
            wallThickNess / 2
          )
        )
    );
    const endOutWallPoint = Measure.VectorCmToPixel(
      this.associateCorners[1].coordinate
        .clone()
        .add(
          this.wallPerpendicularNormalizePointOutRoom.multiplyScalar(
            wallThickNess / 2
          )
        )
    );
    const endInWallPoint = Measure.VectorCmToPixel(
      this.associateCorners[1].coordinate
        .clone()
        .add(
          this.wallPerpendicularNormalizePointInRoom.multiplyScalar(
            wallThickNess / 2
          )
        )
    );
    const startInWallPoint = Measure.VectorCmToPixel(
      this.associateCorners[0].coordinate
        .clone()
        .add(
          this.wallPerpendicularNormalizePointInRoom.multiplyScalar(
            wallThickNess / 2
          )
        )
    );
    return {
      startOutWallPoint,
      endOutWallPoint,
      endInWallPoint,
      startInWallPoint,
    };
  }

  getObjectModify(): ObjectModify {
    return {
      itemType: 'Wall' as ObjectType,
      modifyInfo: {
        thickNess: {
          value: this.thickNess,
          display: 'number-input',
        },
      },
      zod: z.object({
        thickNess: z
          .number()
          .min(1, { message: 'Wall thick cant be lower' })
          .max(200, { message: 'Wall thick cant be greater' }),
      }),
    };
  }
  applyObjectModify = (data: { [x: string]: unknown }) => {
    if (typeof data === 'object') {
      const allowedKeys = ['thickNess'] as const;
      type AllowedKeys = (typeof allowedKeys)[number];
      for (const key in data) {
        if (allowedKeys.includes(key as AllowedKeys)) {
          this[key as AllowedKeys] = data[key] as Wall[AllowedKeys];
        }
      }
    }
    this._view?.drawNormalState();
    this._view3D?.updateDraw();
    this.getAssociateWalls().forEach((wall) => {
      wall?.view?.drawNormalState();
      wall?.view3D?.updateDraw();
    });
  };
}
