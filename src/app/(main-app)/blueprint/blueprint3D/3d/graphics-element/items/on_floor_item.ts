import { ModelData } from 'src/types/asset.type';
import { Group, Matrix4, Vector2, Vector3 } from 'three';
import { Measure } from '../../../helper/measure';
import { Room } from '../../../model/room';
import { KeyAllItemControl } from '../../control-interaction/appController';
import { Item3D } from './Item3D';
export class OnFloorItem extends Item3D {
  private roomRef: Room | undefined;
  constructor(model3d: Group, metadata: ModelData) {
    super(model3d, metadata);
    // this.rotateY(2);
    this.centerModel();
  }
  protected centerModel(): void {
    if (!this._model3d) return;
    const max = this.boundingBox.max.clone();
    const min = this.boundingBox.min.clone();
    this.boundingBox.applyMatrix4(
      new Matrix4().makeTranslation(
        -0.5 * (max.x + min.x),
        -0.5 * (max.y + min.y) + 0.5 * (max.y - min.y),
        -0.5 * (max.z + min.z)
      )
    );
    this._model3d.applyMatrix4(
      new Matrix4().makeTranslation(
        -0.5 * (max.x + min.x),
        -0.5 * (max.y + min.y) + 0.5 * (max.y - min.y),
        -0.5 * (max.z + min.z)
      )
    );
    this._model3d.updateMatrixWorld();
  }
  public attachRoom = (newRoomRef: Room) => {
    this.roomRef = newRoomRef;
    // moveTo(x:number,y:number) // in cm already snap
    // {

    // }

    this.roomRef.addRoomItem(this);
  };

  public detachRoom = () => {
    if (!this.roomRef) return;
    this.roomRef.removeItem(this);
    this.roomRef = undefined;
  };
  get roomModel() {
    return this.roomRef;
  }
  public getControlKey = () => {
    return 'onFloorItemControl' as KeyAllItemControl;
  };

  public getFloorItemFloorPolygon() {
    const pos = this.position.clone();
    const transform = new Matrix4();
    const boundBox = this.boundingBox.clone();
    transform.makeRotationY(this.rotation.y);

    //console.log(this.rotation.y);
    const vertex1 = new Vector3(boundBox.max.x, 0, boundBox.max.z)
      .applyMatrix4(transform)
      .add(pos);
    const vertex2 = new Vector3(boundBox.max.x, 0, boundBox.min.z)
      .applyMatrix4(transform)
      .add(pos);
    const vertex3 = new Vector3(boundBox.min.x, 0, boundBox.min.z)
      .applyMatrix4(transform)
      .add(pos);
    const vertex4 = new Vector3(boundBox.min.x, 0, boundBox.max.z)
      .applyMatrix4(transform)
      .add(pos);

    return [
      Measure.VectorPixelToCm(new Vector2(vertex1.x, vertex1.z)),
      Measure.VectorPixelToCm(new Vector2(vertex2.x, vertex2.z)),
      Measure.VectorPixelToCm(new Vector2(vertex3.x, vertex3.z)),
      Measure.VectorPixelToCm(new Vector2(vertex4.x, vertex4.z)),
    ];
  }
  //Measure.polygonInPolygon( , this.roomRef.corners.map(corner=>corner.coordinate))
}
