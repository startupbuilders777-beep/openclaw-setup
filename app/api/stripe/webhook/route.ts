import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const telegramUserId = session.metadata?.telegramUserId

        if (telegramUserId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
            expand: ['data.items.data.price'],
          })
          const sub = subscription as unknown as {
            id: string
            status: Stripe.Subscription.Status
            current_period_start: number
            current_period_end: number
            items: { data: { price: { id: string } }[] }
          }
          
          await prisma.stripeCustomer.update({
            where: { telegramUserId },
            data: {
              stripeSubscriptionId: sub.id,
              subscriptionStatus: mapStripeStatus(sub.status),
              planType: getPlanType(sub.items.data[0]?.price.id),
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomerId = subscription.customer as string

        const customer = await prisma.stripeCustomer.findUnique({
          where: { stripeCustomerId },
        })

        if (customer) {
          // @ts-ignore - Stripe SDK type mismatch
          const periodStart = subscription.current_period_start
          // @ts-ignore - Stripe SDK type mismatch  
          const periodEnd = subscription.current_period_end
          
          await prisma.stripeCustomer.update({
            where: { id: customer.id },
            data: {
              subscriptionStatus: mapStripeStatus(subscription.status),
              planType: getPlanType(subscription.items.data[0]?.price.id),
              currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
              currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomerId = subscription.customer as string

        const customer = await prisma.stripeCustomer.findUnique({
          where: { stripeCustomerId },
        })

        if (customer) {
          await prisma.stripeCustomer.update({
            where: { id: customer.id },
            data: {
              stripeSubscriptionId: null,
              subscriptionStatus: 'CANCELED',
              planType: 'FREE',
              currentPeriodStart: null,
              currentPeriodEnd: null,
            },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const stripeCustomerId = invoice.customer as string

        const customer = await prisma.stripeCustomer.findUnique({
          where: { stripeCustomerId },
        })

        if (customer) {
          await prisma.stripeCustomer.update({
            where: { id: customer.id },
            data: {
              subscriptionStatus: 'PAST_DUE',
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

function mapStripeStatus(status: Stripe.Subscription.Status): 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'TRIALING' {
  const statusMap: Record<Stripe.Subscription.Status, 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'TRIALING'> = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    incomplete: 'INCOMPLETE',
    incomplete_expired: 'INCOMPLETE_EXPIRED',
    trialing: 'TRIALING',
    unpaid: 'PAST_DUE',
    paused: 'ACTIVE',
  }
  return statusMap[status] || 'CANCELED'
}

function getPlanType(priceId?: string): 'FREE' | 'PRO' | 'AGENCY' | 'ENTERPRISE' {
  if (!priceId) return 'FREE'
  
  // Map your Stripe price IDs to plan types
  // Replace with your actual price IDs
  const priceToPlan: Record<string, 'PRO' | 'AGENCY' | 'ENTERPRISE'> = {
    'price_pro_monthly': 'PRO',
    'price_agency_monthly': 'AGENCY',
    'price_enterprise_monthly': 'ENTERPRISE',
  }
  
  return priceToPlan[priceId] || 'FREE'
}
