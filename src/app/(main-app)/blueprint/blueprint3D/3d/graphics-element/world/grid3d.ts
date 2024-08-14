import {
  DoubleSide,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
} from 'three';
import { StoreEventsKey, twoDStore } from '../../../2d/2dStore';
import { Measure } from '../../../helper/measure';
import { Color3D } from '../../../model/constance';

export class Grid3D {
  private grid: GridHelper | null | undefined;
  private sceneRef: Scene;
  private planeMesh: Mesh | undefined;
  constructor(sceneRef: Scene) {
    this.sceneRef = sceneRef;
    this.initEvent();
    this.drawGrid3D();
  }
  private drawGrid3D = () => {
    this.cleanUpGraphic();
    const configStore = twoDStore.getStore();
    const gridSize = Measure.cmToPixel(configStore.getValue('gridSize'));
    const space = Measure.cmToPixel(
      configStore.getValue('gridSpacing_snapTolerance')
    );
    this.grid = new GridHelper(
      gridSize,
      Math.round(gridSize / space),
      0x0f0f0f,
      0x808080
    );
    this.grid.receiveShadow = true;
    this.grid.position.setY(-0.5);
    this.sceneRef.add(this.grid);

    const gridsize = Measure.cmToPixel(
      twoDStore.getStore().getValue('gridSize')
    );
    const planeGeometry = new PlaneGeometry(gridsize, gridsize);
    // Create a plane material
    const planeMaterial = new MeshStandardMaterial({
      color: Color3D.gridPlane,
      side: DoubleSide,
    });
    // Create the plane mesh
    this.planeMesh = new Mesh(planeGeometry, planeMaterial);
    this.planeMesh.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
    this.planeMesh.position.setY(-1);
    // Optionally, enable shadows for the plane
    this.planeMesh.receiveShadow = true;

    // Add the plane to the scene
    this.sceneRef.add(this.planeMesh);
  };

  private initEvent = () => {
    // twoDStore.eventDispatch.addEventListener<StoreEventsKey>(
    //   'MeasurementUnit-change',
    //   this.drawGrid3D
    // );
    twoDStore.eventDispatch.addEventListener<StoreEventsKey>(
      'gridSpacing_snapTolerance-change',
      this.drawGrid3D
    );

    twoDStore.eventDispatch.addEventListener<StoreEventsKey>(
      'BaseSnapUnit-change',
      this.drawGrid3D
    );
  };

  public cleanUpGraphic() {
    if (this.grid) {
      this.sceneRef.remove(this.grid);
      this.grid.dispose();
      this.grid = undefined;
      if (this.planeMesh) {
        this.sceneRef.remove(this.planeMesh);
        this.planeMesh.geometry.dispose();
        const material = this.planeMesh.material as MeshStandardMaterial;
        material.dispose();
        this.planeMesh = undefined;
      }
    }
  }
  public setVisible(visible: boolean) {
    if (!this.grid || !this.planeMesh) return;
    this.grid.visible = visible;
    this.planeMesh.visible = visible;
  }

  public cleanupEvent = () => {
    // twoDStore.eventDispatch.removeEventListener<StoreEventsKey>(
    //   'MeasurementUnit-change',
    //   this.drawGrid3D
    // );
    twoDStore.eventDispatch.removeEventListener<StoreEventsKey>(
      'gridSpacing_snapTolerance-change',
      this.drawGrid3D
    );

    twoDStore.eventDispatch.removeEventListener<StoreEventsKey>(
      'BaseSnapUnit-change',
      this.drawGrid3D
    );
  };
}
