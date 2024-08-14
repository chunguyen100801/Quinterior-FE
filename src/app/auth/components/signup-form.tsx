'use client';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import AlertError from './alert-error';

import { signup } from '@/lucia-auth/auth-actions';
import { zodResolver } from '@hookform/resolvers/zod';
import * as jwt from 'jsonwebtoken';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: 'This field cant be empty' }),
    lastName: z.string().min(1, { message: 'This field cant be empty' }),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export type RegisterSchemaType = z.infer<typeof registerSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema), // Hook up zodResolver
  });

  const onRegisterSubmit = async (data: RegisterSchemaType) => {
    const toastId = toast.loading('Loading...');

    const response = await signup({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      address: data.address,
    });
    if (response.error) {
      setError('root.serverError', {
        type: 'register Fail',
        message: response.error,
      });
      toast.error('register Fail !', {
        id: toastId,
      });
      return;
    }

    toast.success('register Success !', {
      id: toastId,
    });
    const signedEmail = await jwt.sign(
      { email: data.email },
      process.env.NEXT_PUBLIC_EMAIL_ENCODDE_KEY as string,
      { expiresIn: '1h' }
    );

    return router.push(`/auth/verify-email/${signedEmail}`);
  };

  return (
    <>
      <form
        className="flex w-full flex-col gap-[1rem]"
        onSubmit={handleSubmit(onRegisterSubmit)}
      >
        <span className="text-[2rem]">Sign up</span>
        <span className="mt-[-1rem] text-[0.8rem]">
          Let fill up your infomations
        </span>
        <div className="flex gap-unit-sm ">
          <Input
            type="text"
            label="First Name"
            {...register('firstName')}
            isInvalid={errors.firstName ? true : false}
            errorMessage={errors.firstName?.message as string}
            variant="bordered"
          ></Input>

          <Input
            type="text"
            label="Last Name"
            {...register('lastName')}
            isInvalid={errors.lastName ? true : false}
            errorMessage={errors.lastName?.message as string}
            variant="bordered"
          ></Input>
        </div>

        <Input
          type="email"
          label="Email"
          {...register('email')}
          isInvalid={errors.email ? true : false}
          errorMessage={errors.email?.message as string}
          variant="bordered"
        ></Input>

        <Input
          type="password"
          label="Password"
          {...register('password')}
          isInvalid={errors.password ? true : false}
          errorMessage={errors.password?.message as string}
          variant="bordered"
        ></Input>

        <Input
          type="password"
          label="Confirm Password"
          {...register('confirmPassword')}
          isInvalid={errors.confirmPassword ? true : false}
          errorMessage={errors.confirmPassword?.message as string}
          variant="bordered"
        ></Input>

        <Input
          type="tel"
          label="Phone Number (optional)"
          {...register('phoneNumber')}
          isInvalid={errors.phoneNumber ? true : false}
          errorMessage={errors.phoneNumber?.message as string}
          variant="bordered"
        ></Input>

        <Input
          type="text"
          label="Address (optional)"
          {...register('address')}
          isInvalid={errors.address ? true : false}
          errorMessage={errors.address?.message as string}
          variant="bordered"
        ></Input>
        <AlertError>{errors?.root?.serverError.message}</AlertError>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#0CC8FF] to-[#9260FF] font-bold"
        >
          Sign up
        </Button>
      </form>
    </>
  );
}
