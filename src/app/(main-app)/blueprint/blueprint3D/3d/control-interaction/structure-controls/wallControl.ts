import {
  Intersection,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FloorplanModel } from '../../../model/floorplanModel';
import { WallView3D } from '../../graphics-element/room/wallView3D';

export class WallControl {
  private currentWallView3D: WallView3D | undefined;
  private orbitControlsRef: OrbitControls;
  private floorPlanModelRef: FloorplanModel;
  private cameraRef: PerspectiveCamera;
  constructor(
    cameraRef: PerspectiveCamera,
    orbitControlsRef: OrbitControls,
    floorPlanModelRef: FloorplanModel
  ) {
    this.cameraRef = cameraRef;
    this.orbitControlsRef = orbitControlsRef;
    this.floorPlanModelRef = floorPlanModelRef;
  }
  setCurrentWallView(WallView3DRef: WallView3D): void {
    this.currentWallView3D = WallView3DRef;
  }
  getCurrentWallView(): WallView3D | undefined {
    return this.currentWallView3D;
  }
  currentWallViewSelectOff(): void {
    throw new Error('Method not implemented.');
  }
  onMouseDown(intersectRef: Intersection<Object3D<Object3DEventMap>>): void {
    console.log(intersectRef);
  }
  onMouseUp(): void {
    throw new Error('Method not implemented.');
  }
  onScroll(event: WheelEvent): void {
    console.log(event);
  }
  onMouseMove(intersectRef: Intersection<Object3D<Object3DEventMap>>[]): void {
    console.log(intersectRef);
  }
  onMouseMoveFilterMesh(allMeshes: Object3D<Object3DEventMap>[]) {
    console.log(allMeshes);
  }
}
