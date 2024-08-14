import {
  Box3,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  Texture,
  Vector2,
  Vector3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Measure } from '../../../helper/measure';
import { Color3D } from '../../../model/constance';
import { Room } from '../../../model/room';
import { TextureLoaderSingleton } from '../../loaders/textureLoader';
import { CeillingItem } from '../items/ceilling_item';

export class RoomCeillingView3D extends Group {
  private celling: Mesh;
  private currentTexture: Texture | undefined;
  private roomModelRef: Room;
  private cameraControlRef: OrbitControls;
  private roomHeight: number; //equal to first wall height
  constructor(
    roomModelRef: Room,
    cameraControlRef: OrbitControls,
    roomHeight: number
  ) {
    super();
    this.roomHeight = roomHeight;
    this.cameraControlRef = cameraControlRef;
    this.roomModelRef = roomModelRef;
    this.celling = this.buildCelling();
    this.add(this.celling);

    this.initEvent();
  }

  get roomModel() {
    return this.roomModelRef;
  }

  private initEvent = () => {
    this.cameraControlRef.addEventListener('change', this.onCamControlChange);
  };
  private onCamControlChange = () => {
    this.updateVisibility();
  };
  private updateVisibility = () => {
    if (!this.roomModel.view2D) return;
    if (!this.cameraControlRef.enabled) {
      this.visible = true;
      this.roomModel?.roomItems?.forEach((item) => {
        item.removeTransparent();
      });
      return;
    }

    const roomCentroid = Measure.VectorCmToPixel(
      this.roomModel.view2D.centroid
    );
    const roomceilingCentroidV3 = new Vector3(
      roomCentroid.x,
      Measure.cmToPixel(this.roomHeight),
      roomCentroid.y
    );
    const camPosition = this.cameraControlRef.object.position.clone();
    // setup camera: scope.controls.object refers to the camera of the scene
    const camDir = roomceilingCentroidV3.clone().sub(camPosition).normalize();
    const lookUpV3 = new Vector3(0, 1, 0);
    // find dot
    const dotOut = lookUpV3.dot(camDir);
    // update visible
    if (!this.roomModel.roomItems) return;
    if (dotOut >= 0.01) {
      this.visible = true;
      this.roomModel.roomItems.forEach((item) => {
        if (item instanceof CeillingItem) {
          item.removeTransparent();
        }
      });
    } else {
      this.visible = false;
      this.roomModel.roomItems.forEach((item) => {
        if (item instanceof CeillingItem) {
          item.applyTransparent();
        }
      });
    }
  };
  setTexture = async (textureUrl: string) => {
    const box3 = new Box3().setFromObject(this.celling);
    try {
      this.currentTexture =
        await TextureLoaderSingleton.loadTexture(textureUrl);
      if (
        this.celling &&
        this.celling.material instanceof MeshStandardMaterial
      ) {
        // texture.repeat.set(1, 1); // 0.8 í a magic number i dont know hơ thí work lol
        this.currentTexture.wrapS = RepeatWrapping;
        this.currentTexture.wrapT = RepeatWrapping;
        if (this.currentTexture.image.width) {
          const lenghtX = box3.max.x - box3.min.x;
          const lenghtY = box3.max.z - box3.min.z;

          this.currentTexture.repeat.set(
            lenghtX / (this.currentTexture.image.width * 0.5),
            lenghtY / (this.currentTexture.image.height * 0.5)
          );
        }

        this.celling.material.map = this.currentTexture;
        this.celling.material.needsUpdate = true;
      }
    } catch (err) {
      console.log(err);
    }
  };
  private updateTexture = () => {
    if (!this.currentTexture) return;
    const box3 = new Box3().setFromObject(this.celling);

    if (this.celling && this.celling.material instanceof MeshStandardMaterial) {
      // texture.repeat.set(1, 1); // 0.8 í a magic number i dont know hơ thí work lol
      this.currentTexture.wrapS = RepeatWrapping;
      this.currentTexture.wrapT = RepeatWrapping;
      if (this.currentTexture.image.width) {
        const lenghtX = box3.max.x - box3.min.x;
        const lenghtY = box3.max.z - box3.min.z;

        this.currentTexture.repeat.set(
          lenghtX / (this.currentTexture.image.width * 0.5),
          lenghtY / (this.currentTexture.image.height * 0.5)
        );
      }

      this.celling.material.map = this.currentTexture;
      this.celling.material.needsUpdate = true;
    }
  };

  private updateUv = () => {
    const box3 = new Box3().setFromObject(this.celling);
    const positionAttribute = this.celling.geometry.getAttribute('position');
    const vec3 = new Vector3();
    const uvAttribute = this.celling.geometry.getAttribute('uv');

    for (let i = 0; i < positionAttribute.count; i++) {
      vec3.fromBufferAttribute(positionAttribute, i);
      uvAttribute.setXY(
        i,
        (vec3.x - box3.min.x) / (box3.max.x - box3.min.x),
        (vec3.y - box3.min.z) / (box3.max.z - box3.min.z)
      );
    }

    uvAttribute.needsUpdate = true;
    this.celling.geometry.computeVertexNormals();
    this.celling.geometry.computeBoundingBox();
  };
  public updateCellingPosition = () => {
    // Update celling position based on updated room corners
    const points: Vector2[] = [];
    this.roomModelRef.corners.forEach((corner) => {
      const coor = Measure.VectorCmToPixel(corner.coordinate);
      points.push(coor);
    });

    points.forEach((point, index) => {
      this.celling.geometry.attributes.position.setXY(index, point.x, point.y); // Update vertex position
    });
    // update uv
    this.updateUv();

    //update texture
    this.updateTexture();
    // Mark the geometry as needing updates
    this.celling.geometry.attributes.position.needsUpdate = true;
    this.celling.geometry.computeVertexNormals(); // Recalculate vertex normals
    this.celling.geometry.computeBoundingBox(); // Recalculate bounding box
    this.celling.updateMatrixWorld();
  };
  buildCelling() {
    const points: Vector2[] = [];
    this.roomModelRef.corners.forEach((corner) => {
      const coor = Measure.VectorCmToPixel(corner.coordinate);
      points.push(coor);
    });

    const shape = new Shape(points);
    const useGeometry = new ShapeGeometry(shape);

    const cellingMaterial3D = new MeshStandardMaterial({
      color: Color3D.baseMaterial,
      side: DoubleSide,
      // wireframe: true,
    });
    const celling = new Mesh(useGeometry, cellingMaterial3D);
    celling.receiveShadow = true;
    celling.rotation.set(Math.PI * 0.5, 0, 0);
    celling.translateZ(-Measure.cmToPixel(this.roomHeight));
    //uv
    const box3 = new Box3().setFromObject(celling);
    const positionAttribute = celling.geometry.getAttribute('position');
    const vec3 = new Vector3();
    const uvAttribute = celling.geometry.getAttribute('uv');

    for (let i = 0; i < positionAttribute.count; i++) {
      vec3.fromBufferAttribute(positionAttribute, i);
      uvAttribute.setXY(
        i,
        (vec3.x - box3.min.x) / (box3.max.x - box3.min.x),
        (vec3.y - box3.min.z) / (box3.max.z - box3.min.z)
      );
    }

    uvAttribute.needsUpdate = true;
    celling.geometry.computeVertexNormals();
    celling.geometry.computeBoundingBox();
    celling.updateMatrixWorld();
    return celling;
  }
  public cleanUpAll = () => {
    this.cleanUpGraphic();
    this.cleanUpEvent();
  };
  public cleanUpEvent = () => {
    this.cameraControlRef.removeEventListener(
      'change',
      this.onCamControlChange
    );
  };

  public cleanUpGraphic = () => {
    this.clear();
    if (this.celling && this.celling.material instanceof MeshStandardMaterial) {
      this.celling.geometry.dispose();
      this.celling.material.dispose();
    }
    this.currentTexture?.dispose();
  };
}
