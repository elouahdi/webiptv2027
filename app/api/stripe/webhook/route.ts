import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-16.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { email, firstName, lastName, device, macAddress, pack } = session.metadata || {};

      console.log('✅ Paiement réussi !');
      console.log('Email:', email);
      console.log('Nom:', firstName, lastName);
      console.log('Pack:', pack);
      console.log('Device:', device);
      console.log('MAC:', macAddress);

      // TODO: Envoyer email avec identifiants
      // TODO: Activer l'abonnement dans la base
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
