import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendNotification, formatNotificationMessage } from '@/lib/notifications'

// Schema for updating notification preferences
const notificationPreferenceSchema = z.object({
  telegramEnabled: z.boolean().optional(),
  discordEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  onTaskComplete: z.boolean().optional(),
  onTaskFail: z.boolean().optional(),
  onAgentError: z.boolean().optional(),
  onBudgetAlert: z.boolean().optional(),
  onAgentNeedsInput: z.boolean().optional(),
  webhookUrl: z.string().url().optional().nullable(),
  webhookSecret: z.string().optional().nullable(),
})

// GET /api/notifications - Get notification preferences for authenticated user
export async function GET(request: NextRequest) {
  try {
    // For now, get user from query param or header (in real app, use auth)
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    })

    if (!preferences) {
      // Return defaults
      return NextResponse.json({
        telegramEnabled: true,
        discordEnabled: false,
        emailEnabled: false,
        onTaskComplete: true,
        onTaskFail: true,
        onAgentError: true,
        onBudgetAlert: true,
        onAgentNeedsInput: true,
        webhookUrl: null,
      })
    }

    // Don't expose webhook secret
    return NextResponse.json({
      ...preferences,
      webhookSecret: preferences.webhookSecret ? '***' : null,
    })
  } catch (error) {
    console.error('Get notification preferences error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/notifications - Update notification preferences
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const data = notificationPreferenceSchema.parse(body)
    
    const userId = body.userId
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // Upsert preferences
    const preferences = await prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    })

    // Don't expose webhook secret
    return NextResponse.json({
      ...preferences,
      webhookSecret: preferences.webhookSecret ? '***' : null,
    })
  } catch (error) {
    console.error('Update notification preferences error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/notifications - Send a test notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, eventType, message } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // Validate event type
    const validEvents = ['task.complete', 'task.fail', 'agent.error', 'budget.alert', 'agent.needs_input']
    if (eventType && !validEvents.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const notificationMessage = message || '🧪 This is a test notification from SuperClaw!'

    const result = await sendNotification({
      userId,
      eventType: eventType || 'task.complete',
      message: notificationMessage,
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
