import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export default async function statRoutes(fastify: FastifyInstance) {
  fastify.post('/stats', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { date, weightKg, notes } = request.body as {
      date: string
      weightKg?: number
      notes?: string
    }

    const stat = await prisma.bodyStat.create({
      data: {
        userId: request.user.userId,
        date: new Date(date),
        weightKg: weightKg ?? null,
        notes: notes || null,
      },
    })

    return reply.status(201).send({ stat })
  })

  fastify.get('/stats', { preHandler: [fastify.authenticate] }, async (request) => {
    const { from, to } = request.query as { from?: string; to?: string }

    const where: Record<string, unknown> = { userId: request.user.userId }
    if (from || to) {
      where.date = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      }
    }

    const stats = await prisma.bodyStat.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return { stats }
  })
}
