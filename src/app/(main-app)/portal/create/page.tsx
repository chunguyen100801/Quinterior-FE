export const dynamic = 'force-dynamic';
import { getCategoriesList } from '@/app/apis/category.api';
import { getUserInFo } from '@/lucia-auth/auth-actions';
import { validateRequest } from '@/lucia-auth/lucia';
import { redirect } from 'next/navigation';
import { ELimit } from 'src/constants/enum';
import ManagePackage from '../components/ManagePackage';

async function Page() {
  const { session } = await validateRequest();
  if (!session) {
    return redirect('/auth');
  }

  const user = await getUserInFo();

  const categoryListRes = await getCategoriesList({
    sellerId: user?.id,
    take: ELimit.FIFTY,
  });

  return (
    <>
      <ManagePackage
        type="create"
        categories={categoryListRes?.data || []}
        categoriesMeta={categoryListRes?.meta}
        userInfo={user}
      />
    </>
  );
}

export default Page;
