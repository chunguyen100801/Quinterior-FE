import { Viewport } from 'pixi-viewport';
import { Graphics } from 'pixi.js';
import { Measure } from '../../helper/measure';
import {
  BASE_CORNER_RADIUS,
  Color2D,
  ThemeItem,
  ZindezViewPort,
} from '../../model/constance';

import { Corner } from '../../model/corner';
import { ModeManager } from '../mode-system/modeManager';

export class CornerView extends Graphics {
  public cornerModel: Corner;
  private ModeMangerRef: ModeManager;
  public isDragging: boolean;
  private ViewPortRef: Viewport;

  constructor(
    cornerModel: Corner,
    ModeMangerRef: ModeManager,
    ViewPortRef: Viewport
  ) {
    super();
    this.cornerModel = cornerModel;
    // this.text = new Text(this.cornerModel.id);
    // this.text.position.x = Measure.cmToPixel(cornerModel.coordinate.x);
    // this.text.position.y = Measure.cmToPixel(cornerModel.coordinate.y);
    // this.addChild(this.text);
    this.ModeMangerRef = ModeMangerRef;
    this.ViewPortRef = ViewPortRef;
    this.cornerModel.view = this;
    this.pivot.x = this.pivot.y = 0.5;
    this.eventMode = 'dynamic';
    this.isDragging = false;
    this.drawNormalState();
    this.zIndex = ZindezViewPort.corner;
    this.initEvent();
  }
  private initEvent() {
    this.on('pointerover', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('corner')
        ?.setRef?.(this)
        ?.onMouseOver(evt);
    });
    this.on('pointerout', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('corner')
        ?.setRef?.(this)
        ?.onMouseOut(evt);
    });
    this.on('pointerdown', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('corner')
        ?.setRef?.(this)
        ?.onMouseDown(evt);
    });
    this.on('pointerup', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('corner')
        ?.setRef?.(this)
        ?.onMouseUp(evt);
    });
    this.on('pointermove', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('corner')
        ?.setRef?.(this)
        ?.onMouseMove(evt);
    });
    this.on('pointerupoutside', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('corner')
        ?.setRef?.(this)
        ?.onMouseUp(evt);
    });
  }
  public drawNormalState() {
    this.drawCirle(Color2D.cornerNormalOuter, Color2D.cornerNormalInner);
  }
  public drawHoverState() {
    this.drawCirle(Color2D.cornerHover, Color2D.cornerNormalInner);
  }
  public drawHoverDeleteState() {
    this.drawCirle(Color2D.cornerDeleteOuter, Color2D.cornerNormalInner);
  }
  private drawCirle(outColor: ThemeItem, inColor: ThemeItem) {
    this.clear();
    const { x, y } = Measure.VectorCmToPixel(this.cornerModel.coordinate);
    const radius = Measure.cmToPixel(Measure.scaleFunction(BASE_CORNER_RADIUS));
    this.clear();
    this.beginFill(outColor.color, outColor.alpha); // Black color
    this.drawCircle(x, y, radius); // Centered at (200, 200) with a radius of 100

    this.beginFill(inColor.color, inColor.alpha); // White color
    this.drawCircle(x, y, radius - 2); // Centered at (200, 200) with a radius of 70

    this.endFill();
  }
}
