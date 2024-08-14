import { Skeleton } from '@nextui-org/react';

export default async function PublisherInfoSkeleton() {
  return (
    <>
      <div className="h-32 rounded-lg">
        <Skeleton className="h-full w-full rounded-md">
          <div className="h-full w-full bg-default-200"></div>
        </Skeleton>
      </div>
      <div className="my-8 h-32 rounded-lg">
        <Skeleton className="h-full w-full rounded-md">
          <div className="h-full w-full bg-default-200"></div>
        </Skeleton>
      </div>
    </>
  );
}
