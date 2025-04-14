'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface Message {
  _id: string;
  content: string;
  category: string;
  receivedAt: string;
}

export default function MessagePage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessage() {
      try {
        const response = await fetch(`/api/messages/${params.id}`);
        if (!response.ok) {
          throw new Error('Message not found');
        }
        const data = await response.json();
        setMessage(data);
      } catch (error) {
        console.error('Error fetching message:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessage();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-center text-red-500">Message not found</h1>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Daily Motivation</h1>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-lg">{message.content}</p>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Category: {message.category}</span>
              <span>Received: {new Date(message.receivedAt).toLocaleString()}</span>
            </div>
          </div>
        </Card>
        <div className='mt-5 text-blue-500 underline'>
          <Link href='/'>Back to home</Link>
        </div>
      </div>
    </main>
  );
}
