import { Viewport } from 'pixi-viewport';
import { FederatedPointerEvent } from 'pixi.js';

import { FloorplanModel } from '../../../model/floorplanModel';
import { DrawInstructor } from '../../graphics-elements/drawIntructor';
import { Interaction } from '../Interaction.interface';
export class ViewPortDrawInteraction implements Interaction {
  private ViewportRef: Viewport;
  private floorPlanModelRef: FloorplanModel;
  private instructor: DrawInstructor;

  onMouseOver(): void {
    throw new Error('Method not implemented.');
  }
  onMouseOut(): void {
    throw new Error('Method not implemented.');
  }
  constructor(Viewport: Viewport, floorPlanModelRef: FloorplanModel) {
    this.ViewportRef = Viewport;
    this.floorPlanModelRef = floorPlanModelRef;
    this.instructor = new DrawInstructor(floorPlanModelRef);
    this.ViewportRef.addChild(this.instructor);
  }
  onMouseDown() {}
  onMouseUp(evt: FederatedPointerEvent) {
    this.instructor.onClick();
    const co = evt.getLocalPosition(this.ViewportRef);
    this.instructor.draw(co);
  }
  onMouseMove(evt: FederatedPointerEvent) {
    const co = evt.getLocalPosition(this.ViewportRef);
    this.instructor.draw(co);
    // const lastNode = undefined;
  }
  clearGraphicAndEffect() {
    this.ViewportRef.plugins.resume('drag');
    this.instructor.customClear();
  }
  init() {
    this.ViewportRef.plugins.pause('drag');
    this.instructor.init();
  }
}
