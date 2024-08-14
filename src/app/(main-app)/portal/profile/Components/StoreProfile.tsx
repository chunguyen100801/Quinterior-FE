'use client';
import { Avatar, Button, Divider, Input } from '@nextui-org/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  UpdateProfileSchemaType,
  updateProfileSchema,
} from '@/utils/rules/seller.rule';
import { useMemo, useRef, useState } from 'react';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from 'src/constants/file.rule';
import { useRouter } from 'next/navigation';
import CreateAddress from '@/app/(main-app)/user/components/CreateAddress';
import { updateSellerProfile } from '@/app/apis/publisher.api';
import { PublisherInfoType } from 'src/types/publisher.type';
import TextEditor from '@/components/TextEditor';

interface Props {
  storeProfile: PublisherInfoType | undefined | null;
}

export default function StoreProfile({ storeProfile }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileAvatar, setFileAvatar] = useState<File | null>(null);

  const [checkEmpty, setCheckEmpty] = useState<boolean>(false);
  const router = useRouter();

  const previewAvatar = useMemo(() => {
    return fileAvatar ? URL.createObjectURL(fileAvatar) : storeProfile?.logo;
  }, [fileAvatar, storeProfile?.logo]);

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: storeProfile?.name || '',
      description: storeProfile?.description || '',
    },
  });

  const onUpdateSubmit = async (data: UpdateProfileSchemaType) => {
    console.log(data);
    if (isLoading) return;
    if (checkEmpty) {
      setError('address', {
        type: 'required',
        message: 'Please fill in the address',
      });
      return;
    }
    const toastId = toast.loading('Loading...');

    const body = new FormData();
    data.name && body.append('name', data.name);
    data.description && body.append('description', data.description);
    data.address && body.append('address', data.address);
    fileAvatar && body.append('logo', fileAvatar);

    setIsLoading(true);

    const response = await updateSellerProfile(body);

    if (response?.error) {
      setError('root.serverError', {
        type: 'profile update failed',
        message: response.error,
      });
      toast.error('profile update failed!', {
        id: toastId,
      });
    } else {
      toast.success('Update Successful!', {
        id: toastId,
      });
    }

    router.refresh();
    setIsLoading(false);
    return;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_UPLOAD_SIZE) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error('File is not valid');
        return;
      }
      setFileAvatar(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onUpdateSubmit)}>
      <div className="mt-8 flex flex-col-reverse md:flex-row md:items-start md:justify-between">
        <div className="md:w-[65%]">
          <div className="flex w-full flex-col space-y-8">
            <div className="md:gap-unit-sm flex min-w-min flex-col gap-[2rem] md:flex-row">
              <Input
                type="text"
                label="Name"
                {...register('name')}
                isInvalid={errors.name ? true : false}
                errorMessage={errors.name?.message as string}
                variant="bordered"
                defaultValue={storeProfile?.name || ''}
                isDisabled={isLoading}
                classNames={
                  {
                    // inputWrapper: ['border-gray-300'],
                  }
                }
              />
            </div>

            <div>
              <CreateAddress
                setCheckEmpty={setCheckEmpty}
                isLoading={isLoading}
                onChange={(value: string) => {
                  setValue('address', value);
                }}
                myAddressData={storeProfile?.address}
              />
              <p className="mt-2 min-h-[20px] text-sm text-red-400">
                {errors.address?.message}
              </p>
            </div>

            <div>
              <label className="text-gray-400">Description</label>
              {/* <TextEditor
                value={storeProfile?.description ?? '}
                onChange={(value: string) => {
                  console.log(value);
                  setValue('description', value);
                }}
              /> */}
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextEditor
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <p className="mt-2 text-xs text-[#F31260]">
                {errors.description?.message}
              </p>
            </div>
            <Button
              color="primary"
              variant="ghost"
              radius="sm"
              type="submit"
              className="w-1/4 font-bold"
              isDisabled={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="ml-20 mt-6 hidden lg:block">
          <Divider orientation="vertical" className="py-20" />
        </div>

        <div className="md:w-[35%]">
          <div className="my-4 flex justify-center md:mt-2 ">
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <Avatar
                  src={previewAvatar as string}
                  className="h-28 w-28 text-large"
                />
              </div>
              <input
                type="file"
                className="hidden"
                accept=".jpg, .jpeg, .png"
                ref={fileInputRef}
                onChange={onFileChange}
              />
              <Button
                color="primary"
                variant="ghost"
                radius="sm"
                onClick={handleChooseAvatar}
                type="button"
                isDisabled={isLoading}
              >
                Choose Avatar
              </Button>
              <span className="mt-3 text-xs text-gray-400">
                File size: maximum 5MB
              </span>
              <span className="text-xs text-gray-400">
                File extension: .jpg, .jpeg, .png
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
