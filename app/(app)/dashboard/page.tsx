'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api-client'

interface PlanDay {
  id: string
  dayNumber: number
  name: string
  exercises: { exercise: { name: string } }[]
}

interface Plan {
  id: string
  name: string
  isActive: boolean
  weeks: { days: PlanDay[] }[]
}

export default function DashboardPage() {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [todayDay, setTodayDay] = useState<PlanDay | null>(null)
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { plans } = await apiFetch<{ plans: Plan[] }>('/plans')
        const active = plans.find((p) => p.isActive) || plans[0]
        if (active) {
          setPlan(active)
          const dayOfWeek = new Date().getDay() || 7
          const allDays = active.weeks.flatMap((w) => w.days)
          const today = allDays.find((d) => d.dayNumber === dayOfWeek) || allDays[0]
          if (today) setTodayDay(today)
        }

        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        weekStart.setHours(0, 0, 0, 0)
        const { logs } = await apiFetch<{ logs: unknown[]; total: number }>(
          `/logs?from=${weekStart.toISOString()}&limit=50`
        )
        setWorkoutsThisWeek(logs.length)
      } catch {
        // API might not be running
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Active Plan</CardDescription>
            <CardTitle>{plan?.name || 'No plan yet'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Workouts This Week</CardDescription>
            <CardTitle>{workoutsThisWeek}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Today</CardDescription>
            <CardTitle>{todayDay?.name || 'Rest day'}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {todayDay && (
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Workout</CardTitle>
            <CardDescription>{todayDay.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayDay.exercises?.map((ex, i) => (
              <div key={i} className="text-sm">{ex.exercise.name}</div>
            ))}
            <Link href={`/workout/${todayDay.id}`}>
              <Button className="mt-4">Start Workout</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Link href="/plan">
          <Button variant="outline">View Plan</Button>
        </Link>
        <Link href="/chat">
          <Button variant="outline">Chat with AI</Button>
        </Link>
      </div>
    </div>
  )
}
