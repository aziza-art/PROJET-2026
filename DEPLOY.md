# Guide de Déploiement - ISGI Qualité

Ce guide détaille les étapes pour déployer l'application "ISGI Qualité" sur Vercel.

## Prérequis

- Un compte [GitHub](https://github.com)
- Un compte [Vercel](https://vercel.com)
- Une clé API Gemini (Google AI Studio)

## Étapes de Déploiement

### 1. Préparation du Référentiel
Assurez-vous que votre projet est poussé sur un dépôt GitHub. L'application est configurée pour être compatible avec Vite.

### 2. Importation dans Vercel
1. Connectez-vous à votre tableau de bord Vercel.
2. Cliquez sur **"Add New..."** > **"Project"**.
3. Sélectionnez votre dépôt GitHub `isgi-qualite-audit`.
4. Cliquez sur **"Import"**.

### 3. Configuration du Projet
Vercel détectera automatiquement qu'il s'agit d'un projet Vite. Les paramètres de build par défaut sont corrects :
- **Framework Preset**: Vite
- **Build Command**: `vite build` (ou `npm run build`)
- **Output Directory**: `dist`

### 4. Variables d'Environnement (CRITIQUE)
Avant de cliquer sur "Deploy", vous devez configurer la clé API pour l'intelligence artificielle.

1. Dans la section **"Environment Variables"**, ajoutez :
   - **Key** : `VITE_API_KEY`
   - **Value** : `Votre_Clé_API_Gemini_Commencant_Par_AIza...`

> [!IMPORTANT]
> Le nom de la variable DOIT être `VITE_API_KEY`. Si vous ne mettez pas le préfixe `VITE_`, l'application ne pourra pas y accéder dans le navigateur.

### 5. Finalisation
Cliquez sur **"Deploy"**. Vercel va construire votre application et vous fournir une URL de production (ex: `https://isgi-qualite.vercel.app`).

## Vérification Post-Déploiement
Une fois en ligne :
1. Ouvrez l'application.
2. Naviguez vers un formulaire (ex: "Algèbre 1").
3. Remplissez des réponses de test.
4. Soumettez le formulaire.
5. Si vous voyez l'écran "Diagnostic Validé", tout fonctionne correctement.

## Dépannage
- **Erreur "API Key missing"** : Vérifiez que vous avez bien ajouté `VITE_API_KEY` dans les réglages Vercel et redéployé le projet (un simple "redeploy" est nécessaire pour prendre en compte les nouvelles variables).
