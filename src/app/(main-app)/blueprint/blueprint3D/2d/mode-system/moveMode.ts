import { MoveInteractionManager } from '../interactions/moveInteractionManager';
import { Mode2D, ModeEnum } from './mode.abstract';
export class MoveMode2D extends Mode2D {
  constructor(moveInteractionManager: MoveInteractionManager) {
    super();
    this.interactionManager = moveInteractionManager;
  }
  getMode() {
    return ModeEnum.MOVE;
  }
}
