import { Viewport } from 'pixi-viewport';
import { FederatedPointerEvent } from 'pixi.js';

import { FloorplanModel } from '../../../model/floorplanModel';
import { Interaction } from '../Interaction.interface';

import { WallView } from '../../graphics-elements/wallView';

export class WallDeleteInteraction implements Interaction {
  private wallViewRef: WallView | null = null;
  private floorplanModelRef: FloorplanModel;
  private ViewportRef: Viewport;

  constructor(ViewportRef: Viewport, floorplanModelRef: FloorplanModel) {
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
    this.wallViewRef.drawHoverDeleteState();
  }
  onMouseOut(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.wallViewRef) return;
    this.wallViewRef.drawNormalState();
  }
  onMouseDown(event: FederatedPointerEvent): void {
    event.stopPropagation();
    this.ViewportRef.plugins.pause('drag');
  }

  onMouseUp(event: FederatedPointerEvent): void {
    event.stopPropagation();
    event.stopPropagation();
    this.ViewportRef.plugins.resume('drag');
    if (!this.wallViewRef) return;
    this.floorplanModelRef.removeWall(this.wallViewRef?.wallModel);
    this.floorplanModelRef.updateRooms();
  }

  onMouseMove(): void {}

  clearGraphicAndEffect() {}
  init() {}
}
