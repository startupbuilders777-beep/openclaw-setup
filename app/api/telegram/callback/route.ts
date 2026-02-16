import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/telegram/callback - Complete OAuth authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find user by auth token
    const user = await prisma.telegramUser.findUnique({
      where: { authToken: token },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if token is expired
    if (user.authTokenExpiry && user.authTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 401 }
      )
    }

    // Mark user as authenticated and clear the token
    await prisma.telegramUser.update({
      where: { id: user.id },
      data: {
        isAuthenticated: true,
        authToken: null,
        authTokenExpiry: null,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        isAuthenticated: true,
      },
    })
  } catch (error) {
    console.error('Telegram callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/telegram/callback - Validate token for web-based auth
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find user by auth token
    const user = await prisma.telegramUser.findUnique({
      where: { authToken: token },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if token is expired
    if (user.authTokenExpiry && user.authTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 401 }
      )
    }

    // Return user info for confirmation page
    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
      },
    })
  } catch (error) {
    console.error('Telegram callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
