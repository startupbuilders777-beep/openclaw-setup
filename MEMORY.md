# MEMORY.md — Core Knowledge

*What I know. Updated regularly.*

---

## About Harry

- **Name:** Harry
- **Timezone:** EST
- **GitHub:** startupbuilders777-beep
- **Email:** startupbuilders777@gmail.com
- **Goal:** Build multiple AI/automation SaaS businesses

---

## Projects (Current)

| Project | Status | Priority |
|---------|--------|----------|
| **AgentWatch** | In Progress | P0 |
| **NexusAI** | In Progress | P1 |
| **SafeAgent** | In Progress | P1 |
| **Mission Control** | Planning | P2 |

---

## Agent Architecture

| Agent | ID | Role | Workspace |
|-------|----|------|-----------|
| **Sage** | main | PM Coordinator | ~/.openclaw/workspace |
| **Forge** | builder | Full-Stack Dev | ~/agents/builder |
| **Check** | qa | QA Engineer (Playwright) | ~/agents/qa |
| **Deploy** | deploy | DevOps | ~/agents/deploy |

### Pipeline Flow
```
Sage (creates prioritized tasks in Asana)
  → Forge (picks highest priority, builds, tests)
    → Check (runs Playwright e2e, validates)
      → Deploy (ships to production)
        → Sage (monitors, reports to Harry)
```

---

## Key Preferences

- **Communication:** Discord (#general, #builds, #qa, #deploys, #ideas)
- **Task Management:** Asana (ONLY source of truth)
- **Code Style:** TypeScript, Tailwind, Prisma, Next.js 15
- **Testing:** Playwright (e2e), Vitest (unit)
- **No fluff:** Direct, actionable responses

---

## Technical

- **Gateway:** localhost:18789
- **Model:** MiniMax M2.5 (all agents, all tasks)
- **Exec:** Full mode (no approval needed)
- **GitHub:** https://github.com/startupbuilders777-beep

---

## Asana Projects

| Project | GID |
|---------|-----|
| AgentWatch | 1213277278397665 |
| NexusAI | 1213277068607518 |
| RedditAutoMarket | 1213287173640360 |
| SafeAgent | 1213287696255155 |
| Mission Control | 1213291640888794 |

**Asana Token:** Available as `$ASANA_TOKEN` environment variable. Use it in API calls:
```bash
curl -s -H "Authorization: Bearer $ASANA_TOKEN" "https://app.asana.com/api/1.0/..."
```

---

## Task Priority System

All tasks MUST have a priority tag in Asana:

| Tag | Meaning | SLA |
|-----|---------|-----|
| `P0-critical` | Blocking, bugs, launch requirements | Build within 1 hour |
| `P1-high` | Core features, important improvements | Build within 4 hours |
| `P2-medium` | Nice-to-haves, optimizations | Build within 24 hours |
| `P3-low` | Ideas, research, future work | When backlog is empty |

Forge picks tasks in priority order. Sage ensures all tasks are tagged.

---

## CRITICAL: Gitignore for All Projects

Every project MUST have .gitignore before first push:
```
node_modules/
.next/
.env
.env.local
*.log
.DS_Store
dist/
coverage/
test-results/
playwright-report/
```

---

## CRITICAL: Rules

### Source of Truth
- **Asana IS the source of truth** — Always query Asana API directly
- NEVER create local task files (no board.json, no QUEUE.md, no local boards)
- NEVER post numbers from local files — only from real Asana queries

### Honesty Protocol
- Never fake progress, never post empty updates
- If blocked → say "BLOCKED: [reason]" explicitly in Discord
- If no real work happened → say that, don't fabricate
- NEVER POST FAKE NUMBERS

### Agent Discipline
- **Concurrency:** Only 1 agent per task. Check before assigning.
- **Commits:** Every commit must reference Asana task: `feat(scope): desc [ASANA-<gid>]`
- **Blocking:** Always tell Harry when blocked + what you need to unblock
- **Max 2 hours per task** — if longer, break it up

---

*Updated: 2026-02-16*
