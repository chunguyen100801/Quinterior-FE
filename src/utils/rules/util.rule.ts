import { z } from 'zod';

export const numberValidation = (errorMessage: string) =>
  z.string().refine((data) => {
    const num = +data;
    return !isNaN(num) && num > 0;
  }, errorMessage);
