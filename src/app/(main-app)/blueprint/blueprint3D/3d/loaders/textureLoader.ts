import { SRGBColorSpace, Texture, TextureLoader } from 'three';

export class TextureLoaderSingleton {
  private static instance: TextureLoader | undefined;
  private constructor() {}
  static getInstance() {
    if (!TextureLoaderSingleton.instance) {
      TextureLoaderSingleton.instance = new TextureLoader();
    }
    return TextureLoaderSingleton.instance;
  }
  static loadTexture(url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      TextureLoaderSingleton.getInstance().load(
        url,
        (texture) => {
          texture.colorSpace = SRGBColorSpace;
          return resolve(texture);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => reject(error)
      );
    });
  }
}
