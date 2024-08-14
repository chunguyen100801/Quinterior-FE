import { Avatar, Button, Link } from '@nextui-org/react';
import { MessageSquareMore, Pencil } from 'lucide-react';

import { UserInFo } from '@/lucia-auth/auth-actions';
import { AssetItemType } from 'src/types/asset.type';
import './styles.css';

export default async function Publisher({
  assetDetailData,
  userInfo,
}: {
  assetDetailData: AssetItemType;
  userInfo: UserInFo | null | undefined;
}) {
  return (
    <div className="publisher justify-between rounded-lg  py-3 sm:my-4 sm:flex ">
      <div className="flex  ">
        <div className="ml-4">
          <Link href={`/marketplace/store/${assetDetailData?.seller.id}`}>
            <Avatar
              src={assetDetailData?.seller.logo}
              className="h-20 w-20 text-large"
            />
          </Link>
        </div>
        <div className="ml-4 items-center space-y-2">
          <Link href={`/marketplace/store/${assetDetailData?.seller.id}`}>
            <div className="font-bold text-white">
              {assetDetailData?.seller.name}
            </div>
          </Link>
          <div>
            {userInfo && userInfo.id !== assetDetailData?.seller.userId ? (
              <Button
                color="primary"
                variant="ghost"
                className=" rounded-lg px-3"
                size="md"
              >
                <MessageSquareMore size={20} /> Chat
              </Button>
            ) : (
              <Link href="">
                <Button
                  color="primary"
                  variant="ghost"
                  className=" rounded-lg px-3"
                  size="md"
                >
                  <Pencil size={20} /> Edit
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* <div className="ml-4 mr-4 items-center space-y-2 py-4">
        <div>
          Products:{' '}
          {formatNumberToAbbreviation(assetDetailData?.seller.totalProduct) ||
            0}
        </div>
        <div>
          Total sales:{' '}
          {formatNumberToAbbreviation(assetDetailData?.seller.totalSold) || 0}
        </div>
      </div> */}
    </div>
  );
}
