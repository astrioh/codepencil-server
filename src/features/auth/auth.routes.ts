import { FastifyInstance } from 'fastify';
import { loginHandler, registerUserHandler } from './auth.controller';
import { authSchemas } from './auth.schema';

async function authRoutes(server: FastifyInstance) {
  server.post(
    '/register',
    {
      schema: {
        body: authSchemas.$ref('registerSchema'),
        response: {
          201: authSchemas.$ref('registerResponseSchema'),
        },
      },
    },
    registerUserHandler
  );

  server.post(
    '/login',
    {
      schema: {
        body: authSchemas.$ref('loginSchema'),
        response: {
          200: authSchemas.$ref('loginResponseSchema'),
        },
      },
    },
    loginHandler
  );
}

export default authRoutes;
