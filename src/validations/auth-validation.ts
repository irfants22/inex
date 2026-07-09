import * as z from "zod";

export const registerSchemaForm = z
  .object({
    fullName: z.string("Full Name is required"),
    email: z.email("Email is required"),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords and Confirm Password do not match",
    path: ["confirmPassword"],
  });

export const loginSchemaForm = z.object({
  email: z.email("Email is required"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterForm = z.infer<typeof registerSchemaForm>;
export type LoginForm = z.infer<typeof loginSchemaForm>;
