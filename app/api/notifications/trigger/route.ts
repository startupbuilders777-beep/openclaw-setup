import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendNotification, formatNotificationMessage } from '@/lib/notifications'

// Schema for trigger notification
const triggerSchema = z.object({
  agentId: z.string().optional(),
  agentName: z.string().optional(),
  eventType: z.enum([
    'task.complete',
    'task.fail', 
    'agent.error',
    'budget.alert',
    'agent.needs_input',
  ]),
  taskName: z.string().optional(),
  error: z.string().optional(),
  budget: z.number().optional(),
  inputRequired: z.string().optional(),
  userId: z.string().optional(), // Optional: send to specific user
})

// POST /api/notifications/trigger - Trigger a notification from an agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = triggerSchema.parse(body)

    // Find the agent and its owner
    let userId = data.userId
    
    if (!userId && data.agentId) {
      const agent = await prisma.agent.findUnique({
        where: { id: data.agentId },
        include: { owner: true },
      })
      
      if (agent?.ownerId) {
        userId = agent.ownerId
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId or agentId required' },
        { status: 400 }
      )
    }

    // Format the notification message
    const message = formatNotificationMessage(data.eventType, {
      agentName: data.agentName,
      taskName: data.taskName,
      error: data.error,
      budget: data.budget,
      inputRequired: data.inputRequired,
    })

    // Send the notification
    const result = await sendNotification({
      userId,
      eventType: data.eventType,
      message,
      agentId: data.agentId,
    })

    return NextResponse.json({
      success: true,
      message: 'Notification sent',
      result,
    })
  } catch (error) {
    console.error('Trigger notification error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/notifications/trigger - Info
export async function GET() {
  return NextResponse.json({
    name: 'SuperClaw Notification Trigger',
    version: '1.0.0',
    usage: 'POST with JSON body',
    fields: {
      agentId: 'Agent ID (optional if userId provided)',
      agentName: 'Agent name for display',
      eventType: 'task.complete | task.fail | agent.error | budget.alert | agent.needs_input',
      taskName: 'Name of the task (optional)',
      error: 'Error message (for task.fail, agent.error)',
      budget: 'Current budget spend (for budget.alert)',
      inputRequired: 'Description of input needed (for agent.needs_input)',
      userId: 'Specific user to notify (optional, uses agent owner)',
    },
    example: {
      agentId: 'abc123',
      agentName: 'Content Writer',
      eventType: 'task.complete',
      taskName: 'Write blog post',
    },
  })
}
