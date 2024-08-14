import React, { Suspense } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  // ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { Box } from 'lucide-react';
import Show3D from './Show3D';
import Show3DSkeleton from './Show3DSkeleton';

interface Props {
  url: string;
  background?: string;
  title: string;
}

export default function Show3DModal({ url, background, title }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        size="md"
        className="font-medium"
        onPress={onOpen}
        isDisabled={!url}
      >
        <Box /> View 3D Model
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        className=" rounded-md bg-white text-black"
        backdrop={'blur'}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-1 pt-2">
                {title} | 3D Model
              </ModalHeader>
              <ModalBody className="px-2">
                <Suspense fallback={<Show3DSkeleton />}>
                  <Show3D url={url} background={background} />
                </Suspense>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
