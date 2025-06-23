# AstroMood - Astrology App

AstroMood est une application dédiée à l'astrologie. Elle permet aux utilisateurs de générer leur thème astral personnalisé, de découvrir leur compatibilité, d'accéder à des horoscopes quotidiens et d'apprendre l'astrologie à travers des contenus interactifs.

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Profil

- **Inscription complète** : Création de compte avec toutes les données de naissance (date, heure, lieu)
- **Profil personnalisé** : Gestion du profil utilisateur avec données astrologiques
- **Modification en temps réel** : Mise à jour du username, genre et autres informations via Supabase
- **Sécurité** : Authentification JWT avec Supabase Auth

### 🌟 Thème Astral

- **Génération automatique** : Création du thème astral basé sur les données de naissance
- **Visualisation** : Affichage graphique du thème avec positions planétaires et maisons
- **Données complètes** : Ascendant, planètes, aspects et interprétations

### 💕 Compatibilité

- **Analyse de couple** : Calcul de compatibilité entre deux personnes
- **Scores détaillés** : Compatibilité globale, amoureuse, amicale etc..

### 📅 Horoscopes & Affirmations

- **Horoscopes quotidiens** : Prédictions personnalisées pour chaque signe
- **Affirmations positives** : Messages motivants basés sur l'astrologie

### 📚 Section Explorer

- **Learn (Apprentissage)** :

  - Leçons texte interactives sur les bases de l'astrologie
  - Livres audio pour apprendre en déplacement

- **Test (Mini-jeux)** :
  - Quiz interactifs pour tester ses connaissances

## 🏗️ Architecture Technique

### Backend (Node.js/Express)

- **API RESTful** : Endpoints structurés pour toutes les fonctionnalités
- **TypeScript** : Code typé pour une meilleure maintenabilité
- **Services externes** : Intégration Free Astrology API et calculs timezone
- **Déploiement** : API déployée sur Vercel Functions

### Frontend (React/TypeScript)

- **State Management** : Redux Toolkit pour la gestion d'état
- **Authentification** : Intégration Supabase Auth
- **Expérience utilisateur** : Interface intuitive et animations fluides

### Base de Données (Supabase)

- **PostgreSQL** : Base de données relationnelle managée
- **Authentification** : Système d'auth intégré avec JWT
- **Métadonnées** : Stockage des données astrologiques dans user_metadata
- **Temps réel** : Mises à jour instantanées des profils

## 🛠️ Technologies Utilisées

### Backend

- Node.js 18+
- Express.js avec TypeScript
- Axios pour les appels API
- Moment-timezone pour les calculs
- Variables d'environnement sécurisées

### Frontend

- React 18 avec TypeScript
- Redux Toolkit (State Management)
- Tailwind

### Services & APIs

- **Supabase** : Authentification et base de données
- **Free Astrology API** : Calculs astrologiques professionnels
- **Vercel** : Déploiement frontend et backend
- **Géolocalisation** : API native du navigateur

## 📡 API Endpoints

### Authentification

- `POST /auth/signup` : Inscription utilisateur
- `POST /auth/signin` : Connexion utilisateur
- `POST /auth/signout` : Déconnexion

### Thème Astral

- `POST /api/chart` : Génération du thème astral complet
- `POST /api/chart/planets` : Récupération des positions planétaires

### Utilitaires

- `GET /api/timezone` : Calcul du fuseau horaire par coordonnées
- `POST /api/delete-account` : Suppression de compte utilisateur

## 🚀 Installation & Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Clé API Free Astrology

### 1. Cloner le repository

```bash
git clone ...
cd astromood
```

### 2. Configuration Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` :

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FREE_ASTROLOGY_API_KEY=your_api_key
FREE_ASTROLOGY_API_URL=https://json.freeastrologyapi.com/western/natal-chart
PORT=4000
```

Démarrer le serveur :

```bash
npm run dev
```

### 3. Configuration Frontend

```bash
cd frontend
npm install
```

Créer le fichier `.env.local` :

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_API_URL=http://localhost:4000
```

Démarrer l'application :

```bash
npm start
```

## 📄 Documentation

- **API Documentation** : [Stoplight Studio](https://school-test.stoplight.io/docs/astromood/886eb4db2b19b-astro-mood-api)

## 🎯 Fin

Merci d'avoir consulté mon projet React Native.

[Sitan]
