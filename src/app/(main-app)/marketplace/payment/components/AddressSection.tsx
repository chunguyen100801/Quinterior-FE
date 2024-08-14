'use client';
import { Button } from '@nextui-org/react';
import { MapPinIcon } from 'lucide-react';
import React, { useState } from 'react';
import SelectAddressModal from './SelectAddressModal';
import { AddressType } from 'src/types/address.type';
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';
import { OrderFormSchema } from '@/utils/rules/order.rule';

interface Props {
  data?: AddressType[] | null;
}

function AddressSection({ data }: Props) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { watch } = useFormContext<OrderFormSchema>();
  const addressId = watch('addressId');
  const address = data?.find((item) => item.id === addressId);

  return (
    <>
      <div className="mb-4 bg-[#151517] p-6">
        <div className="mb-3 flex items-center gap-2">
          <MapPinIcon size={20} color="white" />
          <h3 className="text-[18px] font-medium text-white">
            Delivery Address
          </h3>
        </div>

        {address ? (
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {address.fullName}
                <span className="mx-2 border-r border-white" />
                {address.phone}
              </p>
              <p className="mt-1 text-sm font-normal text-white">
                {address.address}
              </p>
            </div>
            <Button
              color="primary"
              className="font-medium  text-blue-400"
              variant="light"
              radius="sm"
              type="button"
              onClick={() => setIsOpenModal(true)}
            >
              Switch
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="flex-1 text-sm text-white">
              Please add your address to continue
            </p>
            <Button
              as={Link}
              href="/user/address"
              color="primary"
              className="font-medium  text-blue-400"
              variant="light"
              radius="sm"
              type="button"
            >
              Manage address
            </Button>
          </div>
        )}
      </div>

      {Array.isArray(data) && data.length > 0 && (
        <SelectAddressModal
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          data={data}
        />
      )}
    </>
  );
}

export default AddressSection;
