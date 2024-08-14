import { FederatedPointerEvent } from 'pixi.js';

export interface Interaction {
  setRef?(ref: unknown): this;
  onMouseDown(evt: FederatedPointerEvent): void;
  onMouseUp(evt: FederatedPointerEvent): void;
  onMouseMove(evt: FederatedPointerEvent): void;
  onMouseOver(evt: FederatedPointerEvent): void;
  onMouseOut(evt: FederatedPointerEvent): void;
  clearGraphicAndEffect(): void;
  init(): void;
}

export interface InteractionManager {
  getInteraction(key: ComponentInteractKeys): Interaction | undefined;
}

export const ComponentInteractKeysArray = [
  'corner',
  'viewPort',
  'wall',
  'room',
] as const;

export type ComponentInteractKeys = (typeof ComponentInteractKeysArray)[number];

export type ComponentInteract = {
  [key in ComponentInteractKeys]?: Interaction;
};
