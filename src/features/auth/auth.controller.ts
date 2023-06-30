import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyPassword } from '../../utils/hash';
import type { CreateUserInput, LoginInput } from './auth.schema';
import { createUser, findUserByEmail, setRefreshToken } from './auth.service';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
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
    const { id, name, email } = user;

    const accessToken = request.jwt.sign(
      { id, name, email },
      { expiresIn: '1h' }
    );

    const refreshToken = request.jwt.sign(
      { id, name, email },
      { expiresIn: '30d' }
    );

    await setRefreshToken({ id, refreshToken });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  return reply.code(401).send({
    message: 'Invalid email or password',
  });
}
