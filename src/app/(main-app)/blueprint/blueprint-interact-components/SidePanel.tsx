'use client';
import { cn } from '@/utils/utils-client';
import { Divider } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Project } from 'src/types/projects.type';
import { FloorPlanMode } from '../Blueprint';
import { Blueprint } from '../blueprint3D/blueprint';
import ModeGroup from './2d-interact/ModeGroup';
import SidePanel2d from './2d-interact/SidePanel2d';
import MarketSidePanel from './3d-interact/MarketSidePanel';
import UninteractContainer from './UninteractContainer';
import RefineSidePanel from './refiner/refineSidePanel';
export default function SidePanel({
  bluePrint,
  mode,
  projectData,
  changeMode,
}: {
  bluePrint: Blueprint;
  mode: FloorPlanMode;
  projectData: Project;
  changeMode: (mode: FloorPlanMode) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isInCamMode, setIsInCamMode] = useState<boolean>(false);
  const router = useRouter();
  const hideTab = () => {
    setIsOpen((prev) => !prev);
  };

  const onLockFirstPersonCam = () => {
    setIsOpen(false);
    setIsInCamMode(true);
  };
  const onUnlockFirstPersonCam = () => {
    setIsInCamMode(false);
    setIsOpen(true);
  };
  useEffect(() => {
    bluePrint.externalEvenDispatch.addEventListener(
      'lock-first-person-camera',
      onLockFirstPersonCam
    );
    bluePrint.externalEvenDispatch.addEventListener(
      'unlock-first-person-camera',
      onUnlockFirstPersonCam
    );
    return () => {
      bluePrint.externalEvenDispatch.removeEventListener(
        'unlock-first-person-camera',
        onUnlockFirstPersonCam
      );

      bluePrint.externalEvenDispatch.removeEventListener(
        'lock-first-person-camera',
        onLockFirstPersonCam
      );
    };
  });
  return (
    <UninteractContainer bluePrint={bluePrint}>
      <div
        className={cn(
          ' absolute bottom-0  left-[calc(-35rem-0.375rem)] h-screen  w-[35rem]  p-3  transition-all ',
          {
            ' left-0  ': isOpen,
          }
        )}
      >
        <div
          onClick={hideTab}
          className={cn(
            '  absolute right-[-4rem] top-[50%]  flex h-[3rem] w-[3rem]   translate-y-[-50%] items-center justify-center rounded-full bg-background opacity-40 transition-all  duration-75 hover:opacity-hover hover:outline hover:outline-primary',
            { '  hidden ': isInCamMode }
          )}
        >
          <ArrowLeft
            className={cn(' transition-all ', { 'rotate-180': !isOpen })}
          />
        </div>

        <div className=" relative flex h-full w-full flex-col items-center  gap-5  rounded-xl bg-background p-5">
          <div className="ml-5  flex w-full gap-2">
            <Image
              className=" cursor-pointer"
              src="/logo.svg"
              height={60}
              width={60}
              alt="app logo"
              onClick={() => {
                router.push('/floor-plans');
              }}
            />
            <div className="flex flex-1 flex-col text-xl font-extrabold ">
              <span className="text-white/60">PROJECT</span>
              <span> {projectData.name}</span>
            </div>
            <ModeGroup mode={mode} changeMode={changeMode}></ModeGroup>
          </div>
          <Divider></Divider>
          <div className=" h-full w-full   overflow-y-auto p-2">
            <div className={cn({ hidden: mode != '2D' })}>
              <SidePanel2d
                bluePrint={bluePrint}
                projectData={projectData}
              ></SidePanel2d>
            </div>

            <div className={cn({ hidden: mode != '3D' })}>
              <MarketSidePanel bluePrint={bluePrint}></MarketSidePanel>
            </div>

            <div className={cn({ hidden: mode !== 'REFINER' })}>
              <RefineSidePanel
                bluePrint={bluePrint}
                projectData={projectData}
              ></RefineSidePanel>
            </div>
          </div>
        </div>
      </div>
    </UninteractContainer>
  );
}
