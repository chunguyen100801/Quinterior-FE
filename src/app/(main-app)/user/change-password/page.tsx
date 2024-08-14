export const dynamic = 'force-dynamic';
import { Divider } from '@nextui-org/react';
// import { getUserInFo } from '@/lucia-auth/auth-actions';
import ChangePassword from '../components/ChangePassword';

export default async function page() {
  // const user = await getUserInFo();
  return (
    <div className="mt-4 w-full rounded-md bg-[#151517]">
      <div className="px-10 pb-10 pt-6">
        <div className="flex w-full flex-col gap-[1rem]">
          <span className="text-[1.5rem]">Change Password</span>
          <span className="mt-[-1rem] text-[0.8rem]">
            Manage and protect your account
          </span>
        </div>
        <Divider className="my-4" />
        <div className="mt-8">
          <ChangePassword />
        </div>
      </div>
    </div>
  );
}
