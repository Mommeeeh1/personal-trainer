'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiFetch, getUser } from '@/lib/api-client'

interface Client {
  id: string
  name: string
  email: string
  profile?: {
    fitnessLevel?: string
    goals?: string[]
  }
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (!user || user.role !== 'TRAINER') {
      router.push('/dashboard')
      return
    }
    async function load() {
      try {
        const data = await apiFetch<{ clients: Client[] }>('/trainer/clients')
        setClients(data.clients)
      } catch {
        // API not available
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clients</h1>

      {clients.length === 0 ? (
        <p className="text-muted-foreground">No clients yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <CardTitle>{client.name}</CardTitle>
                <CardDescription>{client.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {client.profile?.fitnessLevel && (
                  <Badge variant="secondary">
                    {client.profile.fitnessLevel}
                  </Badge>
                )}
                {client.profile?.goals && client.profile.goals.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {client.profile.goals.map((g) => (
                      <Badge key={g} variant="outline" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
