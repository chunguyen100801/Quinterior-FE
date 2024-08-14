export const dynamic = 'force-dynamic';
// import { getUserInFo } from '@/lucia-auth/auth-actions';
import { getPurchasedProducts } from '@/app/apis/user.api';
import _, { isEmpty } from 'lodash';
import { AssetListConfig, AssetListResponse } from 'src/types/asset.type';
import PurchasedProducts from '../components/PurchasedProducts';
import SearchInput from '../components/SearchInput';

interface Props {
  searchParams: AssetListConfig;
}

export default async function page({ searchParams }: Props) {
  // const user = await getUserInFo();
  const isSearchParamsEmpty = isEmpty(searchParams);

  const _searchParams = !isSearchParamsEmpty
    ? searchParams
    : {
        // page: '1',
      };

  const filteredParams = _.pick(_searchParams, ['page', 'search']);

  const assetList = await getPurchasedProducts(filteredParams);

  return (
    <>
      <div className="mt-4 w-full rounded-md bg-[#151517]">
        <div className="px-10 pb-6 pt-6">
          <div className="flex w-full flex-col gap-[1rem]">
            <span className="text-[1.5rem]">Purchased Products</span>
            <span className="mt-[-1rem] text-[0.8rem]">
              Manage products you have pruchased
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center rounded-md bg-[#151517]">
        <SearchInput assetList={assetList as AssetListResponse} />
      </div>
      <div className="mt-4 w-full rounded-md bg-[#151517]">
        <div className="px-10 pb-10 pt-6">
          <div className="mt-8">
            <PurchasedProducts
              assetList={assetList as AssetListResponse}
              // isSearchParamsEmpty={isSearchParamsEmpty}
              _searchParams={filteredParams}
            />
          </div>
        </div>
      </div>
    </>
  );
}
