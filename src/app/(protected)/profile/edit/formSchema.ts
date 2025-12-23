import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || z.string().url().safeParse(v).success, {
    message: 'Enter a valid URL (include https://)'
  });

const optionalRomanianPhone = z
  .string()
  .trim()
  .refine((v) => v === '' || /^(?:0\d{9}|\+40\d{9}|0040\d{9})$/.test(v), {
    message: 'Enter a valid phone number'
  });

export const profileFormSchema = z.object({
  fullname: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  phone: optionalRomanianPhone,
  website: optionalUrl,
  about: z.string().trim().max(2000, 'About must be at most 2000 characters'),
  avatarAlt: z.string().trim().max(120, 'Alt text must be at most 120 characters').optional(),
  isVerified: z.boolean()
});

export type FormValues = z.infer<typeof profileFormSchema>;
