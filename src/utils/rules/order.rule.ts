import { z } from 'zod';

export const orderFormSchema = z.object({
  addressId: z.number({
    message: 'Please select a delivery address',
  }),
  note: z.string().min(0).max(256),
  products: z
    .array(
      z.object({
        productId: z.number(),
        quantity: z.number(),
      })
    )
    .min(1, "You don't have any products in your cart"),
  paymentType: z.string(),
});

export type OrderFormSchema = z.infer<typeof orderFormSchema>;
