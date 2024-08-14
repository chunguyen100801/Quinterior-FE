import { DeleteInteractionManager } from '../interactions/deleteInteractionManager';
import { Mode2D, ModeEnum } from './mode.abstract';
export class DeleteMode2D extends Mode2D {
  constructor(deleteInteractionManager: DeleteInteractionManager) {
    super();
    this.interactionManager = deleteInteractionManager;
  }
  getMode() {
    return ModeEnum.DELETE;
  }
}
