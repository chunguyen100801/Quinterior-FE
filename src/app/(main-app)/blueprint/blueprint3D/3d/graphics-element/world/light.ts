import {
  AmbientLight,
  // CameraHelper,
  DirectionalLight,
  HemisphereLight,
  Scene,
} from 'three';
import { twoDStore } from '../../../2d/2dStore';
import { Measure } from '../../../helper/measure';

export class LightWorld {
  private hemisphereLight: HemisphereLight;
  private sunLight: DirectionalLight;
  private sceneRef: Scene;
  // private directLightGelper: DirectionalLightHelper;
  // private directLightCameraHelper: CameraHelper;
  private ambientLight: AmbientLight;

  constructor(sceneRef: Scene) {
    this.sceneRef = sceneRef;

    this.ambientLight = new AmbientLight(0xffffff, 3.5);
    this.hemisphereLight = new HemisphereLight(0xffffeb, 0x080820, 5);
    this.sunLight = new DirectionalLight(0xffffff, 5);
    this.sunLight.castShadow = true;

    this.sunLight.position.set(10000, 6000, 10000); //default; light shining from top

    const gridSize = Measure.cmToPixel(
      twoDStore.getStore().getValue('gridSize')
    );
    this.sunLight.shadow.bias = -0.00001;
    this.sunLight.shadow.camera.near = 0.1;
    this.sunLight.shadow.camera.far = 100000;
    const d = gridSize / 2;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.camera.updateProjectionMatrix();
    this.sunLight.shadow.mapSize.width = 1024 * 4;
    this.sunLight.shadow.mapSize.height = 1024 * 4;
    // this.directLightGelper = new DirectionalLightHelper(this.sunLight, 1000);

    // this.directLightCameraHelper = new CameraHelper(
    //   this.sunLight.shadow.camera
    // );

    this.sceneRef.add(
      this.ambientLight,
      this.hemisphereLight,
      this.sunLight
      // this.directLightCameraHelper
      // this.directLightGelper
    );
    this.sceneRef.add(this.sunLight.target);
  }

  cleanUpGraphic() {
    this.sceneRef.remove(
      this.ambientLight,
      this.hemisphereLight,
      this.sunLight
      // this.directLightCameraHelper
      // this.directLightGelper
    );

    this.ambientLight.dispose();
    this.hemisphereLight.dispose();
    this.sunLight.dispose();
    // this.directLightCameraHelper.dispose();

    // this.directLightGelper.dispose();
  }
}
