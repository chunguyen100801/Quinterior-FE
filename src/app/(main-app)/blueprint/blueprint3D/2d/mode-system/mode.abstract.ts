import { InteractionManager } from '../interactions/Interaction.interface';

export abstract class Mode2D {
  public interactionManager!: InteractionManager;
  abstract getMode(): ModeEnum;
}
export enum ModeEnum {
  DRAW = 'DRAW',
  MOVE = 'MOVE',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
}
