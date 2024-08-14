'use client';
import { resendVerifyEmail } from '@/lucia-auth/auth-actions';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';
export default function ResendButton({ email }: { email: string }) {
  const resend = async () => {
    const toastId = toast.loading('Loading...');

    const response = await resendVerifyEmail(email);
    if (response.error) {
      toast.error('Fail to resend email !', {
        id: toastId,
      });
      return;
    }

    toast.success('Email sent !', {
      id: toastId,
    });
  };
  return (
    <form action={resend}>
      <Button type="submit" color="primary" className="font-extrabold">
        Resend Email
      </Button>
    </form>
  );
}
