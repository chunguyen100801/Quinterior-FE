import { z } from 'zod';

export const categoryFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(256),
  description: z.string().min(1).max(1000),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
