import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from 'src/constants/file.rule';
import * as z from 'zod';

const sellerRule = {
  name: z
    .string()
    .min(1, { message: 'This field cant be empty' })
    .max(50, 'Maximum length is 50')
    .trim(),

  description: z
    .string()
    .min(1, { message: 'This field cant be empty' })
    .max(1000, 'Maximum length is 1000')
    .trim(),
  address: z.string().max(255, 'Maximum length is 255').trim(),
  avatar: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 5MB')
    .refine((file) => {
      return !file || ACCEPTED_FILE_TYPES.includes(file?.type as string);
    }, 'File must be a PNG or JPG'),
};

export const updateProfileSchema = z.object({
  name: sellerRule.name,
  description: sellerRule.description,
  address: sellerRule.address,
  logo: sellerRule.avatar,
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
