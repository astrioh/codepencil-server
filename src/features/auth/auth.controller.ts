import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyPassword } from '../../utils/hash';
import type {
  CreateUserInput,
  GetCurrentUserResponse,
  LoginInput,
  LoginResponse,
  RegisterResponse,
} from './auth.schema';
import { createUser, findUserByEmail, signAndSetTokens } from './auth.service';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);

    const tokens = await signAndSetTokens(
      { id: user.id, email: user.email, name: user.name },
      request.jwt
    );

    const result: RegisterResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      jwt: tokens,
    };

    return reply.code(201).send(result);
  } catch (e) {
    if (e instanceof Error) {
      return reply.code(500).send({ message: e.message });
    }
    throw e;
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: 'Invalid email or password',
    });
  }

  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    const tokens = await signAndSetTokens(
      { id: user.id, email: user.email, name: user.name },
      request.jwt
    );

    const result: LoginResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      jwt: tokens,
    };

    return result;
  }

  return reply.code(401).send({
    message: 'Invalid email or password',
  });
}

export async function getCurrentUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userEmail = request.user.email;
  const user = await findUserByEmail(userEmail);

  if (!user) {
    return reply.code(404).send({ message: 'User not found' });
  }

  const result: GetCurrentUserResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return result;
}
