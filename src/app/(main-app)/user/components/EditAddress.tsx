'use client';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Checkbox,
} from '@nextui-org/react';

import { MyAddressSchema, MyAddressSchemaType } from '@/utils/rules/user.rule';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import { updateAddressById } from '@/app/apis/address.api';
import { UserInFo } from '@/lucia-auth/auth-actions';
import CreateAddress from './CreateAddress';
import { useRouter } from 'next/navigation';
import { AddressType } from 'src/types/address.type';

interface Props {
  myAddressData: AddressType;
  profileUser: UserInFo | null;
}

export default function EditAddress({ myAddressData, profileUser }: Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [checkEmpty, setCheckEmpty] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MyAddressSchemaType>({
    resolver: zodResolver(MyAddressSchema),
  });

  useEffect(() => {
    setValue('email', profileUser?.email || '');
    setValue('address', address);
  }, [address, profileUser?.email, setValue]);

  const onSubmit = async (data: MyAddressSchemaType) => {
    if (isLoading) return;
    if (checkEmpty) {
      setError('address', {
        type: 'required',
        message: 'Please fill in the address',
      });
      return;
    }
    const toastId = toast.loading('Loading...');
    setIsLoading(true);
    const body = {
      ...data,
    };

    if (myAddressData.isDefault) {
      body.isDefault = true;
    }

    const response = await updateAddressById(myAddressData.id, body);

    if (response?.error) {
      setError('root.serverError', {
        type: 'Updated failed',
        message: response.error,
      });
      toast.error('Updated failed!', {
        id: toastId,
      });
    } else {
      toast.success('Updated successfully!', {
        id: toastId,
      });
    }
    router.refresh();
    setIsLoading(false);
    onCloseModal();
    return;
  };

  const onCloseModal = () => {
    reset();
    setAddress('');
    onClose();
  };

  return (
    <div className="items-center justify-center">
      <Button
        onPress={onOpen}
        color="primary"
        className="  text-blue-400"
        variant="light"
        radius="sm"
        type="button"
      >
        Edit
      </Button>

      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="3xl"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onCloseModal}
        classNames={{
          body: 'py-6',
          backdrop: 'bg-[#2e3965]/50 backdrop-opacity-40 w-full h-full',
          base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
          header: 'border-b-[1px] border-[#292f46]',
          footer: 'border-t-[1px] border-[#292f46]',
          closeButton: 'hover:bg-white/5 active:bg-white/10',
        }}
        placement="top-center"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(onCloseModal) => (
              <>
                <ModalHeader className="flex items-center gap-2">
                  New Address
                </ModalHeader>
                <ModalBody className="gap-[2rem]">
                  <div className="md:gap-unit-sm flex min-w-min flex-col gap-[2rem] md:flex-row">
                    <Input
                      type="text"
                      label="Full Name"
                      {...register('fullName')}
                      isInvalid={errors.fullName ? true : false}
                      errorMessage={errors.fullName?.message as string}
                      variant="bordered"
                      isDisabled={isLoading}
                      required
                      defaultValue={myAddressData?.fullName}
                    />

                    <Input
                      type="text"
                      label="Phone Number"
                      {...register('phone')}
                      isInvalid={errors.phone ? true : false}
                      errorMessage={errors.phone?.message as string}
                      variant="bordered"
                      isDisabled={isLoading}
                      required
                      defaultValue={myAddressData?.phone}
                    ></Input>
                    <input
                      type="hidden"
                      {...register('address', { value: address })}
                      value={address}
                    />
                  </div>
                  <div>
                    <CreateAddress
                      setAddress={setAddress}
                      setCheckEmpty={setCheckEmpty}
                      isLoading={isLoading}
                      myAddressData={myAddressData?.address}
                    />
                    <p className="min-h-[20px] text-sm text-red-400">
                      {errors.address?.message}
                    </p>
                  </div>
                  <div className=" -mt-8">
                    <Checkbox
                      type="checkbox"
                      radius="sm"
                      {...register('isDefault')}
                      defaultSelected={myAddressData?.isDefault}
                      isDisabled={isLoading || myAddressData.isDefault}
                    >
                      Set as default
                    </Checkbox>
                    <p className="min-h-[20px] text-sm text-red-400">
                      {errors.isDefault?.message}
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onCloseModal}
                    isDisabled={isLoading}
                  >
                    Close
                  </Button>
                  <Button color="primary" type="submit" isDisabled={isLoading}>
                    Update
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
}
