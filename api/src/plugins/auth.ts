import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; email: string; role: string }
    user: { userId: string; email: string; role: string }
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch {
      reply.status(401).send({ error: 'Unauthorized' })
    }
  })
}

export default fp(authPlugin)
