export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { validateRequest } from '@/lucia-auth/lucia';
import StoreProfile from './Components/StoreProfile';
import { getMyStore } from '@/app/apis/publisher.api';

async function Page() {
  const { session } = await validateRequest();
  if (!session) {
    return redirect('/auth');
  }

  const storeProfile = await getMyStore();

  return (
    <div className="my-8 ml-8">
      <div className="flex justify-between px-[24px] py-[16px]">
        <h2 className="text-[27px] font-bold text-white">Edit Profile</h2>
      </div>
      <div className="flex-1 px-[24px] py-[16px]">
        <StoreProfile storeProfile={storeProfile} />
      </div>
    </div>
  );
}

export default Page;
