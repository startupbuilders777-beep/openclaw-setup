# Agent Prompt Engineering Learnings

*Valuable patterns from research.*

---

## Planning Prompt Addition

### "Anticipate any potential pitfalls"

**Source:** Sheldon Evans (@SheldonEvans)

**What:** Append "anticipate any potential pitfalls" to planning prompts

**Why:** Forces AI to consider:
- What could go wrong?
- Edge cases
- Failure modes
- Timing issues
- Validation needs

**When to use:**
- Planning any task
- Breaking down features
- Creating subtasks
- Before executing
- Code reviews

**Example:**
Instead of:
> "Break this task into subtasks"

Use:
> "Break this task into subtasks, anticipating any potential pitfalls"

---

## Action Prompt Addition

**Source:** Hartdrawss (@Hartdrawss)

**What:** Add "anticipate any potential pitfalls" to action prompts

**Why:** Catches issues before they happen

**When to use:**
- When executing commands
- When making decisions
- When writing code
- When testing

---

## How This Applies to Ralph Loop

### In Ralph Loop:

1. **Pick task** → "Pick task, anticipating any potential pitfalls"
2. **Break into subtasks** → "Break into subtasks, anticipating any potential pitfalls"
3. **Execute** → "Execute subtask, anticipating any potential pitfalls"
4. **Validate** → "Validate output, anticipating any potential pitfalls"

### In Asana Descriptions:

Add to every task:
```
## Pitfalls to Anticipate
- [ ] What could go wrong?
- [ ] Edge cases?
- [ ] Timing issues?
- [ ] Validation needs?
```

---

## Implementation

Add this phrase to:
- HEARTBEAT.md planning steps
- RALPH_LOOP.md execution steps
- Task descriptions in Asana
- Agent prompts

---

*Always anticipate. Always validate.*
