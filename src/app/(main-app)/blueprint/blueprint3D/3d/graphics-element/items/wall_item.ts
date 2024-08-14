import { ModelData } from 'src/types/asset.type';
import { Box3, Group, Matrix4, Vector2, Vector3 } from 'three';
import { Measure } from '../../../helper/measure';
import { Wall } from '../../../model/wall';
import { KeyAllItemControl } from '../../control-interaction/appController';
import { Item3D } from './Item3D';

export class WallItem extends Item3D {
  private _wallModelRef: Wall | undefined;
  constructor(model3d: Group, metadata: ModelData) {
    super(model3d, metadata);
    this.centerModel();
  }
  get wallModel() {
    return this._wallModelRef;
  }

  protected centerModel(): void {
    if (!this._model3d) return;
    const max = this.boundingBox.max.clone();
    const min = this.boundingBox.min.clone();
    this.boundingBox.applyMatrix4(
      new Matrix4().makeTranslation(
        -0.5 * (max.x + min.x),
        -0.5 * (max.y + min.y),
        min.z
      )
    );
    this._model3d.applyMatrix4(
      new Matrix4().makeTranslation(
        -0.5 * (max.x + min.x),
        -0.5 * (max.y + min.y),
        min.z
      )
    );
    this._model3d.updateMatrixWorld();
  }
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
  public getControlKey(): KeyAllItemControl {
    return 'wallItemControl';
  }
  public attachWall = (newWallModelRef: Wall) => {
    this._wallModelRef = newWallModelRef;
    this._wallModelRef.addWallItem(this);
  };
  public detachWall = () => {
    if (!this._wallModelRef) return;
    this._wallModelRef.removeWallItem(this);
    this._wallModelRef = undefined;
  };
  public itemWallPolygon() {
    //get wall polygon project on X axis or Y axsis
    if (
      (this._wallModelRef!.wallDirection.angle() > Math.PI / 4 &&
        this._wallModelRef!.wallDirection.angle() < (3 * Math.PI) / 4) ||
      (this._wallModelRef!.wallDirection.angle() > (5 * Math.PI) / 4 &&
        this._wallModelRef!.wallDirection.angle() < (7 * Math.PI) / 4)
    ) {
      return this.getWallItemWallPolygonZ();
    }
    return this.getWallItemWallPolygonX();
  }
  private getWallItemWallPolygonX() {
    const boundingBox = new Box3().setFromObject(this, true);
    const max = Measure.Vector3PixelToCm(boundingBox.max);
    const min = Measure.Vector3PixelToCm(boundingBox.min);
    const vertex1 = new Vector2(max.x, max.y);
    const vertex2 = new Vector2(max.x, min.y);
    const vertex3 = new Vector2(min.x, min.y);
    const vertex4 = new Vector2(min.x, max.y);

    return [vertex1, vertex2, vertex3, vertex4];
  }

  private getWallItemWallPolygonZ() {
    const boundingBox = new Box3().setFromObject(this, true);
    const max = Measure.Vector3PixelToCm(boundingBox.max);
    const min = Measure.Vector3PixelToCm(boundingBox.min);
    const vertex1 = new Vector2(max.z, max.y);
    const vertex2 = new Vector2(max.z, min.y);
    const vertex3 = new Vector2(min.z, min.y);
    const vertex4 = new Vector2(min.z, max.y);

    return [vertex1, vertex2, vertex3, vertex4];
  }
}
