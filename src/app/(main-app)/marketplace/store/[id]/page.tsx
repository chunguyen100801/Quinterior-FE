export const dynamic = 'force-dynamic';
import { getAssetListInStore, getStoreInfo } from '@/app/apis/publisher.api';
import { PublisherInfoType } from 'src/types/publisher.type';
import PublisherInfo from '../components/PublisherInfo';

import { getUserInFo } from '@/lucia-auth/auth-actions';
import { isEmpty } from 'lodash';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ELimit, EOrderType } from 'src/constants/enum';
import { AssetListConfig } from 'src/types/asset.type';
import AsideFilter from '../../components/AsideFilter';
import AssetListStore from '../components/AssetListStore';
import NotFound from './not-found';

interface Props {
  params: { id: string };
  searchParams: AssetListConfig;
}

type MetadataProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  // read route params
  const id = params.id;
  if (isNaN(parseInt(id))) {
    return {
      title: 'Asset Detail',
      description: 'Asset Detail',
    };
  }
  // fetch data
  const publisherInfo = await getStoreInfo(parseInt(id));

  return {
    title: publisherInfo?.name || 'Asset Detail',
    description: publisherInfo?.description || 'Asset Detail',
  };
}

async function Publisher({ params, searchParams }: Props) {
  const { id } = params;
  if (isNaN(parseInt(id))) {
    return <NotFound />;
  }

  const idStore = parseInt(id);
  const publisherInfo = await getStoreInfo(idStore);

  const userInfo = await getUserInFo();

  const isSearchParamsEmpty = isEmpty(searchParams);

  const _searchParams = !isSearchParamsEmpty
    ? searchParams
    : {
        page: '1',
        take: ELimit.TWENTY,
        order: EOrderType.ASC,
      };

  const assetList = await getAssetListInStore(id, _searchParams);

  return (
    <div className="container_custom">
      {publisherInfo ? (
        <>
          <div className="mt-8">
            <PublisherInfo
              publisherInfo={publisherInfo as PublisherInfoType}
              userInfo={userInfo}
            />
          </div>
          <div className="-mb-8 mt-16 text-2xl font-bold" id="productTitle">
            Product
          </div>
          <div>
            <div className="flex  w-full flex-col-reverse gap-8 py-10 md:flex-row">
              <main className="w-[100%] md:w-[75%]">
                <AssetListStore
                  assetList={assetList}
                  isSearchParamsEmpty={isSearchParamsEmpty}
                  _searchParams={_searchParams}
                />
              </main>
              <aside className="mt-1 w-[90%] md:w-[25%] md:max-w-[25%]">
                <Suspense>
                  <AsideFilter sellerId={idStore} />
                </Suspense>
              </aside>
            </div>
          </div>
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
}

export default Publisher;
