'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/api-client'

interface Stat {
  id: string
  date: string
  weightKg: number
}

export default function ProgressPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [logCount, setLogCount] = useState(0)
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [statsData, logsData] = await Promise.all([
          apiFetch<{ stats: Stat[] }>('/stats'),
          apiFetch<{ logs: unknown[]; total: number }>('/logs?limit=1'),
        ])
        setStats(statsData.stats)
        setLogCount(logsData.total)
      } catch {
        // API not available
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleAddStat(e: React.FormEvent) {
    e.preventDefault()
    if (!weight) return
    setSaving(true)
    setError('')
    try {
      const stat = await apiFetch<Stat>('/stats', {
        method: 'POST',
        body: JSON.stringify({ date, weightKg: Number(weight) }),
      })
      setStats((prev) => [stat, ...prev])
      setWeight('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Progress</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Total Workouts</CardDescription>
            <CardTitle>{logCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Latest Weight</CardDescription>
            <CardTitle>
              {stats.length > 0 ? `${stats[0].weightKg} kg` : 'No data'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Body Weight</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <form onSubmit={handleAddStat} className="flex items-end gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70.0"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Add'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weight History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="py-2">{new Date(s.date).toLocaleDateString()}</td>
                      <td className="py-2">{s.weightKg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
