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
import { Item3D } from '../../graphics-element/items/Item3D';
import { OnFloorItem } from '../../graphics-element/items/on_floor_item';
import { RoomFloorView3D } from '../../graphics-element/room/roomFloorView3D';
import { ItemControl } from './itemControls.interface';
export class OnFloorItemControl implements ItemControl {
  private onFloorItemRef: OnFloorItem | undefined;
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
    this.floorPlanModelRef = floorPlanModelRef;
    this.sceneRef = sceneRef;
    this.cameraRef = cameraRef;
    this.rendererRef = rendererRef;
    this.orbitControlsRef = orbitControlsRef;
    this.intersectionMarkerRef = intersectionMarkerRef;
  }
  removeItem() {
    if (this.onFloorItemRef) {
      if (this.onFloorItemRef.roomModel) {
        this.onFloorItemRef.detachRoom();
      } else {
        this.floorPlanModelRef.removeFreeItem(this.onFloorItemRef);
      }
      this.onFloorItemRef.deleteModel();
      this.sceneRef.remove(this.onFloorItemRef);
    }
  }

  setCurrentItem = (ItemRef: Item3D | undefined) => {
    if (ItemRef instanceof OnFloorItem) {
      this.mouseDownPos = new Vector3();
      this.previousValidPos = undefined;
      this.onFloorItemRef = ItemRef;
    }
  };
  getCurrentItem = () => {
    return this.onFloorItemRef;
  };
  currentItemSelectOff() {
    if (!this.onFloorItemRef) return;
    this.onFloorItemRef.selectOff();
    this.onFloorItemRef = undefined;
    this.orbitControlsRef.enabled = true;
  }
  onMouseDown = (
    intersectRef: Intersection<Object3D<Object3DEventMap>>
  ): void => {
    if (!this.onFloorItemRef) return;
    this.orbitControlsRef.enabled = false;
    this.onFloorItemRef.selectOn();
    this.onFloorItemRef.isDrag = true;
    this.mouseDownPos = this.onFloorItemRef.position.clone();
    this.offSet.copy(intersectRef.point).sub(this.onFloorItemRef.position);
  };
  onMouseMove = (
    intersectRef: Intersection<Object3D<Object3DEventMap>>[]
  ): void => {
    if (!this.onFloorItemRef || !this.onFloorItemRef.isDrag) {
      return;
    }
    const intersectionPoint = intersectRef[0]?.point;
    const intersectAppItem = recursiveParentToAppType(intersectRef[0].object);

    if (
      this.onFloorItemRef &&
      this.onFloorItemRef.isDrag &&
      intersectionPoint
    ) {
      const camH = this.cameraRef.position.y;
      const camPos = this.cameraRef.position.clone();
      const offsetH = this.offSet.y;
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
        this.onFloorItemRef &&
        intersectAppItem &&
        intersectAppItem instanceof RoomFloorView3D
      ) {
        curentRoom = intersectAppItem.roomModel;
        // this.onFloorItemRef.detachRoom();
        // this.onFloorItemRef.attachRoom(roomModel);
        // console.log(roomModel, 'sd');
      }

      this.onFloorItemRef.position.copy(itemPosition);
      // can it be put in room ?
      if (curentRoom && curentRoom !== this.onFloorItemRef.roomModel) {
        if (
          !Measure.polygonInPolygon(
            this.onFloorItemRef.getFloorItemFloorPolygon(),
            curentRoom.getRoomPolygon()
          )
        ) {
          // cant place
          this.onFloorItemRef.showError();
        } else {
          // can be place in

          this.onFloorItemRef.detachRoom();
          this.onFloorItemRef.attachRoom(curentRoom);
          this.floorPlanModelRef.removeFreeItem(this.onFloorItemRef);
          this.onFloorItemRef.removeError();
        }
      }

      if (this.onFloorItemRef.roomModel) {
        if (
          !Measure.polygonInPolygon(
            this.onFloorItemRef.getFloorItemFloorPolygon(),
            this.onFloorItemRef.roomModel.getRoomPolygon()
          )
        ) {
          if (this.previousValidPos) {
            // alredy in the room
            this.onFloorItemRef.showError();
            const errorPos = itemPosition.clone().sub(this.previousValidPos);
            this.onFloorItemRef.moveError(errorPos);
            this.onFloorItemRef.position.copy(this.previousValidPos);
          } else {
            this.onFloorItemRef.showError();
          }
        } else {
          // can be place in
          this.onFloorItemRef.removeError();
          this.previousValidPos = itemPosition.clone();
          this.onFloorItemRef.position.copy(this.previousValidPos);
        }
      }

      //if position is correct
    }
    this.onFloorItemRef.updateMatrixWorld();
    this.onFloorItemRef.updateMatrix();
  };
  onMouseUp = (): void => {
    if (this.onFloorItemRef) {
      if (this.onFloorItemRef.error3d) {
        this.onFloorItemRef.position.copy(
          this.previousValidPos ? this.previousValidPos : this.mouseDownPos
        );
        this.onFloorItemRef.removeError();
      }
      this.onFloorItemRef.isDrag = false;
    }
  };
  onScroll = (event: WheelEvent) => {
    if (!this.onFloorItemRef) return;
    const deltaY = event.deltaY * scrollScale;
    const r = this.onFloorItemRef.rotation.y;
    this.onFloorItemRef.rotation.y = r + deltaY;
    if (!this.onFloorItemRef.roomModel) return;
    if (
      !Measure.polygonInPolygon(
        this.onFloorItemRef.getFloorItemFloorPolygon(),
        this.onFloorItemRef.roomModel.getRoomPolygon()
      )
    ) {
      this.onFloorItemRef.showError();
    } else {
      this.onFloorItemRef.removeError();
    }
    this.onFloorItemRef.updateMatrixWorld();
    this.onFloorItemRef.updateMatrix();
    // console.log(this.onFloorItemRef?.rotation.y, '232322');
  };
  onMouseMoveFilterMesh(allMeshes: Object3D<Object3DEventMap>[]) {
    return allMeshes.filter((obj) => {
      const objApp = recursiveParentToAppType(obj);
      return (
        objApp !== this.getCurrentItem() && objApp instanceof RoomFloorView3D
      );
    });
  }
}
