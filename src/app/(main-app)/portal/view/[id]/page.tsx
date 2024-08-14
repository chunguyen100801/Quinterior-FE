import { getAssetDetail } from '@/app/apis/asset.api';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ManagePackage from '../../components/ManagePackage';
import { getUserInFo } from '@/lucia-auth/auth-actions';
import { getCategoriesList } from '@/app/apis/category.api';
import { validateRequest } from '@/lucia-auth/lucia';
import { ELimit } from 'src/constants/enum';

type MetadataProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const assetDetailData = await getAssetDetail(id);

  return {
    title: assetDetailData?.name || 'Asset Detail',
    description: assetDetailData?.description || 'Asset Detail',
  };
}

interface AssetProps {
  params: { id: string };
}

async function Page({ params }: AssetProps) {
  const { session } = await validateRequest();
  if (!session) {
    return redirect('/auth');
  }

  const id = params.id;
  const assetDetailData = await getAssetDetail(id);
  if (!assetDetailData) {
    notFound();
  }
  const userInfo = await getUserInFo();
  const cateRes =
    userInfo &&
    (await getCategoriesList({ sellerId: userInfo.id, take: ELimit.FIFTY }));

  return (
    <ManagePackage
      type="view"
      defaultValues={assetDetailData}
      categories={cateRes?.data || []}
      categoriesMeta={cateRes?.meta}
      userInfo={userInfo}
    />
  );
}

export default Page;
