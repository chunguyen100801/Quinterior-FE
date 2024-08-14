// import { Cache } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class GLTFLoaderSingleton {
  private static instance: GLTFLoader | undefined;
  // private 3dCache : Map<id>
  private constructor() {}

  static getInstance(): GLTFLoader {
    if (!GLTFLoaderSingleton.instance) {
      GLTFLoaderSingleton.instance = new GLTFLoader();
      // Cache.enabled = true;
    }
    return GLTFLoaderSingleton.instance;
  }

  static loadGLTF(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      GLTFLoaderSingleton.getInstance().load(
        url,
        (gltf) => resolve(gltf),
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => reject(error)
      );
    });
  }
}
