'use client';
import { getImages } from '@/app/apis/find-ideas.api';
import { Spinner } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import useDebounce from 'src/hooks/useDebounce';

import { validateImages } from '@/utils/utils-client';
import { toast } from 'sonner';
import ImageSearchIdeas from './ImageSearchIdeas';
import ImgCard from './ImgCard';
import SearchIdeas from './SearchIdeas';

export default function InfiniteImageShow() {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setimageFile] = useState<File | null>(null);
  const debouncedSearchValue = useDebounce(search, 800);
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['images', debouncedSearchValue, previewImage],
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      //   const image = dataURLtoFile(previewImage, 'search.png');
      //   console.log(image, 'hell222222222222222o');
      const formData = new FormData();
      if (imageFile) {
        formData.append('file', imageFile);
      }
      return getImages(pageParam, debouncedSearchValue, formData);
    },
    getNextPageParam: (lastPage, allPages, lastPageParam: number) => {
      return lastPageParam + 1;
    },
  });

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

        if (previewImage) {
          URL.revokeObjectURL(previewImage);
        }
        setimageFile(file);
        setPreviewImage(URL.createObjectURL(file));
        // const base64String = await fileToBase64(file);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const imgList =
    data?.pages
      .flatMap((page) => page)
      .filter((img) => img && img.image_url && img.prompt) || [];

  return (
    <div className="container  mx-auto ">
      <div className="flex h-fit flex-col items-center justify-center gap-2 py-10">
        <Image src="/logo.svg" height={80} width={80} alt="app logo" />
        <h1 className=" text-2xl  font-extrabold text-foreground">
          QUINTERIOR
        </h1>
        <SearchIdeas
          search={search}
          setSearch={setSearch}
          onFileChange={onFileChange}
        ></SearchIdeas>
        <ImageSearchIdeas
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          onFileChange={onFileChange}
        ></ImageSearchIdeas>
      </div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1250: 4, 1600: 5 }}
      >
        <Masonry gutter="0.8rem">
          {imgList.map(
            (img, index) => img && <ImgCard key={index} image={img}></ImgCard>
          )}
        </Masonry>
      </ResponsiveMasonry>

      {/* {imgList.length == 0 && (
        <div className=" flex items-center justify-center">
          <span className=" text-large font-bold">No result found !</span>
        </div>
      )} */}

      {isFetching && (
        <div className="mt-8 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}
      <div
        ref={ref}
        className="absolute top-[95%] h-[3rem] w-[3rem] opacity-0"
      ></div>
    </div>
  );
}
