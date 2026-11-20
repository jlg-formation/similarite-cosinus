# Évolution : page « 3 phrases »

Document provisoire. Il décrit la conception de la troisième page, calquée sur la page « 2 phrases ».

## 1. Objectif pédagogique

Montrer qu'avec trois phrases, la similarité n'est pas transitive : A et B peuvent être proches, et C proche de A mais éloignée de B, ou l'inverse. Le stagiaire voit ainsi trois scores et trois angles, et compare les paires entre elles.

Exemple de jeu par défaut :

| Texte | Contenu                                 |
| ----- | --------------------------------------- |
| A     | Le chat dort sur le canapé.             |
| B     | Le félin sommeille sur le sofa.         |
| C     | Le cours de la bourse a chuté ce matin. |

Attendu : cos(A, B) élevé, cos(A, C) et cos(B, C) faibles.

## 2. Navigation

- Menu : « 2 phrases » (route `/`), « 3 phrases » (route `/trois`), « Configuration », « Documentation ».
- Le libellé du bouton d'action peut suivre le menu : « Comparer 2 phrases » et « Comparer 3 phrases ».
- Les routes sont à déclarer là où elles le sont déjà (fichier de routage, probablement `main.tsx`, à confirmer).

## 3. Mise en page

Reprendre la structure `home-3col` de la page 2 phrases :

| Colonne           | Contenu                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| 1 : Textes        | Trois zones de saisie (Texte A, B, C) et le bouton « Comparer ».                                        |
| 2 : Scores        | Matrice 3×3 des similarités, mise en évidence de la paire la plus proche, trois jauges (une par paire). |
| 3 : Visualisation | Les trois vecteurs dans l'espace (voir section 5).                                                      |

En mobile, les colonnes s'empilent comme aujourd'hui.

## 4. Calcul

### 4.1 Similarités

Pour trois vecteurs $v_A, v_B, v_C$ :

$$\cos(v_i, v_j) = \frac{v_i \cdot v_j}{\lVert v_i \rVert \, \lVert v_j \rVert} \quad \text{pour } (i,j) \in \{(A,B), (A,C), (B,C)\}$$

La diagonale vaut 1 et la matrice est symétrique. Le tableau affiche les trois valeurs distinctes.

### 4.2 Appel au moteur d'embedding

- Un seul appel HTTP avec les trois textes en entrée (`input: [A, B, C]`), pour LMStudio comme pour OpenAI.
- Les embeddings sont réordonnés par le champ `index` de la réponse, pour ne pas dépendre de l'ordre renvoyé.
- Si moins de trois embeddings reviennent, lever une erreur explicite.

## 5. Visualisation

Trois vecteurs ne tiennent pas dans un plan en général. Première version : PCA en 2D.

1. Centrer les trois vecteurs (soustraire leur moyenne).
2. Calculer la matrice de covariance 3×3 et ses vecteurs propres (Jacobi suffit).
3. Projeter les trois vecteurs sur les deux axes de variance maximale.

Les angles affichés sont approximatifs. La légende le signale, et les scores exacts restent dans la matrice (section 4.1).

Rendu en SVG, comme aujourd'hui : un arc ou une étiquette par paire, avec la valeur en degrés, et les points T₁, T₂, T₃ (bleu, orange, et une troisième couleur).

Évolution possible (v2) : plongement exact par matrice de Gram en 3D, avec rotation à la souris.

## 6. Pédagogie (volet explicatif)

Ajouter à la section pédagogique :

- la matrice de similarité et sa lecture ;
- un encart « la similarité n'est pas transitive » avec un contre-exemple chiffré ;
- le schéma à trois vecteurs.

## 7. Fichiers concernés

| Fichier                                  | Action                                                                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/pages/TriplePage.tsx`               | Nouveau : page 3 phrases.                                                                                                                              |
| `src/components/SimilarityMatrix.tsx`    | Nouveau : matrice 3×3 et jauges par paire.                                                                                                             |
| `src/components/TripleVisualization.tsx` | Nouveau : rendu des trois vecteurs.                                                                                                                    |
| `src/utils/pca.ts`                       | Nouveau : PCA 2D (Gram + Jacobi).                                                                                                                      |
| `src/utils/cosineSimilarity.ts`          | Ajout d'une fonction de matrice de similarité.                                                                                                         |
| `src/services/embeddingService.ts`       | Généraliser `fetchEmbeddings` de `[string, string]` à `string[]`, retour `number[][]`. Les deux fonctions d'appel deviennent identiques pour N textes. |
| `src/types.ts`                           | Ajout de `TripleResult` (vecteurs, trois scores, matrice).                                                                                             |
| `src/context/AppContext.tsx`             | Ajout d'un état et d'un `handleCalculateTriple`, ou état local à la page (les logs restent partagés via le contexte).                                  |
| `src/data/defaultTexts.ts`               | Nouveau : textes par défaut des pages 2 et 3 phrases (fichier unique à modifier).                                                                      |
| `src/App.tsx`                            | Renommer « Calculer » en « 2 phrases » et ajouter « 3 phrases ».                                                                                       |
| Fichier de routage                       | Ajouter la route `/trois`.                                                                                                                             |
| `brief.md`                               | Mettre à jour le périmètre (la page « 3 phrases » remplace l'exclusion « mode multi-paires » pour ce cas précis).                                      |

Les textes du mode trio ne sont pas persistés (cohérent avec le brief). Seule la clé API et l'URL LMStudio restent en `localStorage`.

## 8. Critères d'acceptation

1. Trois textes saisis, clic sur « Comparer », trois vecteurs reçus et trois scores affichés.
2. La matrice affiche les paires A–B, A–C, B–C ; la paire la plus proche est signalée.
3. La visualisation affiche la légende « projection approximative » ; les scores de la matrice sont exacts.
4. Le panneau de logs affiche une seule requête avec les trois textes et la réponse complète.
5. Le bouton reste désactivé tant qu'un des trois textes est vide.
6. Erreur réseau ou embeddings incomplets : message clair, pas de page blanche.
7. Fonctionne en LMStudio et en OpenAI, sans rechargement de page.
8. Responsive sur mobile.

## 9. Décisions

- Visualisation : PCA en 2D pour la première version ; Gram 3D reporté en v2.
- Bibliothèque : SVG maison, sans Three.js.
- Textes par défaut : deux phrases proches (A et B) et une phrase éloignée (C), comme dans la section 1.
- Pas de sélecteur d'exemples pour l'instant.

## 10. Modifier les phrases

- Dans l'interface : les trois zones de saisie sont éditables à tout moment, sans changement de code. Les textes ne sont pas persistés, donc un rechargement restaure les valeurs par défaut.
- Par défaut, modifier `src/data/defaultTexts.ts` : constantes `TRIPLE_DEFAULTS` (A, B, C) et, pour la page 2 phrases, les valeurs aujourd'hui codées en dur dans `src/context/AppContext.tsx`, à déplacer dans ce même fichier.
- Aucun redéploiement de logique n'est nécessaire : seule la donnée change.
