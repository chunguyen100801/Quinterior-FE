'use client';
import { useAppDispatch } from '@/app/store/hooks';
import { setImageSearch } from '@/app/store/searchSlice';
import { fileToBase64, sleep, validateImages } from '@/utils/utils-client';
import { Button } from '@nextui-org/react';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { EAssetListMode } from 'src/constants/enum';
import useAssetQueryParams from 'src/hooks/useAssetQueryParams';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';

export default function SearchImage() {
  const queryParams = useAssetQueryParams();
  const { handleSearchParams } = useSearchQueryParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageValidation = validateImages(files, 1);
      if (!imageValidation.isValid) {
        toast.error(imageValidation.errorMessage);
        return;
      }
      try {
        const file = files[0];
        setPreviewImage(URL.createObjectURL(file));
        const base64String = await fileToBase64(file);
        dispatch(setImageSearch(base64String as string));
        handleSearchParams(queryParams, [
          {
            key: 'mode',
            value: EAssetListMode.SEARCH,
          },
          {
            key: 'search',
            value: '',
          },
        ]);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };

  async function handleClearImageSearch(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    fileInputRef.current && (fileInputRef.current.value = '');
    setPreviewImage(null);
    handleSearchParams(queryParams, [
      {
        key: 'mode',
        value: EAssetListMode.NORMAL,
      },
      {
        key: 'search',
        value: '',
      },
    ]);
    await sleep(500);
    dispatch(setImageSearch(null));
    event.stopPropagation();
  }

  return (
    <div
      onClick={handleChooseImage}
      className="relative flex h-[150px] cursor-pointer 
      flex-col items-center justify-center gap-[16px] rounded-md border
       border-zinc-700 px-[28px] py-[14px]"
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

      {previewImage ? (
        <div className=" flex h-[150px] flex-wrap  items-center justify-center gap-3  bg-background">
          <Image
            src={previewImage as string}
            // height={120}
            // width={120}
            alt={`Search preview image`}
            className="rounded-md object-contain"
            fill
          />
        </div>
      ) : (
        <>
          <Image src="/upload.svg" width={40} height={30} alt="Upload" />
          <div className="text-default-500">Search by image</div>
        </>
      )}
    </div>
  );
}
