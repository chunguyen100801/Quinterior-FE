'use client';
import { OrderFormSchema } from '@/utils/rules/order.rule';
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
} from '@nextui-org/react';
import Link from 'next/link';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AddressType } from 'src/types/address.type';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: AddressType[];
}

function Item({ data }: { data: AddressType }) {
  return (
    <div className="flex items-start gap-4 border-b border-divider py-3">
      <Radio value={String(data.id)} />
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <p className="font-medium">{data.fullName}</p>
          <Divider orientation="vertical" className="h-4 bg-white" />
          <span>{data.phone}</span>
        </div>
        <p className="mb-1 mt-2 text-sm text-white">{data.address}</p>
        {data.isDefault && (
          <div className="inline-block border border-blue-500 px-2 py-1 text-xs text-blue-500">
            Default
          </div>
        )}
      </div>
    </div>
  );
}

function SelectAddressModal({ isOpen, setIsOpen, data }: Props) {
  const { setValue, watch } = useFormContext<OrderFormSchema>();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    String(watch('addressId'))
  );

  const handleSwitchAddress = () => {
    setValue('addressId', +selectedAddressId);
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-[2px]"
      scrollBehavior="inside"
      size="lg"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Select your delivery address
            </ModalHeader>
            <ModalBody>
              <RadioGroup
                value={selectedAddressId}
                onValueChange={setSelectedAddressId}
              >
                {data.map((item) => (
                  <Item key={item.id} data={item} />
                ))}

                <div className="mt-3 inline-block">
                  <Button
                    as={Link}
                    href="/user/address"
                    color="secondary"
                    type="button"
                    className="rounded-[4px]"
                  >
                    Manage addresses
                  </Button>
                </div>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleSwitchAddress}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default SelectAddressModal;
