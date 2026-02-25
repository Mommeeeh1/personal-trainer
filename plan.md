# Personal Trainer App — Build Plan

## What We're Building

A full-stack AI personal trainer application where users get personalized workout plans, track progress, and chat with an AI coach. Trainers can manage multiple clients. Built with **Next.js** (frontend), **Fastify** (backend API), **Prisma** + **ZenStack** (database with row-level security), and **Anthropic Claude** (AI chat + plan generation).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router, shadcn/ui, Tailwind CSS v4 |
| Backend | Fastify v4, @fastify/jwt, @fastify/cors |
| ORM | Prisma v5 (PostgreSQL) |
| Access Control | ZenStack v2 (`.zmodel` schema, row-level policies) |
| AI | Anthropic Claude via `@anthropic-ai/sdk` |
| Validation | Zod |
| Auth | JWT (access token in header, refresh token in cookie) |

---

## Repository Structure

```
personal-trainer/
├── api/                        # Fastify backend
│   ├── src/
│   │   ├── server.ts           # Fastify app entry point
│   │   ├── plugins/
│   │   │   ├── auth.ts         # JWT plugin + decorators
│   │   │   └── zenstack.ts     # ZenStack enhanced prisma
│   │   ├── routes/
│   │   │   ├── auth.ts         # POST /auth/register, /auth/login, /auth/refresh
│   │   │   ├── profile.ts      # GET/PUT /profile
│   │   │   ├── exercises.ts    # GET /exercises (with filters)
│   │   │   ├── plans.ts        # CRUD + AI generation /plans
│   │   │   ├── workouts.ts     # GET /plans/:id/days/:dayId, log workout
│   │   │   ├── logs.ts         # POST /logs, GET /logs
│   │   │   ├── stats.ts        # POST/GET /stats (body measurements)
│   │   │   ├── chat.ts         # POST /chat (SSE streaming)
│   │   │   └── trainer.ts      # GET/POST /trainer/clients
│   │   └── lib/
│   │       ├── prisma.ts       # Singleton Prisma client
│   │       └── anthropic.ts    # Anthropic client
│   ├── .env.example
│   └── package.json
│
├── prisma/
│   ├── schema.prisma           # Prisma schema (already exists)
│   └── seed.ts                 # Exercise seed data (already exists)
│
├── schema.zmodel               # ZenStack schema extending Prisma (NEW — root level)
│
├── app/                        # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── onboarding/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx          # Authenticated layout with sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── plan/page.tsx
│   │   ├── workout/[dayId]/page.tsx
│   │   ├── exercises/page.tsx
│   │   ├── progress/page.tsx
│   │   └── chat/page.tsx
│   └── (trainer)/
│       └── clients/page.tsx
│
├── components/
│   ├── ui/                     # shadcn components (already exist)
│   ├── chat/
│   │   └── chat-interface.tsx  # SSE streaming chat UI
│   ├── workout/
│   │   ├── exercise-card.tsx
│   │   ├── day-view.tsx
│   │   └── log-set-form.tsx
│   └── charts/
│       └── progress-chart.tsx
│
└── lib/
    ├── api-client.ts           # Fetch wrapper for Fastify API
    └── auth.ts                 # Token storage + refresh logic
```

---

## Database Schema (ZenStack)

The `.zmodel` file at the root extends the existing `prisma/schema.prisma` with access control policies.

### Access Policies

```
User:
  - read own record
  - trainer can read their clients' records
  - admin can read all

Profile:
  - owner can read/write
  - trainer can read their clients' profiles

WorkoutPlan, PlanWeek, PlanDay, WorkoutExercise:
  - owner can CRUD
  - trainer can read/write for their clients

WorkoutLog, SetLog, BodyStat:
  - owner can CRUD
  - trainer can read for their clients

ChatMessage:
  - owner can CRUD (no trainer access — private)

Exercise:
  - anyone authenticated can read
  - admin can create/update/delete
```

---

## API Contracts

### Auth Routes

**POST /api/auth/register**
```json
Request:  { "email": "string", "password": "string", "name": "string", "role": "USER|TRAINER" }
Response: { "user": { "id": "string", "email": "string", "name": "string", "role": "string" }, "accessToken": "string" }
Errors:   409 { "error": "Email already in use" }
          422 { "error": "Validation failed", "details": [...] }
```

**POST /api/auth/login**
```json
Request:  { "email": "string", "password": "string" }
Response: { "user": { "id": "string", "email": "string", "name": "string", "role": "string" }, "accessToken": "string" }
Errors:   401 { "error": "Invalid credentials" }
```

**GET /api/auth/me**
```json
Headers:  Authorization: Bearer <token>
Response: { "id": "string", "email": "string", "name": "string", "role": "string" }
Errors:   401 { "error": "Unauthorized" }
```

### Profile Routes

**GET /api/profile**
```json
Headers:  Authorization: Bearer <token>
Response: { "id": "string", "userId": "string", "bio": "string|null", "fitnessLevel": "BEGINNER|INTERMEDIATE|ADVANCED", "goals": ["string"], "equipment": ["string"], "preferredDays": 3, "sessionDuration": 60 }
Errors:   404 { "error": "Profile not found" }
```

**PUT /api/profile**
```json
Request:  { "bio"?: "string", "fitnessLevel"?: "BEGINNER|INTERMEDIATE|ADVANCED", "goals"?: ["string"], "equipment"?: ["string"], "preferredDays"?: 1-7, "sessionDuration"?: 30-120 }
Response: { "id": "string", ...updated profile fields }
```

### Exercise Routes

**GET /api/exercises**
```json
Query:    ?muscleGroup=CHEST&difficulty=BEGINNER&equipment=DUMBBELLS&search=curl
Response: { "exercises": [{ "id": "string", "name": "string", "description": "string", "instructions": "string", "videoUrl": "string|null", "muscleGroups": ["string"], "equipment": "string", "difficulty": "string", "imageUrl": "string|null" }] }
```

### Plan Routes

**GET /api/plans**
```json
Headers:  Authorization: Bearer <token>
Response: { "plans": [{ "id": "string", "name": "string", "description": "string|null", "isAiGenerated": boolean, "createdAt": "ISO string", "weeks": [{ "id": "string", "weekNumber": 1, "days": [{ "id": "string", "dayNumber": 1, "focus": "string|null" }] }] }] }
```

**POST /api/plans/generate**
```json
Request:  { "prompt"?: "string" }  // optional override, otherwise uses profile
Response: { "plan": { "id": "string", "name": "string", ...full plan with weeks/days/exercises } }
// AI generates based on user's profile (goals, equipment, fitness level, preferredDays)
Errors:   400 { "error": "Complete your profile before generating a plan" }
```

**GET /api/plans/:planId**
```json
Response: { "plan": { "id": "string", "name": "string", "weeks": [{ "days": [{ "exercises": [{ "id": "string", "order": 1, "sets": 3, "reps": 10, "restSeconds": 60, "notes": "string|null", "exercise": { ...exercise object } }] }] }] } }
```

**DELETE /api/plans/:planId**
```json
Response: { "success": true }
```

### Workout Log Routes

**POST /api/logs**
```json
Request:  { "planDayId": "string", "date": "ISO string", "sets": [{ "workoutExerciseId": "string", "setNumber": 1, "weight": 50.0, "reps": 10, "completed": true }], "notes"?: "string" }
Response: { "log": { "id": "string", "date": "ISO string", "planDayId": "string", "sets": [...] } }
```

**GET /api/logs**
```json
Query:    ?from=ISO&to=ISO&limit=20&offset=0
Response: { "logs": [{ "id": "string", "date": "ISO string", "completedAt": "ISO string|null", "planDay": { "focus": "string|null", "dayNumber": 1 }, "sets": [...] }], "total": 42 }
```

### Body Stats Routes

**POST /api/stats**
```json
Request:  { "date": "ISO string", "weight"?: 75.5, "bodyFat"?: 18.5, "measurements"?: { "chest"?: 100, "waist"?: 80, "hips"?: 95 } }
Response: { "stat": { "id": "string", "date": "ISO string", "weight": 75.5, ... } }
```

**GET /api/stats**
```json
Query:    ?from=ISO&to=ISO
Response: { "stats": [{ "id": "string", "date": "ISO string", "weight": 75.5, "bodyFat": 18.5, "measurements": {...} }] }
```

### Chat Route (SSE Streaming)

**POST /api/chat**
```json
Headers:  Authorization: Bearer <token>, Accept: text/event-stream
Request:  { "message": "string" }
Response: SSE stream
  event: delta
  data: {"text": "string chunk"}

  event: done
  data: {"messageId": "string", "fullText": "string"}

  event: error
  data: {"error": "string"}
```

### Trainer Routes

**GET /api/trainer/clients**
```json
Headers:  Authorization: Bearer <token>  (role must be TRAINER)
Response: { "clients": [{ "id": "string", "name": "string", "email": "string", "profile": { "fitnessLevel": "string", "goals": [...] } }] }
```

**POST /api/trainer/clients/:clientId/assign**
```json
Request:  {}
Response: { "success": true }
```

---

## Frontend Pages

### (auth) Routes

**`/login`** — Email + password form. On success stores accessToken in localStorage, redirects to `/dashboard`.

**`/signup`** — Name, email, password, role selection (User/Trainer). On success redirects to `/onboarding`.

**`/onboarding`** — Multi-step form: fitness level → goals (multi-select) → equipment (multi-select) → preferred days/session duration. Creates profile. Redirects to `/dashboard`.

### (app) Routes — All require auth

**`/dashboard`** — Today's workout card (from active plan), recent stats summary, quick nav to plan/chat/progress.

**`/plan`** — Active workout plan view. Shows weeks/days. Click day to go to `/workout/[dayId]`. Button to generate AI plan if none exists.

**`/workout/[dayId]`** — Day's exercises. For each exercise: sets × reps, weight input, checkbox to mark set complete. Submit logs the session.

**`/exercises`** — Browse exercise library. Filter by muscle group, difficulty, equipment. Search by name.

**`/progress`** — Body stats chart (weight over time). Workout completion streak. PR tracking.

**`/chat`** — AI chat interface. Shows message history. Text input at bottom. AI responses stream in real-time via SSE. Context-aware (knows user profile and recent logs).

### (trainer) Routes — Role = TRAINER only

**`/clients`** — List of assigned clients. Click to view client's profile, plan, and recent logs.

---

## Key Implementation Details

### ZenStack Setup

1. Create `schema.zmodel` at project root that duplicates `prisma/schema.prisma` structure with `@@allow` rules
2. Run `npx zenstack generate` to produce enhanced Prisma client
3. In Fastify: create ZenStack-enhanced client per request using the authenticated user's context

```typescript
// In each route handler:
const db = enhance(prisma, { user: request.user });
// All queries automatically filtered by access policies
```

### JWT Auth Flow

- On login: sign JWT with `{ userId, email, role }`, return in response body
- Frontend: store in localStorage, send as `Authorization: Bearer <token>` header
- Fastify: `@fastify/jwt` plugin verifies token, decorates `request.user`
- Protected routes: `preHandler: [fastify.authenticate]`

### AI Chat Implementation

- POST /api/chat receives message, creates Anthropic streaming request
- Streams SSE chunks back to client
- After stream completes, saves full conversation to `ChatMessage` table
- System prompt includes user's profile + recent workout data for context

### AI Plan Generation

- POST /api/plans/generate reads user's profile
- Sends structured prompt to Claude asking for a workout plan JSON
- Parses response and creates `WorkoutPlan` → `PlanWeek` → `PlanDay` → `WorkoutExercise` records
- Links exercises to existing `Exercise` records from the database

### Frontend Auth

```typescript
// lib/api-client.ts
const apiFetch = (path, options) => fetch(`http://localhost:3001/api${path}`, {
  ...options,
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, ...options?.headers }
})
```

---

## Acceptance Criteria

### Auth
- [ ] User can register with email/password
- [ ] User can log in and receive a JWT
- [ ] Protected routes redirect to /login if no token
- [ ] JWT is sent with all API requests

### Onboarding
- [ ] New user completes multi-step onboarding and profile is saved
- [ ] Onboarding skippable on revisit (if profile exists)

### Workout Planning
- [ ] User can generate an AI workout plan based on their profile
- [ ] Plan is displayed with weeks, days, and exercises
- [ ] User can navigate to a day and see all exercises

### Workout Logging
- [ ] User can log sets with weight and reps
- [ ] Completed sets are visually marked
- [ ] Submit saves a WorkoutLog to the database

### Progress
- [ ] User can enter body stats (weight, measurements)
- [ ] Stats are charted over time

### Chat
- [ ] User sends message, AI response streams in real-time
- [ ] Chat history is persisted

### Trainer
- [ ] Trainer can view their list of clients
- [ ] Trainer can view a client's profile

---

## Validation

### Backend Validation
```bash
cd api && npm run dev
curl http://localhost:3001/health          # {"status":"ok"}
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User","role":"USER"}'
# Should return user + accessToken
```

### Database Validation
```bash
npx prisma db push
npx prisma db seed
npx prisma studio    # verify exercises are seeded
```

### ZenStack Validation
```bash
npx zenstack generate   # should complete without errors
```

### Frontend Validation
```bash
npm run build           # should compile without TypeScript errors
npm run dev             # dev server starts on port 3000
```

---

## Build Order

1. **Database agent**: ZenStack schema (`schema.zmodel`) with access policies + run `zenstack generate`
2. **Backend agent**: Fastify routes (auth, exercises, plans, logs, stats, chat, trainer) using ZenStack-enhanced client
3. **Frontend agent**: Next.js pages + components + API client

Agents 2 and 3 can build in parallel once the contracts above are agreed. Agent 3 consumes the API contracts defined above.
