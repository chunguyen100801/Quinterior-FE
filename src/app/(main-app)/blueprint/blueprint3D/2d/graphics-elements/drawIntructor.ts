import { Graphics, Point, Text } from 'pixi.js';
import { Event, EventDispatcher, Vector2 } from 'three';
import { KeyEvents, KeyboardManager } from '../../helper/keyManager';
import { Measure } from '../../helper/measure';
import {
  BASE_CORNER_RADIUS,
  BASE_WALL_THICKNESS,
  Color2D,
  TextSetting,
  ZindezViewPort,
} from '../../model/constance';
import { Corner } from '../../model/corner';
import { FloorplanModel } from '../../model/floorplanModel';

type states = 'drawCorner' | 'drawWall';
export class DrawInstructor extends Graphics {
  public coordinateinCm: Vector2;
  public states: Map<states, IntructorState>;
  private _startPointinCm: Vector2 | undefined;
  private _endPointinCm: Vector2 | undefined;
  private drawState: IntructorState;
  private floorPlanModelRef: FloorplanModel;
  public startCorner?: Corner;
  constructor(floorPlanModelRef: FloorplanModel) {
    super();
    this.floorPlanModelRef = floorPlanModelRef;
    this.states = new Map<states, IntructorState>([
      ['drawCorner', new StateDrawCorner(this, floorPlanModelRef)],
      ['drawWall', new StateDrawWall(this, floorPlanModelRef)],
    ]);
    this.drawState = this.states.get('drawCorner')!;

    this.coordinateinCm = new Vector2(0, 0);
    this.startCorner = undefined;
    this.pivot.set(0.5);
    this.zIndex = ZindezViewPort.drawInstructor;
  }
  init() {
    this.drawState.init();
  }
  setStartPointWithCurrentMousePos() {
    this._startPointinCm = this.coordinateinCm.clone();
  }
  setEndPointWithCurrentMousePos() {
    this._endPointinCm = this.coordinateinCm.clone();
  }
  clearStartPoint() {
    this._startPointinCm = undefined;
  }
  clearEndPoint() {
    this._endPointinCm = undefined;
  }
  get startPointinCm() {
    return this._startPointinCm;
  }
  get endPointinCm() {
    return this._endPointinCm;
  }

  draw(currentMouseLocation: Point) {
    this.clear();
    const { x, y } = Measure.SnapCoordinate(currentMouseLocation);

    this.coordinateinCm.x = x;
    this.coordinateinCm.y = y;
    this.drawState.draw();
  }
  onClick() {
    this.drawState.onClick();
  }

  public changeDrawState(state: IntructorState) {
    this.drawState.clear();
    this.drawState = state;
    this.drawState.init();
  }
  public snapXYOnLine(MousePositionInCm: Vector2) {
    let { x, y } = MousePositionInCm;
    const nearWall = Measure.checkIfMouseIsNearAWall(
      MousePositionInCm,
      this.floorPlanModelRef.walls
    );

    if (nearWall) {
      const pointOnLine = Measure.closestPointOnLine(
        MousePositionInCm,
        nearWall.associateCorners[0].coordinate,
        nearWall.associateCorners[1].coordinate
      );

      x = pointOnLine.x;
      y = pointOnLine.y;
    }
    return { x, y };
  }
  public drawTempCorner(positionInCm: Vector2, alpha?: number) {
    let { x, y } = this.snapXYOnLine(positionInCm);
    x = Measure.cmToPixel(x);
    y = Measure.cmToPixel(y);
    const radius = Measure.cmToPixel(Measure.scaleFunction(BASE_CORNER_RADIUS));
    this.clear();
    this.beginFill(Color2D.cornerHover.color, alpha); // Black color
    this.drawCircle(x, y, radius); // Centered at (200, 200) with a radius of 100

    this.beginFill(Color2D.cornerNormalInner.color, alpha); // White color
    this.drawCircle(x, y, radius - 2); // Centered at (200, 200) with a radius of 70
  }
  customClear() {
    this.clear();
    this.drawState.clear();
    this.changeDrawState(this.states.get('drawCorner')!);
  }
}

interface IntructorState {
  draw(): void;
  changeNextState(): void;
  onClick(): void;
  clear(): void;
  init(): void;
}
class StateDrawCorner implements IntructorState {
  private instrustorRef: DrawInstructor;
  private floorplanModelRef: FloorplanModel;
  constructor(instructor: DrawInstructor, floorplanModelRef: FloorplanModel) {
    this.instrustorRef = instructor;
    this.floorplanModelRef = floorplanModelRef;
  }
  draw() {
    this.instrustorRef.drawTempCorner(this.instrustorRef.coordinateinCm, 0.7);
  }
  init() {}
  changeNextState() {
    this.instrustorRef.changeDrawState(
      this.instrustorRef.states.get('drawWall')!
    );
  }
  public onClick() {
    this.instrustorRef.setStartPointWithCurrentMousePos();
    //add corner
    // change state
    if (this.instrustorRef.startPointinCm) {
      const { x, y } = this.instrustorRef.snapXYOnLine(
        this.instrustorRef.startPointinCm
      );
      this.instrustorRef.startCorner =
        this.floorplanModelRef.addCornerWithNoDuplicate(x, y);
    }
    this.changeNextState();
    this.floorplanModelRef.updateRooms();
  }
  clear() {}
}

class StateDrawWall implements IntructorState {
  private instrustorRef: DrawInstructor;
  private textfield: Text;
  private floorplanModelRef: FloorplanModel;
  constructor(instructor: DrawInstructor, floorplanModelRef: FloorplanModel) {
    this.floorplanModelRef = floorplanModelRef;
    this.instrustorRef = instructor;
    this.textfield = new Text('', TextSetting);
    this.textfield.anchor.set(0.5, 0.5);
    this.instrustorRef.addChild(this.textfield);
  }
  private initKeyEvent() {
    KeyboardManager.getIsntance().evenDispatch.addEventListener(
      'eventKeyReleased',

      this.escKeyPressed
    );
  }
  init() {
    this.initKeyEvent();
  }
  private escKeyPressed = (
    event: {
      key: string;
      code: string;
    } & Event<'eventKeyReleased', EventDispatcher<KeyEvents>>
  ) => {
    if (event.key == 'Escape') {
      this.changeNextState();
    }
  };

  draw() {
    if (!this.instrustorRef.startPointinCm) return;
    const endPoint = this.instrustorRef.coordinateinCm.clone();

    const startPoint = this.instrustorRef.startPointinCm.clone();

    this.instrustorRef.drawTempCorner(startPoint, 1);

    this.instrustorRef.drawTempCorner(endPoint, 0.4);

    this.drawTempLine(startPoint, endPoint);
  }

  changeNextState() {
    this.instrustorRef.changeDrawState(
      this.instrustorRef.states.get('drawCorner')!
    );
  }
  onClick() {
    this.instrustorRef.setStartPointWithCurrentMousePos();
    const { x, y } = this.instrustorRef.snapXYOnLine(
      this.instrustorRef.startPointinCm!
    );
    const newEndCorner = this.floorplanModelRef.addCornerWithNoDuplicate(x, y);
    if (this.instrustorRef.startCorner) {
      this.floorplanModelRef.addNewWallWithNoDuplicate(
        this.instrustorRef.startCorner,
        newEndCorner
      );
    }
    this.instrustorRef.startCorner = newEndCorner;
    this.floorplanModelRef.updateRooms();
  }

  drawTempLine(startPointInCm: Vector2, endPointInCm: Vector2) {
    this.textfield.visible = true;
    const startPoint = Measure.VectorCmToPixel(startPointInCm);
    const endPoint = Measure.VectorCmToPixel(endPointInCm);
    const wallThick = Measure.cmToPixel(BASE_WALL_THICKNESS);
    const vect = endPointInCm.clone().sub(startPointInCm);
    const getPerpendicular = () => {
      const dir = endPoint.clone().sub(startPoint).normalize();
      return new Vector2(dir.y, -dir.x);
    };
    const topLeftPoint = startPoint
      .clone()
      .add(getPerpendicular().multiplyScalar(wallThick / 2));
    const topRightPoint = endPoint
      .clone()
      .add(getPerpendicular().multiplyScalar(wallThick / 2));
    const bottomRightPoint = endPoint
      .clone()
      .add(getPerpendicular().multiplyScalar(-wallThick / 2));
    const bottomLeftPoint = startPoint
      .clone()
      .add(getPerpendicular().multiplyScalar(-wallThick / 2));

    this.instrustorRef.beginFill(
      Color2D.tempLine.color,
      Color2D.tempLine.alpha
    );
    this.instrustorRef.lineStyle(0.5, Color2D.wall.color, 0.8);
    this.instrustorRef.drawPolygon([
      topLeftPoint.x,
      topLeftPoint.y,
      topRightPoint.x,
      topRightPoint.y,
      bottomRightPoint.x,
      bottomRightPoint.y,
      bottomLeftPoint.x,
      bottomLeftPoint.y,
    ]);
    this.instrustorRef.endFill();

    this.textfield.position.x = (startPoint.x + endPoint.x) / 2;
    this.textfield.position.y = (startPoint.y + endPoint.y) / 2 - 20;
    this.textfield.text = Measure.cmToMeasureUnit(vect.length());
  }
  clear() {
    this.instrustorRef.clear();
    this.textfield.visible = false;
    KeyboardManager.getIsntance().evenDispatch.removeEventListener(
      'eventKeyReleased',
      this.escKeyPressed
    );
  }
}
