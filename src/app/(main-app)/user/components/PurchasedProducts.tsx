import { Avatar, Divider } from '@nextui-org/react';
import React from 'react';
import Pagination from 'src/components/Pagination';
import { AssetListConfig, AssetListResponse } from 'src/types/asset.type';
import Link from 'next/link';
import { Coins, ShoppingCart, Store } from 'lucide-react';
import { formatPriceSV } from '@/utils/utils';
import AddtoWorkspace from '../../marketplace/assets/components/AddtoWorkspace';

// import { formatPriceVND } from '@/utils/utils';

interface Props {
  assetList: AssetListResponse | null | undefined;
  //   isSearchParamsEmpty: boolean;
  _searchParams: AssetListConfig;
}

export default function PurchasedProducts({ assetList, _searchParams }: Props) {
  return (
    <div className="mt-8 flex h-full min-h-[30vh] w-full flex-col items-center">
      {assetList?.data &&
        assetList?.data?.length > 0 &&
        assetList?.data.map((data, index) => (
          <div key={index} className="w-full">
            <div className="flex w-full justify-between tracking-wide">
              <div className=" flex space-x-3">
                <Link href={`/marketplace/assets/${data.id}`} target="_blank">
                  <Avatar
                    radius="sm"
                    className="h-24 w-24 text-large"
                    src={data?.thumbnail}
                  />
                </Link>
                <div className="flex flex-col gap-2 text-lg">
                  <Link href={`/marketplace/assets/${data.id}`} target="_blank">
                    <div className="flex max-w-md font-bold text-gray-50">
                      {data.name}
                    </div>
                  </Link>
                  <div className=" flex text-sm text-slate-200">
                    <Coins size={16} strokeWidth={1} className="mr-2" />
                    {formatPriceSV(Number(data?.price)) || 0}
                  </div>
                  <div className=" max-w-md text-nowrap text-sm  text-slate-200">
                    <Link
                      href={`/marketplace/store/${data.sellerId}`}
                      className="flex"
                      target="_blank"
                    >
                      <Store size={16} strokeWidth={1} className="mr-2" />
                      {data.seller.name}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center justify-center">
                  <AddtoWorkspace
                    model={data.model}
                    color="primary"
                    variant="light"
                    radius="sm"
                    className=" text-sky-400"
                  />
                </div>
                {/* <div>
                  <Button
                    color="primary"
                    variant="light"
                    radius="sm"
                    type="button"
                    href={`/marketplace/assets/${data.id}`}
                    as={Link}
                  >
                    Buy again
                  </Button>
                </div> */}
              </div>
            </div>
            <Divider className="text- my-12" />
          </div>
        ))}

      {(!assetList || (assetList?.data && assetList.data.length < 1)) && (
        <div className="mt-8 flex h-full flex-col items-center justify-center">
          <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-slate-300 bg-opacity-10">
            <ShoppingCart size={96} strokeWidth={0.75} />
          </div>
          <div> {'You have not purchased any products yet'}</div>
        </div>
      )}
      <div className="mt-[40px] flex justify-center">
        {assetList?.meta &&
          assetList.meta.pageCount > 1 &&
          assetList.meta.itemCount > 0 && (
            <Pagination
              totalPages={assetList?.meta.pageCount}
              searchParams={_searchParams}
              enableScrollTop={true}
            />
          )}
      </div>
    </div>
  );
}
