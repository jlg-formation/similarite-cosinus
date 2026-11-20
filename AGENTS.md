# AGENTS.md

Application React + TypeScript + Vite qui compare des textes par similarité cosinus (front-end statique, GitHub Pages). Spécification : [brief.md](brief.md). Évolution en cours (page « 3 phrases ») : [évolution.md](évolution.md).

## Commandes

- Gestionnaire de paquets : **Bun uniquement** (version dans [mise.toml](mise.toml)). Ne jamais utiliser npm : il crée un `package-lock.json` parasite.
- Installer : `bun install`
- Développement : `bun run dev`
- Build (`tsc` puis `vite build`) : `bun run build`
- Lint et format : `bun run check`, correction du format : `bun run format`
- Pas de suite de tests.

## Architecture

- [src/main.tsx](src/main.tsx) : routes (HashRouter). Une nouvelle page = une route ici et un lien dans [src/App.tsx](src/App.tsx).
- [src/context/AppContext.tsx](src/context/AppContext.tsx) : configuration du moteur et logs HTTP partagés.
- [src/services/embeddingService.ts](src/services/embeddingService.ts) : seul point d'appel HTTP (LMStudio ou OpenAI). Chaque requête passe par `onLog`.
- [src/utils/](src/utils/) : fonctions mathématiques pures (cosinus, PCA).
- [src/data/defaultTexts.ts](src/data/defaultTexts.ts) : textes par défaut, seul endroit à modifier pour changer les exemples.

## Conventions

- Interface et commentaires en français ; identifiants de code en anglais.
- TypeScript `strict` avec `noUnusedLocals` : une variable inutilisée fait échouer `tsc`.
- Pas de backend. Seules la clé API OpenAI et l'URL LMStudio sont persistées, en `localStorage`.
- Ne pas créer de fichier Markdown de documentation sans demande explicite.

## Pièges

- LMStudio doit avoir CORS activé, sinon l'appel échoue côté navigateur.
- Les embeddings sont réordonnés par `index` dans la réponse ; ne pas supposer leur ordre.
- `dist/` est généré par le build et ignoré par git.
