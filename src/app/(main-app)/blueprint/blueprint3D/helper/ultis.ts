import { Object3D, PerspectiveCamera, Vector3, WebGLRenderer } from 'three';
import { Item3D } from '../3d/graphics-element/items/Item3D';
import { RoomCeillingView3D } from '../3d/graphics-element/room/roomCeilingview3D';
import { RoomFloorView3D } from '../3d/graphics-element/room/roomFloorView3D';
import { WallView3D } from '../3d/graphics-element/room/wallView3D';

export class Util {
  static cycle<T>(arr: T[], shift: number) {
    const tReturn = arr.slice(0);
    for (let tI = 0; tI < shift; tI++) {
      const tmp = tReturn.shift();
      tReturn.push(tmp!);
    }
    return tReturn;
  }
}

type FunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export function classInstanceToObject<T>(instance: T) {
  type K = FunctionPropertyNames<T>;
  const obj: Record<K, T[K]> = {} as Record<K, T[K]>;
  const propertyNames = Object.getOwnPropertyNames(instance) as K[];
  propertyNames.forEach((propertyName) => {
    if (typeof instance[propertyName] !== 'function') {
      obj[propertyName as K] = instance[propertyName];
    }
  });

  return obj;
}

export class PixelTo3DUnitConverter {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera) {
    this.renderer = renderer;
    this.camera = camera;
  }
  public pixelTo3DUnit = (pixelValue: number): number => {
    // Get the width of the viewport
    const viewportWidth = this.renderer.domElement.width;

    // Calculate the NDC x-coordinate corresponding to the pixel value
    const ndcX = (pixelValue / viewportWidth) * 2 - 1;

    // Create a Vector3 representing the NDC coordinate
    const ndcCoord = new Vector3(ndcX, 0, 0);

    // Unproject NDC to world coordinates
    const worldCoord = ndcCoord.unproject(this.camera);

    // Return the x-coordinate in world units
    return worldCoord.x;
  };
}

export function recursiveParentToAppType(object: Object3D) {
  let temp = object;
  while (
    !(
      temp instanceof WallView3D ||
      temp instanceof RoomFloorView3D ||
      temp instanceof Item3D ||
      temp instanceof RoomCeillingView3D
    )
  ) {
    if (temp.parent == null) {
      return null;
    }
    temp = temp.parent;
  }
  return temp;
}

export function isEqual(a: number, b: number) {
  const tolerance = 0.0001;
  return Math.abs(a - b) < tolerance;
}
