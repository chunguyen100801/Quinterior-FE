import { EditInteractionManager } from '../interactions/editInteractionManager';
import { Mode2D, ModeEnum } from './mode.abstract';
export class EditMode2D extends Mode2D {
  constructor(editInteractionManager: EditInteractionManager) {
    super();
    this.interactionManager = editInteractionManager;
  }
  getMode() {
    return ModeEnum.EDIT;
  }
}
