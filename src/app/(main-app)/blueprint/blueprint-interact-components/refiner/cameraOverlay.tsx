import { cn } from '@/utils/utils-client';
import { useEffect, useState } from 'react';

import { CamerasManager } from '../../blueprint3D/3d/cameraManager';
import {
  Blueprint,
  EventData,
  threeDCameraEvent,
} from '../../blueprint3D/blueprint';

export default function CameraOverlay({ bluePrint }: { bluePrint: Blueprint }) {
  const [hideOverlay, setHideOverlay] = useState(true);
  const [cameraPosition, setCameraPosition] = useState({
    xStartOrigin: 0,
    yStartOrigin: 0,
    widthOrigin: 0,
    heightOrigin: 0,
  });
  const [aspect, setAspect] = useState<number>(16 / 9);
  const onFirstPersonEnable = () => {
    setHideOverlay(false);
  };

  const onFirstPersonDisable = () => {
    setHideOverlay(true);
  };

  const changeCamAspect = (
    event: EventData<threeDCameraEvent, 'change-cam-aspect'>
  ) => {
    setAspect(event.aspect);
  };
  useEffect(() => {
    const windowResize = () => {
      const newPosition = CamerasManager.calculateCamViewPosition(aspect);
      setCameraPosition(newPosition);
    };
    bluePrint.externalEvenDispatch.addEventListener(
      'change-cam-aspect',
      changeCamAspect
    );

    bluePrint.externalEvenDispatch.addEventListener(
      'enable-first-person-camera',
      onFirstPersonEnable
    );
    bluePrint.externalEvenDispatch.addEventListener(
      'disable-first-person-camera',
      onFirstPersonDisable
    );

    window.addEventListener('resize', windowResize);

    // Initial call to set the position
    windowResize();

    return () => {
      bluePrint.externalEvenDispatch.removeEventListener(
        'change-cam-aspect',
        changeCamAspect
      );
      window.removeEventListener('resize', windowResize);
      bluePrint.externalEvenDispatch.removeEventListener(
        'enable-first-person-camera',
        onFirstPersonEnable
      );
      bluePrint.externalEvenDispatch.removeEventListener(
        'disable-first-person-camera',
        onFirstPersonDisable
      );
    };
  }, [bluePrint.externalEvenDispatch, aspect]);

  const { xStartOrigin, yStartOrigin, widthOrigin, heightOrigin } =
    cameraPosition;
  console.log(xStartOrigin, yStartOrigin, widthOrigin, heightOrigin);
  return (
    <div
      className={cn(
        'pointer-events-none absolute left-0 top-0 h-screen   w-screen bg-black opacity-45 mix-blend-hard-light',
        { hidden: hideOverlay }
      )}
    >
      <div
        className=" absolute rounded-lg bg-[gray]  transition-all"
        style={{
          left: `${xStartOrigin}px`,
          top: `${yStartOrigin}px`,
          width: `${widthOrigin}px`,
          height: `${heightOrigin}px`,
        }}
      ></div>
    </div>
  );
}
