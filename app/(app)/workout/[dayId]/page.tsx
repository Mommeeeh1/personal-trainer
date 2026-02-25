'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { apiFetch } from '@/lib/api-client'

interface PlanExercise {
  id: string
  sets: number
  reps: number
  restSeconds: number
  exercise: {
    id: string
    name: string
    muscleGroups: string[]
  }
}

interface PlanDay {
  id: string
  name: string
  exercises: PlanExercise[]
}

interface SetLog {
  exerciseId: string
  setNumber: number
  weight: number
  reps: number
  done: boolean
}

export default function WorkoutPage() {
  const params = useParams()
  const router = useRouter()
  const dayId = params.dayId as string
  const [day, setDay] = useState<PlanDay | null>(null)
  const [setLogs, setSetLogs] = useState<SetLog[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { plans } = await apiFetch<{ plans: { weeks: { days: PlanDay[] }[] }[] }>('/plans')
        for (const plan of plans) {
          for (const week of plan.weeks) {
            const found = week.days.find((d) => d.id === dayId)
            if (found) {
              setDay(found)
              const logs: SetLog[] = []
              for (const ex of found.exercises) {
                for (let s = 1; s <= ex.sets; s++) {
                  logs.push({
                    exerciseId: ex.exercise.id,
                    setNumber: s,
                    weight: 0,
                    reps: ex.reps,
                    done: false,
                  })
                }
              }
              setSetLogs(logs)
              return
            }
          }
        }
      } catch {
        // API not available
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dayId])

  function updateSet(exerciseId: string, setNumber: number, field: 'weight' | 'reps' | 'done', value: number | boolean) {
    setSetLogs((prev) =>
      prev.map((s) =>
        s.exerciseId === exerciseId && s.setNumber === setNumber
          ? { ...s, [field]: value }
          : s
      )
    )
  }

  async function handleComplete() {
    setSubmitting(true)
    setError('')
    try {
      await apiFetch('/logs', {
        method: 'POST',
        body: JSON.stringify({
          dayId,
          sets: setLogs.filter((s) => s.done),
          completedAt: new Date().toISOString(),
        }),
      })
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log workout')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>
  if (!day) return <div className="text-muted-foreground">Workout day not found.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{day.name}</h1>
        <Button onClick={handleComplete} disabled={submitting}>
          {submitting ? 'Saving...' : 'Complete Workout'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {day.exercises.map((ex) => {
        const exerciseSets = setLogs.filter((s) => s.exerciseId === ex.exercise.id)
        return (
          <Card key={ex.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {ex.exercise.name}
                <Badge variant="outline" className="text-xs">
                  {ex.sets} x {ex.reps}
                </Badge>
              </CardTitle>
              <div className="flex gap-1">
                {ex.exercise.muscleGroups?.map((mg) => (
                  <Badge key={mg} variant="secondary" className="text-xs">
                    {mg}
                  </Badge>
                ))}
              </div>
              {ex.restSeconds > 0 && (
                <p className="text-xs text-muted-foreground">Rest: {ex.restSeconds}s</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground">
                  <span>Set</span><span>Weight (kg)</span><span>Reps</span><span>Done</span>
                </div>
                {exerciseSets.map((s) => (
                  <div key={s.setNumber} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2">
                    <span className="w-8 text-sm font-medium">{s.setNumber}</span>
                    <Input
                      type="number"
                      min={0}
                      value={s.weight || ''}
                      onChange={(e) => updateSet(s.exerciseId, s.setNumber, 'weight', Number(e.target.value))}
                      placeholder="0"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={s.reps || ''}
                      onChange={(e) => updateSet(s.exerciseId, s.setNumber, 'reps', Number(e.target.value))}
                    />
                    <input
                      type="checkbox"
                      checked={s.done}
                      onChange={(e) => updateSet(s.exerciseId, s.setNumber, 'done', e.target.checked)}
                      className="size-5 rounded"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
