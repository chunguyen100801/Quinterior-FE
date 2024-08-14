import {
  Event,
  EventDispatcher,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { KeyEvents, KeyboardManager } from './../../helper/keyManager';

import { Object3D } from 'three';
import { recursiveParentToAppType } from '../../helper/ultis';
import { FloorplanModel } from '../../model/floorplanModel';
import { Item3D } from '../graphics-element/items/Item3D';
import { WallView3D } from '../graphics-element/room/wallView3D';
import { InwallItemControl } from './item-controls/InWallItemControl';
import { CeillingItemControl } from './item-controls/ceillingItemControl';
import { DecorateItemControl } from './item-controls/decorateItemControl';
import { ItemControl } from './item-controls/itemControls.interface';
import { OnFloorItemControl } from './item-controls/onFloorItemControl';
import { WallItemControl } from './item-controls/wallItemControl';
import { WallControl } from './structure-controls/wallControl';

export type AllItemControl = {
  onFloorItemControl: OnFloorItemControl;
  inWallItemControl: InwallItemControl;
  wallItemControl: WallItemControl;
  decorateItemControl: DecorateItemControl;
  ceillingItemControl: CeillingItemControl;
};
export type KeyAllItemControl = keyof AllItemControl;
export class ItemPositionControl {
  private rayCaster: Raycaster = new Raycaster();
  private cameraRef: PerspectiveCamera;
  private rendererRef: WebGLRenderer;
  private orbitControlsRef: OrbitControls;
  private sceneRef: Scene;
  private pointer = new Vector2();
  private intersectionMarker: Object3D | undefined; // Marker for intersection point
  private itemControls: AllItemControl;
  private wallControl: WallControl;
  private currentItemControl: ItemControl | undefined;
  private currentHoverItem: Item3D | undefined;
  private floorPlanModelRef: FloorplanModel;
  private _disableItemControl: boolean = false;
  constructor(
    sceneRef: Scene,
    cameraRef: PerspectiveCamera,
    rendererRef: WebGLRenderer,
    orbitControlsRef: OrbitControls,
    floorPlanModelRef: FloorplanModel
  ) {
    this.floorPlanModelRef = floorPlanModelRef;
    this.sceneRef = sceneRef;
    this.cameraRef = cameraRef;
    this.rendererRef = rendererRef;
    this.orbitControlsRef = orbitControlsRef;

    this.itemControls = {
      onFloorItemControl: new OnFloorItemControl(
        this.sceneRef,
        this.cameraRef,
        this.rendererRef,
        this.orbitControlsRef,
        this.intersectionMarker,
        this.floorPlanModelRef
      ),
      inWallItemControl: new InwallItemControl(
        this.sceneRef,
        this.cameraRef,
        this.rendererRef,
        this.orbitControlsRef,
        this.floorPlanModelRef
      ),
      wallItemControl: new WallItemControl(
        this.sceneRef,
        this.cameraRef,
        this.rendererRef,
        this.orbitControlsRef,
        this.floorPlanModelRef
      ),
      decorateItemControl: new DecorateItemControl(
        this.sceneRef,
        this.cameraRef,
        this.rendererRef,
        this.orbitControlsRef,
        this.intersectionMarker,
        this.floorPlanModelRef
      ),
      ceillingItemControl: new CeillingItemControl(
        this.sceneRef,
        this.cameraRef,
        this.rendererRef,
        this.orbitControlsRef,
        this.intersectionMarker,
        this.floorPlanModelRef
      ),
    };
    this.wallControl = new WallControl(
      this.cameraRef,
      this.orbitControlsRef,
      this.floorPlanModelRef
    );
    this.initEvent();
  }
  setDisableItemControl = (bool: boolean) => {
    this._disableItemControl = bool;
  };
  private initEvent = () => {
    this.rendererRef.domElement.addEventListener('mousedown', this.onMouseDown);
    this.rendererRef.domElement.addEventListener('mousemove', this.onMouseMove);
    this.rendererRef.domElement.addEventListener('mouseup', this.onMouseUp);
    this.rendererRef.domElement.addEventListener('wheel', this.onScroll);

    KeyboardManager.getIsntance().evenDispatch.addEventListener(
      'eventKeyReleased',
      this.removeItem
    );
  };
  private removeItem = (
    event: {
      key: string;
      code: string;
    } & Event<'eventKeyReleased', EventDispatcher<KeyEvents>>
  ) => {
    if (event.key == 'Delete') {
      this.currentItemControl?.removeItem();
    }
  };
  private onScroll = (event: WheelEvent) => {
    if (
      this.currentItemControl &&
      this.currentItemControl.getCurrentItem()?.selected == true
    ) {
      if (this._disableItemControl == true) return;
      this.currentItemControl?.onScroll(event);
    }
  };
  public cleanUpEvent = () => {
    this.rendererRef.domElement.removeEventListener(
      'mousedown',
      this.onMouseDown
    );
    this.rendererRef.domElement.removeEventListener(
      'mousemove',
      this.onMouseMove
    );
    this.rendererRef.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.rendererRef.domElement.removeEventListener('wheel', this.onScroll);
    KeyboardManager.getIsntance().evenDispatch.removeEventListener(
      'eventKeyReleased',
      this.removeItem
    );
  };
  private onMouseUp = () => {
    if (this._disableItemControl == true) return;
    this.currentItemControl?.onMouseUp();
  };
  private onMouseMove = (event: MouseEvent) => {
    if (this._disableItemControl == true) return;
    this.pointer = new Vector2(
      ((event.clientX - this.rendererRef.domElement.getBoundingClientRect().x) /
        window.innerWidth) *
        2 -
        1,
      -(
        (event.clientY -
          this.rendererRef.domElement.getBoundingClientRect().y) /
        window.innerHeight
      ) *
        2 +
        1
    );
    this.rayCaster.setFromCamera(this.pointer, this.cameraRef);

    const MeshesFilter = this.sceneRef.children.filter(
      (obj) => obj.visible && obj !== this.intersectionMarker
    );

    //item controll
    if (this.currentItemControl && this.currentItemControl.getCurrentItem()) {
      //filter
      const itemMeshesFilter =
        this.currentItemControl.onMouseMoveFilterMesh(MeshesFilter);

      const intersects = this.rayCaster.intersectObjects(itemMeshesFilter);
      const intersectionPoint = intersects[0]?.point;

      if (intersectionPoint) {
        this.intersectionMarker &&
          this.sceneRef.remove(this.intersectionMarker);
        // this.intersectionMarker =
        // this.createIntersectionMarker(intersectionPoint);
        // this.sceneRef.add(this.intersectionMarker);
        this.currentItemControl.onMouseMove(intersects);
      }
    }
  };
  private onMouseDown = () => {
    if (this._disableItemControl == true) return;
    this.rayCaster.setFromCamera(this.pointer, this.cameraRef);
    const MeshesFilter = this.sceneRef.children.filter(
      (obj) =>
        (obj instanceof Group || obj instanceof Object3D) &&
        obj.visible &&
        !(obj == this.intersectionMarker)
    );

    const intersects = this.rayCaster.intersectObjects(MeshesFilter);
    if (intersects.length > 0) {
      const intersecObject = recursiveParentToAppType(intersects[0].object);

      if (intersecObject instanceof Item3D) {
        this.currentItemControl?.currentItemSelectOff();
        this.currentItemControl = this.itemControls[
          intersecObject.getControlKey()
        ] as ItemControl;
        this.currentItemControl.setCurrentItem(intersecObject);
        this.currentItemControl.onMouseDown(intersects[0]);
      } else {
        this.currentItemControl?.currentItemSelectOff();
        this.currentItemControl?.setCurrentItem(undefined);
        this.currentItemControl = undefined;
      }

      if (intersecObject instanceof WallView3D) {
        console.log('wall ');
        this.wallControl.onMouseDown(intersects[0]);
      } else {
        console.log('disable wall ');
      }
    }
  };
  private createIntersectionMarker = (position: Vector3): Object3D => {
    const geometry = new SphereGeometry(1, 32, 32);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    const marker = new Mesh(geometry, material);
    marker.position.copy(position);
    return marker;
  };
}
