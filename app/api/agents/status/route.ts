import { NextRequest, NextResponse } from 'next/server'

// Mock data for when database is unavailable
const mockAgents = [
  {
    id: '1',
    name: 'Killer',
    status: 'ACTIVE' as const,
    description: 'Coordinator - orchestrates the team',
    tasksCompleted: 147,
    tasksRunning: 1,
    uptime: '99.9%',
    dailyBudget: 50,
    monthlyBudget: 1000,
    totalCost: 234.56,
    totalTokens: 1250000,
    recentTask: {
      id: 't1',
      name: 'Build Mission Control Dashboard',
      status: 'RUNNING',
      cost: 0.0234,
      totalTokens: 45000,
      startedAt: new Date(Date.now() - 300000).toISOString(),
    },
  },
  {
    id: '2',
    name: 'Builder',
    status: 'ACTIVE' as const,
    description: 'Build Agent - implements features',
    tasksCompleted: 89,
    tasksRunning: 2,
    uptime: '98.5%',
    dailyBudget: 100,
    monthlyBudget: 2000,
    totalCost: 456.78,
    totalTokens: 2100000,
    recentTask: {
      id: 't2',
      name: 'Implement user auth',
      status: 'RUNNING',
      cost: 0.0456,
      totalTokens: 89000,
      startedAt: new Date(Date.now() - 600000).toISOString(),
    },
  },
  {
    id: '3',
    name: 'QA',
    status: 'ACTIVE' as const,
    description: 'Review Agent - tests and approves',
    tasksCompleted: 56,
    tasksRunning: 0,
    uptime: '99.2%',
    dailyBudget: 30,
    monthlyBudget: 500,
    totalCost: 89.12,
    totalTokens: 420000,
    recentTask: {
      id: 't3',
      name: 'Review PR #42',
      status: 'COMPLETED',
      cost: 0.0123,
      totalTokens: 12000,
      startedAt: new Date(Date.now() - 1800000).toISOString(),
    },
  },
  {
    id: '4',
    name: 'Deploy',
    status: 'INACTIVE' as const,
    description: 'Ship Agent - deploys to production',
    tasksCompleted: 34,
    tasksRunning: 0,
    uptime: '100%',
    dailyBudget: 20,
    monthlyBudget: 300,
    totalCost: 45.67,
    totalTokens: 180000,
    recentTask: null,
  },
]

const mockActivity = [
  { id: 'a1', agentName: 'Killer', action: 'task.start', details: { task: 'Build dashboard' }, createdAt: new Date(Date.now() - 60000).toISOString() },
  { id: 'a2', agentName: 'Builder', action: 'task.complete', details: { task: 'API endpoint' }, createdAt: new Date(Date.now() - 180000).toISOString() },
  { id: 'a3', agentName: 'QA', action: 'task.start', details: { task: 'Review code' }, createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'a4', agentName: 'Deploy', action: 'deploy.success', details: { version: 'v2.1.0' }, createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: 'a5', agentName: 'Builder', action: 'task.start', details: { task: 'Add tests' }, createdAt: new Date(Date.now() - 900000).toISOString() },
]

// GET /api/agents/status - Get real-time agent status
export async function GET(request: NextRequest) {
  try {
    // Try to import prisma - will fail if DATABASE_URL not set
    let prisma
    try {
      const { prisma: p } = await import('@/lib/prisma')
      prisma = p
    } catch {
      // No database - use mock data
      return NextResponse.json({
        agents: mockAgents,
        activity: mockActivity,
        metrics: {
          totalCost: mockAgents.reduce((s, a) => s + a.totalCost, 0),
          totalTokens: mockAgents.reduce((s, a) => s + a.totalTokens, 0),
          totalTasks: mockAgents.reduce((s, a) => s + a.tasksCompleted, 0),
          totalErrors: 2,
        },
        source: 'mock',
      })
    }

    // Get all agents with their recent tasks and usage
    const agents = await prisma.agent.findMany({
      include: {
        tasks: {
          where: {
            startedAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { startedAt: 'desc' },
          take: 10,
        },
        usageRecords: {
          orderBy: { date: 'desc' },
          take: 7,
        },
        _count: {
          select: {
            tasks: true,
            errorLogs: true,
          },
        },
      },
    })

    // Get recent audit logs for activity feed
    const recentActivity = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        agent: {
          select: { name: true },
        },
      },
    })

    // Calculate totals
    const totalCost = agents.reduce((sum, agent) => {
      return sum + agent.usageRecords.reduce((s, r) => s + r.cost, 0)
    }, 0)

    const totalTokens = agents.reduce((sum, agent) => {
      return sum + agent.usageRecords.reduce((s, r) => s + r.totalTokens, 0)
    }, 0)

    return NextResponse.json({
      agents: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        status: agent.status,
        description: agent.description,
        tasksCompleted: agent.tasks.filter(t => t.status === 'COMPLETED').length,
        tasksRunning: agent.tasks.filter(t => t.status === 'RUNNING').length,
        uptime: '99.9%',
        dailyBudget: agent.dailyBudget,
        monthlyBudget: agent.monthlyBudget,
        totalCost: agent.usageRecords.reduce((s, r) => s + r.cost, 0),
        totalTokens: agent.usageRecords.reduce((s, r) => s + r.totalTokens, 0),
        recentTask: agent.tasks[0] || null,
      })),
      activity: recentActivity.map(log => ({
        id: log.id,
        agentName: log.agent.name,
        action: log.action,
        details: log.details,
        createdAt: log.createdAt,
      })),
      metrics: {
        totalCost,
        totalTokens,
        totalTasks: agents.reduce((sum, a) => sum + a._count.tasks, 0),
        totalErrors: agents.reduce((sum, a) => sum + a._count.errorLogs, 0),
      },
      source: 'database',
    })
  } catch (error) {
    console.error('Get agent status error:', error)
    // Fallback to mock data on any error
    return NextResponse.json({
      agents: mockAgents,
      activity: mockActivity,
      metrics: {
        totalCost: mockAgents.reduce((s, a) => s + a.totalCost, 0),
        totalTokens: mockAgents.reduce((s, a) => s + a.totalTokens, 0),
        totalTasks: mockAgents.reduce((s, a) => s + a.tasksCompleted, 0),
        totalErrors: 2,
      },
      source: 'mock',
    })
  }
}
