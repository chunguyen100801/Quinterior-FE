import { Input } from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export default function SearchSide({
  search,
  setSearch,
}: {
  search?: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Input
      value={search}
      onValueChange={setSearch}
      isClearable
      className=" sticky top-0 z-[11] mb-6 w-[100%]"
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
      placeholder="Type to search for products..."
      startContent={
        <SearchIcon className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90" />
      }
    />
  );
}
