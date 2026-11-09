import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters.")
  .max(80, "Name must be 80 characters or fewer.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email must be 254 characters or fewer.")
  .pipe(z.email());

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be 128 characters or fewer."),
  isAdmin: z.boolean().default(false),
});

export const updateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  isAdmin: z.boolean(),
});

export const userIdSchema = z.string().min(1);

export type AdminFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};
