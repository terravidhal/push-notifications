import { NextResponse } from 'next/server';
import webPush from 'web-push';
import { connectToDatabase } from '@/lib/mongodb';

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

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    
    // Get a random message
    const message = await db.collection('messages')
      .aggregate([{ $sample: { size: 1 } }])
      .next();

    if (!message) {
      throw new Error('No messages found');
    }

    // Get all subscriptions
    const subscriptions = await db.collection('push_subscriptions')
      .find({})
      .toArray();

    // Send the notification to all subscribers
    const notifications = subscriptions.map(async ({ subscription }) => {
      try {
        await webPush.sendNotification(
          subscription,
          JSON.stringify({
            title: 'Daily Motivation',
            body: message.content,
            category: message.category
          })
        );
      } catch (error) {
        console.error('Error sending notification:', error);
        // Remove invalid subscriptions
        if ((error as any).statusCode === 410) {
          await db.collection('push_subscriptions').deleteOne({ subscription });
        }
      }
    });

    await Promise.all(notifications);

    // Mark message as sent
    await db.collection('messages').updateOne(
      { _id: message._id },
      { 
        $set: { 
          isReceived: true,
          receivedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send push notifications' },
      { status: 500 }
    );
  }
}