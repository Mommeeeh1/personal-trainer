import { FastifyInstance } from 'fastify'
import { Equipment, FitnessLevel } from '@prisma/client'
import { prisma } from '../lib/prisma'

export default async function profileRoutes(fastify: FastifyInstance) {
  fastify.get('/profile', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: request.user.userId },
    })
    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found' })
    }
    return profile
  })

  fastify.put('/profile', { preHandler: [fastify.authenticate] }, async (request) => {
    const data = request.body as {
      goals?: string[]
      fitnessLevel?: FitnessLevel
      equipment?: Equipment[]
      daysPerWeek?: number
      sessionLength?: number
      weightKg?: number
      heightCm?: number
      age?: number
    }

    const profile = await prisma.profile.upsert({
      where: { userId: request.user.userId },
      update: data,
      create: { userId: request.user.userId, ...data },
    })
    return profile
  })
}
