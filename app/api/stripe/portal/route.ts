import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegramUserId, returnUrl } = body

    if (!telegramUserId) {
      return NextResponse.json(
        { error: 'Missing required field: telegramUserId' },
        { status: 400 }
      )
    }

    const stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { telegramUserId },
    })

    if (!stripeCustomer || !stripeCustomer.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found for this user' },
        { status: 404 }
      )
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      return_url: returnUrl || process.env.NEXT_PUBLIC_APP_URL,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
