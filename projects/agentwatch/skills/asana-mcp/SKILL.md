---
name: asana-mcp
description: Use Asana MCP via mcporter for fast task management. Hybrid MCP + REST.
---

# Asana MCP Skill

Use mcporter for fast Asana operations. Falls back to REST API when MCP tools are limited.

## MCP Tools (Fast - use these)

### Get Projects
```bash
mcporter call asana.asana_get_projects
```
Returns: All projects with GIDs

### Get Workspace
```bash
# MCP doesn't have this - use REST
TOKEN="2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd"
curl -s -H "Authorization: Bearer $TOKEN" "https://app.asana.com/api/1.0/workspaces" | jq '.data'
```

## REST API (Complete - use for everything else)

### Token
```
TOKEN="2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd"
```

### Quick Queries

```bash
# Get incomplete tasks per project
for pid in 1213277068607518 1213277278397665 1213287173640360 1213287696255155; do
  count=$(curl -s -H "Authorization: Bearer $TOKEN" \
    "https://app.asana.com/api/1.0/projects/$pid/tasks?completed=false" | \
    jq '.data | length')
  echo "Project $pid: $count incomplete"
done

# Get tasks from project
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://app.asana.com/api/1.0/projects/1213287173640360/tasks?completed=false&opt_fields=name,notes,gid" | \
  jq '.data[] | {gid: .gid, name: .name}'

# Get task details
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://app.asana.com/api/1.0/tasks/1213287173640360?opt_fields=name,notes,completed" | \
  jq '.data'

# Create task
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"data": {"name": "[FEATURE] New feature", "projects": ["1213287173640360"], "notes": "## Context\n..."}}' \
  "https://app.asana.com/api/1.0/tasks" | jq '.data.gid'

# Move task to section
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"data": {"section": "1213287445773005"}}' \
  "https://app.asana.com/api/1.0/sections/1213287445773005/addTask" \
  -d '{"data": {"task": "TASK_GID"}}'

# Mark complete
curl -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"data": {"completed": true}}' \
  "https://app.asana.com/api/1.0/tasks/TASK_GID"

# Add comment
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"data": {"text": "Progress: Working on this"}}' \
  "https://app.asana.com/api/1.0/tasks/TASK_GID/stories"
```

## Project GIDs

| Project | GID |
|---------|-----|
| AgentWatch | 1213277278397665 |
| NexusAI | 1213277068607518 |
| RedditAutoMarket | 1213287173640360 |
| SafeAgent | 1213287696255155 |
| Whop Course | 1213287173636195 |

## Section GIDs (RedditAutoMarket)

| Section | GID |
|---------|-----|
| Account Management | 1213287445773005 |
| Campaign Management | 1213287455592636 |
| AI Generation | 1213287441865753 |
| Automation | 1213287459539065 |
| UI/Dashboard | 1213287405866954 |
| QA & Testing | 1213277288830888 |
| Marketing | 1213287786912681 |

## When to Use MCP vs REST

| Operation | Use |
|-----------|-----|
| List projects | MCP (`asana_get_projects`) |
| List tasks | REST |
| Create task | REST |
| Update task | REST |
| Move to section | REST |
| Add comment | REST |
| Complex queries | REST |

## Workflow

1. Use MCP to list projects (fast)
2. Use REST for all task operations
3. Always mark complete in Asana (not local files)

---

*MCP for listing, REST for operations.*
