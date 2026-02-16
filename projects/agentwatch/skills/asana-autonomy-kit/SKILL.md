---
name: asana-autonomy-kit
version: 1.0.0
description: Self-sustaining agent that works from Asana tasks 24/7
homepage: https://github.com/startupbuilders777-beep/openclaw-setup
metadata:
  openclaw:
    emoji: "⚡"
    category: productivity
---

# Asana Autonomy Kit

Transform your agent into a self-sustaining worker that uses **Asana as the only source of truth**.

## CRITICAL

**NEVER use local files for tasks.** Local files are stale, unverified, and lead to fake progress. 
- Asana = Source of truth
- Local files = Documentation only

---

## Quick Start

1. Query Asana at start of every session
2. Set up cron jobs to execute work automatically
3. Spawn agents for parallel tasks
4. Mark complete in Asana when done

---

## Required Setup

### Asana Token
```
TOKEN="2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd"
```

### Project GIDs
| Project | GID |
|---------|-----|
| AgentWatch | 1213277278397665 |
| NexusAI | 1213277068607518 |
| RedditAutoMarket | 1213287173640360 |
| SafeAgent | 1213287696255155 |

---

## Heartbeat Checks

### Every Heartbeat (30 min)

```bash
# Query all projects
TOKEN="2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd"
for pid in 1213277068607518 1213277278397665 1213287173640360 1213287696255155; do
  curl -s -H "Authorization: Bearer $TOKEN" \
    "https://app.asana.com/api/1.0/projects/$pid/tasks?completed=false" | \
    jq '.data | length'
done
```

### If tasks exist:
1. Pick highest priority incomplete task
2. Read task notes for specs
3. Execute (spawn agent or do it yourself)
4. Validate
5. Mark complete in Asana

### If blocked:
Post to Discord: "BLOCKED: [task] - need [what you need]"

---

## Cron Jobs (REQUIRED)

### 1. Execute Asana Tasks (every 30 min)
```json
{
  "name": "Execute Asana Tasks",
  "schedule": {"everyMs": 1800000},
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Query Asana for incomplete tasks, pick highest priority, execute it, mark complete. NEVER use local files."
  }
}
```

### 2. B2B Scout & Ideas (every hour)
```json
{
  "name": "B2B Scout & Ideas",
  "schedule": {"everyMs": 3600000},
  "sessionTarget": "isolated", 
  "payload": {
    "kind": "agentTurn",
    "message": "Research trends, post ideas to #ideas, create Asana tasks for valid opportunities."
  }
}
```

---

## The Work Loop

```
QUERY ASANA → PICK TASK → EXECUTE → VALIDATE → MARK COMPLETE
```

1. **Query Asana** - Never assume, always check
2. **Pick Task** - Highest priority, unassigned
3. **Execute** - Spawn agent or do it yourself  
4. **Validate** - Does it work?
5. **Mark Complete** - Update Asana with comment

---

## Anti-Patterns

❌ **HEARTBEAT_OK** — Never just say ok, do work  
❌ **Local files for tasks** — NEVER use tasks/QUEUE.md  
❌ **Fake numbers** — Only post real Asana data  
❌ **Skip execution** — Always pick and work on a task  
❌ **Solo everything** — Spawn agents for parallel work  

---

*Query Asana. Do work. Ship.*
