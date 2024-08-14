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
import { Item3D } from '../../graphics-element/items/Item3D';
import { WallItem } from '../../graphics-element/items/wall_item';
import { WallView3D } from '../../graphics-element/room/wallView3D';
import { ItemControl } from './itemControls.interface';

export class WallItemControl implements ItemControl {
  private wallItemRef: WallItem | undefined;
  private offSet = new Vector3();
  private mouseDownPos = new Vector3();
  private cameraRef: PerspectiveCamera;
  private rendererRef: WebGLRenderer;
  private orbitControlsRef: OrbitControls;
  private sceneRef: Scene;
  private depthVector3: Vector3 | undefined;
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
    console.log('hjkhasdjk');
    if (this.wallItemRef) {
      if (this.wallItemRef.wallModel) {
        this.wallItemRef.detachWall();
      } else {
        this.floorPlanModelRef.removeFreeItem(this.wallItemRef);
      }
      this.wallItemRef.deleteModel();
      this.sceneRef.remove(this.wallItemRef);
    }
  }
  onMouseUp(): void {
    if (this.wallItemRef) {
      this.wallItemRef.isDrag = false;
    }
  }

  setCurrentItem(itemRef: WallItem | undefined): void {
    this.wallItemRef = itemRef;
  }
  getCurrentItem(): Item3D | undefined {
    return this.wallItemRef;
  }
  currentItemSelectOff(): void {
    if (!this.wallItemRef) return;
    this.wallItemRef.selectOff();
    this.wallItemRef = undefined;
    this.orbitControlsRef.enabled = true;
  }
  onMouseDown(intersectRef: Intersection<Object3D<Object3DEventMap>>): void {
    if (
      !this.wallItemRef ||
      this.wallItemRef.wallModel?.view3D?.visible == false
    )
      return;
    this.orbitControlsRef.enabled = false;
    this.wallItemRef.selectOn();
    this.wallItemRef.isDrag = true;
    this.mouseDownPos = this.wallItemRef.position.clone();
    this.offSet.copy(intersectRef.point).sub(this.wallItemRef.position);
  }
  onScroll(event: WheelEvent): void {
    if (!this.wallItemRef) return;
    const deltaZ = event.deltaY * scrollScale;
    // const r = this.wallItemRef.rotation.z;
    const r = this.wallItemRef.rotation.z;
    this.wallItemRef.rotation.z = deltaZ + r;

    // this.wallItemRef.updateMatrixWorld();
    // this.wallItemRef.updateMatrix();
  }
  onMouseMove(intersectRef: Intersection<Object3D<Object3DEventMap>>[]): void {
    if (!this.wallItemRef || !this.wallItemRef.isDrag) {
      return;
    }
    const intersectionPoint = intersectRef[0]?.point;
    const intersectAppItem = recursiveParentToAppType(intersectRef[0].object);
    if (intersectAppItem instanceof WallView3D) {
      if (
        this.wallItemRef.wallModel &&
        this.wallItemRef.wallModel.view3D &&
        this.wallItemRef.wallModel.view3D != intersectAppItem
      ) {
        this.wallItemRef.detachWall();
        // this.wallItemRef.rotation.set(0, 0, 0);
      }
      if (!this.wallItemRef.wallModel) {
        this.wallItemRef.attachWall(intersectAppItem.wallModel);
        this.floorPlanModelRef.removeFreeItem(this.wallItemRef);
      }
      this.snapToWallPos(intersectionPoint);
      this.wallItemRef.wallModel?.view3D?.updateWallItemPosError();
    }
  }
  private snapToWallPos = (intersectionPoint: Vector3) => {
    if (!this.wallItemRef || !this.wallItemRef.wallModel) {
      return;
    }
    //rotation
    const middelPoint = Measure.VectorCmToPixel(
      this.wallItemRef.wallModel.middlePoint()
    );
    const pointInWallVector =
      this.wallItemRef.wallModel.wallPerpendicularNormalizePointInRoom;
    const pointOutWallVector =
      this.wallItemRef.wallModel.wallPerpendicularNormalizePointOutRoom;
    const camPosition = new Vector2(
      this.orbitControlsRef.object.position.x,
      this.orbitControlsRef.object.position.z
    );
    const camDir = middelPoint.clone().sub(camPosition).normalize();
    const isCamLookAtInWall = pointInWallVector.dot(camDir) < 0 ? true : false;

    if (isCamLookAtInWall) {
      const rotateAngle = -(pointInWallVector.angle() - Math.PI / 2);
      this.wallItemRef.rotation.y = rotateAngle;
    } //cam lookat outwall
    else {
      const rotateAngle = -(pointOutWallVector.angle() - Math.PI / 2);
      this.wallItemRef.rotation.y = rotateAngle;
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
        this.wallItemRef.wallModel.associateCorners[0].coordinate,
        this.wallItemRef.wallModel.associateCorners[1].coordinate
      )
    );
    const snapIntersection = new Vector3(
      pointOnLine.x,
      intersectionPointV3.y,
      pointOnLine.y
    );

    if (isCamLookAtInWall) {
      const inWalProject =
        this.wallItemRef.wallModel.wallPerpendicularNormalizePointInRoom
          .clone()
          .multiplyScalar(
            Measure.cmToPixel(this.wallItemRef.wallModel.thickNess) / 2
          );
      const inWalProjectV3 = new Vector3(inWalProject.x, 0, inWalProject.y);
      snapIntersection.add(inWalProjectV3);
    } //cam lookat outwall
    else {
      const inWalProject =
        this.wallItemRef.wallModel.wallPerpendicularNormalizePointOutRoom
          .clone()
          .multiplyScalar(
            Measure.cmToPixel(this.wallItemRef.wallModel.thickNess) / 2
          );
      const inWalProjectV3 = new Vector3(inWalProject.x, 0, inWalProject.y);
      snapIntersection.add(inWalProjectV3);
    }

    this.wallItemRef.position.copy(snapIntersection);
    this.wallItemRef.updateMatrixWorld();
    this.wallItemRef.updateMatrix();
  };

  onMouseMoveFilterMesh(
    allMeshes: Object3D<Object3DEventMap>[]
  ): Object3D<Object3DEventMap>[] {
    return allMeshes.filter((obj) => {
      const objApp = recursiveParentToAppType(obj);
      return objApp !== this.getCurrentItem() && objApp instanceof WallView3D;
    });
  }
}
