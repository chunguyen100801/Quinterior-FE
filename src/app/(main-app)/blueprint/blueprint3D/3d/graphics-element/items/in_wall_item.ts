import { ModelData } from 'src/types/asset.type';
import { Box3, Group, Matrix4, Vector2 } from 'three';
import { Measure } from '../../../helper/measure';
import { Wall } from '../../../model/wall';
import { KeyAllItemControl } from '../../control-interaction/appController';
import { Item3D } from './Item3D';

export class InWallItem extends Item3D {
  private _wallModelRef: Wall | undefined;
  constructor(model3d: Group, metadata: ModelData) {
    super(model3d, metadata);
    this.centerModel();
  }
  get wallModel() {
    return this._wallModelRef;
  }
  public scaleToWallThick() {
    if (!this._wallModelRef) return;
    const modelDepth = this.metadata.z;
    const wallThick = this._wallModelRef.thickNess;
    const scaleZ = wallThick / modelDepth; //8cm offset
    this.scale.setZ(scaleZ);
  }
  public getControlKey(): KeyAllItemControl {
    return 'inWallItemControl';
  }
  protected centerModel(): void {
    if (!this._model3d) return;
    const max = this.boundingBox.max.clone();
    const min = this.boundingBox.min.clone();
    this.boundingBox.applyMatrix4(
      new Matrix4().makeTranslation(
        -0.5 * (max.x + min.x),
        -0.5 * (max.y + min.y),
        -0.5 * (max.z + min.z)
      )
    );
    this._model3d.applyMatrix4(
      new Matrix4().makeTranslation(
        -0.5 * (max.x + min.x),
        -0.5 * (max.y + min.y),
        -0.5 * (max.z + min.z)
      )
    );
    this._model3d.updateMatrixWorld();
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
