import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import ResendButton from './components/resendButton';
export default async function VerifyEmail({
  params,
}: {
  params: { signedEmail: string };
}) {
  let payload;
  try {
    payload = jwt.verify(
      params.signedEmail,
      process.env.NEXT_PUBLIC_EMAIL_ENCODDE_KEY as string
    ) as JwtPayload;
  } catch {
    throw new Error('Expired email verify link !');
  }

  return (
    <div className=" flex flex-col items-center justify-center gap-1">
      <p className="text-4xl font-extrabold">Thank You for Registering!</p>
      <p className=" font-extrabold">
        An email has been sent to {payload.email}
      </p>
      <p className=" font-extrabold">
        Please check your inbox and follow the instructions to verify your
        email.
      </p>

      <ResendButton email={payload.email}></ResendButton>
    </div>
  );
}
