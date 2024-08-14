import { z } from 'zod';
import { numberValidation } from './util.rule';

export const managePackageFormSchema = z.object({
  name: z.string().min(1).max(256),
  description: z.string().min(1).max(10000),
  background: z.string(),
  quantity: numberValidation('Quantity should be greater than 0'),
  price: z.string().refine((data) => {
    const priceNum = +data;
    return !isNaN(priceNum) && priceNum > 1000;
  }, 'Price should be greater than 1000'),
  categoryIds: z.array(z.string()).min(1),
  images: z.any(),
  modelData: z.object({
    width: numberValidation('Width should be greater than 0'),
    height: numberValidation('Height should be greater than 0'),
    depth: numberValidation('Depth should be greater than 0'),
    modelType: z.string().min(1),
  }),
  // .refine((files) => files?.length > 0, 'Image is required.')
  // .refine((files) => files?.length <= 5, 'Maximum of 5 images are allowed.')
  // .refine(
  //   (files) =>
  //     files?.length > 0 &&
  //     files.every((file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
  //   '.jpg, .jpeg, .png and .webp files are accepted.'
  // )
  thumbnail: z.any(),
  // .refine((files) => files?.length > 0, 'Thumbnail is required.')
  // .refine((files) => files?.length === 1, 'Only one thumbnail is allowed.')
  // .refine(
  //   (files) =>
  //     files?.length > 0 && ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //   '.jpg, .jpeg, .png and .webp files are accepted.'
  // )
  model: z.any(),
  // .refine((files) => files?.length > 0, 'Model is required.')
  // .refine((files) => {
  //   const file = files?.[0];
  //   return (
  //     (files?.length > 0 && file?.name?.endsWith('.gltf')) ||
  //     file?.name?.endsWith('.glb')
  //   );
  // }, '.gltf and .glb files are accepted.')
});

export type ManagePackageFormSchemaType = z.infer<
  typeof managePackageFormSchema
>;
