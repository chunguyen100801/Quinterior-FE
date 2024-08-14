'use client';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import AlertError from './alert-error';

import { login } from '@/lucia-auth/auth-actions';
import { zodResolver } from '@hookform/resolvers/zod';
// import { Facebook, MailIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const LoginSchema = z.object({
  username: z.string().min(1, { message: 'Emty field' }),
  password: z.string().min(6),
});
type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema), // Hook up zodResolver
  });

  const onLoginSubmit = async (data: LoginSchemaType) => {
    const toastId = toast.loading('Loading...');

    const response = await login({
      email: data.username,
      password: data.password,
    });
    if (response.error) {
      setError('root.serverError', {
        type: 'Login Fail',
        message: response.error,
      });
      toast.error('Login Fail !', {
        id: toastId,
      });
      return;
    }

    toast.success('Login Success !', {
      id: toastId,
    });

    const pathNameFrom = localStorage.getItem('redirect-after-login');
    if (pathNameFrom) {
      localStorage.removeItem('redirect-after-login');
      return router.push(pathNameFrom);
    }

    return router.push('/');
  };

  return (
    <>
      <form
        className="mb-4 flex w-full flex-col gap-[1rem]"
        onSubmit={handleSubmit(onLoginSubmit)}
      >
        <span className="text-[2rem]">Login</span>
        <span className="mt-[-1rem] text-[0.8rem]">Any new idea today ?</span>
        <Input
          type="text"
          label="Email/Username"
          {...register('username')}
          isInvalid={errors.username ? true : false}
          errorMessage={errors.username?.message as string}
          variant="bordered"
        ></Input>

        <Input
          variant="bordered"
          type="password"
          label="Password"
          {...register('password')}
          isInvalid={errors.password ? true : false}
          errorMessage={errors.password?.message as string}
        ></Input>
        <AlertError>{errors?.root?.serverError.message}</AlertError>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#0CC8FF] to-[#9260FF] font-bold"
        >
          Login
        </Button>
      </form>

      {/* <div className=" mt-unit-md">
        <div className=" flex gap-2">
          <Button className="w-[50%]" variant="ghost">
            <Facebook></Facebook>
            <span className=" ml-1">Facebook</span>
          </Button>
          <Button className="w-[50%]  " variant="ghost">
            <MailIcon></MailIcon>
            <span className=" ml-1">Gmail</span>
          </Button>
        </div>
      </div> */}
    </>
  );
}
