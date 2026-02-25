import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { anthropic } from '../lib/anthropic'

export default async function chatRoutes(fastify: FastifyInstance) {
  fastify.post('/chat', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { message } = request.body as { message: string }
    const userId = request.user.userId

    const profile = await prisma.profile.findUnique({ where: { userId } })

    await prisma.chatMessage.create({
      data: { userId, role: 'user', content: message },
    })

    const history = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })

    const messages = history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    const systemPrompt = `You are an AI personal trainer. Be encouraging, specific, and evidence-based.${
      profile
        ? ` The user's profile: fitness level: ${profile.fitnessLevel}, goals: ${profile.goals.join(', ')}, equipment: ${profile.equipment.join(', ')}, days per week: ${profile.daysPerWeek}.`
        : ''
    }`

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    let fullText = ''

    try {
      const stream = anthropic.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      })

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          fullText += event.delta.text
          reply.raw.write(`data: ${JSON.stringify({ type: 'delta', text: event.delta.text })}\n\n`)
        }
      }

      const saved = await prisma.chatMessage.create({
        data: { userId, role: 'assistant', content: fullText },
      })

      reply.raw.write(`data: ${JSON.stringify({ type: 'done', messageId: saved.id, fullText })}\n\n`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      reply.raw.write(`data: ${JSON.stringify({ type: 'error', error: errorMsg })}\n\n`)
    }

    reply.raw.end()
  })
}
