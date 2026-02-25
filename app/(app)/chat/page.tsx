'use client'

import { ChatInterface } from '@/components/chat/chat-interface'

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <h1 className="mb-4 text-3xl font-bold">AI Coach</h1>
      <ChatInterface />
    </div>
  )
}
