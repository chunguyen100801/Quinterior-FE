export const dynamic = 'force-dynamic';
import { getAssetList } from '@/app/apis/asset.api';
import { getUserInFo } from '@/lucia-auth/auth-actions';
import { Button } from '@nextui-org/react';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { Suspense } from 'react';
import { ELimit } from 'src/constants/enum';
import { AssetQueryParams } from 'src/hooks/useAssetQueryParams';
import { MetaType } from 'src/types/asset.type';
import PackagesTable from './components/PackagesTable';

interface Props {
  searchParams: AssetQueryParams;
}

async function Page({ searchParams }: Props) {
  const auth = await getUserInFo();

  const assets = await getAssetList(
    !isEmpty(searchParams)
      ? {
          ...searchParams,
          sellerId: String(auth?.id),
        }
      : {
          page: '1',
          take: ELimit.FIVE,
          sellerId: String(auth?.id),
        }
  );

  return (
    <div className="">
      <div className="flex justify-between px-[24px] py-[16px]">
        <h2 className="text-[27px] font-bold text-white">All packages</h2>
        <Link href="/portal/create">
          <Button
            color="primary"
            radius="none"
            className="rounded-[4px] text-sm font-medium text-white"
          >
            Create a package
          </Button>
        </Link>
      </div>
      <div className="flex-1 px-[24px] py-[16px]">
        <Suspense>
          <PackagesTable
            data={assets?.data || []}
            meta={assets?.meta as MetaType}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default Page;
