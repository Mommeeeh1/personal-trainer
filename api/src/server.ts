import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import dotenv from 'dotenv'
import authPlugin from './plugins/auth'
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import exerciseRoutes from './routes/exercises'
import planRoutes from './routes/plans'
import logRoutes from './routes/logs'
import statRoutes from './routes/stats'
import chatRoutes from './routes/chat'
import trainerRoutes from './routes/trainer'

dotenv.config()

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: import('fastify').FastifyRequest, reply: import('fastify').FastifyReply) => Promise<void>
  }
}

const server = Fastify({ logger: true })

server.get('/health', async () => ({ status: 'ok' }))

const start = async () => {
  try {
    await server.register(cors, {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    })
    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'dev-secret',
    })
    await server.register(authPlugin)

    await server.register(authRoutes, { prefix: '/api' })
    await server.register(profileRoutes, { prefix: '/api' })
    await server.register(exerciseRoutes, { prefix: '/api' })
    await server.register(planRoutes, { prefix: '/api' })
    await server.register(logRoutes, { prefix: '/api' })
    await server.register(statRoutes, { prefix: '/api' })
    await server.register(chatRoutes, { prefix: '/api' })
    await server.register(trainerRoutes, { prefix: '/api' })

    await server.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
