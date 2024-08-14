import { Intersection, Object3D, Object3DEventMap } from 'three';
import { Item3D } from '../../graphics-element/items/Item3D';

export interface ItemControl {
  setCurrentItem(ItemRef: Item3D | undefined): void;
  getCurrentItem(): Item3D | undefined;
  removeItem(): void;
  currentItemSelectOff(): void;
  onMouseDown(intersectRef: Intersection<Object3D<Object3DEventMap>>): void;
  onMouseUp(): void;
  onScroll(event: WheelEvent): void;
  onMouseMove(intersectRef: Intersection<Object3D<Object3DEventMap>>[]): void;
  onMouseMoveFilterMesh(
    allMeshes: Object3D<Object3DEventMap>[]
  ): Object3D<Object3DEventMap>[];
}
