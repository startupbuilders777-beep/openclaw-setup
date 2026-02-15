---
name: agent-browser
description: Headless browser automation for AI agents. Use for web scraping, automation, testing, and research.
homepage: https://github.com/vercel-labs/agent-browser
---

# Agent Browser Skill

Headless browser automation CLI for AI agents. Fast browser control for web scraping, automation, and research.

## Installation

```bash
npm install -g agent-browser
agent-browser install  # Download Chromium
```

## Setup Check

First time:
```bash
agent-browser install
```

## Core Commands

### Navigate
```bash
agent-browser open https://example.com
agent-browser go https://google.com
```

### Snapshot (Best for AI)
```bash
agent-browser snapshot  # Get accessibility tree
```

### Click
```bash
agent-browser click @e2  # Click by ref from snapshot
agent-browser click "#submit"  # Traditional selector
```

### Fill Forms
```bash
agent-browser fill @e3 "test@example.com"
agent-browser fill "#email" "test@example.com"
```

### Get Content
```bash
agent-browser get text @e1
agent-browser get title
agent-browser get url
```

### Screenshot
```bash
agent-browser screenshot page.png
agent-browser screenshot --full full.png
```

### Close
```bash
agent-browser close
```

## Best Practices

1. **Always snapshot first** - Get the accessibility tree before interacting
2. **Use refs (@e1, @e2)** - More reliable than CSS selectors
3. **Anticipate pitfalls** - When planning, ask "what could go wrong?"
4. **Check for errors** - Validate after each action

## Planning Prompt

When planning browser automation, append:
> "Anticipate any potential pitfalls"

This forces consideration of:
- Page load timing
- Element visibility
- Form validation
- Redirects
- Errors

## Research Workflow

1. `agent-browser open <url>`
2. `agent-browser snapshot` - See what's there
3. `agent-browser click/fill` - Interact
4. `agent-browser get text` - Extract data
5. `agent-browser screenshot` - Verify
6. `agent-browser close`

## Examples

### Search Hacker News
```bash
agent-browser open https://news.ycombinator.com
agent-browser snapshot
agent-browser click @e5  # Click first story
agent-browser get text @title
```

### Fill a Form
```bash
agent-browser open https://example.com/form
agent-browser fill "#email" "test@test.com"
agent-browser fill "#password" "secret"
agent-browser click "button[type=submit]"
```

---

*Browser automation made simple.*
