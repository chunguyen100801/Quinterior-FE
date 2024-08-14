import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import EmailVerifyError from './email-verify-error';
export default function EmailVerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary errorComponent={EmailVerifyError}>{children}</ErrorBoundary>
  );
}
