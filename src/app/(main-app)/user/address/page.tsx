export const dynamic = 'force-dynamic';
import { getUserInFo } from '@/lucia-auth/auth-actions';
import MyAddress from '../components/MyAddress';

export default async function page() {
  const user = await getUserInFo();
  return (
    <div className="mt-4 min-h-[300px] w-full rounded-md bg-[#151517]">
      <div className="px-10 pb-10 pt-6">
        <MyAddress profile={user || null} />
      </div>
    </div>
  );
}
