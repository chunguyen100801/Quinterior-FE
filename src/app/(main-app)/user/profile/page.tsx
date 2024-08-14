export const dynamic = 'force-dynamic';
import { getUserInFo } from '@/lucia-auth/auth-actions';
import { Divider } from '@nextui-org/react';
import EditProfile from '../components/EditProfile';

export default async function page() {
  const user = await getUserInFo();
  return (
    <div className="mt-4 w-full rounded-md bg-[#151517]">
      <div className="px-10 pb-10 pt-6">
        <div className="flex w-full flex-col gap-[1rem]">
          <span className="text-[1.5rem]">My Profile</span>
          <span className="mt-[-1rem] text-[0.8rem]">
            Change your account information
          </span>
        </div>
        <Divider className="my-4" />
        <div className="mt-8">
          <EditProfile profile={user || null} />
        </div>
      </div>
    </div>
  );
}
