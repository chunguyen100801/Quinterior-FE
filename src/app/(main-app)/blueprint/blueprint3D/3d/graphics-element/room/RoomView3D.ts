import { PointLight, Scene, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Measure } from '../../../helper/measure';
import { Room } from '../../../model/room';
import { RoomCeillingView3D } from './roomCeilingview3D';
import { RoomFloorView3D } from './roomFloorView3D';

export class RoomView3D {
  private roomModelRef: Room;
  public cellingView3D: RoomCeillingView3D;
  public floorView3D: RoomFloorView3D;
  private sceneRef: Scene;
  private cameraControlRef: OrbitControls;
  private roomLight: PointLight | undefined;
  private _roomHeight: number; //equal to first wall height
  constructor(
    roomModelRef: Room,
    sceneRef: Scene,
    cameraControlRef: OrbitControls
  ) {
    this.cameraControlRef = cameraControlRef;
    this.sceneRef = sceneRef;
    this.roomModelRef = roomModelRef;
    this._roomHeight =
      this.roomModelRef.corners[0].associateWalls[0].wallHeight;
    this.cellingView3D = new RoomCeillingView3D(
      roomModelRef,
      this.cameraControlRef,
      this._roomHeight
    );
    this.floorView3D = new RoomFloorView3D(roomModelRef);
    // this.initLight();
    this.sceneRef.add(this.cellingView3D);
    this.sceneRef.add(this.floorView3D);
  }
  //too expensive
  get roomHeight() {
    return this._roomHeight;
  }
  initLight() {
    this.roomLight = new PointLight(0xffffff, 3.5, 0, 0);
    const centroid = this.roomModelRef.view2D?.centroid.clone();
    const lightPos = new Vector3(
      centroid?.x,
      Measure.cmToPixel(this._roomHeight) - 40,
      centroid?.y
    );

    this.roomLight.position.copy(lightPos);
    this.roomLight.castShadow = true;
    this.roomLight.shadow.bias = -0.001; // Adjust bias to reduce shadow artifacts
    this.roomLight.shadow.mapSize.width = 512; // Increase map size for sharper shadows
    this.roomLight.shadow.mapSize.height = 512; // Increase map size for sharper shadows
    this.roomLight.shadow.camera.near = 0.1; // Adjust near plane for more accurate shadow rendering
    this.roomLight.shadow.camera.far = 1000; // Adjust far plane for more accurate shadow rendering

    // // this.sceneRef.add(pointLightHelper);
    this.sceneRef.add(this.roomLight);
  }
  clearLight() {
    if (this.roomLight) {
      this.sceneRef.remove(this.roomLight);
      this.roomLight.dispose();
    }
  }
  get roomModel() {
    return this.roomModelRef;
  }
  public updateFloorCeilngPosition() {
    this.cellingView3D.updateCellingPosition();
    this.floorView3D.updateFloorPosition();
  }
  public cleanUpAll() {
    this.floorView3D.cleanUpAll();
    this.cellingView3D.cleanUpAll();
    // this.clearLight();
    this.sceneRef.remove(this.floorView3D);
    this.sceneRef.remove(this.cellingView3D);
  }
}
