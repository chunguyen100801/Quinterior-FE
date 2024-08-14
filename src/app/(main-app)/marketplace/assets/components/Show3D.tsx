/* eslint-disable react/no-unknown-property */
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

interface Props {
  url: string;
  background?: string;
}

const Show3D = ({ url, background = '#aa6363' }: Props) => {
  const item = useGLTF(url);
  // const item = useGLTF('/3d-model/chair/cute_anime_girl_mage.glb');

  return url ? (
    <div className=" h-[36rem] w-full">
      <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }}>
        <color attach="background" args={[background]} />
        <OrbitControls enableZoom={true} />
        <Stage intensity={0.02} environment="sunset">
          <primitive object={item?.scene} scale={0.01} />
        </Stage>
      </Canvas>
    </div>
  ) : (
    <div className=" flex h-[36rem] w-full items-center justify-center ">
      <div className="text-md text-center">
        3D Model is not available for this product.
      </div>
    </div>
  );
};

export default Show3D;
