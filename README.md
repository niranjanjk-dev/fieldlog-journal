# Docko — Field Logs Students Actually Keep

> Verified, photo-and-GPS field journaling for internships, fieldwork, and clinicals.

Docko bridges the gap between students on site and faculty mentors back on campus. With automatic GPS coordinates, timestamps, and in-app photo capture, every log carries its own proof. Mentors verify submissions in one tap, and placement coordinators get audit-ready portfolios with 0 paperwork.

---

## Features

- 📸 **Verified Visual Journaling**: Capture field notes with real-time photo capture, GPS coordinates, and device timestamps.
- ⚡ **9-Second Fast Logging**: Streamlined logging workflow designed specifically for students working in active fieldwork environments.
- 🛡️ **One-Tap Mentor Verification**: Dedicated mentor review queue with instant approval, feedback comments, or rework requests.
- 🗺️ **Interactive Map of Proof**: Geographic visualization of all field entries with coordinate accuracy overlays.
- 📈 **Automated Hours & Milestones**: Live tracking of weekly hours, skill development, streaks, and completion percentages.
- 👥 **Role-Based Portals**:
  - **Public Landing Page**: (`/`) Full interactive overview, animations, and feature breakdowns.
  - **Student Workspace**: (`/app`, `/app/log`, `/app/timeline`, `/app/map`, `/app/portfolio`) Daily logging, personal timeline, map, and exportable portfolio.
  - **Mentor Workspace**: (`/mentor`, `/mentor/verify`, `/mentor/teams`) Queue verification and team oversight.
  - **Admin / Institution Workspace**: (`/admin`, `/admin/people`, `/admin/teams`) Cohort, user, and program management.
- 🌐 **Offline Resilience**: Field entries can be captured offline and automatically synced once connection is restored.

---

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router)
- **UI & Components**: React 19, [Tailwind CSS v4](https://tailwindcss.com), Radix UI primitives, Lucide Icons, Sonner toasts
- **Animations**: [GSAP](https://greensock.com/gsap/) with ScrollTrigger for smooth reveals, floating cards, and count-up stats
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
- **Database & Auth**: [Supabase](https://supabase.com) (`@supabase/supabase-js`)
- **Server Engine**: [Nitro](https://nitro.unjs.io/) / Vite

---

## Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** >= 20.x or **Bun** >= 1.1.x
- **npm**, **pnpm**, or **bun**

### 2. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd fieldlog-journal

# Install dependencies with npm
npm install

# (Alternatively with Bun)
# bun install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:

**Windows Command Prompt (cmd)**:
```cmd
copy .env.example .env
```

**PowerShell**:
```powershell
Copy-Item .env.example .env
```

**macOS / Linux**:
```bash
cp .env.example .env
```

Set your Supabase credentials in `.env`:
```env
# Supabase Configuration
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-or-publishable-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Client Vite Variables (must match SUPABASE_URL & PUBLISHABLE_KEY)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-or-publishable-key"

# Optional: Google Maps API Key for interactive map view and geocoding
VITE_GOOGLE_MAPS_API_KEY=""
GOOGLE_MAPS_API_KEY=""
```

> **Note**: If `GOOGLE_MAPS_API_KEY` is not provided, geocoding automatically falls back to OpenStreetMap Nominatim reverse geocoding so coordinates still resolve into readable addresses.

### 4. Run Development Server
```bash
npm run dev
```

Open your browser at `http://localhost:8080` (or the port indicated in terminal).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the local development server with HMR |
| `npm run build` | Builds the production server and client bundle |
| `npm run preview` | Runs the production build locally |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run format` | Formats the codebase with Prettier |

---

## Cloud Deployment Guide

TanStack Start is powered by Nitro and can be deployed anywhere JavaScript runs.

### Option 1: Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the **Framework Preset** to `Other` or `Vite`.
4. Configure the Environment Variables in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY` (optional)
5. Click **Deploy**. Vercel will automatically run `npm run build` and provision the serverless endpoints.

---

### Option 2: Netlify

1. Connect your repository in [Netlify](https://netlify.com).
2. Set Build Command to `npm run build` and Publish Directory to `.output/public` (or dist).
3. Set your environment variables in Netlify Site Configuration.
4. Deploy site.

---

### Option 3: Docker / Node.js Server (VPS / AWS / Render / Railway)

You can run the production Nitro output using standard Node.js:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

Build and run:
```bash
docker build -t docko-app .
docker run -p 3000:3000 --env-file .env docko-app
```

---

## Supabase Schema & Setup

Docko expects standard Supabase tables for profiles, teams, and entries:
- `profiles`: user metadata (name, role `student | mentor | admin`, institution)
- `teams`: placement groups and assigned mentors
- `entries`: field log items (title, content, photo URL, latitude, longitude, hours, status `pending | verified | changes_requested`)
- `entry_skills`: tagged skills per entry

RLS (Row Level Security) policies ensure students manage only their entries, mentors review assigned cohort entries, and institution admins oversee their domains.

---

## License

MIT
