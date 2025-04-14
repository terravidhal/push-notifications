# Daily Motivation - Application de Notifications Push

Une application Next.js qui envoie des messages de motivation personnalisés via des notifications push.

## 🚀 Installation

1. Clonez le repository :
```bash
git clone [votre-repo]
cd push-notifications
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
Créez un fichier `.env.local` à la racine du projet avec :
```env
MONGODB_URI=votre_uri_mongodb
NEXT_PUBLIC_VAPID_PUBLIC_KEY=votre_cle_publique_vapid
VAPID_PRIVATE_KEY=votre_cle_privee_vapid
```

Pour générer les clés VAPID :
```bash
npx web-push generate-vapid-keys
```

4. Démarrez le serveur de développement :
```bash
npm run dev
```

## 🌐 Configuration du Navigateur

### Chrome (Recommandé)
L'application est optimisée pour Chrome, qui offre la meilleure expérience pour les notifications push :

1. Ouvrez Chrome
2. Accédez à `chrome://settings/content/notifications`
3. Assurez-vous que les notifications sont autorisées
4. Visitez l'application sur `http://localhost:3000`

### Autres Navigateurs
L'application fonctionne également sur d'autres navigateurs modernes, mais Chrome est recommandé pour une expérience optimale.

## 📱 Utilisation

### Configuration Initiale
1. Sur la page d'accueil, cliquez sur "Enable Notifications" pour activer les notifications
2. Acceptez la demande d'autorisation du navigateur

### Personnalisation des Notifications
1. Choisissez la fréquence :
   - Daily : notifications quotidiennes
   - Weekly : notifications le lundi

2. Définissez les heures de réception :
   - Ajoutez plusieurs heures si souhaité
   - Format 24h (ex: 09:00, 14:30)

3. Sélectionnez une catégorie :
   - Motivation
   - Inspiration
   - Persévérance

### Gestion des Messages
- **Historique** : Consultez tous vos messages reçus
- **Vue Détaillée** : Cliquez sur "View" pour voir le détail d'un message
- **Notifications** : Cliquez sur "Ouvrir" dans une notification pour voir le message

## 🔍 Fonctionnalités Clés

### Notifications Push
- Messages personnalisés selon vos préférences
- Notifications élégantes avec bouton d'action
- Vibration et son pour attirer l'attention

### Historique des Messages
- Liste chronologique des messages reçus
- Vue détaillée de chaque message
- Filtrage par catégorie

### Interface Utilisateur
- Design moderne et responsive
- Thème clair/sombre automatique
- Animations fluides

## 💡 Conseils d'Utilisation

1. **Permissions du Navigateur**
   - Gardez les permissions de notifications activées
   - Ne bloquez pas les pop-ups pour ce site

2. **Performance Optimale**
   - Gardez le navigateur ouvert en arrière-plan
   - Évitez le mode économie d'énergie

3. **Dépannage**
   - Si les notifications ne fonctionnent pas :
     * Vérifiez les permissions du navigateur
     * Rechargez la page
     * Réactivez les notifications dans l'application

## 🛠 Notes Techniques

- Built with Next.js 13+ (App Router)
- MongoDB pour le stockage des données
- Service Worker pour les notifications push
- Web Push API pour l'envoi des notifications
- Tailwind CSS pour le style
- TypeScript pour la sécurité du type

## 📝 Remarques

- Les notifications peuvent être légèrement retardées selon la charge du serveur
- La fréquence minimale entre deux notifications est de 1 heure
- L'historique conserve les 50 derniers messages
- Les messages non reçus (navigateur fermé) ne sont pas perdus

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request
