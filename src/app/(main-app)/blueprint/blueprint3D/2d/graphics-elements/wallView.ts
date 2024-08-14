import { Graphics, Text } from 'pixi.js';
import { Measure } from '../../helper/measure';
import {
  Color2D,
  TextSetting,
  ThemeItem,
  ZindezViewPort,
} from '../../model/constance';
import { twoDStore } from '../2dStore';

import { Viewport } from 'pixi-viewport';
import { Wall } from '../../model/wall';
import { ModeManager } from '../mode-system/modeManager';

export class WallView extends Graphics {
  public wallModel: Wall;
  private textfield: Text;
  public isDragging: boolean;
  private ModeMangerRef: ModeManager;
  private ViewPortRef: Viewport;
  constructor(
    wallModel: Wall,
    ModeMangerRef: ModeManager,
    ViewPortRef: Viewport
  ) {
    super();
    this.ModeMangerRef = ModeMangerRef;
    this.ViewPortRef = ViewPortRef;
    this.wallModel = wallModel;
    this.pivot.x = this.pivot.y = 0.5;
    this.zIndex = ZindezViewPort.wall;
    this.eventMode = 'dynamic';
    this.isDragging = false;
    this.textfield = new Text('', TextSetting);
    this.textfield.anchor.set(0.5, 0.5);
    this.addChild(this.textfield);
    this.drawNormalState();
    this.init();
  }
  init() {
    this.on('pointerover', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('wall')
        ?.setRef?.(this)
        ?.onMouseOver(evt);
    });
    this.on('pointerout', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('wall')
        ?.setRef?.(this)
        ?.onMouseOut(evt);
    });
    this.on('pointerdown', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('wall')
        ?.setRef?.(this)
        ?.onMouseDown(evt);
    });
    this.on('pointerup', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('wall')
        ?.setRef?.(this)
        ?.onMouseUp(evt);
    });
    this.on('pointermove', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('wall')
        ?.setRef?.(this)
        ?.onMouseMove(evt);
    });
    this.on('pointerupoutside', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('wall')
        ?.setRef?.(this)
        ?.onMouseUp(evt);
    });

    twoDStore.eventDispatch.addEventListener(
      'MeasurementUnit-change',
      this.drawNormalState
    );
  }
  destroy() {
    twoDStore.eventDispatch.removeEventListener(
      'MeasurementUnit-change',
      this.drawNormalState
    );
    this.textfield.destroy();
    super.destroy();
  }

  public drawNormalState = () => {
    this.drawWall(Color2D.outWall);
    this.drawInfoLine(0.2);
  };
  public drawFocusState = () => {
    this.drawWall(Color2D.outWallHover);
    this.drawInfoLine(1);
  };
  public drawHoverDeleteState = () => {
    this.drawWall(Color2D.outDeleteHover);
    this.drawInfoLine(1);
  };

  private drawInfoLine(alpha: number) {
    const offSet = 10 + this.wallModel.thickNess;
    const endpointRadius = 1.5;
    const startPoint1 = Measure.VectorCmToPixel(
      this.wallModel.associateCorners[0].coordinate
    );
    const endPoint1 = Measure.VectorCmToPixel(
      this.wallModel.associateCorners[0].coordinate
        .clone()
        .add(
          this.wallModel.wallPerpendicularNormalizePointOutRoom.multiplyScalar(
            offSet
          )
        )
    );

    const startPoint2 = Measure.VectorCmToPixel(
      this.wallModel.associateCorners[1].coordinate
    );
    const endPoint2 = Measure.VectorCmToPixel(
      this.wallModel.associateCorners[1].coordinate
        .clone()
        .add(
          this.wallModel.wallPerpendicularNormalizePointOutRoom.multiplyScalar(
            offSet
          )
        )
    );
    // draw length
    this.lineStyle(1, Color2D.infoLine.color, alpha);
    this.moveTo(endPoint1.x, endPoint1.y);
    this.lineTo(endPoint2.x, endPoint2.y);

    //draw first right line
    this.lineStyle(1, Color2D.infoLine.color, alpha);
    this.moveTo(startPoint1.x, startPoint1.y);
    this.lineTo(endPoint1.x, endPoint1.y);
    this.beginFill(Color2D.originCord.color, alpha);
    this.drawCircle(endPoint1.x, endPoint1.y, endpointRadius);
    // draw second line

    this.lineStyle(1, Color2D.infoLine.color, alpha);
    this.moveTo(startPoint2.x, startPoint2.y);
    this.lineTo(endPoint2.x, endPoint2.y);
    this.beginFill(Color2D.originCord.color, alpha);
    this.drawCircle(endPoint2.x, endPoint2.y, endpointRadius);

    //draw text
    this.textfield.alpha = alpha;
    const centerPositionText = Measure.VectorCmToPixel(
      this.wallModel.wallCenter.add(
        this.wallModel.wallPerpendicularNormalizePointOutRoom.multiplyScalar(
          offSet * 2
        )
      )
    );
    this.textfield.position.x = centerPositionText.x;
    this.textfield.position.y = centerPositionText.y;
    this.textfield.text = Measure.cmToMeasureUnit(this.wallModel.wallLength);
    const wallAngleToX = this.wallModel.wallDirectionNormalized.angle();
    let textRorate = wallAngleToX;
    if (wallAngleToX > Math.PI / 2 && wallAngleToX < (Math.PI * 3) / 2) {
      textRorate = wallAngleToX - Math.PI;
    }
    this.textfield.rotation = textRorate;
  }

  drawHoverState() {
    this.drawWall(Color2D.outWallHover);
    this.drawInfoLine(0.8);
  }
  private drawWall(outwallColer: ThemeItem) {
    this.clear();

    const { x: xStart, y: yStart } = Measure.VectorCmToPixel(
      this.wallModel.associateCorners[0].coordinate
    );
    const { x: xEnd, y: yEnd } = Measure.VectorCmToPixel(
      this.wallModel.associateCorners[1].coordinate
    );

    const {
      startOutWallPoint,
      endOutWallPoint,
      endInWallPoint,
      startInWallPoint,
    } = this.wallModel.WallCorners;
    this.beginFill(outwallColer.color, outwallColer.alpha);
    this.lineStyle(0.5, Color2D.wall.color);
    this.drawPolygon([
      startOutWallPoint.x,
      startOutWallPoint.y,
      endOutWallPoint.x,
      endOutWallPoint.y,
      endInWallPoint.x,
      endInWallPoint.y,
      startInWallPoint.x,
      startInWallPoint.y,
    ]);
    this.endFill();

    this.lineStyle(1, Color2D.wall.color);
    this.moveTo(xStart, yStart);
    this.lineTo(xEnd, yEnd);
  }
}
