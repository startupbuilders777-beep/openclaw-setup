# Learnings Log

Learnings from corrections, knowledge gaps, and best practices discovered during work.

---

## [LRN-20260215-001] category: correction

**Logged**: 2026-02-15T21:00:00Z
**Priority**: critical
**Status**: resolved
**Area**: workflow

### Summary
Fake progress reporting - was posting numbers from local files instead of real Asana data

### Details
The cron jobs were posting "Progress Update - 10/30 tickets complete" but checking tasks/QUEUE.md local file. The actual Asana had different numbers. This led to completely fake progress reports.

### Suggested Action
- Removed agent-autonomy-kit skill (pushed local files)
- Added CRITICAL rule: NEVER use local files for tasks
- Fixed cron jobs to query real Asana API
- Updated all agent prompts to use Asana only

### Metadata
- Source: user_feedback
- Related Files: HEARTBEAT.md, MEMORY.md, agents/sage/system-prompt.md
- Tags: asana, fake-numbers, workflow

---
