'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiFetch } from '@/lib/api-client'

interface PlanDay {
  id: string
  dayNumber: number
  name: string
}

interface PlanWeek {
  id: string
  weekNumber: number
  days: PlanDay[]
}

interface Plan {
  id: string
  name: string
  isActive: boolean
  weeks: PlanWeek[]
}

export default function PlanPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    try {
      const data = await apiFetch<{ plans: Plan[] }>('/plans')
      setPlans(data.plans)
    } catch {
      // API not available
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    setError('')
    try {
      await apiFetch('/plans/generate', { method: 'POST' })
      await loadPlans()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan')
    } finally {
      setGenerating(false)
    }
  }

  async function handleDelete(planId: string) {
    try {
      await apiFetch(`/plans/${planId}`, { method: 'DELETE' })
      setPlans((prev) => prev.filter((p) => p.id !== planId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete plan')
    }
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Training Plans</h1>
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? 'Generating...' : 'Generate New Plan'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No training plans yet.</p>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating your AI plan...' : 'Generate your AI plan'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle>{plan.name}</CardTitle>
                {plan.isActive && <Badge variant="secondary">Active</Badge>}
              </div>
              <CardDescription>{plan.weeks.length} week(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.weeks.map((week) => (
                <div key={week.id}>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Week {week.weekNumber}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {week.days.map((day) => (
                      <Link
                        key={day.id}
                        href={`/workout/${day.id}`}
                        className="rounded-lg border p-3 text-sm transition-colors hover:bg-accent"
                      >
                        <span className="font-medium">{day.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="destructive" size="sm" onClick={() => handleDelete(plan.id)}>
                Delete Plan
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
