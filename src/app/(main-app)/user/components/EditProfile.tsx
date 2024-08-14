'use client';
import { Avatar, Button, Divider, Input } from '@nextui-org/react';

import { UserInFo } from '@/lucia-auth/auth-actions';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  UpdateProfileSchemaType,
  updateProfileSchema,
} from '@/utils/rules/user.rule';
import { updateProfileMe } from '@/app/apis/user.api';
import { useMemo, useRef, useState } from 'react';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from 'src/constants/file.rule';
import { useRouter } from 'next/navigation';

interface Props {
  profile: UserInFo | null;
}

export default function EditProfile({ profile: profileUser }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileAvatar, setFileAvatar] = useState<File | null>(null);
  const router = useRouter();

  const previewAvatar = useMemo(() => {
    return fileAvatar ? URL.createObjectURL(fileAvatar) : profileUser?.avatar;
  }, [fileAvatar, profileUser?.avatar]);

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema), // Hook up zodResolver
  });

  const onUpdateSubmit = handleSubmit(async (data: UpdateProfileSchemaType) => {
    if (isLoading) return;
    const toastId = toast.loading('Loading...');
    const body = new FormData();
    body.append('firstName', data.firstName);
    body.append('lastName', data.lastName);
    if (data.phoneNumber) {
      body.append('phoneNumber', data.phoneNumber);
    }
    if (fileAvatar) {
      body.append('avatar', fileAvatar);
    }

    setIsLoading(true);

    const response = await updateProfileMe(body);

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
  });

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
    <form onSubmit={onUpdateSubmit}>
      <div className="mt-8 flex flex-col-reverse md:flex-row md:items-start md:justify-between">
        <div className="md:w-[65%]">
          <div className="flex w-full flex-col gap-[2rem]">
            <div className="md:gap-unit-sm flex min-w-min flex-col gap-[2rem] md:flex-row">
              <Input
                type="text"
                label="First Name"
                {...register('firstName')}
                isInvalid={errors.firstName ? true : false}
                errorMessage={errors.firstName?.message as string}
                variant="bordered"
                defaultValue={profileUser?.firstName || ''}
                isDisabled={isLoading}
              />

              <Input
                type="text"
                label="Last Name"
                {...register('lastName')}
                isInvalid={errors.lastName ? true : false}
                errorMessage={errors.lastName?.message as string}
                defaultValue={profileUser?.lastName || ''}
                variant="bordered"
                isDisabled={isLoading}
              ></Input>
            </div>

            <Input
              type="email"
              label="Email"
              variant="bordered"
              readOnly
              defaultValue={profileUser?.email || ''}
            ></Input>

            <Input
              type="tel"
              label="Phone Number"
              {...register('phoneNumber')}
              isInvalid={errors.phoneNumber ? true : false}
              errorMessage={errors.phoneNumber?.message as string}
              defaultValue={profileUser?.phoneNumber || ''}
              variant="bordered"
              isDisabled={isLoading}
            ></Input>

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
                // {...register('avatar')}
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
