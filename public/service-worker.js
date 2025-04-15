// sw version: 1.0.8

// Installation immédiate
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Nettoyer le cache si nécessaire
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    ])
  );
});

self.addEventListener('push', function(event) {
  if (!event.data) {
    console.warn('Push event received but no data.');
    return;
  }

  const data = event.data.json();

  // Configuration plus élégante de la notification
  try {
    const options = {
      body: data.body,
      icon: new URL('icon.png', self.registration.scope).href,
      badge: new URL('badge.png', self.registration.scope).href,
      vibrate: [200, 100, 200],
      requireInteraction: true,
      silent: false,
      timestamp: Date.now(),
      actions: [
        {
          action: 'open',
          title: 'Ouvrir'
        }
      ],
      data: {
        type: data.type,
        category: data.category,
        messageId: data.messageId,
        dateOfArrival: Date.now(),
        scope: self.registration.scope
      }
    };

    // Afficher la notification avec un titre clair
    event.waitUntil(
      self.registration.showNotification('Daily Motivation', options)
        .catch(error => {
          console.error('[Service Worker] Error showing notification:', error);
        })
    );
  } catch (error) {
    console.error('[Service Worker] Error processing push event:', error);
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Récupérer l'ID du message depuis les données de la notification
  const messageId = event.notification.data.messageId;
  
  // Construire l'URL complète de la page du message
  const baseUrl = self.registration.scope.replace(/\/$/, '');
  const messageUrl = `${baseUrl}/message/${messageId}`;
  
  // Gérer le clic sur le bouton d'action ou sur la notification elle-même
  if (event.action === 'open' || !event.action) {
    // Vérifier si une fenêtre est déjà ouverte
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(function(clientList) {
        try {
          // Si une fenêtre existe déjà avec la même URL, la focus
          for (const client of clientList) {
            if (client.url.includes(messageId) && 'focus' in client) {
              return client.focus();
            }
          }
          // Si aucune fenêtre correspondante n'existe, en ouvrir une nouvelle
          if (clients.openWindow) {
            return clients.openWindow(messageUrl).catch(error => {
              console.error('[Service Worker] Error opening window:', error);
              // Fallback à l'URL de base si l'ouverture échoue
              return clients.openWindow(baseUrl);
            });
          }
        } catch (error) {
          console.error('[Service Worker] Error handling click:', error);
          // Fallback à l'URL de base en cas d'erreur
          return clients.openWindow(baseUrl);
        }
      })
    );
  }
});

