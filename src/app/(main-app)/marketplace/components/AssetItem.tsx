'use client';
import { Link as ButtonLink, Tooltip } from '@nextui-org/react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AssetItemType } from 'src/types/asset.type';
import { twMerge } from 'tailwind-merge';
import { UserInFo } from '@/lucia-auth/auth-actions';

interface Props {
  size?: 'sm' | 'md';
  data: AssetItemType;
  user?: UserInFo | null;
}

function AssetItem({ size = 'sm', data }: Props) {
  if (!data) return null;

  return (
    <>
      <div
        className={twMerge(
          'relative block h-[140px]',
          size === 'md' ? 'h-[200px]' : 'h-[140px]'
        )}
      >
        <Link href={`/marketplace/assets/${data.id}`}>
          <Image src={data.thumbnail} alt={data.name} fill />
        </Link>
      </div>
      <div className="py-2">
        <ButtonLink
          color="foreground"
          className={twMerge(
            'uppercase text-[#ffffffb8]',
            size === 'md' ? 'text-sm' : 'text-xs'
          )}
          href={`/marketplace/store/${data.sellerId}`}
        >
          {data.seller.name}
        </ButtonLink>
        <Tooltip
          placement="bottom"
          content={data.name}
          className="max-w-[200px]"
        >
          <p
            className={twMerge(
              'truncate font-medium leading-[20px] text-white',
              size === 'md' ? 'text-[18px]' : 'text-base'
            )}
          >
            {data.name}
          </p>
        </Tooltip>
        <div className="mt-1 flex items-center gap-2">
          <div className="flex items-center gap-[1px]">
            {Array.from({
              length: 5,
            }).map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i > Math.round(data.avgRating) - 1 ? '#000' : '#ffffffb8'}
              />
            ))}
          </div>
          <div
            className={twMerge(
              'flex items-center text-[#ffffffb8]',
              size === 'md' ? 'text-xs' : 'text-sm'
            )}
          >
            <span>({data.totalRating}) </span>
          </div>
        </div>
        {/* <div className="mt-1 flex items-center justify-between">
          <p
            className={twMerge(
              'font-medium text-[#e55354]',
              size === 'md' ? 'text-base' : 'text-sm'
            )}
          >
            {price}
          </p>
          {user?.id === data.sellerId ? (
            <Link
              href={`/marketplace/assets/${data.id}`}
              className={twMerge(
                'font-medium text-[#3d77c2]',
                size === 'md' ? 'text-sm' : 'text-xs'
              )}
            >
              View detail
            </Link>
          ) : (
            <AddToCartButton size={size} assetId={data.id} />
          )}
        </div> */}
      </div>
    </>
  );
}

export default AssetItem;
