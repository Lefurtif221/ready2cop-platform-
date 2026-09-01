# Ready2Cop Platform

Frontend React pour la plateforme Ready2Cop.

## Deploy sur Vercel

1. Creer un compte sur [vercel.com](https://vercel.com)
2. New Project
3. Connecter ton repo GitHub
4. Vercel detecte automatiquement Vite
5. Ajouter la variable d'environnement :
   - `VITE_API_URL` = URL de ton backend (ex: `https://ready2cop-server.onrender.com`)
6. Deploy

## Variables d'environnement

Voir `.env.example` pour la liste des variables.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```
