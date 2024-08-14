'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import {
  ChangePasswordSchemaType,
  changePasswordSchema,
} from '@/utils/rules/user.rule';

import { Button, Input } from '@nextui-org/react';

import { changePassword } from '@/app/apis/user.api';

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema), // Hook up zodResolver
  });

  const onUpdateSubmit = handleSubmit(
    async (data: ChangePasswordSchemaType) => {
      if (isLoading) return;
      const toastId = toast.loading('Loading...');

      setIsLoading(true);

      const body = {
        ...data,
      };

      const response = await changePassword(body);

      if (response?.error) {
        setError('root.serverError', {
          type: 'Password change failed',
          message: response.error,
        });
        toast.error('Password change failed!', {
          id: toastId,
        });
      } else {
        toast.success('changed password successfully!', {
          id: toastId,
        });
      }
      setIsLoading(false);
      return;
    }
  );

  return (
    <div className="mt-12 flex h-full items-center justify-center">
      <form onSubmit={onUpdateSubmit} className="w-full md:w-[60%]">
        <div className="flex flex-col gap-[2rem]">
          <Input
            type="password"
            label="Current password"
            {...register('oldPassword')}
            isInvalid={!!errors.oldPassword}
            errorMessage={errors.oldPassword?.message || ''}
            variant="bordered"
            isDisabled={isLoading}
          />
          <p
            className={`-mt-3 mb-3 ml-4 h-[10px] text-sm text-red-400 ${
              !errors?.root?.serverError.message && 'hidden'
            }`}
          >
            {errors?.root?.serverError.message}. Please try again.
          </p>
          <Input
            type="password"
            label="New password"
            {...register('newPassword')}
            isInvalid={!!errors.newPassword}
            errorMessage={errors.newPassword?.message || ''}
            variant="bordered"
            isDisabled={isLoading}
          />

          <Input
            type="password"
            {...register('confirmPassword')}
            label="Retype new password"
            variant="bordered"
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message || ''}
            isDisabled={isLoading}
          />

          <Button
            color="primary"
            variant="ghost"
            radius="sm"
            type="submit"
            className="w-full font-bold sm:w-2/3 lg:w-1/3"
            disabled={isLoading}
          >
            Change password
          </Button>
        </div>
      </form>
    </div>
  );
}
