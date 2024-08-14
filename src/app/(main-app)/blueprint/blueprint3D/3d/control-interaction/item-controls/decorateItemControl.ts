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
import { CeillingItem } from '../../graphics-element/items/ceilling_item';
import { DecorateItem } from '../../graphics-element/items/decorate_item';
import { InWallItem } from '../../graphics-element/items/in_wall_item';
import { WallItem } from '../../graphics-element/items/wall_item';
import { RoomCeillingView3D } from '../../graphics-element/room/roomCeilingview3D';
import { RoomFloorView3D } from '../../graphics-element/room/roomFloorView3D';
import { WallView3D } from '../../graphics-element/room/wallView3D';
import { ItemControl } from './itemControls.interface';
export class DecorateItemControl implements ItemControl {
  private decorateItemRef: DecorateItem | undefined;
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
    if (this.decorateItemRef) {
      if (this.decorateItemRef.roomModel) {
        this.decorateItemRef.detachRoom();
      } else {
        this.floorPlanModelRef.removeFreeItem(this.decorateItemRef);
      }
      this.decorateItemRef.deleteModel();
      this.sceneRef.remove(this.decorateItemRef);
    }
  }
  setCurrentItem = (ItemRef: Item3D | undefined) => {
    if (ItemRef instanceof DecorateItem) {
      this.mouseDownPos = new Vector3();
      this.previousValidPos = undefined;
      this.decorateItemRef = ItemRef;
    }
  };
  getCurrentItem = () => {
    return this.decorateItemRef;
  };
  currentItemSelectOff() {
    if (!this.decorateItemRef) return;
    this.decorateItemRef.selectOff();
    this.decorateItemRef = undefined;
    this.orbitControlsRef.enabled = true;
  }
  onMouseDown = (
    intersectRef: Intersection<Object3D<Object3DEventMap>>
  ): void => {
    if (!this.decorateItemRef) return;
    this.orbitControlsRef.enabled = false;
    this.decorateItemRef.selectOn();
    this.decorateItemRef.isDrag = true;
    this.mouseDownPos = this.decorateItemRef.position.clone();
    this.offSet.copy(intersectRef.point).sub(this.decorateItemRef.position);
  };
  onMouseMove = (
    intersectRef: Intersection<Object3D<Object3DEventMap>>[]
  ): void => {
    if (!this.decorateItemRef || !this.decorateItemRef.isDrag) {
      return;
    }
    const intersectionPoint = intersectRef[0]?.point;
    const intersectAppItem = recursiveParentToAppType(intersectRef[0].object);

    if (
      this.decorateItemRef &&
      this.decorateItemRef.isDrag &&
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
        this.decorateItemRef &&
        intersectAppItem &&
        intersectAppItem instanceof RoomFloorView3D
      ) {
        curentRoom = intersectAppItem.roomModel;
      }

      this.decorateItemRef.position.copy(itemPosition);
      // can it be put in room ?
      if (curentRoom && curentRoom !== this.decorateItemRef.roomModel) {
        if (
          !Measure.polygonInPolygon(
            this.decorateItemRef.getFloorItemFloorPolygon(),
            curentRoom.getRoomPolygon()
          )
        ) {
          // cant place
          this.decorateItemRef.showError();
          this.decorateItemRef.moveError(itemPosition.clone());
        } else {
          // can be place in

          this.decorateItemRef.detachRoom();
          this.decorateItemRef.attachRoom(curentRoom);
          this.floorPlanModelRef.removeFreeItem(this.decorateItemRef);
          this.decorateItemRef.removeError();
        }
      }

      if (this.decorateItemRef.roomModel) {
        if (
          !Measure.polygonInPolygon(
            this.decorateItemRef.getFloorItemFloorPolygon(),
            this.decorateItemRef.roomModel.getRoomPolygon()
          )
        ) {
          if (this.previousValidPos) {
            // alredy in the room
            this.decorateItemRef.showError();
            const errorPos = itemPosition.clone().sub(this.previousValidPos);
            this.decorateItemRef.moveError(errorPos);
            this.decorateItemRef.position.copy(this.previousValidPos);
          } else {
            this.decorateItemRef.showError();
          }
        } else {
          // can be place in
          this.decorateItemRef.removeError();
          this.previousValidPos = itemPosition.clone();
          this.decorateItemRef.position.copy(this.previousValidPos);
        }
      }

      //if position is correct
    }
    this.decorateItemRef.updateMatrixWorld();
    this.decorateItemRef.updateMatrix();
  };
  onMouseUp = (): void => {
    if (this.decorateItemRef) {
      if (this.decorateItemRef.error3d) {
        this.decorateItemRef.position.copy(
          this.previousValidPos ? this.previousValidPos : this.mouseDownPos
        );
        this.decorateItemRef.removeError();
      }
      this.decorateItemRef.isDrag = false;
    }
  };
  onScroll = (event: WheelEvent) => {
    if (!this.decorateItemRef) return;
    const deltaY = event.deltaY * scrollScale;
    const r = this.decorateItemRef.rotation.y;
    console.log(r + deltaY, 'ss');
    this.decorateItemRef?.rotation.set(0, r + deltaY, 0);
    if (!this.decorateItemRef.roomModel) return;
    if (
      !Measure.polygonInPolygon(
        this.decorateItemRef.getFloorItemFloorPolygon(),
        this.decorateItemRef.roomModel.getRoomPolygon()
      )
    ) {
      this.decorateItemRef.showError();
    } else {
      this.decorateItemRef.removeError();
    }
    this.decorateItemRef.updateMatrixWorld();
    this.decorateItemRef.updateMatrix();
    // console.log(this.decorateItemRef?.rotation.y, '232322');
  };
  onMouseMoveFilterMesh(allMeshes: Object3D<Object3DEventMap>[]) {
    return allMeshes.filter((obj) => {
      const objApp = recursiveParentToAppType(obj);
      return (
        objApp !== this.getCurrentItem() &&
        !(objApp instanceof WallView3D) &&
        !(objApp instanceof RoomCeillingView3D) &&
        !(objApp instanceof CeillingItem) &&
        !(objApp instanceof WallItem) &&
        !(objApp instanceof InWallItem)
      );
    });
  }
}
