'use client';
import ImgCard from '@/app/(main-app)/find-ideas/components/ImgCard';
import { getGalleryProjects } from '@/app/apis/projects.api';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
export default function Gallery({ projectId }: { projectId: number }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { ref, inView } = useInView();
  const offsetPage: number = 20;
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['images-project', projectId],

    refetchOnWindowFocus: false,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return getGalleryProjects(projectId, undefined, pageParam, offsetPage);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam: number) => {
      return lastPageParam + 1;
    },
  });
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
    <>
      <Button
        color="primary"
        className="font-bold "
        variant="flat"
        onClick={onOpen}
      >
        Photo Gallery
      </Button>
      <Modal
        size="full"
        className=" overflow-y-auto"
        // style={{ width: `calc(${aspectRatio} * 85vh)` }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody className="h-fit ">
                <ModalHeader className="flex flex-col gap-1">
                  <span className=" text-large font-extrabold">Gallery</span>
                </ModalHeader>
                <ResponsiveMasonry
                  columnsCountBreakPoints={{
                    350: 1,
                    750: 2,
                    900: 3,
                    1250: 4,
                    1600: 5,
                  }}
                >
                  <Masonry gutter="0.8rem">
                    {imgList.map(
                      (img, index) =>
                        img && <ImgCard key={index} image={img}></ImgCard>
                    )}
                  </Masonry>
                </ResponsiveMasonry>
                {isFetching && (
                  <div className=" flex w-full items-center justify-center">
                    <Spinner size="lg"></Spinner>
                  </div>
                )}
                <div ref={ref} className=""></div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
