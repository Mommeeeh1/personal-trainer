'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/api-client'

const FITNESS_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
const GOALS = ['Lose weight', 'Build muscle', 'Improve endurance', 'Increase flexibility', 'General fitness']
const EQUIPMENT = [
  'NONE', 'DUMBBELLS', 'BARBELL', 'KETTLEBELL', 'RESISTANCE_BANDS',
  'PULL_UP_BAR', 'BENCH', 'CABLES', 'FULL_GYM',
]
const SESSION_LENGTHS = [30, 45, 60, 90]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [fitnessLevel, setFitnessLevel] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [equipment, setEquipment] = useState<string[]>([])
  const [daysPerWeek, setDaysPerWeek] = useState(3)
  const [sessionLength, setSessionLength] = useState(45)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function toggleGoal(g: string) {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
  }

  function toggleEquipment(e: string) {
    setEquipment((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]))
  }

  async function handleFinish() {
    setError('')
    setLoading(true)
    try {
      await apiFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fitnessLevel,
          goals,
          equipment,
          daysPerWeek,
          sessionLength,
        }),
      })
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Set up your profile</CardTitle>
          <CardDescription>Step {step} of 3</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <Label>Fitness Level</Label>
              <div className="grid gap-3">
                {FITNESS_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFitnessLevel(level)}
                    className={`rounded-lg border p-4 text-left text-sm font-medium transition-colors ${
                      fitnessLevel === level
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label>Goals (select all that apply)</Label>
              <div className="grid gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      goals.includes(g)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Equipment available</Label>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => toggleEquipment(e)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        equipment.includes(e)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {e.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Days per week: {daysPerWeek}</Label>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span><span>7</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Session length</Label>
                <div className="flex gap-2">
                  {SESSION_LENGTHS.map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setSessionLength(len)}
                      className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                        sessionLength === len
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {len} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !fitnessLevel}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={loading}>
              {loading ? 'Saving...' : 'Finish'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
