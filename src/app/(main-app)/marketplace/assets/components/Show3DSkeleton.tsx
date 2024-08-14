'use client';
import { Spinner } from '@nextui-org/react';

export default function Show3DSkeleton() {
  return (
    <div className="flex h-[36rem] w-full items-center justify-center">
      <Spinner size="lg" label="Loading..." labelColor="primary" />
    </div>
  );
}
