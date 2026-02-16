# OpenClaw Lite - No-Code Agent Platform

## Vision

**"OpenClaw for everyone"**

Let non-technical users sign up via Telegram or Discord and get an instant AI agent. One-click. No setup. No technical knowledge required.

---

## The Problem

OpenClaw is powerful but too technical for most users:
- Requires Git, API keys, infrastructure
- Needs technical setup
- No simple onboarding

---

## The Solution

**OpenClaw Lite** = OpenClaw, but simple:

1. User signs up via Telegram/Discord
2. We provision their agent instantly
3. They pick skills (Marketing, SEO, Content, etc.)
4. Agent starts working

---

## How It Works

```
User → /start on Telegram
     → OAuth → Create account
     → Choose skills
     → Agent provisioned
     → Agent starts working
```

---

## Core Features

### 1. Telegram Signup
- /start command
- OAuth flow
- Account creation
- Welcome message with agent status

### 2. Discord Signup  
- /slash commands
- OAuth flow
- Account creation
- Dashboard link

### 3. Agent Provisioning
- Clone base config
- Isolated environment per user
- Start their agent
- Assign skills

### 4. Skill Selection
- Marketing Copywriter
- SEO Specialist
- Content Creator
- Customer Support
- Data Analyst
- Custom (user defines)

### 5. User Dashboard
- Agent status
- Usage stats
- Skill configuration
- Billing

### 6. Multi-tenant Infrastructure
- EC2 per user OR
- Containerized per user
- Cost-effective isolation

---

## Revenue Model

| Tier | Price | Features |
|------|--------|-----------|
| **Free** | $0 | 1 agent, 100 msgs/day |
| **Starter** | $9/mo | 3 agents, 1k msgs/day |
| **Pro** | $29/mo | 10 agents, unlimited |
| **Agency** | $99/mo | Unlimited + team |

---

## Technical Architecture

```
┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  Telegram   │────▶│  Webhook    │────▶│  Provision │
│  Discord   │     │  Handler    │     │  Engine    │
└──────────────┘     └──────────────┘     └─────────────┘
                                                    │
                                             ┌──────┴──────┐
                                             │  Per-User   │
                                             │  Environment │
                                             │  (Docker/VM) │
                                             └─────────────┘
```

---

## Implementation Phases

### Phase 1: MVP (Week 1-2)
1. Telegram webhook handler
2. User account creation
3. Simple agent provisioning
4. Basic dashboard

### Phase 2: Discord + Features (Week 3)
1. Discord OAuth
2. Skill selection UI
3. More provisioning options

### Phase 3: Scale (Week 4+)
1. Multi-tenant infrastructure
2. Stripe billing
3. Analytics

---

## Questions for Harry

1. **Infrastructure**: EC2 per user (expensive) or container-based?
2. **Agent base config**: What should the default skills be?
3. **Limits**: Any rate limits on free tier?
4. **Branding**: "OpenClaw Lite" or different name?
