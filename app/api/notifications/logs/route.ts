import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/notifications/logs - Get notification logs for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const status = request.nextUrl.searchParams.get('status')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const where: any = { userId }
    if (status) {
      where.status = status
    }

    const [logs, total] = await Promise.all([
      prisma.notificationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(limit, 100),
        skip: offset,
      }),
      prisma.notificationLog.count({ where }),
    ])

    return NextResponse.json({
      logs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + logs.length < total,
      },
    })
  } catch (error) {
    console.error('Get notification logs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
