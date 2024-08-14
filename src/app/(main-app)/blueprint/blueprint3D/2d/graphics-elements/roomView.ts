import { Graphics, Text } from 'pixi.js';
import { Vector2 } from 'three';
import { Measure } from '../../helper/measure';
import { Color2D, TextSetting } from '../../model/constance';
import { Room } from '../../model/room';
import { twoDStore } from '../2dStore';
import { ModeManager } from '../mode-system/modeManager';

export class RoomView extends Graphics {
  private nameText: Text;
  private areaText: Text;
  public roomModel: Room;
  private ModeMangerRef: ModeManager;
  constructor(roomModel: Room, ModeMangerRef: ModeManager) {
    super();
    this.ModeMangerRef = ModeMangerRef;
    this.pivot.x = this.pivot.y = 0.5;
    this.roomModel = roomModel;
    this.nameText = new Text('', TextSetting);
    this.areaText = new Text('', TextSetting);
    this.eventMode = 'dynamic';
    this.nameText.anchor.x = this.nameText.anchor.y = 0.5;
    this.areaText.anchor.x = this.areaText.anchor.y = 0.5;
    this.addChild(this.nameText);
    this.addChild(this.areaText);
    this.drawRoom();
    this.initEvent();
  }

  private initEvent() {
    this.on('pointerover', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('room')
        ?.setRef?.(this)
        ?.onMouseOver(evt);
    });
    this.on('pointerout', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('room')
        ?.setRef?.(this)
        ?.onMouseOut(evt);
    });
    this.on('pointerdown', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('room')
        ?.setRef?.(this)
        ?.onMouseDown(evt);
    });
    this.on('pointerup', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('room')
        ?.setRef?.(this)
        ?.onMouseUp(evt);
    });
    this.on('pointermove', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('room')
        ?.setRef?.(this)
        ?.onMouseMove(evt);
    });
    this.on('pointerupoutside', (evt) => {
      this.ModeMangerRef.activeMode.interactionManager
        .getInteraction('room')
        ?.setRef?.(this)
        ?.onMouseUp(evt);
    });

    twoDStore.eventDispatch.addEventListener(
      'MeasurementUnit-change',
      this.drawRoom
    );
  }
  private clearEvent() {
    twoDStore.eventDispatch.removeEventListener(
      'MeasurementUnit-change',
      this.drawRoom
    );
  }
  destroy() {
    this.clearEvent();
    super.destroy();
  }
  drawRoom = () => {
    this.drawFloor();
    this.drawLabel();
    //draw
  };
  drawHoverRoom = () => {
    this.drawHoverFloor();
    this.drawLabel();
    //draw
  };
  private drawHoverFloor() {
    this.clear();
    const corners = this.roomModel.corners
      .map((corner) => [
        Measure.cmToPixel(corner.coordinate.x),
        Measure.cmToPixel(corner.coordinate.y),
      ])
      .flat();
    this.beginFill(Color2D.floorHover.color, Color2D.floorHover.alpha);
    this.drawPolygon(corners);
    this.endFill();
  }
  private drawFloor() {
    this.clear();
    const corners = this.roomModel.corners
      .map((corner) => [
        Measure.cmToPixel(corner.coordinate.x),
        Measure.cmToPixel(corner.coordinate.y),
      ])
      .flat();
    this.beginFill(Color2D.floorDefault.color);
    this.drawPolygon(corners);
    this.endFill();
  }

  get area() {
    let area = 0;
    for (
      let i = 0, j = this.roomModel.corners.length - 1;
      i < this.roomModel.corners.length;
      j = i, i += 1
    ) {
      const point1 = this.roomModel.corners[i].coordinate;
      const point2 = this.roomModel.corners[j].coordinate;
      area += point1.x * point2.y;
      area -= point1.y * point2.x;
    }
    area *= 0.5;

    return area;
  }
  get textArea() {
    return Measure.cmToMeasureUnit(Math.abs(this.area), 2) + '\xB2';
  }

  get centroid() {
    let x = 0,
      y = 0,
      i,
      j,
      f,
      point1,
      point2;
    const length = this.roomModel.corners.length;
    for (i = 0, j = length - 1; i < length; j = i, i += 1) {
      point1 = this.roomModel.corners[i].coordinate;
      point2 = this.roomModel.corners[j].coordinate;
      f = point1.x * point2.y - point2.x * point1.y;
      x += (point1.x + point2.x) * f;
      y += (point1.y + point2.y) * f;
    }

    f = this.area * 6;

    return Measure.VectorCmToPixel(new Vector2(x / f, y / f));
  }

  private drawLabel() {
    const centroid = this.centroid;
    const offset = 8;
    //name
    this.nameText.x = centroid.x;
    this.nameText.y = centroid.y + offset;

    this.areaText.x = centroid.x;
    this.areaText.y = centroid.y - offset;

    const area = Measure.cmToMeasureUnit(Math.abs(this.area), 2);
    this.areaText.text = area + '\xB2';
    this.nameText.text = this.roomModel.name;
  }
}
