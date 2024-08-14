'use client';
import { Input } from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { EAssetListMode } from 'src/constants/enum';
import useAssetQueryParams from 'src/hooks/useAssetQueryParams';
import useDebounce from 'src/hooks/useDebounce';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';

function HeaderSearch() {
  const pathname = usePathname();
  const { handleSearchParams } = useSearchQueryParams();
  const queryParams = useAssetQueryParams(
    pathname !== '/marketplace'
      ? {
          page: '',
          take: '',
          order: '',
        }
      : {}
  );
  const [searchValue, setSearchValue] = useState(queryParams.search || '');
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const isSearched = useRef(false);

  useEffect(() => {
    isSearched.current &&
      pathname === '/marketplace' &&
      handleSearchParams(queryParams, [
        {
          key: 'search',
          value: debouncedSearchValue,
        },
        {
          key: 'page',
          value: '1',
        },
        {
          key: 'mode',
          value: debouncedSearchValue
            ? EAssetListMode.SEARCH
            : EAssetListMode.NORMAL,
        },
      ]);
  }, [debouncedSearchValue, pathname]);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isSearched.current) isSearched.current = true;
    setSearchValue(e.target.value);
  };

  return (
    pathname === '/marketplace' && (
      <>
        <Input
          value={searchValue}
          onChange={handleChangeInput}
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
                {
                  key: 'mode',
                  value: searchValue
                    ? EAssetListMode.SEARCH
                    : EAssetListMode.NORMAL,
                },
              ]);
            }
          }}
          onClear={() => {
            return setSearchValue('');
          }}
          isClearable
          radius="md"
          classNames={{
            base: 'flex-1 mr-[60px]',
            label: 'text-black/50 dark:text-white/90',
            input: [
              'bg-transparent',
              'text-black/90 dark:text-white/90 text-sm',
              'placeholder:text-default-700/50 dark:placeholder:text-white/60',
            ],
            mainWrapper: 'h-full',
            innerWrapper: 'bg-transparent',
            inputWrapper: [
              'ml-[30px]',
              'py-[6px]',
              'pr-[6px]',
              'shadow-xl',
              'bg-default-200/50',
              'dark:bg-default/60',
              'backdrop-blur-xl',
              'backdrop-saturate-200',
              'hover:bg-default-200/70',
              'dark:hover:bg-default/70',
              'group-data-[focused=true]:bg-default-200/50',
              'dark:group-data-[focused=true]:bg-default/60',
              '!cursor-text',
            ],
          }}
          placeholder="Type to search..."
          startContent={
            <SearchIcon
              size={22}
              className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90"
            />
          }
        />
      </>
    )
  );
}

export default HeaderSearch;
