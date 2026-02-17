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
    const { telegramUserId, priceId, successUrl, cancelUrl } = body

    if (!telegramUserId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields: telegramUserId, priceId' },
        { status: 400 }
      )
    }

    // Find or create Stripe customer
    let stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { telegramUserId },
    })

    let stripeCustomerId: string

    if (!stripeCustomer) {
      // Get Telegram user info
      const telegramUser = await prisma.telegramUser.findUnique({
        where: { id: telegramUserId },
      })

      if (!telegramUser) {
        return NextResponse.json(
          { error: 'Telegram user not found' },
          { status: 404 }
        )
      }

      // Create Stripe customer
      const customer = await stripe.customers.create({
        metadata: {
          telegramUserId,
          telegramUsername: telegramUser.username || '',
        },
        name: [telegramUser.firstName, telegramUser.lastName].filter(Boolean).join(' ') || undefined,
      })

      stripeCustomerId = customer.id

      // Save to database
      await prisma.stripeCustomer.create({
        data: {
          telegramUserId,
          stripeCustomerId: customer.id,
        },
      })
    } else {
      stripeCustomerId = stripeCustomer.stripeCustomerId
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        telegramUserId,
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
