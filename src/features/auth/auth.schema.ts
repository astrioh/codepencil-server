import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const userCore = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  name: z.string().nullable(),
};

const registerSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string(),
});

const userResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

const loginResponseSchema = z.object({
  user: userResponseSchema,
  jwt: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

const registerResponseSchema = z.object({
  user: userResponseSchema,
  jwt: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

export type CreateUserInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type GetCurrentUserResponse = z.infer<typeof userResponseSchema>;

export const authSchemas = buildJsonSchemas({
  registerSchema,
  registerResponseSchema,
  loginSchema,
  loginResponseSchema,
  userResponseSchema,
});
