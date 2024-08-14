'use client';
import { Input } from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useDebounce from 'src/hooks/useDebounce';

export default function SearchProject() {
  const [search, setSearch] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const debouncedSearchValue = useDebounce(search, 500);

  useEffect(() => {
    const onChangeSearch = () => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (debouncedSearchValue != '') {
        newSearchParams.set('search', debouncedSearchValue);
      } else {
        newSearchParams.delete('search');
      }
      const query = newSearchParams.toString()
        ? `?${newSearchParams.toString()}`
        : '';
      router.replace(`${pathname}${query}`);
    };
    onChangeSearch();
  }, [debouncedSearchValue, pathname, router, searchParams]);

  return (
    <>
      <Input
        value={search}
        onValueChange={setSearch}
        isClearable
        className="w-[25%]"
        classNames={{
          input: [
            'bg-transparent',
            'text-black/90 dark:text-white/90',
            'placeholder:text-default-700/50 dark:placeholder:text-white/60',
          ],
          innerWrapper: 'bg-transparent',
          inputWrapper: [
            'w-full',
            'shadow-xl',
            'bg-default-200/50',
            'dark:bg-default/60',
            'backdrop-blur-xl',
            'backdrop-saturate-200',
            'hover:bg-default-200/70',
            'dark:hover:bg-default/70',
            'group-data-[focus=true]:bg-default-200/50',
            'dark:group-data-[focus=true]:bg-default/60',
            '!cursor-text',
          ],
        }}
        placeholder="Type to search..."
        startContent={
          <SearchIcon className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90" />
        }
      />
    </>
  );
}
