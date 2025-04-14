import { NextResponse } from 'next/server';
import webPush from 'web-push';
import { connectToDatabase } from '@/lib/mongodb';
import { COLLECTIONS, type PushSubscription } from '@/lib/models';

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  throw new Error('VAPID keys must be set');
}

webPush.setVapidDetails(
  'mailto:vidhalelame@gmail.org',
  publicKey,
  privateKey
);

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const { db } = await connectToDatabase();

    await db.collection<PushSubscription>(COLLECTIONS.PUSH_SUBSCRIPTIONS).insertOne({
      subscription,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to push notifications' },
      { status: 500 }
    );
  }
}