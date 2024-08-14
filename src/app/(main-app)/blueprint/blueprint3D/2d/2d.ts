import { Viewport } from 'pixi-viewport';
import { Application } from 'pixi.js';
import { RefObject } from 'react';
import { Event, EventDispatcher, Vector2 } from 'three';
import { ToastType } from '../../Blueprint';
import {
  BlueprintExternalInteract,
  EventData,
  StoreExternalInteractEvents,
} from '../blueprint';
import { Measure } from '../helper/measure';
import { BACK_GROUND_COLOR, MeasurementUnits } from '../model/constance';
import { Corner } from '../model/corner';
import { FloorplanModel } from '../model/floorplanModel';
import { Room } from '../model/room';
import { Wall } from '../model/wall';
import { twoDStore } from './2dStore';
import { CornerView } from './graphics-elements/cornerView';
import { RoomView } from './graphics-elements/roomView';
import { WallView } from './graphics-elements/wallView';
import { Grid2D } from './grid';
import { DeleteInteractionManager } from './interactions/deleteInteractionManager';
import { DrawInteractionManager } from './interactions/drawInteractionManager';
import { EditInteractionManager } from './interactions/editInteractionManager';
import { MoveInteractionManager } from './interactions/moveInteractionManager';
import { DeleteMode2D } from './mode-system/deleteMode';
import { DrawMode2D } from './mode-system/drawMode';
import { EditMode2D } from './mode-system/editMode';
import { ModeManager } from './mode-system/modeManager';
import { MoveMode2D } from './mode-system/moveMode';

export type Options2D = {
  twodViewerRef: RefObject<HTMLDivElement>;
  toast: ToastType;
};

export class TwoDView {
  private options: Options2D;
  private ViewPort: Viewport;
  private app: Application;
  private grid2d: Grid2D;
  private store: twoDStore;
  private floorplanModel: FloorplanModel;
  private ModeManager: ModeManager;
  private isViewPortHover: boolean;
  private domRef?: HTMLDivElement;
  private externalEvent: EventDispatcher<BlueprintExternalInteract>;
  constructor(
    options: Options2D,
    externalEvent: EventDispatcher<BlueprintExternalInteract>,
    floorplanModel: FloorplanModel
  ) {
    this.app = new Application<HTMLCanvasElement>({
      background: BACK_GROUND_COLOR,
      resizeTo: window,
    });
    this.options = options;
    this.externalEvent = externalEvent;
    this.ViewPort = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      events: this.app.renderer.events,
    });
    this.isViewPortHover = true;
    this.grid2d = new Grid2D();
    this.store = twoDStore.getStore();
    this.floorplanModel = floorplanModel;
    this.ModeManager = new ModeManager({
      drawMode: new DrawMode2D(
        new DrawInteractionManager(this.ViewPort, this.floorplanModel)
      ),
      moveMode: new MoveMode2D(
        new MoveInteractionManager(this.ViewPort, this.floorplanModel)
      ),
      deleteMode: new DeleteMode2D(
        new DeleteInteractionManager(this.ViewPort, this.floorplanModel)
      ),
      editMode: new EditMode2D(
        new EditInteractionManager(this.ViewPort, this.floorplanModel)
      ),
    });

    const { twodViewerRef } = this.options;
    if (twodViewerRef.current) {
      this.domRef = twodViewerRef.current;
      twodViewerRef.current.replaceChildren(this.app.view as HTMLCanvasElement);
    }
    this.ViewPort.drag({ wheel: false }).pinch().wheel();
    //draw
    this.centerViewPort();
    this.ViewPort.addChild(this.grid2d);
    this.app.stage.addChild(this.ViewPort);
    // event

    this.ViewPort.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    this.initDrawFloorPlanModel();
    this.initEvent();
  }
  private initDrawFloorPlanModel = () => {
    for (const corner of this.floorplanModel.corners) {
      const cornerView = new CornerView(
        corner,
        this.ModeManager,
        this.ViewPort
      );
      this.ViewPort.addChild(cornerView);
    }
  };
  public drawAddCorner = (newCorner: Corner) => {
    const cornerView = new CornerView(
      newCorner,
      this.ModeManager,
      this.ViewPort
    );
    this.ViewPort.addChild(cornerView);
    this.ViewPort.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
  };
  public drawAddWall = (newWall: Wall) => {
    const wallView = new WallView(newWall, this.ModeManager, this.ViewPort);
    newWall.view = wallView;
    this.ViewPort.addChild(wallView);
    this.ViewPort.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    // console.log(this.floorplanModel, this.ViewPort.children);
  };

  public drawRoomUpdate = (oldRooms: Room[], currentRooms: Room[]) => {
    //delete old room graphic
    for (const room of oldRooms) {
      room.view2D?.destroy();
      room.view2D = undefined;
    }
    for (const room of currentRooms) {
      const roomView = new RoomView(room, this.ModeManager);
      room.view2D = roomView;
      this.ViewPort.addChild(roomView);
    }
    this.ViewPort.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
  };

  initEvent() {
    //viewport interact
    this.ViewPort.on('zoomed', this.viewPortZoomConstrain);

    this.ViewPort.on('moved', this.viewPortMoveConstrain);
    this.ViewPort.on('pointerdown', (evt) => {
      this.ModeManager.activeMode.interactionManager
        .getInteraction('viewPort')
        ?.onMouseDown(evt);
    });
    this.ViewPort.on('pointerup', (evt) => {
      this.ModeManager.activeMode.interactionManager
        .getInteraction('viewPort')
        ?.onMouseUp(evt);
    });
    this.ViewPort.on('pointermove', (evt) => {
      this.ModeManager.activeMode.interactionManager
        .getInteraction('viewPort')
        ?.onMouseMove(evt);
    });
    // floorplan interract

    // config interact

    this.externalEvent.addEventListener(
      'changeMode-externalInteract',
      this.changeMode
    );
    this.externalEvent.addEventListener(
      'snapToGrid-change',
      this.changeSnaptoGrid
    );
    this.externalEvent.addEventListener(
      'BaseSnapUnit-change',
      this.changeBaseSnapUnit
    );
    this.externalEvent.addEventListener(
      'MeasurementUnit-change',
      this.changeMeasureUnit
    );
    this.externalEvent.addEventListener(
      'gridSpacing_snapTolerance-change',
      this.changeSnapTorlerant
    );
  }
  cleanUpGraphic = () => {
    this.floorplanModel.rooms.forEach((room) => {
      room.view2D?.destroy();
    });
    this.floorplanModel.walls.forEach((wall) => {
      wall.view?.destroy();
    });
    this.floorplanModel.corners.forEach((corner) => {
      corner.view?.destroy();
    });
    this.domRef?.removeChild(this.app.view as HTMLCanvasElement);
    this.app.destroy();
  };
  cleanUpEvent() {
    this.externalEvent.removeEventListener(
      'changeMode-externalInteract',
      this.changeMode
    );
    this.externalEvent.removeEventListener(
      'snapToGrid-change',
      this.changeSnaptoGrid
    );
    this.externalEvent.removeEventListener(
      'MeasurementUnit-change',
      this.changeMeasureUnit
    );
    this.externalEvent.removeEventListener(
      'BaseSnapUnit-change',
      this.changeBaseSnapUnit
    );

    this.ViewPort.off('zoomed', this.viewPortZoomConstrain);
    this.ViewPort.off('moved', this.viewPortMoveConstrain);
    this.ViewPort.off('pointerdown', (evt) => {
      this.ModeManager.activeMode.interactionManager
        .getInteraction('viewPort')
        ?.onMouseDown(evt);
    });
    this.ViewPort.off('pointerup', (evt) => {
      this.ModeManager.activeMode.interactionManager
        .getInteraction('viewPort')
        ?.onMouseUp(evt);
    });
    this.ViewPort.off('pointermove', (evt) => {
      this.ModeManager.activeMode.interactionManager
        .getInteraction('viewPort')
        ?.onMouseMove(evt);
    });

    this.grid2d.cleanUpEvent();
  }

  public setisViewPortHover = (val: boolean) => {
    this.isViewPortHover = val;
    if (val) {
      this.ViewPort.plugins.resume('wheel');
      this.ViewPort.plugins.resume('pinch');
    } else {
      this.ViewPort.plugins.pause('wheel');
      this.ViewPort.plugins.pause('pinch');
    }
  };
  private changeBaseSnapUnit = (
    event: {
      value?: MeasurementUnits | undefined;
    } & Event<
      'BaseSnapUnit-change',
      EventDispatcher<StoreExternalInteractEvents>
    >
  ) => {
    this.store.setValue('BaseSnapUnit', event.value!);
  };
  private changeSnapTorlerant = (
    event: EventData<
      StoreExternalInteractEvents,
      'gridSpacing_snapTolerance-change'
    >
  ) => {
    this.store.setValue('gridSpacing_snapTolerance', event.value!);
  };

  private changeMeasureUnit = (
    event: EventData<StoreExternalInteractEvents, 'MeasurementUnit-change'>
  ) => {
    this.store.setValue('MeasurementUnit', event.value!);
  };
  private changeSnaptoGrid = (
    event: EventData<StoreExternalInteractEvents, 'snapToGrid-change'>
  ) => {
    event.value != undefined && this.store.setValue('snapToGrid', event.value);
  };
  private changeMode = (
    event: EventData<StoreExternalInteractEvents, 'changeMode-externalInteract'>
  ) => {
    this.ModeManager.changeMode(event.mode);
  };

  private viewPortZoomConstrain = () => {
    if (!this.isViewPortHover) return;
    let zoom = this.ViewPort.scale.x;
    const bounds = Measure.cmToPixel(this.store.getValue('gridSize'));

    const maxZoomOut = Math.max(window.innerWidth, window.innerHeight) / bounds;
    zoom = zoom < maxZoomOut ? maxZoomOut : Math.min(zoom, 50);

    this.ViewPort.scale.x = this.ViewPort.scale.y = zoom;
    this.store.setValue('gridScale', zoom);
  };
  private viewPortMoveConstrain = () => {
    const zoom = this.ViewPort.scale.x;
    const bounds = Measure.cmToPixel(this.store.getValue('gridSize')) * zoom;

    const xy = new Vector2(this.ViewPort.x, this.ViewPort.y);
    const topleft = new Vector2(-(bounds * 0.5), -(bounds * 0.5));
    const bottomright = new Vector2(bounds * 0.5, bounds * 0.5);

    let xValue = Math.min(-topleft.x, xy.x);
    let yValue = Math.min(-topleft.y, xy.y);

    xValue = Math.max(window.innerWidth - bottomright.x, xValue);
    yValue = Math.max(window.innerHeight - bottomright.y, yValue);

    this.ViewPort.x = xValue;
    this.ViewPort.y = yValue;
  };
  private centerViewPort() {
    this.ViewPort.position.set(
      window.innerWidth * 0.5,
      window.innerHeight * 0.5
    );
  }
}
