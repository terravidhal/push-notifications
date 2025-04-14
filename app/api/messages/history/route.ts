import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { COLLECTIONS, type Message } from '@/lib/models';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const messages = await db
      .collection<Message>(COLLECTIONS.MESSAGES)
      .find({ isReceived: true })
      .sort({ receivedAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}