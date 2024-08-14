import { Viewport } from 'pixi-viewport';

import { Interaction } from '../Interaction.interface';

export class ViewPortTransformInteraction implements Interaction {
  private ViewportRef: Viewport;
  constructor(Viewport: Viewport) {
    this.ViewportRef = Viewport;
  }

  onMouseOver(): void {
    throw new Error('Method not implemented.');
  }
  onMouseOut(): void {
    throw new Error('Method not implemented.');
  }
  onMouseDown(): void {
    // Implement move mode mouse down behavior
  }

  onMouseUp(): void {
    // Implement move mode mouse up behavior
  }

  onMouseMove(): void {}
  clearGraphicAndEffect() {}
  init() {}
}
