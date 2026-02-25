import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export default async function exerciseRoutes(fastify: FastifyInstance) {
  fastify.get('/exercises', { preHandler: [fastify.authenticate] }, async (request) => {
    const { muscleGroup, difficulty, search } = request.query as {
      muscleGroup?: string
      difficulty?: string
      search?: string
    }

    const where: Record<string, unknown> = {}
    if (muscleGroup) {
      where.muscleGroups = { has: muscleGroup }
    }
    if (difficulty) {
      where.difficulty = difficulty
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    const exercises = await prisma.exercise.findMany({ where })
    return { exercises }
  })
}
