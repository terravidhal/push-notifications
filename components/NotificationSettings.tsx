'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';


export default function NotificationSettings() {
  const [frequency, setFrequency] = useState('daily');
  const [times, setTimes] = useState<string[]>(['09:00']);
  const [isLoading, setIsLoading] = useState(true);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [category, setCategory] = useState<'motivation' | 'inspiration' | 'persévérance'>('motivation');


  const addTime = () => setTimes([...times, '09:00']);
  const removeTime = (index: number) =>
    setTimes(times.filter((_, i) => i !== index));
  
  const updateTime = (index: number, value: string) => {
    const updated = [...times];
    updated[index] = value;
    setTimes(updated);
  };

  useEffect(() => {

    // Check if Push API is supported
    setPushSupported('Notification' in window && 'serviceWorker' in navigator);

    const checkPushStatus = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setPushEnabled(!!subscription); // true si une subscription existe, false sinon
      }
    };

    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences');
        if (!response.ok) {
          throw new Error('Failed to fetch preferences');
        }
        const data = await response.json();
        setFrequency(data.frequency ?? 'daily');
        setTimes(data.times ?? ['09:00']);
        setCategory(data.category ?? 'motivation');
      } catch (error) {
        console.error('Error fetching preferences:', error);
        toast.error('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    checkPushStatus();
    fetchPreferences();
  }, []);

  const subscribeToPushNotifications = async () => {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      // Assure que le service worker est bien prêt
       await navigator.serviceWorker.ready;
      
      // Get push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      // Send subscription to backend
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to push notifications');
      }

      setPushEnabled(true);
      toast.success('Successfully subscribed to notifications');
    } catch (error) {
      console.error('Push subscription error:', error);
      toast.error('Failed to enable notifications');
    }
  };

  const unsubscribeFromPushNotifications = async () => {
    
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Supprimer la souscription côté navigateur
        await subscription.unsubscribe();
  
        // Supprimer la souscription côté serveur
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });
  
        setPushEnabled(false);
        toast.success('Notifications disabled');
      } else {
        toast.info('No active subscriptions to deactivate');
      }
    } catch (error) {
      console.error('Error disabling notifications :', error);
      toast.error('Unable to turn off notifications');
    }
  };
  

  const handleSave = async () => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frequency,
          times,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">General Notification Settings</h2>
        <p className="text-muted-foreground mb-6">
          Configure when motivational messages should be sent to all users
        </p>
      </div>

      {pushSupported && !pushEnabled && (
        <div className="bg-muted p-4 rounded-lg mb-6">
          <p className="text-sm mb-4">Enable push notifications to receive motivational messages</p>
          <Button onClick={subscribeToPushNotifications} variant="outline" className="w-full">
            Enable Notifications
          </Button>
        </div>
      )}

      {pushEnabled && (
        <div className="bg-muted p-4 rounded-lg mb-6">
          <p className="text-sm mb-4">You are currently receiving notifications</p>
          <Button onClick={unsubscribeFromPushNotifications} variant="destructive" className="w-full">
            Turn off notifications
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label>Message Frequency</Label>
          <RadioGroup
            value={frequency}
            onValueChange={setFrequency}
            className="grid grid-cols-2 gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Delivery Time</Label>
          {times.map((time, index) => (
             <div key={index} className="flex items-center space-x-2">
               <Input
                 type="time"
                 value={time}
                 onChange={(e) => updateTime(index, e.target.value)}
                 className="w-full"
               />
               {times.length > 1 && (
                 <Button variant="destructive" onClick={() => removeTime(index)}>
                   Remove
                 </Button>
               )}
             </div>
          ))}
          <Button variant="outline" onClick={addTime}>
            Add another time
          </Button>
        </div>

        <div className="space-y-2">
           <Label htmlFor="category">Message Category</Label>
           <select
             id="category"
             value={category}
             onChange={(e) => setCategory(e.target.value as any)}
             className="w-full border rounded p-2"
           >
             <option value="motivation">Motivation</option>
             <option value="inspiration">Inspiration</option>
             <option value="persévérance">Persévérance</option>
           </select>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Global Settings
        </Button>
      </div>
    </div>
  );
}