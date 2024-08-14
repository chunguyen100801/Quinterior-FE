import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from '@nextui-org/react';

import Image from 'next/image';
import {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Blueprint,
  EventData,
  threeDCameraEvent,
} from '../../blueprint3D/blueprint';
import { ImgContext } from './refineSidePanel';

export default function ImgTakeShow({ bluePrint }: { bluePrint: Blueprint }) {
  const [imgUrl, setImUrl] = useState<string | null>(null);
  const { updateBlob } = useContext(ImgContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [imageDimensions, setImageDimensions] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const aspectRatio = imageDimensions.width / imageDimensions.height;
  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget;

    // setImageDimensions({ width, height });
    console.log(`Image dimensions: ${width}x${height}`);
  };
  const handleOpen = () => {
    onOpen();
  };
  const onNewImgTaken = useCallback(
    (event: EventData<threeDCameraEvent, 'new-img-taken'>) => {
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
      if (updateBlob) {
        updateBlob(event.blob);
      }
      const url = URL.createObjectURL(event.blob);
      setImUrl(url);
    },

    [imgUrl, updateBlob]
  );

  useEffect(() => {
    bluePrint.externalEvenDispatch.addEventListener(
      'new-img-taken',
      onNewImgTaken
    );
    return () => {
      bluePrint.externalEvenDispatch.removeEventListener(
        'new-img-taken',
        onNewImgTaken
      );
    };
  }, [bluePrint.externalEvenDispatch, onNewImgTaken]);
  return (
    <div className=" w-full rounded-lg p-2 outline outline-2 outline-foreground-50 ">
      <div className="relative flex h-[16rem]  items-center justify-center overflow-hidden rounded-lg  ">
        {imgUrl && (
          <Image
            src={imgUrl}
            alt="Captured image"
            fill
            className="  object-contain  "
            onClick={() => {
              handleOpen();
            }}
            onLoad={handleImageLoad}
          ></Image>
        )}
      </div>

      <Modal
        size="5xl"
        // style={{ width: `calc(${aspectRatio} * 85vh)` }}
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton={true}
      >
        <ModalContent>
          {() => (
            <ModalBody className="flex items-center justify-center">
              <div className=" h-[85vh]">
                <Image
                  src={imgUrl!}
                  alt="Captured image"
                  fill
                  className="  object-contain  "
                ></Image>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
