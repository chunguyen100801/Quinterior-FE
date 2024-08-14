import { Viewport } from 'pixi-viewport';
import { FederatedPointerEvent } from 'pixi.js';
import { Measure } from '../../../helper/measure';
import { FloorplanModel } from '../../../model/floorplanModel';
import { CornerView } from '../../graphics-elements/cornerView';
import { Interaction } from '../Interaction.interface';

export class CornerMoveInteraction implements Interaction {
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
    this.cornerViewRef.drawHoverState();
  }
  onMouseOut(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.cornerViewRef) return;
    this.cornerViewRef.drawNormalState();
  }
  onMouseDown(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.cornerViewRef) return;
    this.cornerViewRef.isDragging = true;
    this.cornerViewRef.alpha = 0.5;
  }

  onMouseUp(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.cornerViewRef) return;
    this.cornerViewRef.isDragging = false;
    this.ViewportRef.plugins.resume('drag');
    this.cornerViewRef.alpha = 1;
    this.cornerViewRef.drawNormalState();
    this.ViewportRef.off('pointermove', this.onDragOnViewPort);

    for (const wall of this.cornerViewRef.cornerModel.associateWalls) {
      wall.view?.drawNormalState();
      wall.view3D?.updateDraw();
    }
    this.floorplanModelRef.mergeCornerOnMove(this.cornerViewRef.cornerModel);
    this.floorplanModelRef.updateRooms();
  }

  onMouseMove(): void {
    if (!this.cornerViewRef) return;
    if (!this.cornerViewRef.isDragging) return;
    if (this.cornerViewRef.isDragging) {
      this.ViewportRef.plugins.pause('drag');
      this.ViewportRef.on('pointermove', this.onDragOnViewPort);
    }
  }
  // mouse prevent out of corner when dragging
  private onDragOnViewPort = (event: FederatedPointerEvent) => {
    if (!this.cornerViewRef) return;
    const { x, y } = Measure.SnapCoordinate(
      event.getLocalPosition(this.ViewportRef)
    );
    this.cornerViewRef.cornerModel.moveTo(x, y);

    this.cornerViewRef.drawHoverState();

    for (const wall of this.cornerViewRef.cornerModel.associateWalls) {
      wall.view?.drawFocusState();
    }

    this.floorplanModelRef.rooms.forEach((room) => {
      room.view2D?.drawRoom();
      room.roomView3D?.updateFloorCeilngPosition();
    });
  };

  clearGraphicAndEffect() {}
  init() {}
}
