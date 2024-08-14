import { Spinner } from '@nextui-org/react';
import Image from 'next/image';
export default function LoadingScreen({
  label,
  opacity,
}: {
  label?: string;
  opacity?: number;
}) {
  return (
    <div className=" relative h-[100vh]  w-[100vw]">
      <div
        className="absolute left-0 top-0 flex h-[100vh]  w-[100vw] flex-col items-center justify-center gap-4 bg-background "
        style={{ opacity: opacity !== undefined ? opacity : 1 }}
      ></div>

      <div className="absolute left-[50%] top-[50%] flex translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center gap-4  ">
        <div>
          <div className=" pointer-events-none relative select-none ">
            <Image src="/logo.svg" height={100} width={100} alt="app logo" />

            <Spinner
              className=" absolute left-[50%]  top-[50%] translate-x-[-50%]  translate-y-[-50%] scale-[3]   "
              color="primary"
              labelColor="primary"
              size="lg"
            />
          </div>
        </div>
        {label && (
          <span className="pointer-events-none select-none font-semibold">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
