import { validateRequest } from '@/lucia-auth/lucia';
import { serverFetchWithAutoRotation } from '@/utils/fetch/fetch-service';
import { User } from 'lucia';
import { redirect } from 'next/navigation';

export const getMe = async () => {
  const { session } = await validateRequest();

  if (!session) {
    redirect('/auth');
  }

  try {
    const res: User = await serverFetchWithAutoRotation({
      method: 'GET',
      api: `/api/v1/auth/me`,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
