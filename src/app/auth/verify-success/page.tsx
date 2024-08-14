'use client';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
export default function EmailVerifyError() {
  const router = useRouter();
  return (
    <div className=" flex flex-col items-center justify-center gap-unit-lg">
      <div className=" flex items-center justify-center gap-2">
        <p className=" text-5xl font-extrabold ">Email verified !</p>
      </div>

      <Button
        color="primary"
        className="font-extrabold"
        onClick={() => {
          router.push('/auth');
        }}
      >
        Back To Login
      </Button>
    </div>
  );
}
