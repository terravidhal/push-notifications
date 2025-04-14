'use client';

import { Bell, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationSettings from '@/components/NotificationSettings';
import MessageHistory from '@/components/MessageHistory';



export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Daily Motivation</h1>
          <p className="text-muted-foreground">Get inspired every day with personalized motivational messages</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-4">
           <TabsList className="grid w-full grid-cols-2"> {/*//grid-cols-3 */}
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card className="p-6">
              <NotificationSettings />
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6">
              <MessageHistory />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
