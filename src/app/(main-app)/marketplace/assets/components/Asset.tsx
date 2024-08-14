import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Link as ButtonLink, Tooltip } from '@nextui-org/react';
import { AssetItemType } from 'src/types/asset.type';
import { Star } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function Asset({
  size = 'sm',
  data,
}: {
  size?: 'sm' | 'md';
  data: AssetItemType;
}) {
  return (
    <>
      <div
        className={twMerge(
          'relative block h-[140px] md:h-[200px]',
          size === 'md' ? 'md:h-[200px]' : 'md:h-[140px]'
        )}
      >
        <Link href={`/marketplace/assets/${data.id}`}>
          <Image src={data.thumbnail} alt={data.name} fill={true} />
        </Link>
      </div>
      <div className="py-2">
        <ButtonLink
          color="foreground"
          className={twMerge(
            'uppercase text-[#ffffffb8]',
            size === 'md' ? 'text-sm' : 'text-xs'
          )}
          href={``}
        >
          {data.name}
        </ButtonLink>
        <Tooltip
          placement="bottom"
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data.description),
              }}
            />
          }
          className="max-w-[200px]"
        >
          <div
            className={twMerge(
              'truncate font-medium leading-[20px] text-white',
              size === 'md' ? 'text-[18px]' : 'text-base'
            )}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.description),
            }}
          />
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
            {formatPrice(data?.price)}
          </p>
          <div className="text-sm">
            Sold: {formatNumberToAbbreviation(data.sold)}
          </div>
        </div> */}
      </div>
    </>
  );
}
