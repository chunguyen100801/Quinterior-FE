import { Viewport } from 'pixi-viewport';
import { FederatedPointerEvent } from 'pixi.js';
import { ObjectModifyManager } from '../../../helper/objectModifyManager';
import { FloorplanModel } from '../../../model/floorplanModel';
import { RoomView } from '../../graphics-elements/roomView';
import { Interaction } from '../Interaction.interface';

export class RoomEditInteraction implements Interaction {
  private roomViewRef: RoomView | null = null;
  private floorplanModelRef: FloorplanModel;
  private ViewPortRef: Viewport;
  constructor(floorplanModelRef: FloorplanModel, ViewPortRef: Viewport) {
    this.floorplanModelRef = floorplanModelRef;
    this.ViewPortRef = ViewPortRef;
  }
  setRef(ref: RoomView) {
    if (
      (this.roomViewRef && this.roomViewRef != ref) ||
      this.roomViewRef == undefined
    ) {
      this.roomViewRef = ref;
    }
    return this;
  }
  onMouseOver(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.roomViewRef) return;
    this.roomViewRef.drawHoverRoom();
  }
  onMouseOut(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.roomViewRef) return;
    this.roomViewRef.drawRoom();
  }
  onMouseDown(event: FederatedPointerEvent): void {
    event.stopPropagation();
  }

  onMouseUp(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.roomViewRef) return;
    ObjectModifyManager.getIsntance().setObject(this.roomViewRef.roomModel);
  }

  onMouseMove(): void {}

  clearGraphicAndEffect() {}
  init() {}
}
