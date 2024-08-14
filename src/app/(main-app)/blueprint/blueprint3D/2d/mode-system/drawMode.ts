import { DrawInteractionManager } from '../interactions/drawInteractionManager';
import { Mode2D, ModeEnum } from './mode.abstract';
export class DrawMode2D extends Mode2D {
  constructor(drawInteractionManager: DrawInteractionManager) {
    super();
    this.interactionManager = drawInteractionManager;
  }
  getMode() {
    return ModeEnum.DRAW;
  }
}
