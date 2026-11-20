/** Libellé qualitatif d'un score cosinus dans [-1, 1]. */
export function similarityLabel(score: number): string {
  if (score > 0.8) return "Très similaires";
  if (score > 0.5) return "Similaires";
  if (score > 0.2) return "Quelque peu liés";
  if (score > -0.2) return "Peu liés";
  if (score > -0.5) return "Dissemblables";
  return "Opposés";
}
