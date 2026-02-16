import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Notification types
export type NotificationEventType = 
  | 'task.complete' 
  | 'task.fail' 
  | 'agent.error' 
  | 'budget.alert' 
  | 'agent.needs_input'

export interface SendNotificationParams {
  userId: string
  eventType: NotificationEventType
  message: string
  agentId?: string
  taskId?: string
  metadata?: Record<string, unknown>
}

// Send notification to user via their preferred channels
export async function sendNotification({
  userId,
  eventType,
  message,
  agentId,
  taskId,
  metadata,
}: SendNotificationParams) {
  // Get user preferences
  const preferences = await prisma.notificationPreference.findUnique({
    where: { userId },
  })

  if (!preferences) {
    console.log(`No notification preferences for user ${userId}`)
    return
  }

  // Determine which channels to send to based on event type and preferences
  const channels: Array<'TELEGRAM' | 'DISCORD' | 'EMAIL' | 'WEBHOOK'> = []
  
  const shouldSendTelegram = preferences.telegramEnabled && (
    (eventType === 'task.complete' && preferences.onTaskComplete) ||
    (eventType === 'task.fail' && preferences.onTaskFail) ||
    (eventType === 'agent.error' && preferences.onAgentError) ||
    (eventType === 'budget.alert' && preferences.onBudgetAlert) ||
    (eventType === 'agent.needs_input' && preferences.onAgentNeedsInput)
  )
  
  const shouldSendDiscord = preferences.discordEnabled && shouldSendTelegram
  const shouldSendEmail = preferences.emailEnabled && shouldSendTelegram
  
  if (shouldSendTelegram) channels.push('TELEGRAM')
  if (shouldSendDiscord) channels.push('DISCORD')
  if (shouldSendEmail) channels.push('EMAIL')
  if (preferences.webhookUrl) channels.push('WEBHOOK')

  // Get user for contact info
  const user = await prisma.telegramUser.findUnique({
    where: { id: userId },
  })

  // Send to each channel
  const results = await Promise.all(
    channels.map(channel => 
      deliverNotification({
        channel,
        userId,
        eventType,
        message,
        agentId,
        taskId,
        user,
        webhookUrl: preferences.webhookUrl,
        webhookSecret: preferences.webhookSecret,
        metadata,
      })
    )
  )

  return results
}

interface DeliverParams {
  channel: 'TELEGRAM' | 'DISCORD' | 'EMAIL' | 'WEBHOOK'
  userId: string
  eventType: string
  message: string
  agentId?: string
  taskId?: string
  user?: any
  webhookUrl?: string | null
  webhookSecret?: string | null
  metadata?: Record<string, unknown>
}

async function deliverNotification({
  channel,
  userId,
  eventType,
  message,
  agentId,
  taskId,
  user,
  webhookUrl,
  webhookSecret,
  metadata,
}: DeliverParams) {
  // Create notification log entry
  const notificationLog = await prisma.notificationLog.create({
    data: {
      userId,
      channel,
      eventType,
      message,
      agentId,
      taskId,
      status: 'PENDING',
    },
  })

  try {
    let success = false

    switch (channel) {
      case 'TELEGRAM':
        success = await sendTelegramNotification(user?.telegramId, message)
        break
      case 'DISCORD':
        success = await sendDiscordNotification(user?.discordId, message)
        break
      case 'EMAIL':
        success = await sendEmailNotification(user?.email, message)
        break
      case 'WEBHOOK':
        success = await sendWebhookNotification(webhookUrl!, webhookSecret!, {
          event: eventType,
          message,
          agentId,
          taskId,
          metadata,
        })
        break
    }

    // Update log with result
    await prisma.notificationLog.update({
      where: { id: notificationLog.id },
      data: {
        status: success ? 'SENT' : 'FAILED',
        sentAt: success ? new Date() : null,
      },
    })

    return { channel, success }
  } catch (error: any) {
    await prisma.notificationLog.update({
      where: { id: notificationLog.id },
      data: {
        status: 'FAILED',
        errorMessage: error.message,
      },
    })
    return { channel, success: false, error: error.message }
  }
}

// Telegram notification sender
async function sendTelegramNotification(telegramId: string | null, message: string) {
  if (!telegramId) return false
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN not configured')
    return false
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text: message,
        parse_mode: 'HTML',
      }),
    })
    return response.ok
  } catch (error) {
    console.error('Telegram send error:', error)
    return false
  }
}

// Discord notification sender
async function sendDiscordNotification(discordId: string | null, message: string) {
  if (!discordId) return false
  
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL not configured')
    return false
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `<@${discordId}> ${message}`,
      }),
    })
    return response.ok
  } catch (error) {
    console.error('Discord send error:', error)
    return false
  }
}

// Email notification sender
async function sendEmailNotification(email: string | null, message: string) {
  if (!email) return false
  
  // Use Resend, SendGrid, or similar
  const apiKey = process.env.EMAIL_API_KEY
  if (!apiKey) {
    console.error('EMAIL_API_KEY not configured')
    return false
  }

  // Implement based on provider (Resend example)
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'SuperClaw <notifications@superclaw.ai>',
        to: email,
        subject: 'SuperClaw Notification',
        text: message,
      }),
    })
    return response.ok
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

// Webhook notification sender
async function sendWebhookNotification(
  webhookUrl: string, 
  webhookSecret: string | null, 
  payload: any
) {
  try {
    const body = JSON.stringify(payload)
    
    // Sign the payload if secret is provided
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (webhookSecret) {
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex')
      headers['X-SuperClaw-Signature'] = signature
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body,
    })
    return response.ok
  } catch (error) {
    console.error('Webhook send error:', error)
    return false
  }
}

// Helper to format notification messages
export function formatNotificationMessage(
  eventType: NotificationEventType,
  data: {
    agentName?: string
    taskName?: string
    error?: string
    budget?: number
    inputRequired?: string
  }
): string {
  const emoji = {
    'task.complete': '✅',
    'task.fail': '❌',
    'agent.error': '⚠️',
    'budget.alert': '💰',
    'agent.needs_input': '🤔',
  }[eventType]

  switch (eventType) {
    case 'task.complete':
      return `${emoji} Task Completed\n\nAgent: ${data.agentName}\nTask: ${data.taskName}`
    case 'task.fail':
      return `${emoji} Task Failed\n\nAgent: ${data.agentName}\nTask: ${data.taskName}\nError: ${data.error}`
    case 'agent.error':
      return `${emoji} Agent Error\n\nAgent: ${data.agentName}\nError: ${data.error}`
    case 'budget.alert':
      return `${emoji} Budget Alert\n\nAgent: ${data.agentName}\nCurrent spend: $${data.budget}`
    case 'agent.needs_input':
      return `${emoji} Input Required\n\nAgent: ${data.agentName}\n${data.inputRequired}`
    default:
      return `${emoji} Notification\n\n${JSON.stringify(data)}`
  }
}
