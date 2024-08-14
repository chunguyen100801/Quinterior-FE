export const dynamic = 'force-dynamic';
import { Spinner } from '@nextui-org/react';
import { Suspense } from 'react';
import InfiniteImaheShow from './components/InfiniteImaheShow';

export default async function Page() {
  return (
    <div
      className="relative flex h-fit min-h-[calc(100vh-4.5rem)]
    flex-col items-center  justify-start py-[3rem]"
    >
      <Suspense fallback={<Spinner size="lg"></Spinner>}>
        <InfiniteImaheShow></InfiniteImaheShow>
      </Suspense>
    </div>
  );
}
