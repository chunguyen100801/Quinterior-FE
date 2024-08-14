import { ComponentInteractKeysArray } from '../interactions/Interaction.interface';
import { Mode2D } from './mode.abstract';

export type ModeString = 'drawMode' | 'moveMode' | 'deleteMode' | 'editMode';
type Modes = { [key in ModeString]: Mode2D };

export class ModeManager {
  private modes: Modes;
  public activeMode: Mode2D;
  constructor(modes: Modes) {
    this.modes = modes;
    this.activeMode = this.modes.moveMode;
  }
  changeMode(mode: ModeString) {
    console.log(mode);
    if (!this.modes[mode]) {
      throw new Error('Invalid mode');
    }
    for (const conponentKey of ComponentInteractKeysArray) {
      this.activeMode.interactionManager
        .getInteraction(conponentKey)
        ?.clearGraphicAndEffect();
    }
    this.activeMode = this.modes[mode];
    for (const conponentKey of ComponentInteractKeysArray) {
      this.activeMode.interactionManager.getInteraction(conponentKey)?.init();
    }
  }
  getMode() {
    return this.activeMode.getMode();
  }
}
