import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const telegramUserId = searchParams.get('telegramUserId')

    if (!telegramUserId) {
      return NextResponse.json(
        { error: 'Missing required query param: telegramUserId' },
        { status: 400 }
      )
    }

    const stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { telegramUserId },
    })

    if (!stripeCustomer) {
      return NextResponse.json({
        hasSubscription: false,
        planType: 'FREE',
        subscriptionStatus: null,
      })
    }

    return NextResponse.json({
      hasSubscription: !!stripeCustomer.stripeSubscriptionId,
      planType: stripeCustomer.planType || 'FREE',
      subscriptionStatus: stripeCustomer.subscriptionStatus,
      currentPeriodStart: stripeCustomer.currentPeriodStart,
      currentPeriodEnd: stripeCustomer.currentPeriodEnd,
    })
  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    )
  }
}
