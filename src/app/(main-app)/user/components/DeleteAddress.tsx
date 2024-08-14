'use client';
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AddressType } from 'src/types/address.type';
import { deleteAddressById } from '@/app/apis/address.api';

interface Props {
  myAddressData: AddressType;
}

export default function DeleteAddress({ myAddressData }: Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onSubmit = async () => {
    if (isLoading) return;
    if (myAddressData.isDefault) {
      toast.error('Cannot delete default address');
      return;
    }
    const toastId = toast.loading('Loading...');
    setIsLoading(true);
    const response = await deleteAddressById(myAddressData.id);
    if (response?.error) {
      toast.error('Delete failed!', {
        id: toastId,
      });
    } else {
      toast.success('Deleted successfully!!', {
        id: toastId,
      });
    }
    router.refresh();
    setIsLoading(false);
    onClose();
    return;
  };

  return (
    <div className="items-center justify-center">
      <Button
        onPress={onOpen}
        color="danger"
        variant="light"
        radius="sm"
        className=" text-red-500"
        type="button"
      >
        Delete
      </Button>

      <Modal
        size="sm"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: 'bg-[#2e3965]/50 backdrop-opacity-40 w-full h-full',
          base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
          closeButton: 'hover:bg-white/5 active:bg-white/10',
        }}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                Delete Address
              </ModalHeader>
              <ModalBody className="gap-[2rem]">
                Confirm deletion of this address
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isLoading}
                >
                  Close
                </Button>
                <Button
                  color="danger"
                  onClick={onSubmit}
                  isDisabled={isLoading}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
