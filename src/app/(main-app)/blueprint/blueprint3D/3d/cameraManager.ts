import {
  Clock,
  Event,
  EventDispatcher,
  PerspectiveCamera,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { ToastType } from '../../Blueprint';
import {
  BlueprintExternalInteract,
  EventData,
  threeDCameraEvent,
} from '../blueprint';
import { KeyEvents, KeyboardManager } from '../helper/keyManager';
import { Measure } from '../helper/measure';
import { ItemPositionControl } from './control-interaction/appController';
import { Grid3D } from './graphics-element/world/grid3d';
export type CamType = 'orbit' | 'firstPerson';
export class CamerasManager {
  private _orbitControl: OrbitControls;
  private _firstPersonControl: PointerLockControls;
  private _currentCam: PerspectiveCamera;
  private _orbitCam: PerspectiveCamera;
  private _firstPersonCam: PerspectiveCamera;
  private _itemPositionControlRef?: ItemPositionControl;
  private _externalEventRef: EventDispatcher<BlueprintExternalInteract>;
  private renderRef: WebGLRenderer;
  private _clock: Clock;
  private toast: ToastType;
  private moveForward = false;
  private moveLeft = false;
  private moveBackward = false;
  private moveRight = false;
  private moveUp = false;
  private moveDown = false;
  private velocity = new Vector3();
  private direction = new Vector3();
  private grid3DRef: Grid3D;
  private _cropAspectRatio = 16 / 9;
  constructor(
    renderer: WebGLRenderer,
    externalEventRef: EventDispatcher<BlueprintExternalInteract>,
    clock: Clock,
    toast: ToastType,
    grid3DRef: Grid3D
  ) {
    //set up cam
    this.grid3DRef = grid3DRef;
    this.toast = toast;
    this._clock = clock;
    this.renderRef = renderer;
    this._externalEventRef = externalEventRef;
    this._orbitCam = new PerspectiveCamera(75, 1, 0.1, 10000);
    this._orbitCam.aspect = window.innerWidth / window.innerHeight;
    this._orbitCam.updateProjectionMatrix();
    this._orbitCam.position.set(0, 400, 400);
    this._orbitCam.lookAt(0, 0, 0);

    this._firstPersonCam = new PerspectiveCamera(75, 1, 0.1, 10000);
    this._firstPersonCam.aspect = window.innerWidth / window.innerHeight;
    this._firstPersonCam.updateProjectionMatrix();
    this._firstPersonCam.position.set(0, 400, 400);
    this._firstPersonCam.lookAt(0, 0, 0);

    this._orbitControl = new OrbitControls(
      this._orbitCam,
      this.renderRef.domElement
    );
    this._firstPersonControl = new PointerLockControls(
      this._firstPersonCam,
      this.renderRef.domElement
    );

    this._currentCam = this._orbitCam;
    this.initEvent();
  }
  private initEvent() {
    window.addEventListener('resize', this.windowResize);

    this._externalEventRef.addEventListener(
      'change-cam-FOV',
      this.changeCamPov
    );

    this._externalEventRef.addEventListener(
      'change-cam-aspect',
      this.changeCamAspect
    );

    this._externalEventRef.addEventListener(
      'lock-first-person-camera',
      this.lockFirstPersonCam
    );
    this._externalEventRef.addEventListener(
      'enable-first-person-camera',
      this.enableFirstPersonCam
    );
    this._externalEventRef.addEventListener(
      'enable-orbit-camera',
      this.enableOrbitCamera
    );

    this._firstPersonControl.addEventListener(
      'unlock',
      this.unlockFirstPersonCam
    );
  }
  cleanUpEvent() {
    window.removeEventListener('resize', this.windowResize);
    this._externalEventRef.removeEventListener(
      'change-cam-FOV',
      this.changeCamPov
    );
    this._externalEventRef.removeEventListener(
      'change-cam-aspect',
      this.changeCamAspect
    );

    this._externalEventRef.removeEventListener(
      'lock-first-person-camera',
      this.lockFirstPersonCam
    );
    this._externalEventRef.removeEventListener(
      'enable-first-person-camera',
      this.enableFirstPersonCam
    );
    this._externalEventRef.removeEventListener(
      'enable-orbit-camera',
      this.enableOrbitCamera
    );

    this._firstPersonControl.removeEventListener(
      'unlock',
      this.unlockFirstPersonCam
    );
  }
  private changeCamPov = (
    event: EventData<threeDCameraEvent, 'change-cam-FOV'>
  ) => {
    if (typeof event.FOV === 'number') {
      this._firstPersonCam.fov = event.FOV;
    }
  };
  private changeCamAspect = (
    event: EventData<threeDCameraEvent, 'change-cam-aspect'>
  ) => {
    this._cropAspectRatio = event.aspect;
  };

  private copyOrbitCamPositionToFirstPerson = () => {
    this._firstPersonCam.position.copy(this._orbitCam.position);
    this._firstPersonCam.rotation.copy(this._orbitCam.rotation);
  };
  private copyFirstPersonPositionToOrbit = () => {
    const clonePos = this._firstPersonCam.position.clone();
    const dir = new Vector3();
    this._firstPersonCam.getWorldDirection(dir);
    const distantOrbitToTarget = Measure.distanceV3(
      this._orbitControl.target,
      this._orbitControl.object.position
    );
    const newTargetPos = dir.normalize().multiplyScalar(distantOrbitToTarget);
    newTargetPos.add(this._firstPersonCam.position);
    this._orbitControl.target.set(
      newTargetPos.x,
      newTargetPos.y,
      newTargetPos.z
    );
    this._orbitControl.object.position.copy(clonePos);
    this._orbitControl.update();
  };

  get orbitControl(): OrbitControls {
    return this._orbitControl;
  }
  get firstPersonControl(): PointerLockControls {
    return this._firstPersonControl;
  }
  get currentCam(): PerspectiveCamera {
    return this._currentCam;
  }
  set itemPositionControlRef(itemPositionControlRef: ItemPositionControl) {
    this._itemPositionControlRef = itemPositionControlRef;
  }
  setCurrentCam = (camType: CamType) => {
    if (camType == 'orbit') {
      this._currentCam = this._orbitCam;
    }
    if (camType == 'firstPerson') {
      this._currentCam = this._firstPersonCam;
    }
  };
  cleanUp = () => {
    this._orbitControl.dispose();
    this._firstPersonControl.dispose();
  };

  private enableFirstPersonCam = () => {
    this._itemPositionControlRef?.setDisableItemControl(true);
    this.setCurrentCam('firstPerson');
    this._orbitControl.enabled = false;
    this.copyOrbitCamPositionToFirstPerson();
    // this._firstPersonControl.lock();
    this.grid3DRef.setVisible(false);
    this._orbitControl.dispatchEvent({ type: 'change' });
  };
  private lockFirstPersonCam = () => {
    console.log(this._firstPersonControl);
    this._firstPersonControl.lock();
    KeyboardManager.getIsntance().evenDispatch.addEventListener(
      'eventKeyPressed',
      this.onKeyPressed
    );
    KeyboardManager.getIsntance().evenDispatch.addEventListener(
      'eventKeyReleased',
      this.onKeyReleased
    );

    window.addEventListener('click', this.captureScene);
  };
  private unlockFirstPersonCam = () => {
    this._externalEventRef.dispatchEvent({
      type: 'unlock-first-person-camera',
    });
    KeyboardManager.getIsntance().evenDispatch.removeEventListener(
      'eventKeyPressed',
      this.onKeyPressed
    );
    KeyboardManager.getIsntance().evenDispatch.removeEventListener(
      'eventKeyReleased',
      this.onKeyReleased
    );
    window.removeEventListener('click', this.captureScene);
  };
  private enableOrbitCamera = () => {
    this._itemPositionControlRef?.setDisableItemControl(false);
    this.setCurrentCam('orbit');
    this._orbitControl.enabled = true;
    this.copyFirstPersonPositionToOrbit();
    this._externalEventRef.dispatchEvent({
      type: 'disable-first-person-camera',
    });
    this.grid3DRef.setVisible(true);
  };

  private windowResize = () => {
    const aspect = window.innerWidth / window.innerHeight;
    this._orbitCam.aspect = aspect;
    this._firstPersonCam.aspect = aspect;

    this._orbitCam.updateProjectionMatrix();
    this._firstPersonCam.updateProjectionMatrix();
    this.renderRef.setSize(window.innerWidth, window.innerHeight);
  };
  private keyMap: { [key: string]: boolean } = {};
  onDocumentKey = (e: KeyboardEvent) => {
    this.keyMap[e.code] = e.type === 'keydown';
  };
  private onKeyPressed = (
    event: {
      key: string;
      code: string;
    } & Event<'eventKeyPressed', EventDispatcher<KeyEvents>>
  ) => {
    if (this._currentCam !== this._firstPersonCam) {
      return;
    }
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = true;

        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = true;

        break;
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = true;

        break;
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = true;

        break;
      case 'KeyQ':
        this.moveDown = true;

        break;
      case 'KeyE':
        this.moveUp = true;

        break;
    }
  };

  private onKeyReleased = (
    event: {
      key: string;
      code: string;
    } & Event<'eventKeyReleased', EventDispatcher<KeyEvents>>
  ) => {
    if (this._currentCam !== this._firstPersonCam) {
      return;
    }
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = false;
        break;

      case 'KeyQ':
        this.moveDown = false;

        break;
      case 'KeyE':
        this.moveUp = false;

        break;
    }
  };

  moveAnimate = () => {
    const delta = this._clock.getDelta();

    this.velocity.x -= this.velocity.x * 10 * delta;
    this.velocity.z -= this.velocity.z * 10 * delta;
    this.velocity.y -= this.velocity.y * 10 * delta;
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.y = Number(this.moveUp) - Number(this.moveDown);
    this.direction.normalize(); // this ensures consistent movements in all this.directions

    if (this.moveForward || this.moveBackward)
      this.velocity.z += this.direction.z * 4000 * delta;
    if (this.moveLeft || this.moveRight)
      this.velocity.x += this.direction.x * 4000 * delta;
    if (this.moveUp || this.moveDown)
      this.velocity.y += this.direction.y * 2000 * delta;

    this._firstPersonControl.moveRight(this.velocity.x * delta);
    this._firstPersonControl.moveForward(this.velocity.z * delta);
    this.movefirstPersonControlUp(this.velocity.y * delta);
  };

  private movefirstPersonControlUp(distance: number) {
    // move forward parallel to the xz-plane
    // assumes camera.up is y-up

    this._firstPersonCam.position.y =
      this._firstPersonCam.position.y + distance;
  }

  static calculateCamViewPosition(_cropAspectRatio: number) {
    // Calculate the cropping dimensions
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    let cropWidth = originalWidth;
    let cropHeight = originalWidth / _cropAspectRatio;

    if (cropHeight > originalHeight) {
      // If the calculated height is greater than the original height, adjust the dimensions
      cropWidth = originalHeight * _cropAspectRatio;
      cropHeight = originalHeight;
    }
    return {
      xStartOrigin: (originalWidth - cropWidth) / 2, // x start
      yStartOrigin: (originalHeight - cropHeight) / 2, // y start
      widthOrigin: cropWidth, // width to crop
      heightOrigin: cropHeight, // height to crop
      xStartOut: 0, // x draw
      yStartOut: 0, // y draw
      widthOut: cropWidth, // width to draw
      heightOut: cropHeight, // height to draw
    };
  }

  private captureScene = () => {
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    if (!offscreenCtx) return;
    // Calculate the cropping dimensions
    const originalWidth = this.renderRef.domElement.width;
    const originalHeight = this.renderRef.domElement.height;
    let cropWidth = originalWidth;
    let cropHeight = originalWidth / this._cropAspectRatio;

    if (cropHeight > originalHeight) {
      // If the calculated height is greater than the original height, adjust the dimensions
      cropWidth = originalHeight * this._cropAspectRatio;
      cropHeight = originalHeight;
    }

    // Set the offscreen canvas size to the crop dimensions
    offscreenCanvas.width = cropWidth;
    offscreenCanvas.height = cropHeight;

    // Draw the cropped image on the offscreen canvas
    offscreenCtx.drawImage(
      this.renderRef.domElement,
      (originalWidth - cropWidth) / 2, // x start
      (originalHeight - cropHeight) / 2, // y start
      cropWidth, // width to crop
      cropHeight, // height to crop
      0, // x draw
      0, // y draw
      cropWidth, // width to draw
      cropHeight // height to draw
    );

    // Convert the offscreen canvas content to a Blob
    offscreenCanvas.toBlob(
      (blob) => {
        if (!blob) return;

        this._externalEventRef.dispatchEvent({
          type: 'new-img-taken',
          blob,
        });
        this.toast.success('A new image was taken!');
      },
      'image/png',
      1.0
    );

    this._firstPersonControl.unlock();
    this.unlockFirstPersonCam();
  };
}
