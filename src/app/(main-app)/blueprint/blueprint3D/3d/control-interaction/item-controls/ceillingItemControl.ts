import {
  Intersection,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Measure } from '../../../helper/measure';
import { recursiveParentToAppType } from '../../../helper/ultis';
import { scrollScale } from '../../../model/constance';

import { FloorplanModel } from '../../../model/floorplanModel';
import { CeillingItem } from '../../graphics-element/items/ceilling_item';
import { Item3D } from '../../graphics-element/items/Item3D';
import { RoomCeillingView3D } from '../../graphics-element/room/roomCeilingview3D';
import { ItemControl } from './itemControls.interface';
export class CeillingItemControl implements ItemControl {
  private ceillingItemRef: CeillingItem | undefined;
  private cameraRef: PerspectiveCamera;
  private rendererRef: WebGLRenderer;
  private orbitControlsRef: OrbitControls;
  private sceneRef: Scene;
  private offSet: Vector3 = new Vector3();
  private intersectionMarkerRef: Object3D<Object3DEventMap> | undefined;
  private previousValidPos: Vector3 | undefined;
  private mouseDownPos = new Vector3();
  private floorPlanModelRef: FloorplanModel;
  constructor(
    sceneRef: Scene,
    cameraRef: PerspectiveCamera,
    rendererRef: WebGLRenderer,
    orbitControlsRef: OrbitControls,
    intersectionMarkerRef: Object3D<Object3DEventMap> | undefined,
    floorPlanModelRef: FloorplanModel
  ) {
    this.sceneRef = sceneRef;
    this.cameraRef = cameraRef;
    this.rendererRef = rendererRef;
    this.orbitControlsRef = orbitControlsRef;
    this.intersectionMarkerRef = intersectionMarkerRef;
    this.floorPlanModelRef = floorPlanModelRef;
  }
  removeItem() {
    if (this.ceillingItemRef) {
      if (this.ceillingItemRef.roomModel) {
        this.ceillingItemRef.detachRoom();
      } else {
        this.floorPlanModelRef.removeFreeItem(this.ceillingItemRef);
      }
      this.ceillingItemRef.deleteModel();
      this.sceneRef.remove(this.ceillingItemRef);
    }
  }
  setCurrentItem = (ItemRef: Item3D | undefined) => {
    if (ItemRef instanceof CeillingItem) {
      this.mouseDownPos = new Vector3();
      this.previousValidPos = undefined;
      this.ceillingItemRef = ItemRef;
    }
  };
  getCurrentItem = () => {
    return this.ceillingItemRef;
  };
  currentItemSelectOff() {
    if (!this.ceillingItemRef) return;
    this.ceillingItemRef.selectOff();
    this.ceillingItemRef = undefined;
    this.orbitControlsRef.enabled = true;
  }
  onMouseDown = (
    intersectRef: Intersection<Object3D<Object3DEventMap>>
  ): void => {
    if (
      !this.ceillingItemRef ||
      this.ceillingItemRef.roomModel?.roomView3D?.cellingView3D.visible == false
    )
      return;
    this.orbitControlsRef.enabled = false;
    this.ceillingItemRef.selectOn();
    this.ceillingItemRef.isDrag = true;
    this.mouseDownPos = this.ceillingItemRef.position.clone();
    this.offSet.copy(intersectRef.point).sub(this.ceillingItemRef.position);
  };
  onMouseMove = (
    intersectRef: Intersection<Object3D<Object3DEventMap>>[]
  ): void => {
    if (!this.ceillingItemRef || !this.ceillingItemRef.isDrag) {
      return;
    }
    const intersectionPoint = intersectRef[0]?.point;
    const intersectAppItem = recursiveParentToAppType(intersectRef[0].object);
    if (!(intersectAppItem instanceof RoomCeillingView3D)) return;
    if (
      this.ceillingItemRef &&
      this.ceillingItemRef.isDrag &&
      intersectionPoint
    ) {
      const roomHeight = intersectRef[0]?.point.y;
      const camH = Math.abs(roomHeight - this.cameraRef.position.y);
      const camPos = this.cameraRef.position.clone();
      const offsetH = -this.offSet.y;

      const portion = offsetH / camH / (offsetH / camH + 1);
      const itemPosition = intersectionPoint
        .clone()
        .sub(
          intersectionPoint
            .clone()
            .sub(camPos)
            .multiply(new Vector3(portion, 0, portion))
        )
        .sub(new Vector3(this.offSet.x, 0, this.offSet.z));

      // if position is wrong out out room collide with wall
      let curentRoom = undefined;
      if (
        this.ceillingItemRef &&
        intersectAppItem &&
        intersectAppItem instanceof RoomCeillingView3D
      ) {
        curentRoom = intersectAppItem.roomModel;
      }

      this.ceillingItemRef.position.copy(itemPosition);
      // can it be put in room ?
      if (curentRoom && curentRoom !== this.ceillingItemRef.roomModel) {
        if (
          !Measure.polygonInPolygon(
            this.ceillingItemRef.getFloorItemFloorPolygon(),
            curentRoom.getRoomPolygon()
          )
        ) {
          // cant place
          this.ceillingItemRef.showError();
          this.ceillingItemRef.moveError(itemPosition.clone());
        } else {
          // can be place in

          this.ceillingItemRef.detachRoom();
          this.ceillingItemRef.attachRoom(curentRoom);
          this.floorPlanModelRef.removeFreeItem(this.ceillingItemRef);
          this.ceillingItemRef.removeError();
        }
      }

      if (this.ceillingItemRef.roomModel) {
        if (
          !Measure.polygonInPolygon(
            this.ceillingItemRef.getFloorItemFloorPolygon(),
            this.ceillingItemRef.roomModel.getRoomPolygon()
          )
        ) {
          if (this.previousValidPos) {
            // alredy in the room
            this.ceillingItemRef.showError();
            const errorPos = itemPosition.clone().sub(this.previousValidPos);
            this.ceillingItemRef.moveError(errorPos);
            this.ceillingItemRef.position.copy(this.previousValidPos);
          } else {
            this.ceillingItemRef.showError();
          }
        } else {
          // can be place in
          this.ceillingItemRef.removeError();
          this.previousValidPos = itemPosition.clone();
          this.ceillingItemRef.position.copy(this.previousValidPos);
        }
      }

      //if position is correct
    }
    this.ceillingItemRef.updateMatrixWorld();
    this.ceillingItemRef.updateMatrix();
  };
  onMouseUp = (): void => {
    if (this.ceillingItemRef) {
      if (this.ceillingItemRef.error3d) {
        this.ceillingItemRef.position.copy(
          this.previousValidPos ? this.previousValidPos : this.mouseDownPos
        );
        this.ceillingItemRef.removeError();
      }
      this.ceillingItemRef.isDrag = false;
    }
  };
  onScroll = (event: WheelEvent) => {
    if (!this.ceillingItemRef) return;
    const deltaY = event.deltaY * scrollScale;
    const r = this.ceillingItemRef.rotation.y;

    this.ceillingItemRef?.rotation.set(0, r + deltaY, 0);
    if (!this.ceillingItemRef.roomModel) return;
    if (
      !Measure.polygonInPolygon(
        this.ceillingItemRef.getFloorItemFloorPolygon(),
        this.ceillingItemRef.roomModel.getRoomPolygon()
      )
    ) {
      this.ceillingItemRef.showError();
    } else {
      this.ceillingItemRef.removeError();
    }
    this.ceillingItemRef.updateMatrixWorld();
    this.ceillingItemRef.updateMatrix();
  };
  onMouseMoveFilterMesh(allMeshes: Object3D<Object3DEventMap>[]) {
    return allMeshes.filter((obj) => {
      const objApp = recursiveParentToAppType(obj);
      return (
        objApp !== this.getCurrentItem() && objApp instanceof RoomCeillingView3D
      );
    });
  }
}
