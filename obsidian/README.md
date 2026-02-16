# Obsidian Setup

## Vault Location
```
/home/ubuntu/.openclaw/workspace/obsidian
```

## Sync with Obsidian App
1. Open Obsidian
2. Open vault: `~/.openclaw/workspace/obsidian`
3. Enable Sync (optional)

## Folder Structure

```
obsidian/
├── daily/           # Daily notes (auto-generated)
│   └── YYYY-MM-DD.md
├── projects/        # Project-specific notes
│   └── [project]/
│       ├── SPEC.md
│       ├── RETROSPECTIVE.md
│       └── DEBUG.md
├── learnings/       # Hard lessons
│   └── TAGS/
├── templates/       # Reusable templates
│   ├── daily.md
│   ├── project-retro.md
│   └── bug-report.md
└── inbox/          # Quick captures
```

## Templates

### Daily Note
```markdown
# {{date}}

## Tasks
- [ ] 

## Learnings
- 

## Blockers
- 

## Tomorrow
- 
```

### Project Retrospective
```markdown
# {{project}} - Retro

## What Worked
- 

## What Didn't
- 

## Fixes Needed
- 

## Next Sprint
- 
```

### Bug Report
```markdown
# Bug: [title]

## Environment
- 

## Steps to Reproduce
1. 

## Expected
- 

## Actual
- 

## Fix
- 
```

## Integration with Ralph Loop

### Before Coding
1. Read project notes in `obsidian/projects/[project]/`
2. Check `SPEC.md` for requirements

### After Testing
1. Create bug note in `obsidian/inbox/`
2. Link to Asana task

### Daily
1. Create/update `obsidian/daily/YYYY-MM-DD.md`
2. Log learnings

## Keyboard Shortcuts (Obsidian)
- `Ctrl+N` - New note
- `Ctrl+Shift+N` - New daily note
- `Ctrl+K` - Quick switcher
- `Ctrl+[[` - Navigate backlinks
