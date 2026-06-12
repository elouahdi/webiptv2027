import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packKey } = body;

    const prices: Record<string, number> = {
      '1mois': 17.99, '3mois': 26.99, '6mois': 36.99, '12mois': 46.99, '24mois': 89.99,
    };
    const amount = prices[packKey] || 46.99;

    const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY!;
    
    const res = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: 'eur',
        pay_currency: 'btc,eth,usdt,ltc',
        order_id: `IPTV-${Date.now()}`,
        order_description: `Abonnement IPTV ${packKey}`,
      }),
    });
    const data = await res.json();
    return NextResponse.json({ payment_url: data.invoice_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
