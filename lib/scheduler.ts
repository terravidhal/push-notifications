import cron from 'node-cron';
import { connectToDatabase } from './mongodb';
import { COLLECTIONS, type Preferences } from './models';
import webPush from 'web-push';

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

class NotificationScheduler {
  // Stocker plusieurs tâches
  private cronJobs: cron.ScheduledTask[] = [];

  async updateSchedule() {
    try {
      this.stop(); // Stop all before restarting
  
      const { db } = await connectToDatabase();
      const preferences = await db
        .collection<Preferences>(COLLECTIONS.PREFERENCES)
        .findOne({ type: 'general' });
  
      if (!preferences) return;
  
      const { frequency, times = [], category } = preferences;
  
      for (const time of times) {
        const [hours, minutes] = time.split(':');
        let cronExpression = `${minutes} ${hours} * * *`;
        if (frequency === 'weekly') {
          cronExpression = `${minutes} ${hours} * * 1`; // weekly: only Monday
        }

        const job = cron.schedule(cronExpression, async () => {
          try {
            // Get a random message  
            const message = await db.collection('messages')
            .aggregate([
             // { $match: { isReceived: false, category: preferences.category } }, 
              { $match: { category: preferences.category } }, 
              { $sample: { size: 1 } }
            ])
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
                    category: message.category,
                    type: 'motivation',
                    messageId: message._id.toString() // Inclure l'ID du message
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
  
            console.log(`Notifications sent successfully at ${new Date().toISOString()}`);
          } catch (error) {
            console.error('Failed to send scheduled notifications:', error);
          }
        });
  
        this.cronJobs.push(job);
      }
  
      console.log(`Scheduled ${this.cronJobs.length} notification jobs.`);
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  }
  
  stop() {
    this.cronJobs.forEach((job) => job.stop());
    this.cronJobs = [];
  }

}

// Export singleton instance
export const scheduler = new NotificationScheduler();
