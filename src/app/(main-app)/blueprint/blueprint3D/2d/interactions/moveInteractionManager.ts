import { Viewport } from 'pixi-viewport';
import { FloorplanModel } from '../../model/floorplanModel';
import {
  ComponentInteract,
  ComponentInteractKeys,
  InteractionManager,
} from './Interaction.interface';
import { CornerMoveInteraction } from './corner-interactions/cornerMoveInteraction';
import { WallMoveInteraction } from './wall-interactions/wallMoveInteraction';

export class MoveInteractionManager implements InteractionManager {
  private moveInteractstore: ComponentInteract;
  constructor(Viewport: Viewport, floorPlanModelRef: FloorplanModel) {
    this.moveInteractstore = {
      corner: new CornerMoveInteraction(Viewport, floorPlanModelRef),
      wall: new WallMoveInteraction(Viewport, floorPlanModelRef),
    };
  }
  getInteraction(key: ComponentInteractKeys) {
    return this.moveInteractstore[key];
  }
}
