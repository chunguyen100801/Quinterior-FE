import { Viewport } from 'pixi-viewport';
import { FederatedPointerEvent } from 'pixi.js';
import { Vector2 } from 'three';
import { Measure } from '../../../helper/measure';
import { FloorplanModel } from '../../../model/floorplanModel';
import { WallView } from '../../graphics-elements/wallView';
import { Interaction } from '../Interaction.interface';

export class WallMoveInteraction implements Interaction {
  private wallViewRef: WallView | null = null;
  private floorplanModelRef: FloorplanModel;
  private ViewportRef: Viewport;
  private mousedowPoint: Vector2;
  private mousedowCornerPoint: Map<'start' | 'end', Vector2>;
  constructor(ViewportRef: Viewport, floorplanModelRef: FloorplanModel) {
    this.floorplanModelRef = floorplanModelRef;
    this.ViewportRef = ViewportRef;
    this.mousedowPoint = new Vector2();
    this.mousedowCornerPoint = new Map();
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
    if (!this.wallViewRef) return;
    this.wallViewRef.isDragging = true;
    this.wallViewRef.alpha = 0.5;
    const co = event.getLocalPosition(this.ViewportRef);
    this.mousedowPoint.x = Measure.pixelToCm(co.x);
    this.mousedowPoint.y = Measure.pixelToCm(co.y);
    this.mousedowCornerPoint.set(
      'start',
      this.wallViewRef.wallModel.associateCorners[0].coordinate.clone()
    );
    this.mousedowCornerPoint.set(
      'end',
      this.wallViewRef.wallModel.associateCorners[1].coordinate.clone()
    );
  }

  onMouseUp(event: FederatedPointerEvent): void {
    event.stopPropagation();
    if (!this.wallViewRef) return;
    this.wallViewRef.isDragging = false;
    this.ViewportRef.plugins.resume('drag');
    this.wallViewRef.alpha = 1;
    this.wallViewRef.drawNormalState();

    this.ViewportRef.off('pointermove', this.onDragOnViewPort);
    for (const corner of this.wallViewRef.wallModel.associateCorners) {
      this.floorplanModelRef.mergeCornerOnMove(corner);
    }

    this.floorplanModelRef.updateRooms();
  }

  onMouseMove(): void {
    if (!this.wallViewRef) return;
    if (!this.wallViewRef.isDragging) return;
    if (this.wallViewRef.isDragging) {
      this.ViewportRef.plugins.pause('drag');
      this.ViewportRef.on('pointermove', this.onDragOnViewPort);
    }
  }
  // mouse prevent out of wall when dragging
  private onDragOnViewPort = (event: FederatedPointerEvent) => {
    if (!this.wallViewRef?.isDragging) return;
    if (!this.wallViewRef) return;
    const mouseVec = Measure.MousePixelToCm(
      event.getLocalPosition(this.ViewportRef)
    );
    const dirVector = Measure.SnapDirVector(mouseVec.sub(this.mousedowPoint));

    const start = this.mousedowCornerPoint.get('start')!.clone().add(dirVector);
    const end = this.mousedowCornerPoint.get('end')!.clone().add(dirVector);

    this.wallViewRef.wallModel.associateCorners[0].moveTo(start.x, start.y);
    this.wallViewRef.wallModel.associateCorners[1].moveTo(end.x, end.y);

    // this.wallViewRef.wallModel.moveTo(x, y);

    this.wallViewRef.drawFocusState();
    this.wallViewRef.wallModel.associateCorners[0].view?.drawNormalState();
    this.wallViewRef.wallModel.associateCorners[1].view?.drawNormalState();
    for (const corner of this.wallViewRef.wallModel.associateCorners) {
      for (const wall of corner.associateWalls) {
        wall.view?.drawFocusState();
      }
    }

    this.floorplanModelRef.rooms.forEach((room) => {
      room.view2D?.drawRoom();
      room.roomView3D?.updateFloorCeilngPosition();
    });
  };

  clearGraphicAndEffect() {}
  init() {}
}
