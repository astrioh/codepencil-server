import { FastifyRequest, FastifyReply } from 'fastify';
import fjwt from '@fastify/jwt';
import { CONFIG } from '../config/config';
import fp from 'fastify-plugin';

export default fp((server) => {
  server.register(fjwt, {
    secret: CONFIG.JWT_SECRET,
  });

  server.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (e) {
        return reply.send(e);
      }
    }
  );

  server.addHook('preHandler', (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });
});
