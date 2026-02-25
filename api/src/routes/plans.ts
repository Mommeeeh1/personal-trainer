import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { anthropic } from '../lib/anthropic'

export default async function planRoutes(fastify: FastifyInstance) {
  fastify.get('/plans', { preHandler: [fastify.authenticate] }, async (request) => {
    const plans = await prisma.workoutPlan.findMany({
      where: { userId: request.user.userId },
      include: {
        weeks: {
          orderBy: { weekNumber: 'asc' },
          include: {
            days: { orderBy: { dayNumber: 'asc' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return { plans }
  })

  fastify.post('/plans/generate', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: request.user.userId },
    })
    if (!profile) {
      return reply.status(400).send({ error: 'Complete your profile before generating a plan' })
    }

    const exercises = await prisma.exercise.findMany()
    const exerciseNames = exercises.map((e) => e.name)

    const prompt = `Create a workout plan for someone with the following profile:
- Fitness level: ${profile.fitnessLevel}
- Goals: ${profile.goals.join(', ')}
- Available equipment: ${profile.equipment.join(', ')}
- Days per week: ${profile.daysPerWeek}
- Session length: ${profile.sessionLength} minutes
${profile.weightKg ? `- Weight: ${profile.weightKg}kg` : ''}
${profile.age ? `- Age: ${profile.age}` : ''}

Available exercises in the database: ${exerciseNames.join(', ')}

Return a JSON object (no markdown, just raw JSON) with this exact structure:
{ "name": "Plan Name", "weeks": [{ "weekNumber": 1, "days": [{ "dayNumber": 1, "name": "Day Name", "isRest": false, "exercises": [{ "exerciseName": "exact exercise name from list", "sets": 3, "reps": "8-12", "restSeconds": 60, "notes": "optional note" }] }] }] }

Use ONLY exercise names from the provided list. Create ${profile.daysPerWeek} training days per week with rest days filling the remaining days. Plan should be 4 weeks.`

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return reply.status(500).send({ error: 'Unexpected AI response' })
    }

    let planData: {
      name: string
      weeks: {
        weekNumber: number
        days: {
          dayNumber: number
          name: string
          isRest: boolean
          exercises?: { exerciseName: string; sets: number; reps: string; restSeconds: number; notes?: string }[]
        }[]
      }[]
    }
    try {
      planData = JSON.parse(content.text)
    } catch {
      return reply.status(500).send({ error: 'Failed to parse AI response' })
    }

    const exerciseMap = new Map(exercises.map((e) => [e.name.toLowerCase(), e]))

    const plan = await prisma.workoutPlan.create({
      data: {
        userId: request.user.userId,
        name: planData.name,
        generatedByAI: true,
        weeks: {
          create: planData.weeks.map((week) => ({
            weekNumber: week.weekNumber,
            days: {
              create: week.days.map((day) => ({
                dayNumber: day.dayNumber,
                name: day.name,
                isRest: day.isRest,
                exercises: {
                  create: (day.exercises || [])
                    .map((ex, idx) => {
                      const exercise = exerciseMap.get(ex.exerciseName.toLowerCase())
                      if (!exercise) return null
                      return {
                        exerciseId: exercise.id,
                        sets: ex.sets,
                        reps: ex.reps,
                        restSeconds: ex.restSeconds,
                        order: idx + 1,
                        notes: ex.notes || null,
                      }
                    })
                    .filter((e): e is NonNullable<typeof e> => e !== null),
                },
              })),
            },
          })),
        },
      },
      include: {
        weeks: {
          orderBy: { weekNumber: 'asc' },
          include: {
            days: {
              orderBy: { dayNumber: 'asc' },
              include: {
                exercises: {
                  orderBy: { order: 'asc' },
                  include: { exercise: true },
                },
              },
            },
          },
        },
      },
    })

    return reply.status(201).send({ plan })
  })

  fastify.get('/plans/:planId', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { planId } = request.params as { planId: string }

    const plan = await prisma.workoutPlan.findUnique({
      where: { id: planId },
      include: {
        weeks: {
          orderBy: { weekNumber: 'asc' },
          include: {
            days: {
              orderBy: { dayNumber: 'asc' },
              include: {
                exercises: {
                  orderBy: { order: 'asc' },
                  include: { exercise: true },
                },
              },
            },
          },
        },
      },
    })

    if (!plan) {
      return reply.status(404).send({ error: 'Plan not found' })
    }
    if (plan.userId !== request.user.userId) {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    return { plan }
  })

  fastify.delete('/plans/:planId', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { planId } = request.params as { planId: string }

    const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } })
    if (!plan) {
      return reply.status(404).send({ error: 'Plan not found' })
    }
    if (plan.userId !== request.user.userId) {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    await prisma.workoutPlan.delete({ where: { id: planId } })
    return { success: true }
  })
}
