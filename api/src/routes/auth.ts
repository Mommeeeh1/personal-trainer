import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', async (request, reply) => {
    const { email, password, name, role } = request.body as {
      email: string
      password: string
      name: string
      role?: 'USER' | 'TRAINER'
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return reply.status(409).send({ error: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, name, role: role || 'USER', password: hashedPassword },
    })

    const accessToken = fastify.jwt.sign({ userId: user.id, email: user.email, role: user.role })
    return reply.status(201).send({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
    })
  })

  fastify.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    const accessToken = fastify.jwt.sign({ userId: user.id, email: user.email, role: user.role })
    return reply.send({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
    })
  })

  fastify.get('/auth/me', { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    })
    return user
  })
}
