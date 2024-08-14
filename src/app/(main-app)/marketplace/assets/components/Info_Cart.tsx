'use client';
import { UserInFo } from '@/lucia-auth/auth-actions';
import { convertFileSize } from '@/utils/utils-client';
import { Button, Divider } from '@nextui-org/react';
import { ShieldAlert, Star } from 'lucide-react';
import moment from 'moment';
import AddtoWorkspace from './AddtoWorkspace';
import Link from 'next/link';
import { AssetItemType } from 'src/types/asset.type';

export default function Info_Cart({
  assetDetailData,
  userInfo,
}: {
  assetDetailData: AssetItemType;
  userInfo: UserInFo | null | undefined;
}) {
  const isMyProduct = Number(userInfo?.id) === assetDetailData?.seller.userId;

  return (
    <div className="mt-4 flex flex-col">
      <h2 className="text-3xl font-bold">{assetDetailData?.name} </h2>
      <div className="mt-4">
        <div className="flex h-5 items-center space-x-4">
          <div className="flex gap-2">
            {assetDetailData?.avgRating || 0}
            {Array.from({
              length: 5,
            }).map((_, i) => (
              <Star
                key={i}
                size={20}
                fill={
                  i >= assetDetailData?.avgRating ? ' transparent' : '#effb09'
                }
                strokeWidth={0.75}
              />
            ))}
          </div>
          {/* <Divider orientation="vertical" className="mx-2" />
          <div>
            {formatNumberToAbbreviation(assetDetailData?.sold) || 0} Sales
          </div> */}
        </div>
      </div>
      {/* <div className="mt-4 text-3xl font-bold tracking-widest text-blue-500 ">
        {formatPrice(Number(assetDetailData?.price)) || 0}
      </div> */}
      {/* <div className="mt-6 space-y-2 text-sm text-default-500">
        <div className="flex items-center gap-x-2">
          <Lock size={16} /> Secure payment
        </div>
        <div className="flex items-center gap-x-2">
          <Mail size={16} strokeWidth={1} /> Support from sellers
        </div>
        <div className="flex  items-center gap-x-2">
          <Undo2 size={16} /> Return product if defective
        </div>
      </div> */}
      {/* <div className="mt-8 flex">
        {assetDetailData?.quantity > 0 ? (
          <>
            {!isMyProduct && (
              <label htmlFor="quantity" className="mt-1">
                Quantity
              </label>
            )}
            <div className=" ml-6 flex  flex-wrap">
              {!isMyProduct && (
                <InputNumber
                  id="quantity"
                  name="quantity"
                  min={1}
                  step={1}
                  max={assetDetailData.quantity}
                  className="mr-4"
                  value={quantity}
                  onInputChange={(value) => setQuantity(value)}
                />
              )}
              <div className="mt-1">
                {formatNumberToAbbreviation(assetDetailData?.quantity) || 0}{' '}
                products available
              </div>
            </div>
          </>
        ) : (
          <div className=" w-full text-center text-2xl font-bold">
            Out of stock
          </div>
        )}
      </div> */}
      <div className="mx-4 mt-6 flex  flex-col space-y-4 text-white">
        {isMyProduct && (
          <Button
            as={Link}
            href={`/portal/edit/${assetDetailData?.id}`}
            color="primary"
            className="text-white"
            size="lg"
            radius="sm"
            variant="ghost"
          >
            Edit Product
          </Button>
        )}
      </div>
      <div className="product-description mt-8 rounded-md">
        <div className="mx-4 my-4">
          <div className="text-xl font-bold">3D Model Information</div>
          {assetDetailData?.model ? (
            <>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <div>License</div>
                  <div className="flex gap-1">
                    <ShieldAlert size={20} strokeWidth={1} />
                    Standard
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <div>File Size</div>
                  <div>
                    {convertFileSize(
                      assetDetailData?.model?.file?.size,
                      'B',
                      'MB'
                    )}
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <div>Included 3D formats</div>
                  <div>GLB</div>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <div>Release date</div>
                  <div>
                    {' '}
                    {moment(assetDetailData?.model?.file?.createdAt)
                      .locale('vi')
                      .format('DD-MM-YYYY')}
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <div>Latest update date</div>
                  <div>
                    {moment(assetDetailData?.model?.file?.updatedAt)
                      .locale('vi')
                      .format('DD-MM-YYYY')}
                  </div>
                </div>
              </div>
              <div className="my-8">
                {userInfo && (
                  <AddtoWorkspace model={assetDetailData.model} size="lg" />
                )}
              </div>
            </>
          ) : (
            <div className="my-4">
              <div className="text-md text-center">
                3D Model is not available for this product.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
