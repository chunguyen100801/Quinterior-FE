import {
  Intersection,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Measure } from '../../../helper/measure';
import { recursiveParentToAppType } from '../../../helper/ultis';
import { scrollScale } from '../../../model/constance';
import { FloorplanModel } from '../../../model/floorplanModel';
import { CeillingItem } from '../../graphics-element/items/ceilling_item';
import { InWallItem } from '../../graphics-element/items/in_wall_item';
import { RoomFloorView3D } from '../../graphics-element/room/roomFloorView3D';
import { WallView3D } from '../../graphics-element/room/wallView3D';
import { ItemControl } from './itemControls.interface';

export class InwallItemControl implements ItemControl {
  private inWallItemRef: InWallItem | undefined;
  private offSet = new Vector3();
  private mouseDownPos = new Vector3();
  private cameraRef: PerspectiveCamera;
  private rendererRef: WebGLRenderer;
  private orbitControlsRef: OrbitControls;
  private sceneRef: Scene;
  private floorPlanModelRef: FloorplanModel;
  constructor(
    sceneRef: Scene,
    cameraRef: PerspectiveCamera,
    rendererRef: WebGLRenderer,
    orbitControlsRef: OrbitControls,
    floorPlanModelRef: FloorplanModel
  ) {
    this.sceneRef = sceneRef;
    this.cameraRef = cameraRef;
    this.rendererRef = rendererRef;
    this.orbitControlsRef = orbitControlsRef;
    this.floorPlanModelRef = floorPlanModelRef;
  }
  removeItem() {
    if (this.inWallItemRef) {
      if (this.inWallItemRef.wallModel) {
        const wall = this.inWallItemRef.wallModel.view3D;
        this.inWallItemRef.detachWall();
        wall?.updateDraw();
      } else {
        this.floorPlanModelRef.removeFreeItem(this.inWallItemRef);
      }
      this.inWallItemRef.deleteModel();
      this.sceneRef.remove(this.inWallItemRef);
    }
  }
  setCurrentItem(itemRef: InWallItem | undefined): void {
    this.inWallItemRef = itemRef;
  }
  getCurrentItem(): InWallItem | undefined {
    return this.inWallItemRef;
  }
  currentItemSelectOff(): void {
    if (!this.inWallItemRef) return;
    this.inWallItemRef.selectOff();
    this.inWallItemRef = undefined;
    this.orbitControlsRef.enabled = true;
  }
  onMouseDown(intersectRef: Intersection<Object3D<Object3DEventMap>>): void {
    if (
      !this.inWallItemRef ||
      this.inWallItemRef.wallModel?.view3D?.visible == false
    )
      return;
    this.orbitControlsRef.enabled = false;
    this.inWallItemRef.selectOn();
    this.inWallItemRef.isDrag = true;
    this.mouseDownPos = this.inWallItemRef.position.clone();
    this.offSet.copy(intersectRef.point).sub(this.inWallItemRef.position);
  }

  onMouseUp(): void {
    if (this.inWallItemRef) {
      this.inWallItemRef.isDrag = false;
    }
  }
  onScroll(event: WheelEvent): void {
    if (!this.inWallItemRef) return;
    const deltaZ = event.deltaY * scrollScale;
    // const r = this.inWallItemRef.rotation.z;
    const r = this.inWallItemRef.rotation.z;
    this.inWallItemRef.rotation.z = deltaZ + r;
    this.inWallItemRef.updateMatrixWorld();
    this.inWallItemRef.updateMatrix();
    this.inWallItemRef.wallModel?.view3D?.updateDraw();
  }
  onMouseMove(intersectRef: Intersection<Object3D<Object3DEventMap>>[]): void {
    if (!this.inWallItemRef || !this.inWallItemRef.isDrag) {
      return;
    }
    //if mouse  touch wall
    let wallIntersectionPoint;
    let wallintersectAppItem;
    for (let i = 0; i < intersectRef.length; i++) {
      wallIntersectionPoint = intersectRef[i].point;
      wallintersectAppItem = recursiveParentToAppType(intersectRef[i].object);
      if (wallintersectAppItem instanceof WallView3D) break;
    }

    if (wallintersectAppItem instanceof WallView3D && wallIntersectionPoint) {
      if (
        this.inWallItemRef.wallModel &&
        this.inWallItemRef.wallModel.view3D &&
        this.inWallItemRef.wallModel.view3D != wallintersectAppItem
      ) {
        const preWall3D = this.inWallItemRef.wallModel.view3D;
        this.inWallItemRef.detachWall();
        // this.inWallItemRef.rotation.set(0, 0, 0);
        preWall3D.updateDraw();
      }
      if (!this.inWallItemRef.wallModel) {
        this.inWallItemRef.attachWall(wallintersectAppItem.wallModel);
        this.floorPlanModelRef.removeFreeItem(this.inWallItemRef);
        this.inWallItemRef.scaleToWallThick();
      }
      this.snapToWallPos(wallIntersectionPoint);
      this.inWallItemRef.wallModel!.view3D?.updateDraw();
      return;
    }
    //if mouse dont touch wall because the  hole on the wall and just tuoch the inwal item
    const inWallItemIntersectionPoint = intersectRef[0].point;
    const inWallItemintersectAppItem = recursiveParentToAppType(
      intersectRef[0].object
    );
    if (
      this.inWallItemRef.wallModel &&
      inWallItemintersectAppItem instanceof InWallItem
    ) {
      this.snapToWallPos(inWallItemIntersectionPoint);
      this.inWallItemRef.wallModel.view3D?.updateDraw();
      return;
    }
  }

  private snapToWallPos = (intersectionPoint: Vector3) => {
    if (!this.inWallItemRef || !this.inWallItemRef.wallModel) {
      return;
    }
    console.log(this.inWallItemRef.wallModel, 'shsuhsu');
    //rotation
    const middelPoint = Measure.VectorCmToPixel(
      this.inWallItemRef.wallModel.middlePoint()
    );
    const pointInWallVector =
      this.inWallItemRef.wallModel.wallPerpendicularNormalizePointInRoom;
    const pointOutWallVector =
      this.inWallItemRef.wallModel.wallPerpendicularNormalizePointOutRoom;
    const camPosition = new Vector2(
      this.orbitControlsRef.object.position.x,
      this.orbitControlsRef.object.position.z
    );
    const camDir = middelPoint.clone().sub(camPosition).normalize();
    const isCamLookAtInWall = pointInWallVector.dot(camDir) < 0 ? true : false;

    if (isCamLookAtInWall) {
      const rotateAngle = -(pointInWallVector.angle() - Math.PI / 2);
      this.inWallItemRef.rotation.y = rotateAngle;
    } //cam lookat outwall
    else {
      const rotateAngle = -(pointOutWallVector.angle() - Math.PI / 2);
      this.inWallItemRef.rotation.y = rotateAngle;
    }

    // project to middle
    const intersectionPointV3 = intersectionPoint.sub(
      new Vector3(this.offSet.x, this.offSet.y, this.offSet.z)
    );
    const intersectionPointV2 = new Vector2(
      intersectionPointV3.x,
      intersectionPointV3.z
    );
    const intersectionPointV2InCm =
      Measure.VectorPixelToCm(intersectionPointV2);
    const pointOnLine = Measure.VectorCmToPixel(
      Measure.closestPointOnLine(
        intersectionPointV2InCm,
        this.inWallItemRef.wallModel.associateCorners[0].coordinate,
        this.inWallItemRef.wallModel.associateCorners[1].coordinate
      )
    );

    const snapIntersection = new Vector3(
      pointOnLine.x,
      intersectionPointV3.y,
      pointOnLine.y
    );

    this.inWallItemRef.position.copy(snapIntersection);
    this.inWallItemRef.updateMatrixWorld();
    this.inWallItemRef.updateMatrix();
  };

  onMouseMoveFilterMesh(
    allMeshes: Object3D<Object3DEventMap>[]
  ): Object3D<Object3DEventMap>[] {
    return allMeshes.filter((obj) => {
      const objApp = recursiveParentToAppType(obj);
      return (
        // !(objApp instanceof InWallItem)

        !(objApp instanceof RoomFloorView3D) &&
        !(objApp instanceof CeillingItem)
      );
    });
  }
}
