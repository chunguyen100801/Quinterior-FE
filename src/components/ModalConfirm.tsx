'use client';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@nextui-org/react';
import React, { useState } from 'react';

export interface ModalConfirmProps {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: () => Promise<void>;
  title: string;
  message: string;
}

function ModalConfirm({
  title,
  message,
  isOpen,
  onClose,
  onSubmit,
}: ModalConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    !isLoading && onClose?.();
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await onSubmit?.();
    setIsLoading(false);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} placement={'auto'} onClose={handleClose} radius="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              {!isLoading ? (
                <Button
                  color="primary"
                  onPress={handleConfirm}
                  isDisabled={isLoading}
                >
                  Confirm
                </Button>
              ) : (
                <div className="flex h-[40px] w-[89px] items-center justify-center">
                  <Spinner size="sm" />
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalConfirm;
