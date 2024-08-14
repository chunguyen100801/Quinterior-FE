export const dynamic = 'force-dynamic';
import { getAssetDetail } from '@/app/apis/asset.api';
import { getUserInFo } from '@/lucia-auth/auth-actions';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { AssetItemType } from 'src/types/asset.type';
import Info_Cart from '../components/Info_Cart';
import ProductDescription from '../components/ProductDescription';
import Publisher from '../components/Publisher';
import ReviewProduct from '../components/ReviewProduct';
import SimilarAssetsList from '../components/SimilarAssetsList';
import SlideShow from '../components/SlideShow';
import NotFound from './not-found';

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

async function Asset({ params }: AssetProps) {
  const id = params.id;
  const assetDetailData = await getAssetDetail(id);
  // if (!assetDetailData) {
  //   notFound();
  // }
  const userInfo = await getUserInFo();

  return assetDetailData ? (
    <div className="container_custom">
      <div className="mt-10 flex w-full">
        <div className="w-full md:w-[65%]">
          <SlideShow assetDetailData={assetDetailData as AssetItemType} />
          {/* <div className=" md:hidden">
            <Info_Cart
              assetDetailData={assetDetailData as AssetItemType}
              userInfo={userInfo}
            />
          </div> */}
          <div className="mb-10 mt-[3.2rem]">
            <Publisher
              assetDetailData={assetDetailData as AssetItemType}
              userInfo={userInfo}
            />
          </div>
          <div>
            <ProductDescription
              assetDetailData={assetDetailData as AssetItemType}
            />
          </div>
          <div className="mt-10">
            <Suspense>
              <ReviewProduct
                assetDetailData={assetDetailData as AssetItemType}
                userInfo={userInfo}
              />
            </Suspense>
          </div>
        </div>
        <div className="ml-6 hidden w-[35%] md:block">
          <div>
            <Info_Cart
              assetDetailData={assetDetailData as AssetItemType}
              userInfo={userInfo}
            />
          </div>
        </div>
      </div>
      <div className="mb-20 mt-10  flex w-full">
        <SimilarAssetsList productId={id} />
      </div>
    </div>
  ) : (
    <NotFound />
  );
}

export default Asset;
