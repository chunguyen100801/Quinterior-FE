import { Gender } from 'src/constants/enum';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from 'src/constants/file.rule';
import * as z from 'zod';

const regexPhoneNumber = /(84|0)+([0-9]{9})\b/g;

const userRule = {
  firstName: z
    .string()
    .min(1, { message: 'This field cant be empty' })
    .max(50, 'Maximum length is 50')
    .trim(),
  lastName: z
    .string()
    .min(1, { message: 'This field cant be empty' })
    .max(50, 'Maximum length is 50')
    .trim(),
  fullName: z
    .string()
    .min(1, { message: 'This field cant be empty' })
    .max(100, 'Maximum length is 100')
    .trim(),
  email: z
    .string()
    .min(1, { message: 'Email Required' })
    .email('emailInvalid')
    .max(160, 'Length From 5 To 160')
    .trim(),
  password: z.string().min(1, 'Password Required').min(6, 'Length at least 6'),
  confirmPassword: z
    .string()
    .min(1, 'Confirm Password Required')
    .min(6, 'Length at least 6'),
  phoneNumber: z.optional(
    z.string().trim().regex(regexPhoneNumber, 'Invalid phone number')
  ),
  address: z.optional(z.string().max(300, 'Maximum length is 300').trim()),
  gender: z.optional(z.enum([Gender.MALE, Gender.FEMALE, Gender.NONE])),
  avatar: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 5MB')
    .refine((file) => {
      return !file || ACCEPTED_FILE_TYPES.includes(file?.type as string);
    }, 'File must be a PNG'),
};

export const updateProfileSchema = z.object({
  firstName: userRule.firstName,
  lastName: userRule.lastName,
  phoneNumber: userRule.phoneNumber,
  gender: userRule.gender,
  // avatar: userRule.avatar,
});

// change password
export const changePasswordSchema = z
  .object({
    oldPassword: userRule.password,
    newPassword: userRule.password,
    confirmPassword: userRule.confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const MyAddressSchema = z.object({
  fullName: userRule.fullName,
  email: userRule.email,
  address: userRule.address,
  phone: userRule.phoneNumber,
  isDefault: z.boolean().optional(),
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type MyAddressSchemaType = z.infer<typeof MyAddressSchema>;
