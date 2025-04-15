'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface Message {
  _id: string;
  content: string;
  category: string;
  receivedAt: string;
}

export default function MessageHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages/history');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
        
      } catch (error) {
        console.error('Error fetching messages:', error);
      }finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Message History</h2>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground">No messages yet</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div key={message._id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {new Date(message.receivedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium leading-none">
                        {message.content}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Category: {message.category}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => router.push(`/message/${message._id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
                {i < messages.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
