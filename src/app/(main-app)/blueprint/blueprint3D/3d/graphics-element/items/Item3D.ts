import { ModelData } from 'src/types/asset.type';
import {
  Box3,
  Box3Helper,
  BufferGeometry,
  Color,
  ColorRepresentation,
  Float32BufferAttribute,
  Group,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
  Vector3,
} from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Measure } from '../../../helper/measure';
import { KeyAllItemControl } from '../../control-interaction/appController';

// export type ItemType =
//   | 'floor_item'
//   | 'in_wall_item'
//   | 'wall_item'
//   | 'decorate_item'
//   | 'ceilling_item';

// export type ItemMetaData = {
//   name: string;
//   width: number; // x coordinate reallife unit
//   height: number; // y  coordinate reallife unit
//   depth: number; // z  coordinate reallife unit
//   type: ModelType;
//   modelUrl: string; // modelURL to load
// };
export abstract class Item3D extends Group {
  public onHover: boolean = false;
  private _selected = false;
  public boundingBox: Box3 = new Box3();
  protected _model3d: Group | undefined;
  protected _metadata: ModelData;
  protected _isDrag: boolean = false;
  protected _isHover: boolean = false;
  public error3d: Object3D | undefined;
  public hover3d: Object3D | undefined;
  public boxHelper: Box3Helper;
  protected normalScale = new Vector3();
  public static convexItemMap = new Map<string, ConvexGeometry>();
  private originMaterialSetup = new Map<
    unknown,
    { transparent: boolean; opacity: number }
  >();
  private isFirstCallOriginMaterialSetup = true;
  public static cleanUpConvexItemGraphic = () => {
    this.convexItemMap.forEach((geo) => {
      geo.dispose();
    });
    this.convexItemMap.clear();
  };
  public static removeItemConvex(item: Item3D) {
    const geo = this.convexItemMap.get(item.uuid);
    if (geo) {
      this.convexItemMap.delete(item.uuid);
      geo.dispose();
    }
  }

  // Function to generate UV coordinates based on vertex positions
  static generateUVs(geometry: BufferGeometry) {
    const positionAttribute = geometry.getAttribute('position');
    const uvAttribute = new Float32BufferAttribute(
      positionAttribute.count * 2,
      2
    );

    for (let i = 0; i < positionAttribute.count; i++) {
      // Get vertex position
      const vertex = new Vector3();
      vertex.fromBufferAttribute(positionAttribute, i);

      // Calculate UV coordinates based on vertex position (example: using vertex position as UV)
      uvAttribute.setXY(i, vertex.x, vertex.y); // Example: using x and y coordinates as UV
    }

    return uvAttribute;
  }
  public static addItemConvex(item: Item3D) {
    if (!item.model3d) return;
    const id = item.uuid;
    if (Item3D.convexItemMap.has(id)) {
      return;
    }

    const model3d = item.model3d;
    const geos: BufferGeometry[] = [];
    model3d.traverse((child) => {
      if (child instanceof Mesh) {
        child.updateMatrix();
        const clonedGeometry = child.geometry.clone();
        clonedGeometry.applyMatrix4(child.matrixWorld);
        clonedGeometry.deleteAttribute('uv');
        geos.push(clonedGeometry);
      }
    });

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geos, true);

    const itemConvexHullGeometry =
      BufferGeometryUtils.mergeVertices(mergedGeometry); // Get vertices of the face

    const vertices = [];
    const positionAttribute = itemConvexHullGeometry.getAttribute('position');

    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new Vector3();
      vertex.fromBufferAttribute(positionAttribute, i);
      vertices.push(vertex);
    }
    const convexHullGeometry = new ConvexGeometry(vertices);

    // HOW TO CREATE MY OWN UV
    convexHullGeometry.setAttribute(
      'uv',
      this.generateUVs(itemConvexHullGeometry) // error here
    );

    this.convexItemMap.set(id, convexHullGeometry);
  }

  constructor(_model3d: Group, metadata: ModelData) {
    super();
    this._model3d = _model3d;
    this._metadata = metadata;
    this.scaleToNormal();
    this.setColorSpace();
    this.setCastShadow();
    this.boundingBox = new Box3().setFromObject(this._model3d, true);
    this.boxHelper = new Box3Helper(this.boundingBox, new Color(4409830));
    this.boxHelper.visible = false;
    // this.centerModel();
    this.add(this.boxHelper, this._model3d);
  }
  get metadata() {
    return this._metadata;
  }
  get model3d() {
    return this._model3d;
  }
  get selected() {
    return this._selected;
  }
  selectOn = () => {
    this.boxHelper.visible = true;
    this._selected = true;
  };
  selectOff = () => {
    this.boxHelper.visible = false;
    this._selected = false;
  };
  get isDrag() {
    return this._isDrag;
  }
  set isDrag(value: boolean) {
    this._isDrag = value;
  }
  get isHover() {
    return this._isHover;
  }
  set isHover(value: boolean) {
    this._isHover = value;
  }
  private scaleToNormal() {
    const temp = this.computeMeasure();
    if (!this._model3d || !temp) return;
    const { modelDepth, modelWidth, modelHeight } = temp;
    const scaleX = Measure.cmToPixel(this.metadata.x) / modelWidth;
    const scaleY = Measure.cmToPixel(this.metadata.y) / modelHeight;
    const scaleZ = Measure.cmToPixel(this.metadata.z) / modelDepth;
    // this._model3d.translateX .set(0,0,0)
    this._model3d.scale.set(scaleX, scaleY, scaleZ);
    this.normalScale = this._model3d.scale.clone();
  }
  get modelDepth() {
    return this.boundingBox.max.z - this.boundingBox.min.z;
  }
  get modelWidth() {
    return this.boundingBox.max.x - this.boundingBox.min.x;
  }
  get modelHeight() {
    return this.boundingBox.max.y - this.boundingBox.min.y;
  }
  public computeMeasure = () => {
    if (!this._model3d) return;
    this.boundingBox = new Box3().setFromObject(this._model3d, true);

    const modelDepth = this.modelDepth;
    const modelWidth = this.modelWidth;
    const modelHeight = this.modelHeight;
    return { modelDepth, modelWidth, modelHeight };
  };
  private setCastShadow = () => {
    if (!this._model3d) return;
    this._model3d.traverse((child) => {
      if (child instanceof Object3D) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  };
  private setColorSpace = () => {
    if (!this._model3d) return;
    this._model3d.traverse((child) => {
      if (child instanceof Mesh) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((material) => {
          if (material.map) {
            material.map.colorSpace = SRGBColorSpace; // or THREE.LinearEncoding for linear color space
          }
        });
      }
    });
  };
  public removeError() {
    if (this.error3d) {
      this.remove(this.error3d);

      this.error3d.traverse((child) => {
        if (child instanceof Mesh) {
          // Dispose of geometry
          child.geometry.dispose();

          // Dispose of materials
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              material.dispose();
            });
          } else {
            child.material.dispose();
          }
        }
      });
      this.error3d = undefined;
    }
  }

  public showError() {
    if (!this.error3d) {
      this.error3d = this.createGlow();
      if (this.error3d) {
        this.add(this.error3d);
      }
    }
  }
  public moveError(position: Vector3) {
    if (this.error3d) {
      this.error3d.position.copy(
        position.applyMatrix4(new Matrix4().makeRotationY(-this.rotation.y))
      );
    }
  }

  public applyTransparent() {
    if (!this._model3d) return;
    if (this.isFirstCallOriginMaterialSetup) {
      this._model3d.traverse((child) => {
        if (child instanceof Mesh) {
          if (child.material) {
            //save originnal setup
            this.originMaterialSetup.set(child.material, {
              transparent: child.material.transparent,
              opacity: child.material.opacity,
            });
          }
        }
      });
      this.isFirstCallOriginMaterialSetup = false;
    }

    this._model3d.traverse((child) => {
      if (child instanceof Mesh) {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = 0.1;
          child.material.needsUpdate = true;
        }
      }
    });
  }
  public removeTransparent() {
    if (!this._model3d) return;
    if (this.isFirstCallOriginMaterialSetup) return;
    this._model3d.traverse((child) => {
      if (child instanceof Mesh) {
        if (child.material) {
          const setup = this.originMaterialSetup.get(child.material);

          child.material.transparent = setup?.transparent;
          child.material.opacity = setup?.opacity;
          child.material.needsUpdate = true;
        }
      }
    });
  }

  public createGlow(
    color: ColorRepresentation = 16711680,
    opacity = 0.2,
    ignoreDepth = false
  ) {
    if (!this._model3d) return;
    ignoreDepth = ignoreDepth || false;

    const glowClone = clone(this._model3d);
    glowClone.traverse((child) => {
      const glowMaterial = new MeshStandardMaterial({
        color: color,
        // blending: AdditiveBlending,
        opacity: opacity,
        transparent: true,
        depthTest: !ignoreDepth,
      });
      if (child instanceof Mesh) {
        child.material = glowMaterial;
      }
    });
    return glowClone;
  }

  public deleteModel() {
    if (this._model3d) {
      this.remove(this._model3d);

      this._model3d.traverse((child) => {
        if (child instanceof Mesh) {
          // Dispose of geometry
          child.geometry.dispose();

          // Dispose of materials
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              material.dispose();
            });
          } else {
            child.material.dispose();
          }
        }
      });
    }
    if (this.boxHelper) {
      this.remove(this.boxHelper);
      this.boxHelper.dispose();
    }
    this._model3d = undefined;
  }
  public abstract getControlKey(): KeyAllItemControl;
  protected abstract centerModel(): void;
}
