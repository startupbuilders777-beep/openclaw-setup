# CODE REVIEW PROCESS

## Rules

1. **NEVER merge without review** - All PRs need review
2. **NEVER skip tests** - TypeScript type check + tests required
3. **Link PRs to Asana** - Use TASK-ID format
4. **Fresh context from Asana** - Read task before coding

---

## FRESH CONTEXT FLOW

### 1. Get Task Context
```bash
# Before coding, get fresh Asana context
TOKEN="2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd"

# Get task details
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://app.asana.com/api/1.0/tasks/TASK_GID?opt_fields=name,notes"
```

### 2. Code with Context
- Read acceptance criteria
- Write tests first (TDD)
- Implement feature
- Run type check
- Push PR

### 3. Code Review Agent
- Review PR
- Run CI locally first

---

## TDD WORKFLOW

### 1. Write Test First
```bash
# Test must fail first
npm run test
# Should fail: test expects feature to exist
```

### 2. Write Code
```bash
# Now implement feature
# Tests should pass
npm run test
```

### 3. Type Check
```bash
npm run type-check
npm run build
```

---

## PR CREATION

### Branch Format
```
feature/TASK-ID-description
task/TASK-ID-description
fix/TASK-ID-bug-description
```

### PR Template
```markdown
## Asana Task
- Task: [TASK-ID]
- URL: https://app.asana.com/0/.../TASK-ID

## Changes
- [ ] Tests added
- [ ] Type check passes
- [ ] Build succeeds
- [ ] No lint errors

## Test Results
```
npm run test
```
```

---

## CI/CD CHECKS

1. **TypeScript compile** - `npm run build`
2. **Tests** - `npm run test`
3. **Lint** - `npm run lint`

---

## OUTPUT

### Post to #builds
```
## PR Created: [TITLE]
- Task: [TASK-ID]
- Tests: [pass/fail]
- TypeCheck: [pass/fail]
```
