import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Exercise {
  id: string
  name: string
  muscleGroups: string[]
  difficulty: string
  description?: string
}

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {exercise.muscleGroups.map((mg) => (
            <Badge key={mg} variant="secondary" className="text-xs">
              {mg}
            </Badge>
          ))}
        </div>
        <Badge variant="outline" className="text-xs">
          {exercise.difficulty.charAt(0) + exercise.difficulty.slice(1).toLowerCase()}
        </Badge>
        {exercise.description && (
          <p className="text-sm text-muted-foreground">{exercise.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
