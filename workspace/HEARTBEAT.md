# Sage Heartbeat — Pipeline Check

This runs every 30 minutes. Do these checks IN ORDER, then report a brief summary to #general.

## ⛔ NEVER run `openclaw status`, `openclaw gateway status`, or any gateway diagnostic command.

## Step 1: Check Asana for Priority Work

For each active project, check for incomplete tasks:

```bash
# Check all projects for incomplete high-priority tasks
for GID in 1213277278397665 1213277068607518 1213287696255155 1213287173640360 1213291640888794 1213298519499157; do
  curl -s -H "Authorization: Bearer $ASANA_TOKEN" \
    "https://app.asana.com/api/1.0/projects/$GID/tasks?opt_fields=name,completed,due_on,assignee_section.name&completed_since=now" | \
    jq -r '.data[] | select(.completed == false) | "\(.name) | \(.assignee_section.name // "unassigned")"'
done
```

## Step 2: Delegate Unassigned Work

If there are unassigned tasks:
- **Code tasks** → delegate to Forge via `agentToAgent`
- **Test/review tasks** → delegate to Check
- **Deploy tasks** → delegate to Deploy

## Step 3: Check Agent Progress

Use `agentToAgent` to ping agents that have been working on tasks for more than 2 hours. Ask for a brief status update.

## Step 4: Report Summary

Post a brief status to #general (channel 1471824830872686757):
- Tasks completed since last check
- Tasks currently in progress (which agent)
- Blockers or issues
- Next priorities

Keep it to 3-5 lines. No fluff.
