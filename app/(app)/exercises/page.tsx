'use client'

import { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExerciseCard } from '@/components/workout/exercise-card'
import { apiFetch } from '@/lib/api-client'

interface Exercise {
  id: string
  name: string
  muscleGroups: string[]
  difficulty: string
  description?: string
}

const MUSCLE_GROUPS = [
  'ALL', 'CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS',
  'LEGS', 'GLUTES', 'ABS', 'CALVES', 'FOREARMS',
]
const DIFFICULTIES = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [search, setSearch] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('ALL')
  const [difficulty, setDifficulty] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const loadExercises = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (muscleGroup !== 'ALL') params.set('muscleGroup', muscleGroup)
      if (difficulty !== 'ALL') params.set('difficulty', difficulty)
      const qs = params.toString()
      const data = await apiFetch<{ exercises: Exercise[] }>(`/exercises${qs ? `?${qs}` : ''}`)
      setExercises(data.exercises)
    } catch {
      // API not available
    } finally {
      setLoading(false)
    }
  }, [search, muscleGroup, difficulty])

  useEffect(() => {
    const timer = setTimeout(loadExercises, 300)
    return () => clearTimeout(timer)
  }, [loadExercises])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Exercises</h1>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={muscleGroup} onValueChange={setMuscleGroup}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Muscle group" />
          </SelectTrigger>
          <SelectContent>
            {MUSCLE_GROUPS.map((mg) => (
              <SelectItem key={mg} value={mg}>
                {mg === 'ALL' ? 'All muscles' : mg.charAt(0) + mg.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d}>
                {d === 'ALL' ? 'All levels' : d.charAt(0) + d.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : exercises.length === 0 ? (
        <div className="text-muted-foreground">No exercises found.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  )
}
