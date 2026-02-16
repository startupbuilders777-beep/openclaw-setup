import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes, createHash } from 'crypto'

// Telegram Bot API base URL
const TELEGRAM_API_URL = 'https://api.telegram.org'

// Get bot token from env
function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured')
  }
  return token
}

// Send message to Telegram user
async function sendMessage(chatId: string, text: string, keyboard?: any) {
  const token = getBotToken()
  const url = `${TELEGRAM_API_URL}/bot${token}/sendMessage`
  
  const payload: any = {
    chat_id: chatId,
    text: text,
  }
  
  if (keyboard) {
    payload.reply_markup = keyboard
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  
  return response.json()
}

// Generate auth token for OAuth
function generateAuthToken(): string {
  return randomBytes(32).toString('hex')
}

// Create OAuth URL for the user
function createOAuthUrl(authToken: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${appUrl}/auth/telegram?token=${authToken}`
}

// Telegram Update types (simplified)
interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

interface TelegramMessage {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  text?: string
  command?: string
}

interface TelegramCallbackQuery {
  id: string
  from: TelegramUser
  message?: TelegramMessage
  data?: string
}

interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

interface TelegramChat {
  id: number
  type: string
}

// POST /api/telegram/webhook - Handle incoming Telegram updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const update: TelegramUpdate = body

    // Handle /start command
    if (update.message?.text === '/start') {
      await handleStartCommand(update.message)
    }
    // Handle /auth command for OAuth
    else if (update.message?.text === '/auth') {
      await handleAuthCommand(update.message)
    }
    // Handle /help command
    else if (update.message?.text === '/help') {
      await handleHelpCommand(update.message)
    }
    // Handle callback queries (button clicks)
    else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/telegram/webhook - Webhook info
export async function GET() {
  return NextResponse.json({
    name: 'SuperClaw Telegram Webhook',
    version: '1.0.0',
    commands: [
      { command: '/start', description: 'Start and create account' },
      { command: '/auth', description: 'Generate OAuth link' },
      { command: '/help', description: 'Show help information' },
    ],
  })
}

// Handle /start command
async function handleStartCommand(message: TelegramMessage) {
  const chatId = message.chat.id.toString()
  const from = message.from

  if (!from) {
    await sendMessage(chatId, 'Unable to identify user. Please try again.')
    return
  }

  // Check if user already exists
  let user = await prisma.telegramUser.findUnique({
    where: { telegramId: from.id.toString() },
  })

  const firstName = from.first_name || 'User'
  const lastName = from.last_name || null
  const username = from.username || null
  const languageCode = from.language_code || null
  const isPremium = from.is_premium || false

  if (!user) {
    // Create new user
    user = await prisma.telegramUser.create({
      data: {
        telegramId: from.id.toString(),
        firstName,
        lastName,
        username,
        languageCode,
        isPremium,
      },
    })

    await sendMessage(
      chatId,
      `🎉 *Welcome to SuperClaw, ${firstName}!*\n\n` +
      `Your account has been created successfully.\n\n` +
      `What would you like to do?\n\n` +
      `• /auth - Get your OAuth link to link your account to the web app\n` +
      `• /help - See all available commands`,
      {
        parse_mode: 'Markdown',
      }
    )
  } else {
    // Update existing user info
    await prisma.telegramUser.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        username,
        languageCode,
        isPremium,
      },
    })

    await sendMessage(
      chatId,
      `👋 *Welcome back, ${firstName}!*\n\n` +
      `You're already a SuperClaw member.\n\n` +
      `• /auth - Get your OAuth link\n` +
      `• /help - See all commands`,
      {
        parse_mode: 'Markdown',
      }
    )
  }
}

// Handle /auth command - Generate OAuth link
async function handleAuthCommand(message: TelegramMessage) {
  const chatId = message.chat.id.toString()
  const from = message.from

  if (!from) {
    await sendMessage(chatId, 'Unable to identify user. Please try again.')
    return
  }

  const user = await prisma.telegramUser.findUnique({
    where: { telegramId: from.id.toString() },
  })

  if (!user) {
    await sendMessage(
      chatId,
      `Please run /start first to create your account.`
    )
    return
  }

  // Generate new auth token
  const authToken = generateAuthToken()
  const authTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await prisma.telegramUser.update({
    where: { id: user.id },
    data: {
      authToken,
      authTokenExpiry,
      isAuthenticated: false,
    },
  })

  const oauthUrl = createOAuthUrl(authToken)

  await sendMessage(
    chatId,
    `🔐 *Authentication Link*\n\n` +
    `Use this link to authenticate with the SuperClaw web app:\n\n` +
    `[Click here to authenticate](${oauthUrl})\n\n` +
    `⏰ This link expires in 24 hours.\n\n` +
    `After authenticating, you'll be able to manage your agents from Telegram.`,
    {
      parse_mode: 'Markdown',
    }
  )
}

// Handle /help command
async function handleHelpCommand(message: TelegramMessage) {
  const chatId = message.chat.id.toString()

  await sendMessage(
    chatId,
    `📖 *SuperClaw Commands*\n\n` +
    `• /start - Create your account or welcome back\n` +
    `• /auth - Generate OAuth link for web app\n` +
    `• /help - Show this help message\n\n` +
    `SuperClaw helps you monitor and manage your AI agents.`,
    {
      parse_mode: 'Markdown',
    }
  )
}

// Handle callback queries (button clicks)
async function handleCallbackQuery(callback: TelegramCallbackQuery) {
  const chatId = callback.from.id.toString()
  const data = callback.data

  if (data?.startsWith('auth_')) {
    // Handle auth button clicks
    const action = data.replace('auth_', '')
    
    if (action === 'generate') {
      // Re-generate auth token
      const user = await prisma.telegramUser.findUnique({
        where: { telegramId: callback.from.id.toString() },
      })

      if (user) {
        const authToken = generateAuthToken()
        const authTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await prisma.telegramUser.update({
          where: { id: user.id },
          data: {
            authToken,
            authTokenExpiry,
          },
        })

        const oauthUrl = createOAuthUrl(authToken)

        await sendMessage(
          chatId,
          `🔐 *New Authentication Link*\n\n` +
          `[Click here to authenticate](${oauthUrl})\n\n` +
          `⏰ Expires in 24 hours.`,
          {
            parse_mode: 'Markdown',
          }
        )
      }
    }
  }
}
