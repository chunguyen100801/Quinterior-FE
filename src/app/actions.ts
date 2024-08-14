'use server';

import { validateRequest } from '../auth/lucia';

export const getUser = async () => {
  const { user } = await validateRequest();

  return user;
};

export const revalidatePath = async (path: string) => {
  await revalidatePath(path);
  return;
};
