import { z } from "zod";
import { USER_ROLES } from "@/lib/permissions";

export const signUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Keep it under 72 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const roleSelectSchema = z.object({
  role: z.enum([USER_ROLES.brand, USER_ROLES.creator]),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Keep it under 72 characters"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type RoleSelectInput = z.infer<typeof roleSelectSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
