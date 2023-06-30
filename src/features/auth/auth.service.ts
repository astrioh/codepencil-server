import { hashPassword } from '../../utils/hash';
import prisma from '../../utils/prisma';
import type { CreateUserInput } from './auth.schema';

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash },
  });

  return user;
}

export async function setRefreshToken(data: {
  id: number;
  refreshToken: string;
}) {
  const user = await prisma.user.update({
    data: {
      refreshToken: data.refreshToken,
    },
    where: {
      id: data.id,
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}
