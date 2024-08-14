import { ModelData } from 'src/types/asset.type';
import { Event, EventDispatcher } from 'three';
import { Options2D, TwoDView } from './2d/2d';
import { Store2D } from './2d/2dStore';
import { ModeString } from './2d/mode-system/modeManager';
import { Options3D, ThreeDView } from './3d/3d';
import { KeyboardManager } from './helper/keyManager';
import { ObjectModifyManager } from './helper/objectModifyManager';
import {
  FloorplanModel,
  OptionsFloorPlan,
  SavedFloorPlan,
} from './model/floorplanModel';
export type options = {
  options2D: Options2D;
  options3D: Options3D;
  savedFloorPlan?: SavedFloorPlan;
  optionsFloorPlan: OptionsFloorPlan;
};

export type StoreExternalInteractEvents = {
  [K in keyof Store2D as `${string & K}-change`]: { value?: Store2D[K] };
} & { 'changeMode-externalInteract': { mode: ModeString } };

export type saveLoadFloorPlanEvent = {
  'export-floorplan': { name: string };
  'save-floorplan': { id: number };
  'load-floorplan': { externalFloorplan: SavedFloorPlan };
  'reset-floorplan': object;
  'loaded-all-3d': object;
  'start-load-3d': object;
};
export type threeDEvent = {
  'add-3d-model': { modelData: ModelData; name: string };
};
export type threeDCameraEvent = {
  'enable-first-person-camera': object;
  'disable-first-person-camera': object;
  'enable-orbit-camera': object;
  'lock-first-person-camera': object;
  'unlock-first-person-camera': object;
  'new-img-taken': { blob: Blob };
  'change-cam-aspect': { aspect: number };
  'change-cam-FOV': { FOV: number | number[] };
};
export type EventData<S extends object, T extends keyof S & string> = S[T] &
  Event<T, EventDispatcher<S>>;

export type BlueprintExternalInteract = StoreExternalInteractEvents &
  saveLoadFloorPlanEvent &
  threeDEvent &
  threeDCameraEvent;

export class Blueprint {
  public Viewer2D?: TwoDView;
  public Viewer3D?: ThreeDView;

  public externalEvenDispatch =
    new EventDispatcher<BlueprintExternalInteract>();
  public ObjectModifyManager: ObjectModifyManager;
  private floorplanModel?: FloorplanModel;
  private savedFloorPlan?: SavedFloorPlan;
  constructor(options: options) {
    const { options2D, options3D, savedFloorPlan, optionsFloorPlan } = options;
    this.externalEvenDispatch =
      new EventDispatcher<BlueprintExternalInteract>();
    this.floorplanModel = new FloorplanModel(
      this.externalEvenDispatch,
      optionsFloorPlan
    );
    this.Viewer2D = new TwoDView(
      options2D,
      this.externalEvenDispatch,
      this.floorplanModel
    );
    this.Viewer3D = new ThreeDView(
      options3D,
      this.externalEvenDispatch,
      this.floorplanModel
    );
    this.floorplanModel.viewer2D = this.Viewer2D;
    this.floorplanModel.viewer3D = this.Viewer3D;
    // this.floorplan.initEvent();
    this.ObjectModifyManager = ObjectModifyManager.getIsntance();
    KeyboardManager.getIsntance().eventInit();

    this.savedFloorPlan = savedFloorPlan;
  }
  loadFloorPlan = () => {
    if (this.savedFloorPlan) {
      this.floorplanModel?.loadFloorPlan(this.savedFloorPlan);
    }
  };
  cleanUpEvent = () => {
    this.Viewer2D?.cleanUpEvent();
    this.Viewer3D?.cleanUpEvent();
    this.floorplanModel?.cleanUpEvent();
    KeyboardManager.getIsntance()?.cleanupEvent();
  };
  cleanUpGraphics = () => {
    this.Viewer3D?.cleanUpGraphic();
    this.Viewer2D?.cleanUpGraphic();
    this.floorplanModel?.cleanUpFloorPlan();
    this.cleanUpRef();
  };
  private cleanUpRef = () => {
    this.Viewer2D = undefined;
    this.Viewer3D = undefined;
    this.floorplanModel = undefined;
  };
  // changeMode(mode: ModeString) {
  //   this.floorplan.changeMode(mode);
  // }
}
