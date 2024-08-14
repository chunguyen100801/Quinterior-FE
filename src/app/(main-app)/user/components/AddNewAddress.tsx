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
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { addNewAddress } from '@/app/apis/address.api';
import { UserInFo } from '@/lucia-auth/auth-actions';
import CreateAddress from './CreateAddress';
import { useRouter } from 'next/navigation';
import { AddressType } from 'src/types/address.type';

interface Props {
  profile: UserInFo | null;
  myAddressData: AddressType[] | null | undefined;
}

export default function AddNewAddress({
  profile: profileUser,
  myAddressData,
}: Props) {
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

    if (myAddressData && myAddressData.length < 1) {
      body.isDefault = true;
    }

    const response = await addNewAddress(body);

    if (response?.error) {
      setError('root.serverError', {
        type: 'Adding new address failed',
        message: response.error,
      });
      toast.error('Adding new address failed!', {
        id: toastId,
      });
    } else {
      toast.success('Added successfully!', {
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
        color="primary"
        variant="ghost"
        radius="sm"
        type="submit"
        className=" font-bold md:w-full"
      >
        <Plus size={20} />
        Add new address
      </Button>

      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="3xl"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
            {(onClose) => (
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
                      isRequired
                    />

                    <Input
                      type="text"
                      label="Phone Number"
                      {...register('phone')}
                      isInvalid={errors.phone ? true : false}
                      errorMessage={errors.phone?.message as string}
                      variant="bordered"
                      isDisabled={isLoading}
                      isRequired
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
                    />
                    <p className="min-h-[20px] text-sm text-red-400">
                      {errors.address?.message}
                    </p>
                  </div>
                  <div className=" -mt-8">
                    <Checkbox
                      radius="sm"
                      {...register('isDefault')}
                      isDisabled={isLoading}
                    >
                      Set as default
                    </Checkbox>
                  </div>
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
                  <Button color="primary" type="submit" isDisabled={isLoading}>
                    Add
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
