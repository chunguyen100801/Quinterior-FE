import { Button } from '@nextui-org/react';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useAspectRatio } from '../hooks/ImgHook';
export default function ImageSearchIdeas({
  previewImage,
  setPreviewImage,
  onFileChange,
}: {
  previewImage: string | null;
  setPreviewImage: Dispatch<SetStateAction<string | null>>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setAspect, divContainerRef, height } = useAspectRatio(16 / 9);
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  function handleClearImageSearch(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    fileInputRef.current && (fileInputRef.current.value = '');
    setPreviewImage(null);
    event.stopPropagation();
  }

  return (
    <div
      ref={divContainerRef}
      onClick={handleChooseImage}
      className="relative mt-2 flex w-[400px] flex-col 
        items-center justify-center rounded-md  border border-zinc-700
         transition-height  marker:cursor-pointer
         "
      style={{
        height: previewImage ? `${height}px` : '0px',
      }}
    >
      <input
        ref={fileInputRef}
        onChange={onFileChange}
        accept=".jpg, .jpeg, .png"
        type="file"
        hidden
      />
      {previewImage && (
        <Button
          isIconOnly
          variant="light"
          className="absolute right-0 top-0 z-10 mx-0 my-0 h-10 w-10 rounded-full "
          onClick={handleClearImageSearch}
        >
          <Trash size={16} />
        </Button>
      )}

      {previewImage && (
        <Image
          src={previewImage as string}
          alt={`Search preview image`}
          className="w-full rounded-md object-contain"
          fill
          onLoad={(e) => {
            const loaded = e.target as HTMLImageElement;
            console.log(loaded.naturalWidth, loaded.naturalHeight);
            setAspect(loaded.naturalWidth / loaded.naturalHeight);
          }}
        />
      )}
    </div>
  );
}
