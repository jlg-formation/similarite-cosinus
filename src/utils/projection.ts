function dot(a: number[], b: number[]): number {
  return a.reduce((sum, x, i) => sum + x * b[i], 0);
}

function norm(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

function scale(a: number[], s: number): number[] {
  return a.map((x) => x * s);
}

function subtract(a: number[], b: number[]): number[] {
  return a.map((x, i) => x - b[i]);
}

/**
 * Projects two high-dimensional vectors onto the 2D plane they span,
 * preserving the angle between them exactly (Gram-Schmidt).
 * Returns unit vectors in 2D: [cos θ, sin θ] with first vector at (1, 0).
 */
export function projectTo2D(v1: number[], v2: number[]): [[number, number], [number, number]] {
  const n1 = norm(v1);
  const n2 = norm(v2);

  if (n1 === 0)
    return [
      [0, 0],
      [1, 0],
    ];
  if (n2 === 0)
    return [
      [1, 0],
      [0, 0],
    ];

  const u1 = scale(v1, 1 / n1);
  const proj = dot(v2, u1);
  const v2perp = subtract(v2, scale(u1, proj));
  const n2perp = norm(v2perp);

  // Normalise v2 for display
  const cosTheta = dot(v1, v2) / (n1 * n2);
  const sinTheta = n2perp > 1e-10 ? Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta)) : 0;

  return [
    [1, 0],
    [cosTheta, sinTheta],
  ];
}
