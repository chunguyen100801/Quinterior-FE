import { Viewport } from 'pixi-viewport';
import { FederatedPointerEvent } from 'pixi.js';
import { ObjectModifyManager } from '../../../helper/objectModifyManager';
import { FloorplanModel } from '../../../model/floorplanModel';
import { WallView } from '../../graphics-elements/wallView';
import { Interaction } from '../Interaction.interface';

export class WallEditInteraction implements Interaction {
  private wallViewRef: WallView | null = null;
  private floorplanModelRef: FloorplanModel;
  private ViewportRef: Viewport;

  constructor(floorplanModelRef: FloorplanModel, ViewportRef: Viewport) {
    this.floorplanModelRef = floorplanModelRef;
    this.ViewportRef = ViewportRef;
  }
  setRef(ref: WallView) {
    if (
      (this.wallViewRef &&
        this.wallViewRef != ref &&
        this.wallViewRef.isDragging != true) ||
      this.wallViewRef == undefined
    ) {
      this.wallViewRef = ref;
    }
    return this;
  }
  onMouseOver(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.wallViewRef) return;
    this.wallViewRef.drawHoverState();
  }
  onMouseOut(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.wallViewRef) return;
    this.wallViewRef.drawNormalState();
  }
  onMouseDown(event: FederatedPointerEvent): void {
    event.stopPropagation();
  }

  onMouseUp(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.wallViewRef) return;
    ObjectModifyManager.getIsntance().setObject(this.wallViewRef.wallModel);
  }

  onMouseMove(): void {}

  clearGraphicAndEffect() {}
  init() {}
}
