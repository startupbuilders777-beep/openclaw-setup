# Ralph Loop — Execution Framework

## Overview

Ralph Loop is my execution engine. It transforms Asana tasks into shippable code through a disciplined, TDD-driven process.

---

## THE LOOP

```
1. FRESH CONTEXT → Get Asana task details
2. BREAK → Create subtasks/checklist
3. CODE → Implement with TDD
4. VALIDATE → Run tests + type checks
5. COMPLETE → Mark done in Asana
```

---

## 1. FRESH CONTEXT

**Before touching code, ALWAYS get fresh context from Asana:**

```bash
TOKEN="2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd"
TASK_GID="1213287174963537"

# Get task with full details
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://app.asana.com/api/1.0/tasks/$TASK_GID?opt_fields=name,notes,assignee,due_date,custom_fields"
```

**What to capture:**
- Task name + description
- Acceptance criteria
- Technical notes
- Dependencies

---

## 2. BREAK (Subtasks)

If task is large, break into subtasks:

```bash
# Create subtask
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"name": "Subtask name", "parent": "TASK_GID"}}' \
  "https://app.asana.com/api/1.0/subtasks"
```

---

## 3. CODE (TDD)

### Test First, Then Code

```bash
# 1. Write test first (must fail)
npm run test
# Expected: FAIL - feature doesn't exist yet

# 2. Implement feature
# ... code ...

# 3. Run tests again (should pass)
npm run test
```

### Pre-commit Checks

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

All must pass before pushing.

---

## 4. VALIDATE

### Checklist

- [ ] Tests pass (`npm run test`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] No lint errors
- [ ] PR created (if applicable)

### Run Locally

```bash
# Full validation
npm run type-check && npm run lint && npm run test && npm run build
```

---

## 5. COMPLETE

### Mark Task Done

```bash
curl -s -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"completed": true}}' \
  "https://app.asana.com/api/1.0/tasks/$TASK_GID"
```

### Add Completion Comment

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"text": "✅ Completed - [summary of work]"}}' \
  "https://app.asana.com/api/1.0/tasks/$TASK_GID/stories"
```

---

## Branch Strategy

```
feature/TASK-ID-description
fix/TASK-ID-bug-description
```

### Commit Format

```
[TASK-ID] Brief description

- What changed
- Why
```

---

## Quick Start

```bash
# Pick task → Fresh context → Code → Validate → Complete

# 1. Get task
TASK_GID="1213287174963537"

# 2. Fresh Asana context
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://app.asana.com/api/1.0/tasks/$TASK_GID?opt_fields=name,notes"

# 3. TDD
npm run test  # Write failing test first
# ... implement ...
npm run test  # Should pass

# 4. Pre-push checks
npm run type-check && npm run build

# 5. Commit
git add -A
git commit -m "[TASK-ID] Description"

# 6. Mark complete
curl -s -X PUT -H "Authorization: Bearer $TOKEN" \
  -d '{"data": {"completed": true}}' \
  "https://app.asana.com/api/1.0/tasks/$TASK_GID"
```

---

## Anti-Patterns

❌ **No stale context** - Always query fresh Asana data  
❌ **Skip tests** - TDD or no code  
❌ **Skip type check** - Must pass before push  
❌ **Skip lint** - Code style matters  
❌ **Skip build** - Must compile successfully  
❌ **Fake progress** - Don't mark done until validated

---

*Test first. Validate. Complete.*
