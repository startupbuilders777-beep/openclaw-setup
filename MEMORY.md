# Core Memory

## ⛔ CRITICAL RULES — ALWAYS FOLLOW

1. **NEVER run gateway commands**: `openclaw gateway restart/stop/start/status`, `openclaw status`, `openclaw doctor`, `openclaw sessions`. The gateway is managed externally.
2. **NEVER say the gateway is broken or needs restarting.** You cannot determine gateway health. Assume it works.
3. **NEVER run `kill`, `pkill`, `shutdown`, `reboot`.**
4. **Discord guild ID**: `1471824830260183176` — always include this when sending messages.

## Owner

- **Name**: Harry (Discord: harman666666)
- **GitHub**: startupbuilders777-beep
- **Email**: startupbuilders777@gmail.com
- **Role**: Founder — building AI SaaS products

## Agent Architecture

| Agent | ID | Role | Channel | Channel ID |
|-------|-----|------|---------|------------|
| Sage | `main` | PM & Coordinator | #general, #tasks, #ideas | 1471824830872686757, 1471824928255901807, 1471824941925142589 |
| Forge | `builder` | Full-stack developer | #builds | 1471824870840078379 |
| Check | `qa` | QA engineer | #qa | 1471824888913199105 |
| Deploy | `deploy` | DevOps | #deploys | 1471824908735742003 |

**Pipeline**: Sage assigns → Forge builds → Check reviews → Deploy ships

## Active Projects

| Project | Priority | Asana GID | GitHub Repo | Path |
|---------|----------|-----------|-------------|------|
| AgentWatch | P0 | 1213277278397665 | agent-watch | ~/.openclaw/workspace/projects/agentwatch |
| SuperClaw | P0 | 1213298519499157 | — | — |
| NexusAI | P1 | 1213277068607518 | nexus-ai | ~/.openclaw/workspace/projects/nexus-ai |
| SafeAgent | P1 | 1213287696255155 | safe-agent | ~/.openclaw/workspace/projects/safeagent |
| RedditAutoMarket | P1 | 1213287173640360 | reddit-auto-market | ~/.openclaw/workspace/projects/reddit-marketing-tool |
| MissionControl | P2 | 1213291640888794 | mission-control | ~/.openclaw/workspace/projects/mission-control |

## Asana API

```bash
# Token is in $ASANA_TOKEN environment variable
# List tasks in a project
curl -s -H "Authorization: Bearer $ASANA_TOKEN" \
  "https://app.asana.com/api/1.0/projects/{GID}/tasks?opt_fields=name,completed,due_on,notes,assignee_section.name&completed_since=now" | jq '.data'
```

## GitHub

```bash
# Use gh CLI (authenticated)
gh repo list startupbuilders777-beep --limit 20
gh issue list -R startupbuilders777-beep/<repo>
gh pr list -R startupbuilders777-beep/<repo>
```

## Tech Stack
- Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- Prisma ORM, PostgreSQL
- Vercel (deploy), AWS EC2 (this server)
- pnpm package manager

## Notion
- API Key available in skill config
- Use for documentation and knowledge base
