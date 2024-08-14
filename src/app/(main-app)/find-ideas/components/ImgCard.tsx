import { reverseMappingRange } from '@/utils/utils-client';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  useDisclosure,
} from '@nextui-org/react';
import Image from 'next/image';
import { ImageFindIdea } from 'src/types/findIdeas.type';
import {
  CREATIVITY_RANGE,
  NUMSINFER_RANGE,
} from '../../blueprint/blueprint3D/model/constance';
import { useAspectRatio } from '../hooks/ImgHook';
export default function ImgCard({ image }: { image: ImageFindIdea }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setAspect, divContainerRef, height, handleResize } = useAspectRatio(
    16 / 9
  );

  // const {
  //   setAspect: setAspect2,
  //   divContainerRef: divContainerRef2,
  //   height: height2,
  //   handleResize: handleResize2,
  // } = useAspectRatio(16 / 9);
  return (
    <div
      ref={divContainerRef}
      className="relative overflow-hidden transition-all"
      style={{
        height: `${height}px`,
      }}
      onClick={onOpen}
    >
      <Image
        src={image.image_url}
        alt={image.prompt}
        fill
        style={{
          objectFit: 'contain',
        }}
        className="rounded-lg shadow-md"
        onLoad={(e) => {
          const loaded = e.target as HTMLImageElement;
          setAspect(loaded.naturalWidth / loaded.naturalHeight);
          handleResize();
        }}
      />
      <div className=" absolute bottom-0  left-0 right-0  h-[70%]   bg-gradient-to-t from-black/90 to-transparent  text-white opacity-0 transition-all hover:opacity-100">
        <p className=" absolute bottom-2 line-clamp-4 text-wrap px-4 text-sm  ">
          {image.prompt}
        </p>
      </div>

      <Modal
        className="  rounded-lg"
        size="full"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody className=" flex h-full  items-center justify-center overflow-y-auto  ">
                <div className=" flex h-full w-full  items-center   justify-center  gap-3  p-5">
                  <div className=" flex h-full flex-[2.5] flex-col  items-start gap-3 py-2  font-bold ">
                    <span className=" mb-5 text-5xl font-extrabold text-primary ">
                      Image Specs
                    </span>

                    <span>Prompt:</span>
                    <Snippet symbol="" variant="bordered" className="w-full">
                      <span className="line-clamp-4 text-wrap">
                        {image.prompt}
                      </span>
                    </Snippet>
                    <span>Negative Prompt:</span>
                    <Snippet symbol="" variant="bordered" className="w-full  ">
                      <span className="line-clamp-3 text-wrap ">
                        {image.negativePrompt}
                      </span>
                    </Snippet>
                    <span>Seed:</span>
                    <Snippet symbol="" variant="bordered" className="w-full">
                      <span className="text-wrap">{image.seed.toString()}</span>
                    </Snippet>
                    <span>Image Quality:</span>
                    <Snippet symbol="" variant="bordered" className="w-full">
                      <span className="text-wrap">
                        {reverseMappingRange(
                          image.numInferenceSteps,
                          false,
                          100,
                          0,
                          NUMSINFER_RANGE[1],
                          NUMSINFER_RANGE[0]
                        ).toString()}
                      </span>
                    </Snippet>
                    <span>Creativity:</span>
                    <Snippet symbol="" variant="bordered" className="w-full">
                      <span className="text-wrap">
                        {reverseMappingRange(
                          image.guidanceScale,
                          true,
                          100,
                          0,
                          CREATIVITY_RANGE[1],
                          CREATIVITY_RANGE[0]
                        ).toString()}
                      </span>
                    </Snippet>
                  </div>
                  <div className=" relative  h-full w-full flex-[5] items-center justify-center ">
                    {/* <div
                      ref={divContainerRef2}
                      style={{
                        height: `${height2}px`,
                      }}
                      // className="fixed left-0 top-0"
                    > */}
                    <Image
                      src={image.image_url}
                      alt={image.prompt}
                      fill
                      style={{
                        objectFit: 'contain',
                      }}

                      // onLoad={(e) => {
                      //   const loaded = e.target as HTMLImageElement;

                      //   setAspect2(loaded.naturalWidth / loaded.naturalHeight);
                      //   handleResize2();
                      // }}
                    />
                  </div>
                </div>
                {/* </div> */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
