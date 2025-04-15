import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { COLLECTIONS } from '@/lib/models';




export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const endpoint = subscription?.endpoint;

    if (!endpoint) {
      return NextResponse.json({ error: 'No endpoint provided' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection(COLLECTIONS.PUSH_SUBSCRIPTIONS).deleteOne({
      'subscription.endpoint': endpoint
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from push notifications' },
      { status: 500 }
    );
  }
}
