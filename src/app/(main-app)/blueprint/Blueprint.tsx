'use client';

import { useEffect, useRef, useState } from 'react';
import { Blueprint } from './blueprint3D/blueprint';

import LoadingScreen from '@/components/LoadingScreen';
import { cn } from '@/utils/utils-client';
import { toast } from 'sonner';
import { Project } from 'src/types/projects.type';
import SidePanel from './blueprint-interact-components/SidePanel';
import UninteractContainer from './blueprint-interact-components/UninteractContainer';
import CameraOverlay from './blueprint-interact-components/refiner/cameraOverlay';

export type ToastType = typeof toast;
export type FloorPlanMode = '2D' | '3D' | 'REFINER';
export default function BluePrint({ projectData }: { projectData: Project }) {
  const twodViewerRef = useRef<HTMLDivElement>(null);
  const threeDViewerRef = useRef<HTMLDivElement>(null);
  const [bluePrint, setBluePrint] = useState<Blueprint | null>(null);
  const [mode, setMode] = useState<FloorPlanMode>('3D');
  const [loading3d, setloading3d] = useState<boolean>(false);
  const changeMode = (mode: FloorPlanMode) => {
    if (mode == 'REFINER') {
      bluePrint?.externalEvenDispatch.dispatchEvent({
        type: 'enable-first-person-camera',
      });
    }
    if (mode == '3D' || mode == '2D') {
      bluePrint?.externalEvenDispatch.dispatchEvent({
        type: 'enable-orbit-camera',
      });
    }
    setMode(mode);
  };
  const load3DStart = () => {
    setloading3d(true);
  };
  const load3DDone = () => {
    setloading3d(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const blueprint: Blueprint | null = new Blueprint({
        savedFloorPlan: projectData.data,
        options2D: {
          twodViewerRef,
          toast,
        },
        options3D: {
          threeDViewerRef,
          toast,
        },
        optionsFloorPlan: {
          toast,
        },
      });

      setBluePrint(blueprint);
      blueprint.externalEvenDispatch.addEventListener(
        'start-load-3d',
        load3DStart
      );
      blueprint.externalEvenDispatch.addEventListener(
        'loaded-all-3d',
        load3DDone
      );
      blueprint.loadFloorPlan();
      return () => {
        blueprint?.externalEvenDispatch.removeEventListener(
          'start-load-3d',
          load3DStart
        );
        blueprint?.externalEvenDispatch.removeEventListener(
          'loaded-all-3d',
          load3DDone
        );
        blueprint?.cleanUpEvent();
        blueprint?.cleanUpGraphics();
        // blueprint = null;
        // setBluePrint(null);
      };
    }
  }, [projectData.data]);

  return (
    <div className="relative">
      <div className="  max-w-screen relative isolate max-h-screen overflow-hidden ">
        <div
          ref={twodViewerRef}
          className={cn(
            '   invisible relative  top-[100vh]   overflow-hidden',
            {
              'visible top-0': mode == '2D',
            }
          )}
        ></div>

        <UninteractContainer bluePrint={bluePrint}>
          <div
            ref={threeDViewerRef}
            className={cn(
              '  invisible  relative top-[100vh]   overflow-hidden',
              {
                'visible top-[-100vh]': mode == '3D' || mode == 'REFINER',
              }
            )}
          ></div>
        </UninteractContainer>

        {bluePrint && <CameraOverlay bluePrint={bluePrint}></CameraOverlay>}

        {bluePrint && (
          <div>
            <SidePanel
              bluePrint={bluePrint}
              mode={mode}
              projectData={projectData}
              changeMode={changeMode}
            ></SidePanel>
          </div>
        )}
      </div>

      {loading3d && (
        <UninteractContainer bluePrint={bluePrint}>
          <div className="  absolute left-0 top-0 ">
            <LoadingScreen
              label="Loading 3D Models..."
              opacity={0.9}
            ></LoadingScreen>
          </div>
        </UninteractContainer>
      )}
    </div>
  );
}
