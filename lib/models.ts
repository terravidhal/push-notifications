// Message Model
export interface Message {
  _id?: string;
  category: string;
  content: string;
  createdAt: Date;
  isReceived: boolean;
  receivedAt?: Date;
}

// Push Subscription Model
export interface PushSubscription {
  _id?: string;
  subscription: PushSubscriptionJSON;
  createdAt: Date;
}

// Preferences Model
export interface Preferences {
  _id?: string;
  type: 'general';
  frequency: 'daily' | 'weekly';
  times: string[]; 
  category: 'motivation' | 'inspiration' | 'persévérance'; 
  updatedAt: Date;
}


// Collection Names
export const COLLECTIONS = {
  MESSAGES: 'messages',
  PUSH_SUBSCRIPTIONS: 'push_subscriptions',
  PREFERENCES: 'preferences',
} as const;

// Database initialization script
export async function initializeDatabase(db: any) {
  // Create collections if they don't exist
  await Promise.all([
    db.createCollection(COLLECTIONS.MESSAGES),
    db.createCollection(COLLECTIONS.PUSH_SUBSCRIPTIONS),
    db.createCollection(COLLECTIONS.PREFERENCES),
  ]);

  // Create indexes
  await Promise.all([
    // Messages indexes
    db.collection(COLLECTIONS.MESSAGES).createIndex({ category: 1 }),
    db.collection(COLLECTIONS.MESSAGES).createIndex({ isReceived: 1 }),
    db.collection(COLLECTIONS.MESSAGES).createIndex({ receivedAt: -1 }),

    // Push Subscriptions index
    db.collection(COLLECTIONS.PUSH_SUBSCRIPTIONS).createIndex({ createdAt: 1 }),

    // Preferences index
    db.collection(COLLECTIONS.PREFERENCES).createIndex({ type: 1 }, { unique: true }),
  ]);

  // Insert some initial messages if the collection is empty
  const messageCount = await db.collection(COLLECTIONS.MESSAGES).countDocuments();
  if (messageCount === 0) {
    await db.collection(COLLECTIONS.MESSAGES).insertMany([
      {
        category: 'persévérance',
        content: 'Le succès n\'est pas final, l\'échec n\'est pas fatal. C\'est le courage de continuer qui compte.',
        createdAt: new Date(),
        isReceived: false
      },
      {
        category: 'motivation',
        content: 'Le seul mauvais choix est l\'absence de choix.',
        createdAt: new Date(),
        isReceived: false
      },
      {
        category: 'inspiration',
        content: 'Chaque jour est une nouvelle chance de changer votre vie.',
        createdAt: new Date(),
        isReceived: false
      }
    ]);
  }

  // Initialize default preferences if they don't exist
  const preferences = await db.collection(COLLECTIONS.PREFERENCES).findOne({ type: 'general' });
  if (!preferences) {
    await db.collection(COLLECTIONS.PREFERENCES).insertOne({
      type: 'general',
      frequency: 'daily',
      times: ['09:00'],
      category: 'motivation',
      updatedAt: new Date()
    });
  }
}