import { Viewport } from 'pixi-viewport';
import {
  ComponentInteract,
  ComponentInteractKeys,
  InteractionManager,
} from './Interaction.interface';
import { ViewPortDrawInteraction } from './viewport-interactions/viewPortDrawInteraction';
import { FloorplanModel } from '../../model/floorplanModel';

export class DrawInteractionManager implements InteractionManager {
  private drawInteractstore: ComponentInteract;
  constructor(Viewport: Viewport, floorPlanModelRef: FloorplanModel) {
    this.drawInteractstore = {
      viewPort: new ViewPortDrawInteraction(Viewport, floorPlanModelRef),
    };
  }
  getInteraction(key: ComponentInteractKeys) {
    return this.drawInteractstore[key];
  }
}
