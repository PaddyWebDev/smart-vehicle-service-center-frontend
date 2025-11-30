import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(5, "Name should be minimum 5 characters")
      .max(200, "Name should be maximum 200 characters"),
    email: z
      .string()
      .email()
      .min(8, {
        message: "Email must contain at least 8 character(s)",
      })
      .max(40, {
        message: "Email must contain up to 40 character(s) only",
      }),

    role: z.string().min(1, {
      message: "Role is required",
    }),
    phoneNumber: z.string().regex(/^\d{10}$/, {
      message: "Please enter a valid 10-digit phone number.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .min(8, {
      message: "Email must contain at least 8 character(s)",
    })
    .max(40, {
      message: "Email must contain up to 40 character(s) only",
    }),

  role: z.string().min(1, {
    message: "Role is required",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
