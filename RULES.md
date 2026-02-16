# OPERATING RULES - Killer's Agent System

*This file is the source of truth for how this agent system operates. All rules must be followed.*

---

## CORE PRINCIPLES

1. **Asana is the ONLY source of truth for tasks** - Never read local files for task status
2. **Every commit MUST reference an Asana task** - Format: `[TASK-ID] Description`
3. **GitHub is the ONLY source of truth for code** - Each project in its own repo
4. **Never fake progress** - Only post real data from APIs
5. **Self-improvement is mandatory** - Log errors, corrections, learnings
6. **Distributed System: Asana is the coordinator** - Assign tasks in Asana, not local files
7. **Never pollute context with local tracking files** - Read Asana for state

---

## ASANA RULES

### Token
```
TOKEN="2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd"
```

### Project GIDs
| Project | GID | GitHub |
|---------|-----|--------|
| AgentWatch | 1213277278397665 | https://github.com/startupbuilders777-beep/agentwatch |
| NexusAI | 1213277068607518 | https://github.com/startupbuilders777-beep/nexus-ai |
| RedditAutoMarket | 1213287173640360 | https://github.com/startupbuilders777-beep/reddit-automarket |
| SafeAgent | 1213287696255155 | https://github.com/startupbuilders777-beep/safeagent |

### Queries

```bash
# Get incomplete tasks per project
for pid in 1213277068607518 1213277278397665 1213287173640360 1213287696255155; do
  curl -s -H "Authorization: Bearer $TOKEN" \
    "https://app.asana.com/api/1.0/projects/$pid/tasks?completed=false" | \
    jq '.data | length'
done

# Get task details
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://app.asana.com/api/1.0/tasks/TASK_GID?opt_fields=name,notes,completed" | \
  jq '.data'
```

### Task Format
Every task MUST have:
- **Name**: Clear, actionable (e.g., `[FEATURE] Login page`)
- **Notes**: Context + Acceptance Criteria + Priority
- **Section**: In proper project section

---

## GITHUB RULES

### Repos (Each project has its own)
- `agentwatch` - AI agent monitoring
- `nexus-ai` - RAG/chat platform
- `reddit-automarket` - Reddit marketing
- `safeagent` - AI guardrails

### Commit Format
```
[ASANA-TASK-ID] Brief description

Example:
[WATCH-001] Add multi-agent support
```

### Branch Naming
```
task/ASANA-TASK-ID/description

Example:
task/WATCH-001/multi-agent-support
```

### Workflow
1. Pick task from Asana
2. Create branch: `task/ASANA-TASK-ID/description`
3. Work and commit with TASK-ID prefix
4. Push to GitHub
5. Mark Asana task complete

---

## CRON JOBS (Always Running)

| Job | Frequency | What It Does |
|-----|-----------|--------------|
| Execute Asana Tasks | 30 min | Query Asana → spawn builder → mark complete |
| B2B Scout & Ideas | 1 hour | Research → post ideas → create Asana tasks |
| Competitor Analysis | 1 hour | Research competitors → post gaps |
| GitHub Sync | 2 hours | Push code to project repos |
| Daily Memory | 24 hours | Log learnings → commit to git |

---

## SELF-IMPROVEMENT RULES

### Files
- `.learnings/LEARNINGS.md` - Corrections, knowledge gaps
- `.learnings/ERRORS.md` - Command failures
- `.learnings/FEATURE_REQUESTS.md` - User requests
- `memory/YYYY-MM-DD.md` - Daily session logs

### What to Log
- User corrections ("No, that's wrong...")
- Errors encountered
- Knowledge gaps discovered
- Better approaches found

### When to Log
- Immediately after any correction
- After any command failure
- At end of each session (via cron)

---

## AGENT RULES

### Sage (Orchestrator)
- Queries Asana at start of EVERY session
- Spawns builder agents for work
- Never uses local files for task status

### Forge (Builder)
- Executes from Asana task context
- Marks complete in Asana when done
- Uses commit format: `[TASK-ID] Description`

### Check (QA)
- Reviews code from Forge
- Tests functionality
- Approves or rejects

### Deploy (DevOps)
- Deploys approved code
- Monitors for issues

---

## ANTI-PATTERNS (NEVER DO)

❌ **HEARTBEAT_OK** - Never just say ok, do work  
❌ **Local files for tasks** - NEVER use tasks/QUEUE.md or board.json  
❌ **Fake numbers** - Only post real data from Asana API  
❌ **Skip Asana** - Task queue IS Asana  
❌ **Skip GitHub** - Code goes to project repos, not workspace  
❌ **Solo everything** - Spawn agents for parallel work  
❌ **Forget learnings** - Log errors and corrections  
❌ **Skip commits** - Every code change needs commit with TASK-ID  
❌ **Skip QA** - Every project needs end-to-end verification  
❌ **Code-only QA** - QA must actually RUN the app, not just review code  

---

## PROJECT SETUP CHECKLIST

When starting a new project:

- [ ] Create Asana project with GID
- [ ] Create GitHub repo
- [ ] Link GitHub in Asana project description
- [ ] Add SPEC.md to repo
- [ ] Create sections in Asana (Account Mgmt, Features, QA, etc.)
- [ ] Add tasks with proper format
- [ ] Add to cron job project list

---

## AUDIT CHECKLIST (Weekly)

- [ ] All projects have GitHub repos with SPEC.md
- [ ] All Asana tasks in proper sections
- [ ] Commit format includes TASK-ID
- [ ] Cron jobs running (check cron list)
- [ ] Learnings logged (check .learnings/)
- [ ] Memory updated (check memory/)
- [ ] QA verification completed for all projects

---

## QA VERIFICATION PROCESS

### Every Project MUST Pass QA Before Deployment

QA Agent runs end-to-end verification:

1. **Pull Latest Code** - `git pull && npm install && npm run build`
2. **Start App** - `npm run dev`
3. **Verify Asana Tasks** - Check each completed task's acceptance criteria
4. **Test All Screens** - Homepage, login, dashboard, all features
5. **Compare with SPEC.md** - Ensure matches PRD
6. **Create Issues** - If bugs found, create Asana tasks

### Project Verification Checklist

#### RedditAutoMarket
- [ ] Auth flow (register/login)
- [ ] Database tables created
- [ ] Campaign CRUD
- [ ] Reddit OAuth
- [ ] AI comment generation
- [ ] Automation worker
- [ ] Analytics dashboard
- [ ] All UI screens

#### AgentWatch
- [ ] Dashboard loads
- [ ] Agent details view
- [ ] API endpoints work

#### SafeAgent
- [ ] Homepage loads
- [ ] Dashboard accessible

#### NexusAI
- [ ] Chat interface works
- [ ] RAG pipeline functional

### QA Output

**Pass:**
```
✅ QA Verified: [Project]
Tasks: X/Y complete
Issues: 0
Ready for: Deploy
```

**Fail:**
```
❌ QA Issues: [Project]
Tasks: X/Y complete
Issues Found: N
Created Asana tasks for each issue
```

---

*Last Updated: 2026-02-15*
*Commit: Run `git log -1 --oneline` to see latest*
