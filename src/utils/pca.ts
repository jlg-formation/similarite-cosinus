export interface Point2D {
  x: number;
  y: number;
}

/** Projette N vecteurs sur les deux axes de variance maximale, normalisés dans le disque unité. */
export function pcaProject2D(vectors: number[][]): Point2D[] {
  const n = vectors.length;
  const d = vectors[0].length;

  const mean: number[] = Array.from({ length: d }, () => 0);
  for (const v of vectors) for (let k = 0; k < d; k++) mean[k] += v[k] / n;
  const centered = vectors.map((v) => v.map((x, k) => x - mean[k]));

  // Gram des vecteurs centrés : même spectre que la covariance, sans matrice d×d.
  const gram = centered.map((a) => centered.map((b) => dot(a, b)));
  const { values, vectors: evecs } = jacobiEigen(gram);

  const order = values.map((_, i) => i).sort((i, j) => values[j] - values[i]);
  const axes = [order[0], order[1]].filter((i) => i !== undefined);

  const points = centered.map((_, i) => {
    const coord = (axis: number | undefined) =>
      axis === undefined ? 0 : Math.sqrt(Math.max(values[axis], 0)) * evecs[i][axis];
    return { x: coord(axes[0]), y: coord(axes[1]) };
  });

  const maxNorm = Math.max(...points.map((p) => Math.hypot(p.x, p.y)));
  if (maxNorm === 0) return points;
  return points.map((p) => ({ x: p.x / maxNorm, y: p.y / maxNorm }));
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let k = 0; k < a.length; k++) s += a[k] * b[k];
  return s;
}

/** Jacobi cyclique pour matrice symétrique ; colonnes de `vectors` = vecteurs propres. */
function jacobiEigen(m: number[][]): { values: number[]; vectors: number[][] } {
  const n = m.length;
  const a = m.map((r) => [...r]);
  const v: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] * a[p][q];
    if (off < 1e-24) break;

    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (a[p][q] === 0) continue;
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;

        for (let k = 0; k < n; k++) {
          const akp = a[k][p];
          const akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p][k];
          const aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = v[k][p];
          const vkq = v[k][q];
          v[k][p] = c * vkp - s * vkq;
          v[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }

  return { values: a.map((row, i) => row[i]), vectors: v };
}
