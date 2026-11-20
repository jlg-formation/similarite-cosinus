# Application pédagogique — Similarité Cosinus

## Contexte

Un formateur souhaite illustrer interactivement le concept de similarité cosinus à ses stagiaires. L'outil est conçu pour être projeté en salle de formation et potentiellement utilisé en autonomie par les stagiaires via leur navigateur. Il n'existe pas de version précédente ; c'est un nouveau projet.

## Objectif

Fournir une application web interactive permettant de comparer deux textes via leurs embeddings vectoriels, d'afficher le score de similarité cosinus avec une visualisation graphique, et d'exposer en temps réel les échanges HTTP avec le moteur d'embedding — le tout dans un cadre pédagogique incluant une explication théorique de la notion.

## Périmètre fonctionnel

### Zone de saisie

- Deux zones de texte affichées en parallèle (côte à côte sur desktop, empilées sur mobile).
- Chaque zone accepte une phrase ou un court paragraphe.
- Un bouton **« Calculer »** déclenche manuellement le calcul (pas de calcul automatique à la frappe).

### Résultat de la similarité

- Affichage du score cosinus (valeur entre −1 et 1).
- Visualisation graphique complète : représentation géométrique 2D/3D des deux vecteurs et de l'angle entre eux (ou projection sur un plan réduit), accompagnée d'une jauge visuelle colorée.

### Moteur d'embedding

Sélecteur permettant de choisir entre deux moteurs :

**LMStudio (local)**

- URL configurable dans l'interface (par défaut `http://localhost:1234`).
- Peut pointer vers un serveur réseau (pas seulement localhost).

**OpenAI (distant)**

- Clé API saisie dans l'interface et persistée en `localStorage`.
- Champ de saisie avec option afficher/masquer.
- Sélecteur de modèle parmi une liste fixe de trois options :
  - `text-embedding-ada-002`
  - `text-embedding-3-small`
  - `text-embedding-3-large`

### Intercepteur HTTP (panneau de logs)

- Panneau dédié affichant en temps réel les échanges HTTP avec le moteur d'embedding.
- Contenu : payload JSON brut — corps complet de la requête (textes envoyés) et de la réponse (vecteurs reçus).
- Mis à jour à chaque appel au moteur.

### Volet pédagogique

Section intégrée à la page comprenant :

- La formule mathématique de la similarité cosinus avec explication textuelle.
- Un schéma géométrique (vecteurs, angle, projection) pour illustrer la notion visuellement.

## Hors périmètre

- Authentification ou gestion d'utilisateurs.
- Historique des calculs (pas de persistance des résultats entre sessions).
- Support d'autres moteurs d'embedding (Ollama, Cohere, Mistral…) — uniquement LMStudio et OpenAI.
- Mode multi-paires, sauf la page « 3 phrases » (route `/trois`), qui compare trois textes.
- Backend serveur — l'application est 100 % front-end statique.

## Utilisateurs cibles

- **Formateur** : projette l'application en salle pour illustrer un concept lors d'une formation IA/NLP.
- **Stagiaires** : peuvent accéder à l'application depuis leur propre navigateur pour expérimenter en autonomie.

## Stack technique

| Élément      | Choix                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| Bundler      | Vite                                                                   |
| Framework UI | React                                                                  |
| Langage      | TypeScript                                                             |
| Style        | CSS light mode — design propre et professionnel, pas de charte imposée |
| Responsive   | Tous écrans (desktop, tablette, mobile)                                |
| Hébergement  | GitHub Pages (front-end statique uniquement)                           |
| Persistance  | `localStorage` uniquement (clé API, URL LMStudio)                      |

## Contraintes techniques

- **CORS** : les appels à LMStudio (localhost ou réseau) et à l'API OpenAI sont effectués directement depuis le navigateur. LMStudio doit avoir CORS activé ; l'API OpenAI l'accepte nativement. Aucun proxy backend n'est prévu.
- **Pas de serveur** : l'application est déployée comme site statique sur GitHub Pages. Aucune logique serveur, aucune base de données.
- **Clé API** : stockée en `localStorage` côté navigateur. Avertir l'utilisateur que la clé est lisible par toute personne ayant accès au navigateur (pas de chiffrement côté client).
- **Vecteurs de haute dimension** : les embeddings OpenAI peuvent avoir jusqu'à 3072 dimensions. La visualisation géométrique nécessite une réduction dimensionnelle (PCA ou t-SNE côté client) pour projeter en 2D/3D.

## Critères de succès

1. Saisir deux phrases et obtenir un score cosinus correct après clic sur « Calculer ».
2. Le score est accompagné d'une représentation visuelle des vecteurs (angle lisible).
3. Le panneau de logs affiche le JSON brut de la requête et de la réponse après chaque calcul.
4. La bascule LMStudio ↔ OpenAI fonctionne sans rechargement de page.
5. La clé API OpenAI est retrouvée automatiquement à la réouverture du navigateur.
6. L'application est accessible et fonctionnelle sur mobile (responsive).
7. Le déploiement sur GitHub Pages produit une URL publique opérationnelle.
8. La section pédagogique affiche la formule et le schéma géométrique de la similarité cosinus.

## Points en suspens

- **Librairie de visualisation** : à choisir (D3.js, Chart.js, Plotly, Three.js…) selon la complexité de la représentation vectorielle souhaitée.
- **Algorithme de réduction dimensionnelle** : PCA ou t-SNE pour projeter les vecteurs haute dimension — choix à valider selon la lisibilité pédagogique souhaitée.
- **Modèle LMStudio** : l'identifiant du modèle local est-il saisissable librement ou fixé ? (À préciser si LMStudio expose plusieurs modèles simultanément.)
