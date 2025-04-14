self.addEventListener('push', function(event) {
  if (!event.data) {
    console.warn('Push event received but no data.');
    return;
  }

  const data = event.data.json();

  // Configuration plus élégante de la notification
  const options = {
    body: data.body,
    icon: '/icon.png',
    badge: '/badge.png',
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
      dateOfArrival: Date.now()
    }
  };

  // Afficher la notification avec un titre clair
  event.waitUntil(
    self.registration.showNotification('Daily Motivation', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Récupérer l'ID du message depuis les données de la notification
  const messageId = event.notification.data.messageId;
  
  // Construire l'URL de la page du message
  const messageUrl = `/message/${messageId}`;
  
  // Gérer le clic sur le bouton d'action ou sur la notification elle-même
  if (event.action === 'open' || !event.action) {
    // Vérifier si une fenêtre est déjà ouverte
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(function(clientList) {
        // Si une fenêtre existe déjà avec la même URL, la focus
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url.includes(messageUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        // Si aucune fenêtre correspondante n'existe, en ouvrir une nouvelle
        if (clients.openWindow) {
          return clients.openWindow(messageUrl);
        }
      })
    );
  }
});
