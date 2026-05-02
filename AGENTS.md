# AGENT.md — JejakKarier

> Important Note: This file contains the system instructions, architectural constraints, and coding standards for the JejakKarier project. All AI agents must strictly adhere to these rules before generating or modifying any code.

---

## 1. Project Overview

- **Name**: JejakKarier - Smart Job Tracker
- **Description**: A high-efficiency, keyboard-first job application pipeline management tool with smart parsing, proactive "ghosting" alerts, and visual analytics.
- **Goal**: To reduce cognitive load during job hunting by transitioning from a passive tracking tool (like standard spreadsheets) to a proactive career assistant.
- **Target Users**: Developers, engineers, and professionals seeking a frictionless, fast, and dark-themed (Linear-style) job tracking experience.
- **Version**: v1.0.0 (MVP)
- **Status**: Active development

---

## 2. Tech Stack

- **Language**: TypeScript
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Library**: Shadcn/ui (Customized for Linear-style minimal aesthetic)
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (Google Provider + strict Row Level Security)
- **State Management**: Zustand, React `useState` (for local UI state)
- **Data Fetching**: TanStack Query + Supabase Client
- **Package Manager**: npm
- **Deployment**: Vercel

---

## 3. Commands

```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run format        # Format code with Prettier (if configured)

# Package Management
npm install [package] # Install a new package

# Supabase Local (If using Supabase CLI)
npx supabase start    # Start local Supabase instance
npx supabase gen types typescript --project-id [PROJECT_REF] > types/supabase.ts # Generate types

[root]/
  src/
    app/              # Next.js App Router pages, layouts, and API routes
    components/       # Reusable UI components (shadcn, generic UI)
      ui/             # Base shadcn components
      layout/         # Navigation, Sidebars, Wrappers
    features/         # Domain-specific logic and components (e.g., /jobs, /analytics)
    lib/              # Utility configurations (Supabase client, React Query config, cn/clsx)
    hooks/            # Custom React hooks
    types/            # Global TypeScript definitions (including Supabase DB types)
    stores/	      # State Management
  public/             # Static assets
  middleware.ts       # Supabase Auth session management and route protection

# Files and Folders
- Components    : PascalCase      (e.g., JobCard.tsx, KanbanColumn.tsx)
- Non-components: camelCase       (e.g., useAuth.ts, fetchJobs.ts)
- Folders       : kebab-case      (e.g., job-pipeline/, user-profile/)
- Pages/Layouts : page.tsx, layout.tsx
- Test files    : [name].test.ts or [name].spec.ts

# Code Level
- Variables     : camelCase       (e.g., applicationData, isLoading)
- Constants     : UPPER_SNAKE     (e.g., MAX_RETRY, STATUS_COLORS)
- Functions     : camelCase       (e.g., updateJobStatus, formatCurrency)
- Types/Interfaces: PascalCase    (e.g., JobApplication, Database)
- Enums         : PascalCase      (e.g., ApplicationStatus)
- CSS Classes   : kebab-case      (e.g., job-card, ghosting-alert)

# Git Branches
- New Feature   : feat/[feature-name]
- Bug Fix       : fix/[bug-name]
- Refactor      : refactor/[name]

# General Approach
- Apply DRY and clean code principles.
- Prioritize readability over clever, condensed code.
- Linear-style UI dictates extreme minimalism: avoid unnecessary borders, use subtle typography differences for hierarchy.

# TypeScript
- Use strict mode.
- **Never use `any`.** Create specific interfaces or use `unknown` if absolutely necessary.
- Explicitly define return types for functions.
- Always use the generated `Database` types from Supabase for DB interactions.

# Import Order
1. React/Next.js external imports.
2. Third-party libraries (Lucide, TanStack Query, etc.).
3. Absolute internal imports (`@/components`, `@/lib`).
4. Relative internal imports (`./ChildComponent`).
5. Types and Interfaces.

# Export Pattern
- Use named exports for standard components and utility functions.
- Use default exports ONLY for Next.js `page.tsx` and `layout.tsx`.

# Error Handling
- Always use try-catch blocks in async functions.
- Display user-friendly toast notifications (via shadcn toast) for mutations that fail.

# Component Structure Order
1. Imports
2. Types / Interfaces
3. Component Definition
4. Hooks (TanStack Query, state, etc.)
5. Local Handlers
6. Return JSX
7. Export

# Next.js Server vs Client Components
- **Default to Server Components** for data presentation and SEO.
- Add `"use client"` ONLY when necessary:
  - Using `useState`, `useEffect`, or custom hooks.
  - Using event listeners (`onClick`, `onDragEnd`).
  - Using Browser APIs.
  - Implementing TanStack Query providers or interactive UI (Kanban board).

# General Styling
- Use **Tailwind CSS**.
- Use `clsx` and `tailwind-merge` (via `cn` utility) for conditional classes.
- NEVER use inline styles unless calculating dynamic layout positions (e.g., drag-and-drop).

# Linear Style Implementation
- **Theme**: Deep dark mode default. Background `#09090b` (`bg-zinc-950`).
- **Borders**: Thin, subtle borders (`border-zinc-800` or `border-zinc-800/50`).
- **Radius**: Minimal rounded corners (`rounded-md` or `rounded-sm`). Avoid pill shapes unless for specific badges.
- **Typography**: Inter or Geist font. Text is mostly `text-zinc-400` (secondary) and `text-zinc-100` (primary). Small font sizes with tight tracking.
- **Micro-interactions**: Fast, snappy transitions (`duration-150 ease-in-out`). Hover states should apply subtle background lightening (`hover:bg-zinc-900`), not aggressive color changes.

# Responsive
- Mobile-first approach. Ensure Kanban board transforms into a list or horizontal scroll on mobile (`sm`, `md` breakpoints).

# Fetching Strategy
- Use **TanStack Query (React Query)** for all client-side data fetching and mutations.
- Do NOT use `useEffect` for data fetching.
- Use Supabase Server Component client for initial server-side rendering if SEO or initial load speed is critical.

# TanStack Query & Supabase
- **Optimistic Updates**: MUST be implemented for drag-and-drop Kanban interactions to ensure the UI feels instant.
- Queries should be invalidated automatically on successful mutations.

# Database / Backend
- Interact directly with Supabase via `@supabase/ssr` or `@supabase/supabase-js`.
- Respect Row Level Security (RLS). Ensure the `user_id` is automatically handled by Supabase Auth context, not passed blindly from the client.

# Hierarchy
1. Local State (`useState`): Form inputs, toggles.
2. Server State (`TanStack Query`): Job applications, user profile, analytics data.
3. Global UI State (`Zustand` / Context): Theme, Sidebar collapse state (if needed).

- Do not duplicate data in global state if it already exists in TanStack Query cache.

# Public Variables (Safe for Client)
NEXT_PUBLIC_SUPABASE_URL=           # Your Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Your Supabase Anon Key

# Server-only Variables (NEVER expose to Client)
SUPABASE_SERVICE_ROLE_KEY=          # For admin tasks (only if absolutely needed)
```
