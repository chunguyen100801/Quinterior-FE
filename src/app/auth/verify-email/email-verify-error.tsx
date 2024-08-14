'use client'; // Error components must be Client Components
import { Button } from '@nextui-org/react';
import { MessageCircleWarning } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function EmailVerifyError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className=" flex flex-col items-center justify-center gap-unit-lg">
      <div className=" flex gap-2">
        <p className=" text-9xl font-extrabold ">Oops! </p>
        <MessageCircleWarning size={100} className=""></MessageCircleWarning>
      </div>
      <p className=" text-3xl font-extrabold text-foreground  ">
        {error.message}
      </p>
      <Button
        color="primary"
        onClick={() => {
          router.push('/');
        }}
        className="font-extrabold"
      >
        Back To Home
      </Button>
    </div>
  );
}
