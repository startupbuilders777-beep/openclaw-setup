# Asana Workflow — SKILL.md

*A self-sustaining workflow kit using Asana as the single source of truth.*

---

## What This Is

A complete workflow for OpenClaw agents that uses **Asana exclusively** for task management. No local files, no fake numbers.

---

## CRITICAL RULES

### NEVER USE LOCAL FILES FOR TASKS
- **Asana IS the source of truth** - Always query Asana API directly
- NEVER read local tasks/QUEUE.md or tasks/board.json for task status
- NEVER post numbers from local files - only from real Asana queries
- If you need task info, call the Asana API directly

### Token
```
TOKEN="2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd"
```

---

## Quick Query Commands

### Get incomplete tasks per project
```bash
for pid in 1213277068607518 1213277278397665 1213287173640360 1213287696255155; do
  incomplete=$(curl -s -H "Authorization: Bearer $TOKEN" \
    "https://app.asana.com/api/1.0/projects/$pid/tasks?completed=false" | jq '.data | length')
  echo "Project $pid: $incomplete incomplete"
done
```

### Get tasks from a project
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://app.asana.com/api/1.0/projects/$PROJECT_GID/tasks?completed=false&opt_fields=name,notes,assignee.name" | \
  jq '.data[] | {name, notes: .notes[0:100], assignee: .assignee.name}'
```

### Mark task complete
```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"data": {"completed": true}}' \
  "https://app.asana.com/api/1.0/tasks/$TASK_GID"
```

---

## Project GIDs

| Project | GID |
|---------|-----|
| AgentWatch | 1213277278397665 |
| NexusAI | 1213277068607518 |
| RedditAutoMarket | 1213287173640360 |
| SafeAgent | 1213287696255155 |
| Whop Course | 1213287173636195 |

---

## The Loop

```
DISCOVER → ASANA → EXECUTE → VALIDATE → COMPLETE
    ↑                                      ↓
    └──────────────────────────────────────┘
```

1. **Discover** — Find opportunities via research
2. **Asana** — Create tasks, break into subtasks
3. **Execute** — Do the work (spawn agents or do it yourself)
4. **Validate** — Does it work? Does it meet spec?
5. **Complete** — Mark done in Asana with comment

---

## Heartbeat Integration

Add to your heartbeat:

```bash
# 1. Query real Asana
TOKEN="2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd"
for pid in 1213277068607518 1213277278397665 1213287173640360 1213287696255155; do
  curl -s -H "Authorization: Bearer $TOKEN" \
    "https://app.asana.com/api/1.0/projects/$pid/tasks?completed=false" | \
    jq '.data | length'
done

# 2. Pick highest priority incomplete task

# 3. Execute or spawn agent

# 4. Mark complete when done
```

---

## Cron Jobs

Set up cron jobs to execute work:

### Execute Asana Tasks (every 30 min)
```json
{
  "name": "Execute Asana Tasks",
  "schedule": {"everyMs": 1800000},
  "payload": {
    "kind": "agentTurn",
    "message": "Query Asana for incomplete tasks, pick one, execute it, mark complete"
  }
}
```

### Scout & Create Ideas (every hour)
```json
{
  "name": "B2B Scout & Ideas", 
  "schedule": {"everyMs": 3600000},
  "payload": {
    "kind": "agentTurn", 
    "message": "Research trends, post ideas to #ideas, create Asana tasks"
  }
}
```

---

## Anti-Patterns

❌ Using local files for task status  
❌ Posting fake numbers  
❌ Ignoring Asana  
❌ Solo everything (spawn agents)  
❌ Skipping validation  
❌ Not marking tasks complete  

---

*Asana or nothing. Real work or nothing.*
