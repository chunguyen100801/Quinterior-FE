import { Viewport } from 'pixi-viewport';
import { FloorplanModel } from '../../model/floorplanModel';
import {
  ComponentInteract,
  ComponentInteractKeys,
  InteractionManager,
} from './Interaction.interface';
import { RoomEditInteraction } from './room-interactions/roomEditInteraction';
import { WallEditInteraction } from './wall-interactions/wallEditInteraction';

export class EditInteractionManager implements InteractionManager {
  private editInteractstore: ComponentInteract;
  constructor(Viewport: Viewport, floorPlanModelRef: FloorplanModel) {
    this.editInteractstore = {
      room: new RoomEditInteraction(floorPlanModelRef, Viewport),
      wall: new WallEditInteraction(floorPlanModelRef, Viewport),
    };
  }
  getInteraction(key: ComponentInteractKeys) {
    return this.editInteractstore[key];
  }
}
