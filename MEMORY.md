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
| **SuperClaw** | In Progress | P0 - Stripe/Auth |
| **AgentWatch** | In Progress | P1 |
| **NexusAI** | In Progress | P1 |
| **SafeAgent** | In Progress | P1 |
| **MissionControl** | Planning | P2 |

---

## GitHub Repos

| Repo | Contents |
|------|----------|
| superclaw | agents + skills (Sage/Forge/Check/Deploy) |
| openclaw-system | System files (renamed from reddit-automarket) |
| agentwatch | AgentWatch code |
| nexus-ai | NexusAI code |
| safeagent | SafeAgent code |
| mission-control | Mission Control dashboard |

---

## Agent Architecture

| Agent | Role |
|-------|------|
| **Killer** | Coordinator (me) |
| **Sage** | PM Coordinator |
| **Forge** | Builder (auto-merges after tests pass) |
| **Check** | QA Engineer |
| **Deploy** | DevOps |

---

## Key Preferences

- **Communication:** Discord
- **Task Management:** Asana ONLY
- **Code:** TypeScript, Tailwind, Prisma, Next.js 15

---

## Asana Projects

| Project | GID |
|---------|-----|
| SuperClaw | 1213298519499157 |
| AgentWatch | 1213277278397665 |
| NexusAI | 1213277068607518 |
| SafeAgent | 1213287696255155 |
| MissionControl | 1213291640888794 |
| RedditAutoMarket | 1213287173640360 |

---

## CRITICAL: Rules

- **Asana IS the source of truth** — Never create local task files
- Use `gh api` for GitHub (handles auth)
- Never fake progress

---

*Updated: 2026-02-17*

---

## CRITICAL RULES

1. **NEVER restart, stop, or modify the openclaw gateway.** Do not run: `openclaw gateway restart`, `systemctl restart openclaw-gateway`, or any similar command. This kills your own session.
2. **ALWAYS use Discord for messaging.** When using the `message` tool, set `channel=discord` and use numeric channel IDs as targets. Never use `whatsapp` or `telegram`.
3. **Discord Channel IDs:**
   - general: 1471824830872686757
   - builds: 1471824870840078379
   - qa: 1471824888913199105
   - deploys: 1471824908735742003
   - tasks: 1471824928255901807
   - ideas: 1471824941925142589
