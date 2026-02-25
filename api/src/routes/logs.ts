import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export default async function logRoutes(fastify: FastifyInstance) {
  fastify.post('/logs', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { planDayId, date, sets, notes, durationMin } = request.body as {
      planDayId?: string
      date: string
      sets: { exerciseId: string; setNumber: number; weightKg?: number; reps?: number; done: boolean }[]
      notes?: string
      durationMin?: number
    }

    const log = await prisma.workoutLog.create({
      data: {
        userId: request.user.userId,
        planDayId: planDayId || null,
        date: new Date(date),
        notes: notes || null,
        durationMin: durationMin || null,
        setLogs: {
          create: sets.map((s) => ({
            exerciseId: s.exerciseId,
            setNumber: s.setNumber,
            weightKg: s.weightKg ?? null,
            reps: s.reps ?? null,
            done: s.done,
          })),
        },
      },
      include: { setLogs: true },
    })

    return reply.status(201).send({ log })
  })

  fastify.get('/logs', { preHandler: [fastify.authenticate] }, async (request) => {
    const { from, to, limit, offset } = request.query as {
      from?: string
      to?: string
      limit?: string
      offset?: string
    }

    const where: Record<string, unknown> = { userId: request.user.userId }
    if (from || to) {
      where.date = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      }
    }

    const [logs, total] = await Promise.all([
      prisma.workoutLog.findMany({
        where,
        include: { setLogs: true, planDay: true },
        orderBy: { date: 'desc' },
        take: Number(limit) || 20,
        skip: Number(offset) || 0,
      }),
      prisma.workoutLog.count({ where }),
    ])

    return { logs, total }
  })
}
