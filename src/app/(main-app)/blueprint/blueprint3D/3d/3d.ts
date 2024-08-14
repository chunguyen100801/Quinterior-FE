import { RefObject } from 'react';
import {
  ACESFilmicToneMapping,
  Clock,
  Color,
  //   DoubleSide,
  EventDispatcher,
  SRGBColorSpace,
  Scene,
  VSMShadowMap,
  Vector3,
  //   Shape,
  //   ShapeGeometry,
  //   TextureLoader,
  //   Vector2,
  WebGLRenderer,
} from 'three';

import { BlueprintExternalInteract, EventData } from '../blueprint';
import { FloorplanModel, ItemSave } from '../model/floorplanModel';
import { threeDEvent } from './../blueprint';
import { Item3D } from './graphics-element/items/Item3D';
import { DecorateItem } from './graphics-element/items/decorate_item';
import { InWallItem } from './graphics-element/items/in_wall_item';
import { OnFloorItem } from './graphics-element/items/on_floor_item';
import { WallItem } from './graphics-element/items/wall_item';

import { ModelType } from 'src/constants/enum';
import { ModelData } from 'src/types/asset.type';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ToastType } from '../../Blueprint';
import { Room } from '../model/room';
import { Wall } from '../model/wall';
import { CamerasManager } from './cameraManager';
import { ItemPositionControl } from './control-interaction/appController';
import { CeillingItem } from './graphics-element/items/ceilling_item';
import { RoomView3D } from './graphics-element/room/RoomView3D';
import { WallView3D } from './graphics-element/room/wallView3D';
import { Grid3D } from './graphics-element/world/grid3d';
import { LightWorld } from './graphics-element/world/light';
import { GLTFLoaderSingleton } from './loaders/gltfLoader';

export type Options3D = {
  threeDViewerRef: RefObject<HTMLDivElement>;
  toast: ToastType;
};
export class ThreeDView {
  private scene?: Scene;

  private renderer?: WebGLRenderer;
  // private control?: OrbitControls;
  private camerasManager: CamerasManager;
  private canvas?: HTMLCanvasElement;
  private floorplanModelRef?: FloorplanModel;
  private grid3D: Grid3D;
  private lightWorld: LightWorld;
  private itemPositionControl?: ItemPositionControl;
  private stats: Stats;
  private toast: ToastType;
  private toastId?: string | number = undefined;
  private domRef?: HTMLDivElement;
  private animationLoop: number | null = null;
  private clock: Clock;
  private deltaTime: number = 0;
  private externalEvent: EventDispatcher<BlueprintExternalInteract>;
  constructor(
    options: Options3D,
    externalEvent: EventDispatcher<BlueprintExternalInteract>,
    floorplanModelRef: FloorplanModel
  ) {
    this.externalEvent = externalEvent;
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
    this.floorplanModelRef = floorplanModelRef;
    const { threeDViewerRef, toast } = options;
    this.toast = toast;
    this.canvas = document.createElement('canvas');
    this.scene = new Scene();
    this.scene.background = new Color(0xffffff);
    this.lightWorld = new LightWorld(this.scene);

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    this.clock = new Clock(true);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = VSMShadowMap;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (threeDViewerRef.current) {
      this.domRef = threeDViewerRef.current;
      threeDViewerRef.current.replaceChildren(this.canvas);
    }

    // draw grid 3d
    this.grid3D = new Grid3D(this.scene);
    // AxesHelper
    // const axesHelper = new AxesHelper(5);
    // this.scene.add(axesHelper);
    // position control
    this.camerasManager = new CamerasManager(
      this.renderer,
      this.externalEvent,
      this.clock,
      this.toast,
      this.grid3D
    );
    this.itemPositionControl = new ItemPositionControl(
      this.scene,
      this.camerasManager.currentCam,
      this.renderer,
      this.camerasManager.orbitControl,
      this.floorplanModelRef
    );
    this.camerasManager.itemPositionControlRef = this.itemPositionControl;
    this.initEvent();
    this.animate();
  }

  initEvent() {
    this.externalEvent.addEventListener('add-3d-model', this.addItemOnClick);
  }

  privatMouseDow = () => {
    this.camerasManager.orbitControl.enabled = false;
  };
  privatMouseUp = () => {
    this.camerasManager.orbitControl.enabled = true;
  };
  public drawRoom3DUpdate = (oldRooms: Room[], currentRooms: Room[]) => {
    //delete old room graphic
    for (const room of oldRooms) {
      room.roomView3D?.cleanUpAll();
      room.roomView3D = undefined;
    }
    for (const room of currentRooms) {
      if (this.scene)
        room.roomView3D = new RoomView3D(
          room,
          this.scene,
          this.camerasManager.orbitControl
        );
    }
  };
  public drawAddWall3D = (newWall: Wall) => {
    if (this.scene) {
      const wallView3D = new WallView3D(
        newWall,
        this.scene,
        this.camerasManager.orbitControl
      );
      newWall.view3D = wallView3D;
    }
  };

  private animate = () => {
    if (this.animationLoop) {
      cancelAnimationFrame(this.animationLoop);
    }
    this.animationLoop = requestAnimationFrame(this.animate);
    // requestAnimationFrame(this.animate);
    this.camerasManager.moveAnimate();
    this.stats.update();
    // this.camerasManager.orbitControl?.update();
    if (this.camerasManager.currentCam instanceof OrbitControls) {
      this.camerasManager.orbitControl?.update();
    }
    this.camerasManager.currentCam?.updateProjectionMatrix();
    // if (this.camera.position.y < 0) {
    //   this.camera.position.y = 0;
    // }
    this.renderer?.render(this.scene!, this.camerasManager.currentCam!);
  };

  private stopAnimationLoop = () => {
    if (this.animationLoop) cancelAnimationFrame(this.animationLoop);
  };

  cleanUpGraphic = () => {
    this.grid3D.cleanUpGraphic();
    this.lightWorld.cleanUpGraphic();
    this.cleanUpAllWalls3D();
    this.cleanUpAllRooms3D();
    this.cleanUpAllItems3D();
    Item3D.cleanUpConvexItemGraphic();
    this.stats.end();
    document.body.removeChild(this.stats.dom);
    this.itemPositionControl = undefined;
    this.toast.dismiss();
    if (this.domRef) {
      this.domRef.removeChild(this.canvas!);
    }

    this.renderer?.dispose();
    this.scene?.clear();
    this.camerasManager.cleanUp();
    this.renderer = undefined;

    this.stopAnimationLoop();
  };
  private cleanUpAllItems3D() {
    if (!this.floorplanModelRef) return;
    this.floorplanModelRef.rooms.forEach((room) => {
      for (const item of room.roomItems ? room.roomItems : []) {
        item.deleteModel();
      }
      room.roomItems = [];
    });
    this.floorplanModelRef.walls.forEach((wall) => {
      for (const item of wall.wallItems ? wall.wallItems : []) {
        item.deleteModel();
      }
      wall.wallItems = [];
    });
    this.floorplanModelRef.freeItems.forEach((item) => {
      item.deleteModel();
    });
    this.floorplanModelRef.freeItems = [];
  }
  private cleanUpAllWalls3D() {
    for (const wall of this.floorplanModelRef!.walls) {
      const view3D = wall.view3D;
      if (view3D) {
        view3D.cleanUpAll();
        wall.view3D = undefined;
      }
    }
  }
  private cleanUpAllRooms3D() {
    this.floorplanModelRef?.rooms.forEach((room) => {
      room.roomView3D?.cleanUpAll();
      room.roomView3D = undefined;
    });
  }
  cleanUpEvent() {
    this.itemPositionControl?.cleanUpEvent();
    this.camerasManager.cleanUpEvent();

    this.grid3D.cleanupEvent();
  }

  private addItem = async (itemMetaData: ModelData) => {
    const model = await GLTFLoaderSingleton.loadGLTF(itemMetaData.url);
    let newItem;
    if (itemMetaData.type == ModelType.FLOOR_ITEM) {
      newItem = new OnFloorItem(model.scene, itemMetaData);
    }
    if (itemMetaData.type == ModelType.IN_WALL_ITEM) {
      newItem = new InWallItem(model.scene, itemMetaData);
      Item3D.addItemConvex(newItem);
    }
    if (itemMetaData.type == ModelType.WALL_ITEM) {
      newItem = new WallItem(model.scene, itemMetaData);
    }
    if (itemMetaData.type == ModelType.DECORATE_ITEM) {
      newItem = new DecorateItem(model.scene, itemMetaData);
    }
    if (itemMetaData.type == ModelType.ROOF_ITEM) {
      newItem = new CeillingItem(model.scene, itemMetaData);
      newItem.setPosition(new Vector3(0, newItem.modelHeight, 0));
    }
    if (!newItem) throw new Error('Cant create item!');
    this.floorplanModelRef?.addFreeItem(newItem);
    this.scene?.add(newItem);
    return newItem;
  };
  public addItemOnClick = async (
    event: EventData<threeDEvent, 'add-3d-model'>
  ) => {
    try {
      this.toastId = this.toast.loading(`Loading model:  ${event.name}`);
      const newItem = await this.addItem(event.modelData);
      this.toast.success(`New model ${event.name}  loaded !`, {
        id: this.toastId,
      });
      return newItem;
    } catch (err) {
      this.toast.error(`Failed to load model !`, {
        id: this.toastId,
        description: `There is something wrong with ${event.name} `,
      });
    }
  };

  private addItemAndMove = async (
    itemSave: ItemSave,
    itemWallMap: Map<ItemSave, Wall>,
    itemRoomMap: Map<ItemSave, Room>
  ) => {
    try {
      const newItem = await this.addItem(itemSave);
      if (!newItem) return;
      const room = itemRoomMap.get(itemSave);
      const wall = itemWallMap.get(itemSave);
      const rotation = itemSave.posMatrix.rotation;
      const position = itemSave.posMatrix.position;
      newItem.position.set(position.x, position.y, position.z);
      newItem.rotation.set(rotation.x, rotation.y, rotation.z);

      newItem.updateMatrixWorld();
      newItem.updateMatrix();
      if (newItem instanceof OnFloorItem) {
        if (!room) return;
        newItem.attachRoom(room);
      }
      if (newItem instanceof InWallItem) {
        if (!wall) return;
        newItem.attachWall(wall);
        newItem.scaleToWallThick();
        wall.view3D?.updateDraw();
      }
      if (newItem instanceof WallItem) {
        if (!wall) return;
        newItem.attachWall(wall);
      }
      if (newItem instanceof DecorateItem) {
        if (!room) return;
        newItem.attachRoom(room);
      }
      if (newItem instanceof CeillingItem) {
        if (!room) return;
        newItem.attachRoom(room);
      }
      this.floorplanModelRef!.removeFreeItem(newItem);
    } catch (err) {
      this.toast.error(`Failed to load model !`, {
        id: this.toastId,
        description: `There is something wrong, product id: ${itemSave.productId}`,
      });
    }
  };

  public addItemOnLoad = async (
    itemWallMap: Map<ItemSave, Wall>,
    itemRoomMap: Map<ItemSave, Room>,
    freeItems: ModelData[]
  ) => {
    const promises: Promise<void>[] = [];
    itemWallMap.forEach((_, itemSave) => {
      promises.push(this.addItemAndMove(itemSave, itemWallMap, itemRoomMap));
    });
    itemRoomMap.forEach((_, itemSave) => {
      promises.push(this.addItemAndMove(itemSave, itemWallMap, itemRoomMap));
    });
    freeItems.forEach((item) => {
      this.addItem(item);
    });
    this.camerasManager.orbitControl?.dispatchEvent({ type: 'change' });
    try {
      await Promise.all(promises);
    } catch (err) {
      console.log(err);
    }
  };
}
