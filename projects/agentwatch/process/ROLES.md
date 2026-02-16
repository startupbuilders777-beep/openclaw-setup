# Team Roles & Ownership — Killer's Team

*Who does what. Clear ownership = no bottlenecks.*

---

## Our Agents

| Agent | Name | Role |
|-------|------|------|
| main | **Killer** | Coordinator - routes work, keeps things moving |
| builder | **Builder** 🔨 | Full-stack development, builds production code |
| qa | **QA** 🧪 | Code review, testing, security |
| deploy | **Deploy** 🚀 | DevOps, deployments, infrastructure |

---

## Core Roles (Mapped to Our Agents)

### Killer (main) — The Coordinator
**Mission:** Route work, keep the team moving, make things happen.

**Owns:**
- `tasks/board.json` / Asana project management
- Discord coordination (#general, #builds, #qa, #deploys)
- Spawning sub-agents for work
- Priority decisions

**Cadence:**
- Continuous via heartbeat (every 30 min)
- Human updates when needed

**Tools:**
- Asana API for task management
- Discord for communication
- Exec for running commands

---

### Builder 🔨 — The Developer
**Mission:** Build production-ready code.

**Owns:**
- Code in `projects/`
- Pull requests
- Code quality

**Cadence:**
- Spawned by Killer for specific tasks
- Works until task complete

---

### QA 🧪 — The Reviewer
**Mission:** Ensure quality, catch bugs.

**Owns:**
- Code review
- Testing
- Security audits

**Cadence:**
- Spawned after Builder completes work

---

### Deploy 🚀 — The DevOps
**Mission:** Ship to production.

**Owns:**
- Deployments
- CI/CD
- Infrastructure

**Cadence:**
- Spawned after QA approves

---

## Human

### Harry — The Lead
**Mission:** Strategic direction, hard calls.

**Owns:**
- Final decisions on priorities
- Business strategy
- External relationships

**How to reach:**
- Discord DM: harman666666
- Responds when available

---

## How Work Flows

```
Harry (Idea)
    ↓
Killer (Coordinator) 
    ↓
    ├─→ Builder (Build)
    ↓
    ├─→ QA (Review)
    ↓
    └─→ Deploy (Ship)
```

---

## Task Management (Asana)

All tasks live in Asana. Use the Asana API to:
- List projects
- Create tasks
- Update task status
- Add comments

**Asana Projects:**
- AgentWatch (1213277278397665)
- NexusAI (1213277068607518) 
- Whop Course (1213287173636195)
- RedditAutoMarket (1213287173640360)

---

## Communication

| Channel | Purpose |
|---------|---------|
| #general | Killer's updates, daily standups |
| #builds | Builder's domain |
| #qa | QA reviews |
| #deploys | Deployments |
| #ideas | New opportunities |
| #tasks | Task management |

---

*Clear roles, continuous work.*
