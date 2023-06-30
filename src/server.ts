import Fastify from 'fastify';
import { JWT } from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { withRefResolver } from 'fastify-zod';
import { version } from '../package.json';
import { authSchemas } from 'features/auth/auth.schema';
import authRoutes from 'features/auth/auth.routes';
import { fastifyCors } from '@fastify/cors';
import { CONFIG } from 'config/config';
import jwtPlugin from 'plugins/jwt.plugin';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string | null;
    };
  }
}

async function buildServer() {
  const server = Fastify();

  for (const schema of [...authSchemas.schemas]) {
    server.addSchema(schema);
  }

  server.register(jwtPlugin);

  await server.register(fastifyCors, {
    origin: CONFIG.IS_DEV ? 'http://localhost:5173' : true,
  });

  await server.register(
    swagger,
    withRefResolver({
      openapi: {
        info: {
          title: 'Fastify API',
          description: 'API for some products',
          version,
        },
      },
    })
  );

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    staticCSP: true,
  });

  await server.register(authRoutes, { prefix: 'api/auth' });

  return server;
}

export default buildServer;
