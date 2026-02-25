import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export default async function trainerRoutes(fastify: FastifyInstance) {
  fastify.get('/trainer/clients', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'TRAINER') {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    const clients = await prisma.user.findMany({
      where: { trainerId: request.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: { fitnessLevel: true, goals: true, daysPerWeek: true },
        },
      },
    })

    return { clients }
  })

  fastify.get('/trainer/clients/:clientId', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'TRAINER') {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    const { clientId } = request.params as { clientId: string }

    const client = await prisma.user.findFirst({
      where: { id: clientId, trainerId: request.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        workoutPlans: {
          include: {
            weeks: {
              include: { days: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        workoutLogs: {
          include: { setLogs: true },
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    })

    if (!client) {
      return reply.status(404).send({ error: 'Client not found' })
    }

    return {
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        profile: client.profile,
        plans: client.workoutPlans,
        recentLogs: client.workoutLogs,
      },
    }
  })
}
