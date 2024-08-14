import {
  BoxGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  NoBlending,
  RepeatWrapping,
  Scene,
  Vector2,
  Vector3,
} from 'three';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Measure } from '../../../helper/measure';
import { isEqual } from '../../../helper/ultis';
import {
  Color3D,
  inWallMaterialIndex,
  outWallMaterialIndex,
} from '../../../model/constance';
import { Wall } from '../../../model/wall';
import { TextureLoaderSingleton } from '../../loaders/textureLoader';
import { Item3D } from '../items/Item3D';
import { InWallItem } from '../items/in_wall_item';
import { WallItem } from '../items/wall_item';

export type WallEgdeUpdate = {
  inWallStart: number;
  inWallEnd: number;
  outWallStart: number;
  outWallEnd: number;
};

export class WallView3D extends Group {
  private _wallModel: Wall;
  private wallBoxMesh: Mesh | undefined;
  private sceneRef: Scene;
  private cameraControlRef: OrbitControls;
  private hole: Brush | undefined;
  private wallBrush: Brush | undefined;
  private materials: MeshStandardMaterial[] = [];
  private updateInfo: WallEgdeUpdate | undefined;
  constructor(
    _wallModel: Wall,
    sceneRef: Scene,
    cameraControlRef: OrbitControls
  ) {
    super();
    this._wallModel = _wallModel;
    this.sceneRef = sceneRef;
    this.cameraControlRef = cameraControlRef;
    this.initMaterial();
    this.updateDraw();
    this.initEvent();
    this.updateInwallTexture('/wallTexture/wallmap_yellow.png');
    this.updateOutwallTexture('/wallTexture/wallmap_yellow.png');
    this.sceneRef.add(this);
  }
  get wallModel() {
    return this._wallModel;
  }
  private initEvent = () => {
    this.cameraControlRef.addEventListener('change', this.onCamControlChange);
  };
  updateInwallTexture = async (textureUrl: string) => {
    try {
      const texture = await TextureLoaderSingleton.loadTexture(textureUrl);
      if (this.materials[inWallMaterialIndex] instanceof MeshStandardMaterial) {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        this.materials[inWallMaterialIndex].map = texture;
        this.updateInWallTextureLength();
        this.materials[inWallMaterialIndex].needsUpdate = true;
      }
    } catch (err) {
      console.log(err);
    }
  };

  updateOutwallTexture = async (textureUrl: string) => {
    try {
      const texture = await TextureLoaderSingleton.loadTexture(textureUrl);
      if (
        this.materials[outWallMaterialIndex] instanceof MeshStandardMaterial
      ) {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        this.materials[outWallMaterialIndex].map = texture;
        this.updateOutWallTextureLength();
      }
    } catch (err) {
      console.log(err);
    }
  };
  private updateOutWallTextureLength() {
    const texture = this.materials[outWallMaterialIndex].map;
    if (!texture) return;
    if (texture.image.width) {
      const lenght = Measure.cmToPixel(this._wallModel.wallLength);
      texture.repeat.set(lenght / (texture.image.width * 0.5), 1);
    }
    this.materials[outWallMaterialIndex].needsUpdate = true;
  }
  private updateInWallTextureLength() {
    const texture = this.materials[inWallMaterialIndex].map;
    if (!texture) return;
    if (texture.image.width) {
      const lenght = Measure.cmToPixel(this._wallModel.wallLength);
      texture.repeat.set(lenght / (texture.image.width * 0.5), 1);
    }
    this.materials[inWallMaterialIndex].needsUpdate = true;
  }
  private onCamControlChange = () => {
    this.updateVisibility();
  };

  private updateVisibility = () => {
    if (
      !this.cameraControlRef.enabled ||
      this._wallModel.isInteriorWall() ||
      this._wallModel.addAttachRoom.length == 0
    ) {
      this.visible = true;
      this.wallModel?.wallItems?.forEach((item) => {
        item.removeTransparent();
      });
      return;
    }

    const camVeritcalDown = this.cameraControlRef.target
      .clone()
      .sub(this.cameraControlRef.object.position)
      .normalize();

    if (Measure.isLookDown(camVeritcalDown)) {
      this.visible = true;
      this.wallModel?.wallItems?.forEach((item) => {
        item.removeTransparent();
      });
      return;
    }

    const middelPoint = Measure.VectorCmToPixel(this._wallModel.middlePoint());
    const pointBottomOutWallVector =
      this._wallModel.wallPerpendicularNormalizePointOutRoom;
    const camPosition = new Vector2(
      this.cameraControlRef.object.position.x,
      this.cameraControlRef.object.position.z
    );

    // setup camera: scope.controls.object refers to the camera of the scene
    const camDir = middelPoint.clone().sub(camPosition).normalize();
    // find dot
    const dotOut = pointBottomOutWallVector.dot(camDir);

    // upda te visible
    if (!this.wallModel.wallItems) return;
    if (dotOut >= 0.1) {
      this.visible = true;
      this.wallModel.wallItems.forEach((item) => {
        item.removeTransparent();
      });
    } else {
      this.visible = false;
      this.wallModel.wallItems.forEach((item) => {
        item.applyTransparent();
      });
    }
  };
  private initMaterial = () => {
    const materialBaseWall = new MeshStandardMaterial({
      color: Color3D.baseMaterial,
      side: DoubleSide,
    });
    const materialInWall = new MeshStandardMaterial({
      color: Color3D.baseMaterial,
      side: DoubleSide,
      blending: NoBlending,
    });
    const materialOutWall = new MeshStandardMaterial({
      color: Color3D.baseMaterial,
      side: DoubleSide,
      blending: NoBlending,
    });
    this.materials = [
      materialBaseWall,
      materialBaseWall,
      materialBaseWall,
      materialBaseWall,
      materialInWall, // Inwall side
      materialOutWall, // Outwall side
    ];
  };

  public updateWallItemPosError() {
    if (!this._wallModel.wallItems) return;
    for (let i = this._wallModel.wallItems.length - 1; i >= 0; i--) {
      const item = this._wallModel.wallItems[i];
      if (item instanceof InWallItem || item instanceof WallItem) {
        if (
          !Measure.polygonInPolygon(
            item.itemWallPolygon(),
            this._wallModel.wallPolygon()
          ) ||
          Measure.pointDistanceFromLine(
            new Vector2(item.position.x, item.position.z),
            Measure.VectorCmToPixel(
              this._wallModel.associateCorners[0].coordinate
            ),
            Measure.VectorCmToPixel(
              this._wallModel.associateCorners[1].coordinate
            )
          ) >
            Measure.cmToPixel(this._wallModel.thickNess) / 2 + 1
        ) {
          item.showError();
        } else {
          item.removeError();
        }
      }
    }
  }

  public updateDraw = () => {
    if (this.wallBoxMesh) {
      this.wallBoxMesh.geometry.dispose();
      this.remove(this.wallBoxMesh);
    }

    const height = Measure.cmToPixel(this.wallModel.wallHeight);
    const thicc = Measure.cmToPixel(this.wallModel.thickNess);
    const width = Measure.cmToPixel(this.wallModel.wallLength);
    const rotate = this.wallModel.wallDirectionNormalized.angle();
    const middlePointV3 = Measure.Vector3CmToPixel(
      this.wallModel.middlePointV3()
    );

    const wallGeometry = new BoxGeometry(width, height, thicc);

    this.wallBoxMesh = new Mesh(wallGeometry, this.materials);
    this.materials.forEach((material) => {
      material.needsUpdate = true;
    });
    this.wallBoxMesh.rotation.y = -rotate;
    this.wallBoxMesh.translateY(height / 2);
    this.position.set(middlePointV3.x, middlePointV3.y, middlePointV3.z);
    this.wallBoxMesh.receiveShadow = true;
    this.wallBoxMesh.castShadow = true;
    this.updateMatrixWorld();
    this.add(this.wallBoxMesh);
    this.wallBoxMesh.updateMatrixWorld();
    this.updateOutWallTextureLength();
    this.updateInWallTextureLength();
    this.updateWallItemPosError();
    this.wallModel.associateCorners.forEach((corner) => {
      corner.updateEdge();
    });
    if (!this.wallModel.wallItems) return;
    this.wallModel.wallItems.forEach((wallItem) => {
      if (wallItem instanceof InWallItem) {
        this.updateWallCSG(wallItem);
      }
    });
  };

  updateEgde=(updateInfo: WallEgdeUpdate)=> {
    const positionAttribute =
      this.wallBoxMesh?.geometry.getAttribute('position');
    if (!positionAttribute) return;

    const vertex = new Vector3();

    const {
      bottomInWallStart,
      topInWallStart,
      bottomInWallEnd,
      topInWallEnd,
      bottomOutWallStart,
      topOutWallStart,
      bottomOutWallEnd,
      topOutWallEnd,
    } = this.getWallPoint3D();
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);

      if (
        isEqual(vertex.x, topOutWallStart.x) &&
        isEqual(vertex.y, topOutWallStart.y) &&
        isEqual(vertex.z, topOutWallStart.z)
      ) {
        vertex.x += updateInfo.outWallStart;
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      if (
        isEqual(vertex.x, topOutWallEnd.x) &&
        isEqual(vertex.y, topOutWallEnd.y) &&
        isEqual(vertex.z, topOutWallEnd.z)
      ) {
        vertex.x += updateInfo.outWallEnd;
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      if (
        isEqual(vertex.x, bottomOutWallStart.x) &&
        isEqual(vertex.y, bottomOutWallStart.y) &&
        isEqual(vertex.z, bottomOutWallStart.z)
      ) {
        vertex.x += updateInfo.outWallStart;
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      if (
        isEqual(vertex.x, bottomOutWallEnd.x) &&
        isEqual(vertex.y, bottomOutWallEnd.y) &&
        isEqual(vertex.z, bottomOutWallEnd.z)
      ) {
        vertex.x += updateInfo.outWallEnd;
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      if (
        isEqual(vertex.x, topInWallStart.x) &&
        isEqual(vertex.y, topInWallStart.y) &&
        isEqual(vertex.z, topInWallStart.z)
      ) {
        vertex.x += updateInfo.inWallStart;
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      if (
        isEqual(vertex.x, topInWallEnd.x) &&
        isEqual(vertex.y, topInWallEnd.y) &&
        isEqual(vertex.z, topInWallEnd.z)
      ) {
        vertex.x += updateInfo.inWallEnd;
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      if (
        isEqual(vertex.x, bottomInWallStart.x) &&
        isEqual(vertex.y, bottomInWallStart.y) &&
        isEqual(vertex.z, bottomInWallStart.z)
      ) {
        vertex.x += updateInfo.inWallStart;
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      if (
        isEqual(vertex.x, bottomInWallEnd.x) &&
        isEqual(vertex.y, bottomInWallEnd.y) &&
        isEqual(vertex.z, bottomInWallEnd.z)
      ) {
        vertex.x += updateInfo.inWallEnd;
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
    }
    positionAttribute.needsUpdate = true;
  }

  updateWallCSG(item: Item3D) {
    const convexHullGeometry = Item3D.convexItemMap.get(item.uuid);
    if (!convexHullGeometry || !this.wallBoxMesh) return;
    // this.updateDraw();
    // if (this.hole && this.wallBrush) {
    //   this.sceneRef.remove(this.hole, this.wallBrush);
    // }
    const wallGeo = this.wallBoxMesh.geometry.clone();
    const wallMaterial = this.wallBoxMesh.material;
    this.wallBrush = new Brush(wallGeo, wallMaterial);
    this.wallBrush.applyMatrix4(this.wallBoxMesh.matrixWorld.clone());
    this.hole = new Brush(convexHullGeometry.clone());
    this.hole.scale.z = this.hole.scale.z * 2;
    this.hole.applyMatrix4(item.matrixWorld.clone());
    this.hole.updateMatrixWorld();
    this.wallBrush.updateMatrixWorld();
    const evaluator = new Evaluator();
    const WallHoleMesh = evaluator.evaluate(
      this.wallBrush,
      this.hole,
      SUBTRACTION
    );
    // make new csg wall to no any effect of translat rotate ..
    const matrix = this.wallBoxMesh.matrixWorld.clone().invert();
    WallHoleMesh.geometry.applyMatrix4(matrix); //invert WallHoleGeo to wallGeo
    // WallHoleMesh.position.set(0, 0, 0);
    //update position
    const height = Measure.cmToPixel(this.wallModel.wallHeight);
    const rotate = this.wallModel.wallDirectionNormalized.angle();
    WallHoleMesh.rotation.y = -rotate;
    WallHoleMesh.translateY(height / 2);
    this.remove(this.wallBoxMesh);
    this.wallBoxMesh.geometry.dispose();
    //new mesh
    this.wallBoxMesh = WallHoleMesh;
    this.wallBoxMesh.receiveShadow = true;
    this.wallBoxMesh.castShadow = true;
    this.add(this.wallBoxMesh);
    this.wallBoxMesh.updateMatrixWorld();
    // this.sceneRef.add(this.hole, this.wallBrush);
  }

  public cleanUpAll = () => {
    this.cleanUpEvent();
    this.cleanUpGraphic();
  };

  public cleanUpEvent = () => {
    this.cameraControlRef.removeEventListener(
      'change',
      this.onCamControlChange
    );
  };

  public cleanUpGraphic = () => {
    if (!this.wallBoxMesh) return;
    this.wallBoxMesh.geometry.dispose();
    if (this.wallBoxMesh.material instanceof MeshStandardMaterial) {
      this.wallBoxMesh.material.dispose();
      this.wallBoxMesh.material.map?.dispose();
    }

    if (Array.isArray(this.materials)) {
      this.materials.forEach((mat) => {
        mat.dispose();
        if (mat instanceof MeshStandardMaterial) {
          mat.map?.dispose();
        }
      });

      this.remove(this.wallBoxMesh);
      this.sceneRef.remove(this);
      this.wallBoxMesh = undefined;
    }
  };
  private getWallPoint3D = () => {
    const height = Measure.cmToPixel(this.wallModel.wallHeight);
    const length = Measure.cmToPixel(this.wallModel.wallLength);
    const depth = Measure.cmToPixel(this.wallModel.thickNess);
    let bottomStartOutWallPoint;
    let bottomEndOutWallPoint;
    let bottomEndInWallPoint;
    let bottomStartInWallPoint;
    if (this.wallModel.perDirectionPointOut == true) {
      bottomStartOutWallPoint = new Vector2(-length / 2, -depth / 2);
      bottomStartInWallPoint = new Vector2(-length / 2, depth / 2);
      bottomEndOutWallPoint = new Vector2(length / 2, -depth / 2);
      bottomEndInWallPoint = new Vector2(length / 2, depth / 2);
    } else {
      bottomStartOutWallPoint = new Vector2(-length / 2, depth / 2);
      bottomStartInWallPoint = new Vector2(-length / 2, -depth / 2);
      bottomEndOutWallPoint = new Vector2(length / 2, depth / 2);
      bottomEndInWallPoint = new Vector2(length / 2, -depth / 2);
    }

    const bottomInWallStart = new Vector3(
      bottomStartInWallPoint.x,
      -height / 2,
      bottomStartInWallPoint.y
    );
    const bottomInWallEnd = new Vector3(
      bottomEndInWallPoint.x,
      -height / 2,
      bottomEndInWallPoint.y
    );
    const topInWallStart = new Vector3(
      bottomStartInWallPoint.x,
      height / 2,
      bottomStartInWallPoint.y
    );
    const topInWallEnd = new Vector3(
      bottomEndInWallPoint.x,
      height / 2,
      bottomEndInWallPoint.y
    );

    const bottomOutWallStart = new Vector3(
      bottomStartOutWallPoint.x,
      -height / 2,
      bottomStartOutWallPoint.y
    );
    const bottomOutWallEnd = new Vector3(
      bottomEndOutWallPoint.x,
      -height / 2,
      bottomEndOutWallPoint.y
    );
    const topOutWallStart = new Vector3(
      bottomStartOutWallPoint.x,
      height / 2,
      bottomStartOutWallPoint.y
    );
    const topOutWallEnd = new Vector3(
      bottomEndOutWallPoint.x,
      height / 2,
      bottomEndOutWallPoint.y
    );

    return {
      bottomInWallStart,
      topInWallStart,
      bottomInWallEnd,
      topInWallEnd,

      bottomOutWallStart,
      topOutWallStart,
      bottomOutWallEnd,
      topOutWallEnd,
    };
  };
}

// export class WallView3DOld {
//   private wallModel: Wall;
//   private inWall: Mesh | undefined;
//   private outWall: Mesh | undefined;
//   private leftSideWall: Mesh | undefined;
//   private rightSideWall: Mesh | undefined;
//   private topWall: Mesh | undefined;
//   private sceneRef: Scene;
//   constructor(wallModel: Wall, sceneRef: Scene) {
//     this.wallModel = wallModel;
//     this.sceneRef = sceneRef;
//     this.initDraw();
//     // console.log('khi anh qua thung lung', this.sceneRef);
//   }

//   updateInwallTexture = async (textureUrl: string) => {
//     try {
//       const texture = await TextureLoaderSingleton.loadTexture(textureUrl);
//       if (this.inWall && this.inWall.material instanceof MeshStandardMaterial) {
//         texture.wrapS = RepeatWrapping;
//         texture.wrapT = RepeatWrapping;

//         if (texture.image.width) {
//           const lenght = Measure.cmToPixel(this.wallModel.wallLength);

//           console.log('IMG QW', texture.image, texture.image.width);
//           texture.repeat.set(lenght / (texture.image.width * 0.8), 1); // 0.8 í a magic number i dont know hơ thí work lol
//         }
//         this.inWall.material.map = texture;
//         this.inWall.material.needsUpdate = true;
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   updateOutwallTexture = async (textureUrl: string) => {
//     try {
//       const texture = await TextureLoaderSingleton.loadTexture(textureUrl);
//       if (
//         this.outWall &&
//         this.outWall.material instanceof MeshStandardMaterial
//       ) {
//         this.outWall.material.map = texture;
//         this.outWall.material.needsUpdate = true;
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   public updateDraw = () => {
//     // Update the vertices of each wall
//     this.updateInWallVertices();
//     this.updateOutWallVertices();
//     this.updateTopWallVertices();
//     this.updateLeftSideWallVertices();
//     this.updateRightSideWallVertices();
//   };

//   private initDraw = () => {
//     this.drawInWall3D();
//     this.drawOutWall3D();
//     this.drawTopWall3D();
//     this.drawLeftSideWall();
//     this.drawRightSideWall();
//     this.updateInwallTexture(BaseWallTextTure);
//   };
//   private updateInWallVertices = () => {
//     const {
//       bottomInWallLeft,
//       topInWallLeft,
//       bottomInWallRight,
//       topInWallRight,
//     } = this.getWallPoint3D();

//     const points = [
//       bottomInWallLeft,
//       bottomInWallRight,
//       topInWallRight,
//       topInWallLeft,
//     ];

//     // Update vertices of inWall mesh
//     this.updateMeshVertices(this.inWall!, points);
//   };

//   private updateOutWallVertices = () => {
//     const {
//       bottomOutWallLeft,
//       topOutWallLeft,
//       bottomOutWallRight,
//       topOutWallRight,
//     } = this.getWallPoint3D();

//     const points = [
//       bottomOutWallLeft,
//       bottomOutWallRight,
//       topOutWallRight,
//       topOutWallLeft,
//     ];

//     // Update vertices of outWall mesh
//     this.updateMeshVertices(this.outWall!, points);
//   };

//   private updateTopWallVertices = () => {
//     const { topInWallLeft, topInWallRight, topOutWallRight, topOutWallLeft } =
//       this.getWallPoint3D();

//     const points = [
//       topInWallLeft,
//       topInWallRight,
//       topOutWallRight,
//       topOutWallLeft,
//     ];

//     // Update vertices of topWall mesh
//     this.updateMeshVertices(this.topWall!, points);
//   };

//   private updateLeftSideWallVertices = () => {
//     const {
//       bottomInWallLeft,
//       topInWallLeft,
//       topOutWallLeft,
//       bottomOutWallLeft,
//     } = this.getWallPoint3D();

//     const points = [
//       bottomInWallLeft,
//       topInWallLeft,
//       topOutWallLeft,
//       bottomOutWallLeft,
//     ];

//     // Update vertices of leftSideWall mesh
//     this.updateMeshVertices(this.leftSideWall!, points);
//   };

//   private updateRightSideWallVertices = () => {
//     const {
//       bottomInWallRight,
//       topInWallRight,
//       topOutWallRight,
//       bottomOutWallRight,
//     } = this.getWallPoint3D();

//     const points = [
//       bottomInWallRight,
//       topInWallRight,
//       topOutWallRight,
//       bottomOutWallRight,
//     ];

//     // Update vertices of rightSideWall mesh
//     this.updateMeshVertices(this.rightSideWall!, points);
//   };

//   private updateMeshVertices = (mesh: Mesh, points: Vector3[]) => {
//     // Update mesh vertices
//     const geometry = mesh.geometry;
//     points.forEach((point, index) => {
//       geometry.attributes.position.setXYZ(index, point.x, point.y, point.z);
//     });
//     geometry.computeVertexNormals();
//     geometry.computeBoundingBox();
//     geometry.computeBoundingSphere();
//     geometry.attributes.position.needsUpdate = true;
//   };

//   private drawRightSideWall = () => {
//     const {
//       bottomInWallRight,
//       topInWallRight,
//       topOutWallRight,
//       bottomOutWallRight,
//     } = this.getWallPoint3D();
//     const points = [
//       bottomInWallRight,
//       topInWallRight,
//       topOutWallRight,
//       bottomOutWallRight,
//     ];
//     const material = new MeshStandardMaterial({
//       color: Color3D.baseMaterial,
//       side: DoubleSide,
//     });
//     const polyGeometry = this.getPolygonGeometry(points);
//     this.rightSideWall = new Mesh(polyGeometry, material);
//     this.rightSideWall.castShadow = true;
//     // Add the polygon mesh to the scene
//     this.sceneRef.add(this.rightSideWall);
//   };
//   private drawLeftSideWall = () => {
//     const {
//       bottomInWallLeft,
//       topInWallLeft,
//       topOutWallLeft,
//       bottomOutWallLeft,
//     } = this.getWallPoint3D();
//     const points = [
//       bottomInWallLeft,
//       topInWallLeft,
//       topOutWallLeft,
//       bottomOutWallLeft,
//     ];
//     const material = new MeshStandardMaterial({
//       color: Color3D.baseMaterial,
//       side: DoubleSide,
//     });
//     const polyGeometry = this.getPolygonGeometry(points);
//     this.leftSideWall = new Mesh(polyGeometry, material);
//     this.leftSideWall.castShadow = true;
//     // Add the polygon mesh to the scene
//     this.sceneRef.add(this.leftSideWall);
//   };

//   private drawTopWall3D = () => {
//     const { topInWallLeft, topInWallRight, topOutWallRight, topOutWallLeft } =
//       this.getWallPoint3D();
//     const points = [
//       topInWallLeft,
//       topInWallRight,
//       topOutWallRight,
//       topOutWallLeft,
//     ];
//     const material = new MeshStandardMaterial({
//       color: Color3D.baseMaterial,
//       side: DoubleSide,
//     });
//     const polyGeometry = this.getPolygonGeometry(points);
//     this.topWall = new Mesh(polyGeometry, material);
//     this.topWall.castShadow = true;
//     // Add the polygon mesh to the scene
//     this.sceneRef.add(this.topWall);
//   };

//   private drawInWall3D = () => {
//     const {
//       bottomInWallLeft,
//       topInWallLeft,
//       bottomInWallRight,
//       topInWallRight,
//     } = this.getWallPoint3D();
//     const points = [
//       bottomInWallLeft,
//       bottomInWallRight,
//       topInWallRight,
//       topInWallLeft,
//     ];
//     const material = new MeshStandardMaterial({
//       color: Color3D.baseMaterial,
//       side: DoubleSide,
//     });
//     const polyGeometry = this.getPolygonGeometry(points);
//     this.inWall = new Mesh(polyGeometry, material);
//     this.inWall.castShadow = true;
//     // Add the polygon mesh to the scene
//     this.sceneRef.add(this.inWall);
//   };

//   private drawOutWall3D = () => {
//     const {
//       bottomOutWallLeft,
//       topOutWallLeft,
//       bottomOutWallRight,
//       topOutWallRight,
//     } = this.getWallPoint3D();
//     const points = [
//       bottomOutWallLeft,
//       bottomOutWallRight,
//       topOutWallRight,
//       topOutWallLeft,
//     ];
//     const material = new MeshStandardMaterial({
//       color: Color3D.baseMaterial,
//       side: DoubleSide,
//     });
//     const polyGeometry = this.getPolygonGeometry(points);
//     this.outWall = new Mesh(polyGeometry, material);
//     this.outWall.castShadow = true;
//     // Add the polygon mesh to the scene
//     this.sceneRef.add(this.outWall);
//   };

//   private getPolygonGeometry = (points: Vector3[]) => {
//     const polyGeometry = new BufferGeometry();

//     // Define the indices for the rectangle
//     const indices = [
//       0,
//       1,
//       2, // Triangle 1: A, B, C
//       3,
//       0,
//       2, // Triangle 2: A, C, D
//     ];

//     polyGeometry.setFromPoints(points);
//     polyGeometry.setIndex(indices);
//     polyGeometry.computeVertexNormals();

//     const uv = [0, 0, 1, 0, 1, 1, 0, 1];
//     // const uv: number[] = [];
//     // points.forEach((point) => {
//     //   uv.push(point.x / Measure.cmToPixel(this.wallModel.wallLength), 0); // Mapping the x-coordinate of each point to the texture width
//     // });

//     polyGeometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
//     return polyGeometry;
//   };
//   private getWallPoint3D = () => {
//     const {
//       topLeftOutWallPoint,
//       topRightOutWallPoint,
//       bottomRightInWallPoint,
//       bottomLeftInWallPoint,
//     } = this.wallModel.WallCorners;
//     const height = Measure.cmToPixel(this.wallModel.wallHeight);
//     const bottomInWallLeft = new Vector3(
//       bottomLeftInWallPoint.x,
//       0,
//       bottomLeftInWallPoint.y
//     );
//     const bottomInWallRight = new Vector3(
//       bottomRightInWallPoint.x,
//       0,
//       bottomRightInWallPoint.y
//     );
//     const topInWallLeft = new Vector3(
//       bottomLeftInWallPoint.x,
//       height,
//       bottomLeftInWallPoint.y
//     );
//     const topInWallRight = new Vector3(
//       bottomRightInWallPoint.x,
//       height,
//       bottomRightInWallPoint.y
//     );

//     const bottomOutWallLeft = new Vector3(
//       topLeftOutWallPoint.x,
//       0,
//       topLeftOutWallPoint.y
//     );
//     const bottomOutWallRight = new Vector3(
//       topRightOutWallPoint.x,
//       0,
//       topRightOutWallPoint.y
//     );
//     const topOutWallLeft = new Vector3(
//       topLeftOutWallPoint.x,
//       height,
//       topLeftOutWallPoint.y
//     );
//     const topOutWallRight = new Vector3(
//       topRightOutWallPoint.x,
//       height,
//       topRightOutWallPoint.y
//     );

//     return {
//       bottomInWallLeft,
//       topInWallLeft,
//       bottomInWallRight,
//       topInWallRight,

//       bottomOutWallLeft,
//       topOutWallLeft,
//       bottomOutWallRight,
//       topOutWallRight,
//     };
//   };

//   public cleanUpGraphic = () => {
//     if (this.inWall && this.inWall.material instanceof MeshStandardMaterial) {
//       this.inWall.geometry.dispose();
//       this.inWall.material.dispose();
//       this.inWall.material.map?.dispose();
//       this.sceneRef.remove(this.inWall);
//     }
//     if (this.outWall && this.outWall.material instanceof MeshStandardMaterial) {
//       this.outWall.geometry.dispose();
//       this.outWall.material.dispose();
//       this.outWall.material.map?.dispose();
//       this.sceneRef.remove(this.outWall);
//     }
//     if (this.topWall && this.topWall.material instanceof MeshStandardMaterial) {
//       this.topWall.geometry.dispose();
//       this.topWall.material.dispose();
//       this.topWall.material.map?.dispose();
//       this.sceneRef.remove(this.topWall);
//     }
//     if (
//       this.leftSideWall &&
//       this.leftSideWall.material instanceof MeshStandardMaterial
//     ) {
//       this.leftSideWall.geometry.dispose();
//       this.leftSideWall.material.dispose();
//       this.leftSideWall.material.map?.dispose();
//       this.sceneRef.remove(this.leftSideWall);
//     }
//     if (
//       this.rightSideWall &&
//       this.rightSideWall.material instanceof MeshStandardMaterial
//     ) {
//       this.rightSideWall.geometry.dispose();
//       this.rightSideWall.material.dispose();
//       this.rightSideWall.material.map?.dispose();
//       this.sceneRef.remove(this.rightSideWall);
//     }
//   };
// }
