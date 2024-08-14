'use server';
import { AssetItemType, AssetListConfig, MetaType } from 'src/types/asset.type';
import Pagination from '../../../../components/Pagination';
import AssetItem from './AssetItem';
import SortAssetsList from './SortAssetsList';
import { Frown } from 'lucide-react';
import { UserInFo, getUserInFo } from '@/lucia-auth/auth-actions';
import { validateRequest } from '@/lucia-auth/lucia';

interface Props {
  data?: AssetItemType[];
  searchParams: AssetListConfig;
  meta?: MetaType;
}

async function AssetsList({ data, meta, searchParams }: Props) {
  const { session } = await validateRequest();
  let user: UserInFo | null | undefined = null;
  if (session) {
    user = await getUserInFo();
  }

  return (
    <>
      <SortAssetsList meta={meta} />

      <div>
        <div className="mt-[24px] grid grid-cols-12 gap-x-4 gap-y-7">
          {data &&
            data.length > 0 &&
            data.map((item) => (
              <div key={item.id} className="col-span-3">
                <AssetItem data={item} user={user} />
              </div>
            ))}
        </div>
        {/* {data && data.length === 0 && searchParams.search && (
            <div className="flex h-[50vh] flex-col items-center justify-center text-xl">
              <div className="mb-4 ">
                <Frown size={96} strokeWidth={0.75} />
              </div>
              <p>No result for &#8243;{searchParams.search}&#8243;</p>
            </div>
            //
          )} */}
        {data && data.length === 0 && (
          <div className="flex h-[50vh] flex-col items-center justify-center text-xl">
            <div className="mb-4 ">
              <Frown size={96} strokeWidth={0.75} />
            </div>
            <p>{'No product found!'}</p>
          </div>
        )}
        <div className="mt-[40px] flex justify-center">
          {meta && meta.pageCount > 1 && meta.itemCount > 0 && (
            <Pagination
              totalPages={meta.pageCount}
              searchParams={searchParams}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AssetsList;
