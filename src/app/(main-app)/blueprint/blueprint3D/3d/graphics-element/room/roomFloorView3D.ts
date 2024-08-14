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
import { Measure } from '../../../helper/measure';
import { Color3D } from '../../../model/constance';

import { Room } from '../../../model/room';
import { TextureLoaderSingleton } from '../../loaders/textureLoader';

export class RoomFloorView3D extends Group {
  private floor: Mesh;
  private currentTexture: Texture | undefined;
  private roomModelRef: Room;
  constructor(roomModelRef: Room) {
    super();
    this.roomModelRef = roomModelRef;
    this.floor = this.buildFloor();
    this.setTexture('/floorTexture/hardwood.png');
    this.add(this.floor);
  }
  get roomModel() {
    return this.roomModelRef;
  }
  setTexture = async (textureUrl: string) => {
    const box3 = new Box3().setFromObject(this.floor);
    try {
      this.currentTexture =
        await TextureLoaderSingleton.loadTexture(textureUrl);
      if (this.floor && this.floor.material instanceof MeshStandardMaterial) {
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

        this.floor.material.map = this.currentTexture;
        this.floor.material.needsUpdate = true;
      }
    } catch (err) {
      console.log(err);
    }
  };
  private updateTexture = () => {
    if (!this.currentTexture) return;
    const box3 = new Box3().setFromObject(this.floor);

    if (this.floor && this.floor.material instanceof MeshStandardMaterial) {
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

      this.floor.material.map = this.currentTexture;
      this.floor.material.needsUpdate = true;
    }
  };

  private updateUv = () => {
    const box3 = new Box3().setFromObject(this.floor);
    const positionAttribute = this.floor.geometry.getAttribute('position');
    const vec3 = new Vector3();
    const uvAttribute = this.floor.geometry.getAttribute('uv');

    for (let i = 0; i < positionAttribute.count; i++) {
      vec3.fromBufferAttribute(positionAttribute, i);
      uvAttribute.setXY(
        i,
        (vec3.x - box3.min.x) / (box3.max.x - box3.min.x),
        (vec3.y - box3.min.z) / (box3.max.z - box3.min.z)
      );
    }

    uvAttribute.needsUpdate = true;
    this.floor.geometry.computeVertexNormals();
    this.floor.geometry.computeBoundingBox();
  };
  public updateFloorPosition = () => {
    // Update floor position based on updated room corners
    const points: Vector2[] = [];
    this.roomModelRef.corners.forEach((corner) => {
      const coor = Measure.VectorCmToPixel(corner.coordinate);
      points.push(coor);
    });

    points.forEach((point, index) => {
      this.floor.geometry.attributes.position.setXY(index, point.x, point.y); // Update vertex position
    });
    // update uv
    this.updateUv();

    //update texture
    this.updateTexture();
    // Mark the geometry as needing updates
    this.floor.geometry.attributes.position.needsUpdate = true;
    this.floor.geometry.computeVertexNormals(); // Recalculate vertex normals
    this.floor.geometry.computeBoundingBox(); // Recalculate bounding box
  };
  buildFloor() {
    const points: Vector2[] = [];
    this.roomModelRef.corners.forEach((corner) => {
      const coor = Measure.VectorCmToPixel(corner.coordinate);
      points.push(coor);
    });

    const shape = new Shape(points);
    const useGeometry = new ShapeGeometry(shape);

    const floorMaterial3D = new MeshStandardMaterial({
      color: Color3D.baseMaterial,
      side: DoubleSide,
      // wireframe: true,
    });
    const floor = new Mesh(useGeometry, floorMaterial3D);
    floor.receiveShadow = true;
    floor.rotation.set(Math.PI * 0.5, 0, 0);
    //uv
    const box3 = new Box3().setFromObject(floor);
    const positionAttribute = floor.geometry.getAttribute('position');
    const vec3 = new Vector3();
    const uvAttribute = floor.geometry.getAttribute('uv');

    for (let i = 0; i < positionAttribute.count; i++) {
      vec3.fromBufferAttribute(positionAttribute, i);
      uvAttribute.setXY(
        i,
        (vec3.x - box3.min.x) / (box3.max.x - box3.min.x),
        (vec3.y - box3.min.z) / (box3.max.z - box3.min.z)
      );
    }

    uvAttribute.needsUpdate = true;
    floor.geometry.computeVertexNormals();
    floor.geometry.computeBoundingBox();

    return floor;
  }
  public cleanUpAll = () => {
    this.cleanUpGraphic();
  };

  public cleanUpGraphic = () => {
    this.clear();
    if (this.floor && this.floor.material instanceof MeshStandardMaterial) {
      this.floor.geometry.dispose();
      this.floor.material.dispose();
    }
    this.currentTexture?.dispose();
  };
}
