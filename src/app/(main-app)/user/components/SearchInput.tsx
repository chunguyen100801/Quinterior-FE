'use client';
import { Input } from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAssetQueryParams from 'src/hooks/useAssetQueryParams';
import useDebounce from 'src/hooks/useDebounce';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';
import { AssetListResponse } from 'src/types/asset.type';
import { OrderListResponse } from 'src/types/order.type';

const expectedURL = ['/user/purchased-products', '/user/my-purchase'];

interface Props {
  assetList: AssetListResponse | null | undefined | OrderListResponse;
  isSearchOrder?: boolean;
}

function SearchInput({ assetList, isSearchOrder }: Props) {
  const pathname = usePathname();
  const { handleSearchParams } = useSearchQueryParams();
  const queryParams = useAssetQueryParams(
    expectedURL.includes(pathname)
      ? { take: '', order: '' }
      : { page: '', take: '', order: '' }
  );

  const [searchValue, setSearchValue] = useState(queryParams.search || '');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    const pageCount = assetList?.meta?.pageCount;
    const checkPage = pageCount && pageCount === 1 ? '' : 1;

    handleSearchParams(queryParams, [
      {
        key: 'search',
        value: debouncedSearchValue,
      },
      {
        key: 'page',
        value: `${checkPage}`,
      },
    ]);
  }, [assetList?.meta?.pageCount, debouncedSearchValue]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <>
      <Input
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        onClear={() => {
          return setSearchValue('');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearchParams(queryParams, [
              {
                key: 'search',
                value: searchValue,
              },
              {
                key: 'page',
                value: '1',
              },
            ]);
          }
        }}
        isClearable
        classNames={{
          input: [
            'bg-transparent',
            'text-black/90 dark:text-white/90',
            'placeholder:text-default-700/50 dark:placeholder:text-white/60',
          ],
          innerWrapper: ['bg-transparent'],
          mainWrapper: ['h-full'],
          inputWrapper: [
            'px-10',
            'bg-transparent',
            'shadow-xl',
            'backdrop-blur-xl',
            'backdrop-saturate-200',
            'hover:bg-default-200/70',
            'dark:hover:bg-default/70',
            'group-data-[focused=true]:bg-default-200/50',
            'dark:group-data-[focused=true]:bg-default/60',
            '!cursor-text',
            'rounded-md',
          ],
        }}
        placeholder={`Search by product name, store name${
          isSearchOrder ? ', order code' : ''
        }`}
        startContent={
          <SearchIcon className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90" />
        }
      />
    </>
  );
}

export default SearchInput;
