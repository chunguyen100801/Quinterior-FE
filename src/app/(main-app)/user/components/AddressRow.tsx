'use client';
import { Button, Chip, Divider } from '@nextui-org/react';
import React, { useState } from 'react';
import { AddressType } from 'src/types/address.type';
import DeleteAddress from './DeleteAddress';
import EditAddress from './EditAddress';
import { UserInFo } from '@/lucia-auth/auth-actions';

import { useForm } from 'react-hook-form';

import { toast } from 'sonner';
import { updateAddressById } from '@/app/apis/address.api';
import { useRouter } from 'next/navigation';

interface Props {
  myAddressData: AddressType;
  profileUser: UserInFo | null;
}

export default function AddressRow({ myAddressData, profileUser }: Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, setError } = useForm();

  const onSubmitSetDefault = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const body = {
      // fullName: myAddressData.fullName,
      // phone: myAddressData.phone,
      // address: myAddressData.address,
      // email: myAddressData.email,
      isDefault: true,
    };

    const response = await updateAddressById(myAddressData.id, body);

    if (response?.error) {
      setError('root.serverError', {
        type: 'Updated failed',
        message: response.error,
      });
      toast.error('Updated failed!');
    } else {
      toast.success('Updated successfully!');
    }
    router.refresh();
    setIsLoading(false);
    return;
  };

  return (
    <div className="flex w-full justify-between tracking-wide">
      <div className=" space-y-2">
        <div className="flex max-w-md">
          {myAddressData.fullName}
          <Divider orientation="vertical" className="mx-4 py-3 pl-[1px]" />{' '}
          {myAddressData.phone}
        </div>
        <div className=" max-w-md text-slate-300">{myAddressData.address}</div>
      </div>
      <div className={`flex flex-col justify-center gap-2 `}>
        <div className="flex w-full">
          {myAddressData.isDefault ? (
            <div className="flex w-full justify-end">
              <EditAddress
                myAddressData={myAddressData}
                profileUser={profileUser}
              />
            </div>
          ) : (
            <>
              <EditAddress
                myAddressData={myAddressData}
                profileUser={profileUser}
              />
              <DeleteAddress myAddressData={myAddressData} />
            </>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmitSetDefault)}>
          <div className="flex items-end justify-end">
            {!myAddressData.isDefault ? (
              <Button
                variant="bordered"
                size="md"
                radius="sm"
                type="submit"
                isLoading={isLoading}
              >
                Set as default
              </Button>
            ) : (
              <Chip size="md" radius="sm" variant="faded" className="py-4">
                Default address
              </Chip>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
