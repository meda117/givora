import { NextRequest, NextResponse } from 'next/server';
import { generateOrderNumber } from '@/lib/utils';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, total } = body;

    if (!items?.length || !shippingAddress || !paymentMethod || total === undefined) {
      return NextResponse.json(
        { error: 'Missing required order fields' },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const orderId = `order_${Date.now()}`;

    const order = {
      id: orderId,
      orderNumber,
      ...body,
      status: 'new',
      paymentStatus: 'pending',
      timeline: [
        {
          id: `evt_${Date.now()}`,
          status: 'new',
          note: 'Order placed',
          isInternal: false,
          createdAt: new Date().toISOString(),
          createdBy: 'customer',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save directly to Firestore orders collection
    await setDoc(doc(db, COLLECTIONS.ORDERS, orderId), order);

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      order,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
