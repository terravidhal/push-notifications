import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { COLLECTIONS, type Preferences } from '@/lib/models';
import { scheduler } from '@/lib/scheduler';

export async function POST(req: Request) {
  try {
    const { frequency, times, category } = await req.json();
    const { db } = await connectToDatabase();


    await db.collection<Preferences>(COLLECTIONS.PREFERENCES).updateOne(
      { type: 'general' },
      {
        $set: {
          frequency,
          times,
          category,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Update the notification schedule
    await scheduler.updateSchedule();


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const preferences = await db
      .collection<Preferences>(COLLECTIONS.PREFERENCES)
      .findOne({ type: 'general' });


    return NextResponse.json({
      frequency: preferences?.frequency ,
      times: preferences?.times,
      category: preferences?.category,
    });  
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}
