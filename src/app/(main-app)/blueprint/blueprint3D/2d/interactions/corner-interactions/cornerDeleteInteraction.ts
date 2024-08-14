import { Viewport } from 'pixi-viewport';
import { FederatedPointerEvent } from 'pixi.js';
import { FloorplanModel } from '../../../model/floorplanModel';
import { CornerView } from '../../graphics-elements/cornerView';
import { Interaction } from '../Interaction.interface';

export class CornerDeleteInteraction implements Interaction {
  private cornerViewRef: CornerView | null = null;
  private floorplanModelRef: FloorplanModel;
  private ViewportRef: Viewport;
  constructor(ViewportRef: Viewport, floorplanModelRef: FloorplanModel) {
    this.floorplanModelRef = floorplanModelRef;
    this.ViewportRef = ViewportRef;
  }
  setRef(ref: CornerView) {
    if (
      (this.cornerViewRef &&
        this.cornerViewRef != ref &&
        this.cornerViewRef.isDragging != true) ||
      this.cornerViewRef == undefined
    ) {
      this.cornerViewRef = ref;
    }
    return this;
  }
  onMouseOver(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.cornerViewRef) return;
    this.cornerViewRef.drawHoverDeleteState();
  }
  onMouseOut(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.cornerViewRef) return;
    this.cornerViewRef.drawNormalState();
  }
  onMouseDown(): void {
    this.ViewportRef.plugins.pause('drag');
  }

  onMouseUp(event: FederatedPointerEvent): void {
    event.stopPropagation();
    this.ViewportRef.plugins.resume('drag');
    if (!this.cornerViewRef) return;
    this.floorplanModelRef.removeCorner(this.cornerViewRef?.cornerModel);
    this.floorplanModelRef.updateRooms();
  }

  onMouseMove(): void {}

  clearGraphicAndEffect() {}
  init() {}
}
