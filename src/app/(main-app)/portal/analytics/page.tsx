import { Metadata } from 'next';
import Analytics from './components/Analytics';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Analytics',
};

function Page() {
  return (
    <div>
      <div className="flex justify-between px-[24px] py-[16px]">
        <h2 className="text-[27px] font-bold text-white">Analytics</h2>
      </div>
      <div className="flex-1 px-[24px] py-[16px]">
        <Analytics />
      </div>
    </div>
  );
}

export default Page;
