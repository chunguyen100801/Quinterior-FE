import { Input } from '@nextui-org/react';
import { ImageIcon, SearchIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useRef } from 'react';

export default function SearchIdeas({
  search,
  setSearch,
  onFileChange,
}: {
  search?: string;
  setSearch: Dispatch<SetStateAction<string>>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };
  return (
    <Input
      value={search}
      onValueChange={setSearch}
      className=" w-[45%]"
      classNames={{
        input: [
          'bg-transparent',
          'text-black/90 dark:text-white/90 text-center',
          'placeholder:text-center placeholder:text-default-700/50 dark:placeholder:text-white/60',
        ],

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
          '',
        ],
      }}
      placeholder="Type to search for your ideas..."
      startContent={
        <SearchIcon className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90" />
      }
      endContent={
        <div>
          <input
            ref={fileInputRef}
            onChange={onFileChange}
            accept=".jpg, .jpeg, .png"
            type="file"
            hidden
          ></input>
          <ImageIcon
            onClick={handleChooseImage}
            className=" mb-0.5 flex-shrink-0 cursor-pointer text-black/50 text-slate-400 dark:text-white/90"
          />
        </div>
      }
    />
  );
}
