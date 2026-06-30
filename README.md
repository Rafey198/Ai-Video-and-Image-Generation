# VireoMorph

**Generate. Animate. Remix. Sync.**

VireoMorph is a premium AI creative studio SaaS platform for generating, editing, animating, and syncing images, videos, and audio using open-source and open-weight AI models.

> **Trademark Notice:** VireoMorph is a provisional project name. Before commercial launch, perform formal trademark search, domain search, app store search, and legal review.

> **Model License Notice:** Model entries are seeded for architecture and UI. Before commercial deployment, verify each model's license, commercial usage rights, safety requirements, provider costs, and hosting feasibility.

## Features

- **Image Studio** — Text-to-image, image editing, style transfer, inpainting
- **Video Studio** — Text-to-video, image-to-video, frame-to-video, video remix
- **Audio Studio** — Music, SFX, voiceovers, text-to-speech
- **Sync Studio** — Lip sync, beat sync, audio-video alignment
- **Model Registry** — 60+ open-source model entries with dynamic UI
- **Credits & Billing** — Wallet, transactions, plans, Stripe-ready checkout
- **Gallery & History** — Folders, favorites, remix, download, share
- **Admin Dashboard** — Users, models, jobs, storage, moderation, feature flags
- **Demo Mode** — Full product experience without real GPU providers

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Motion | Framer Motion, React Three Fiber, Drei |
| State | Zustand, TanStack Query |
| Backend | Next.js API Routes, Server Actions |
| Database | PostgreSQL, Prisma ORM |
| Auth | NextAuth.js (credentials + OAuth-ready) |
| Storage | Local / S3-compatible (Cloudflare R2) |
| Queue | Redis/BullMQ architecture (mock provider for demo) |
| Validation | Zod |
| Deployment | Vercel-ready |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App (Vercel)                  │
├──────────────┬──────────────┬──────────────┬────────────┤
│ Public Site  │  Dashboard   │ Admin Panel  │  API Routes│
├──────────────┴──────────────┴──────────────┴────────────┤
│              Auth (NextAuth) + RBAC                      │
├──────────────┬──────────────┬──────────────┬────────────┤
│   Prisma     │   Storage    │  Job Queue   │  Credits   │
│  PostgreSQL  │  R2 / S3     │  Redis/Mock  │  Stripe    │
├──────────────┴──────────────┴──────────────┴────────────┤
│         AI Provider Adapters (Mock, HF, Replicate...)    │
└─────────────────────────────────────────────────────────┘
```

## Folder Structure

```
src/
├── app/
│   ├── (public)/          # Marketing pages
│   ├── (auth)/            # Login / Signup
│   ├── (protected)/       # User dashboard & studios
│   ├── admin/             # Admin panel
│   └── api/               # REST API routes
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── 3d/                # React Three Fiber scenes
│   ├── marketing/         # Landing page components
│   ├── dashboard/         # Dashboard shell & widgets
│   ├── studio/            # Generation studio UI
│   ├── admin/             # Admin panel components
│   └── media/             # Gallery & media players
├── lib/
│   ├── auth/              # NextAuth config
│   ├── db/                # Prisma client
│   ├── storage/           # File storage abstraction
│   ├── ai/                # Job system & providers
│   ├── credits/           # Credit calculator & wallet
│   ├── security/          # Rate limiting & moderation
│   └── validation/        # Zod schemas
├── config/                # Site config & constants
└── hooks/                 # React hooks
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed data
```

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### 1. Clone & Install

```bash
git clone https://github.com/Rafey198/Ai-Video-and-Image-Generation.git
cd Ai-Video-and-Image-Generation
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values. Minimum for local dev:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vireomorph"
NEXTAUTH_SECRET="your-random-secret-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEMO_MODE=true
STORAGE_PROVIDER=local
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vireomorph.dev | Admin123! |
| Demo User | demo@vireomorph.dev | Demo123! |

## Demo Mode

Set `NEXT_PUBLIC_DEMO_MODE=true` to enable full product experience without real AI providers:

- Generation forms work end-to-end
- Jobs are created and processed with simulated delays
- Credits are deducted and refunded correctly
- Placeholder media appears in gallery/history

## AI Provider Integration

The platform uses a provider adapter pattern. To integrate real models:

1. Configure provider credentials in `.env`
2. Enable provider in Admin → Provider Settings
3. Assign models to providers in Model Registry
4. Set up external GPU worker with webhook endpoint at `/api/webhooks/jobs`

Supported provider adapters:
- `MockProvider` — Demo mode (built-in)
- `HuggingFaceProvider` — Placeholder
- `ReplicateProvider` — Placeholder
- `ComfyUIProvider` — Placeholder
- `CustomWorkerProvider` — FastAPI/RunPod endpoint

## Storage Setup

### Local (Development)

```env
STORAGE_PROVIDER=local
```

Files stored in `./storage/`

### Cloudflare R2 / AWS S3

```env
STORAGE_PROVIDER=s3
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=vireomorph
S3_REGION=auto
S3_PUBLIC_URL=https://cdn.yourdomain.com
```

## Vercel Deployment

> **Required:** Add `DATABASE_URL` in Vercel → Project → Settings → Environment Variables **before** deploying. Without it, auth, dashboard, and generation features will not work at runtime.

### Minimum Vercel environment variables

```env
DATABASE_URL=postgresql://...          # Required — Neon, Supabase, or Vercel Postgres
NEXTAUTH_SECRET=your-random-secret   # Required — 32+ character random string
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_DEMO_MODE=true
STORAGE_PROVIDER=local
```

### Deploy steps

1. **Import** the GitHub repository in [Vercel](https://vercel.com)
2. **Add environment variables** above (especially `DATABASE_URL`)
3. **Connect PostgreSQL** — Use Vercel Postgres, Neon, or Supabase
4. **Deploy** — Build command: `prisma generate && next build`
5. **Initialize database** after first deploy (from your machine or Vercel CLI):
   ```bash
   npx prisma db push
   npm run db:seed
   ```
6. **Configure storage** — Set S3/R2 credentials for production file uploads

### Post-Deploy Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure production `DATABASE_URL`
- [ ] Set up S3/R2 storage
- [ ] Configure Stripe keys (if billing enabled)
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=false` for production
- [ ] Verify model licenses before enabling real providers
- [ ] Run trademark/domain legal review

## Security Notes

- API keys are server-side only, never exposed to frontend
- Private media uses signed URLs
- Rate limiting on API and generation endpoints
- RBAC with roles: user, creator, team_admin, developer, admin, super_admin
- Admin actions are audit-logged
- Prompt/upload moderation hooks in place
- CSRF protection via NextAuth

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database |

## License

Proprietary — All rights reserved. Model weights and third-party AI models are subject to their respective licenses.
