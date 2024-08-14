import { Viewport } from 'pixi-viewport';
import { FloorplanModel } from '../../model/floorplanModel';
import {
  ComponentInteract,
  ComponentInteractKeys,
  InteractionManager,
} from './Interaction.interface';
import { CornerDeleteInteraction } from './corner-interactions/cornerDeleteInteraction';
import { WallDeleteInteraction } from './wall-interactions/wallDeleteInteraction';

export class DeleteInteractionManager implements InteractionManager {
  private moveInteractstore: ComponentInteract;
  constructor(Viewport: Viewport, floorPlanModelRef: FloorplanModel) {
    this.moveInteractstore = {
      corner: new CornerDeleteInteraction(Viewport, floorPlanModelRef),
      wall: new WallDeleteInteraction(Viewport, floorPlanModelRef),
    };
  }
  getInteraction(key: ComponentInteractKeys) {
    return this.moveInteractstore[key];
  }
}
