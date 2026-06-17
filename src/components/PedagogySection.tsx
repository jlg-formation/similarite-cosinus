export default function PedagogySection() {
  return (
    <section className="card pedagogy">
      <h2 className="section-title">Comprendre la similarité cosinus</h2>

      <div className="pedagogy-grid">
        <div className="pedagogy-text">
          <h3>Définition</h3>
          <p>
            La <strong>similarité cosinus</strong> mesure le cosinus de l'angle θ entre deux vecteurs
            dans un espace de haute dimension. Elle vaut :
          </p>

          <div className="formula-box">
            <div className="formula">
              cos(θ) ={' '}
              <span className="fraction">
                <span className="numerator">A · B</span>
                <span className="denominator">‖A‖ × ‖B‖</span>
              </span>
            </div>
          </div>

          <p>
            Où <strong>A · B</strong> est le produit scalaire des deux vecteurs, et{' '}
            <strong>‖A‖</strong>, <strong>‖B‖</strong> leurs normes euclidiennes.
          </p>

          <h3>Interprétation</h3>
          <ul className="interp-list">
            <li>
              <span className="badge-score green">+1</span> — vecteurs parfaitement alignés (textes
              identiques ou synonymes)
            </li>
            <li>
              <span className="badge-score yellow">≈ 0</span> — vecteurs orthogonaux (textes sans
              rapport)
            </li>
            <li>
              <span className="badge-score red">−1</span> — vecteurs opposés (sens contraires)
            </li>
          </ul>

          <h3>Pourquoi les embeddings ?</h3>
          <p>
            Un modèle d'embedding transforme chaque texte en un vecteur dense de haute dimension
            (souvent 768 à 3072 valeurs). Les textes de sens proches produisent des vecteurs orientés
            dans la même direction — d'où une similarité cosinus élevée.
          </p>
          <p>
            La norme du vecteur (longueur) dépend du texte mais <em>n'influe pas</em> sur le cosinus :
            seule la direction compte. C'est ce qui rend la similarité cosinus robuste aux différences
            de longueur entre textes.
          </p>
        </div>

        <div className="pedagogy-diagram">
          <h3>Schéma géométrique</h3>
          <SchematicDiagram />
          <p className="diagram-caption">
            Deux vecteurs A et B dans un espace réduit à 2D. L'angle θ entre eux détermine la
            similarité cosinus.
          </p>
        </div>
      </div>

      <div className="formula-detail">
        <h3>Formule développée</h3>
        <div className="formula-code">
          <code>
            cos(θ) = (Σ Aᵢ·Bᵢ) / (√(Σ Aᵢ²) × √(Σ Bᵢ²))
          </code>
        </div>
        <p>
          La somme porte sur toutes les <em>n</em> dimensions du vecteur (ex. <em>n</em> = 1536 pour{' '}
          <code>text-embedding-3-small</code>).
        </p>
      </div>
    </section>
  )
}

function SchematicDiagram() {
  const W = 260
  const H = 220
  const CX = 60
  const CY = 165

  // Fixed schematic vectors (not computed from real data)
  const A = { x: 160, y: -90 } // upper right
  const B = { x: 120, y: -150 } // more vertical

  const arcR = 48
  const thetaA = Math.atan2(-A.y, A.x)
  const thetaB = Math.atan2(-B.y, B.x)

  function polarToSVG(angle: number, r: number): [number, number] {
    return [CX + r * Math.cos(angle), CY + r * Math.sin(-angle)]
  }

  const [arcAx, arcAy] = polarToSVG(thetaA, arcR)
  const [arcBx, arcBy] = polarToSVG(thetaB, arcR)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block' }}>
      <defs>
        <marker id="pd-arrow-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
        </marker>
        <marker id="pd-arrow-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#f97316" />
        </marker>
      </defs>

      {/* Axes */}
      <line x1={CX - 10} y1={CY} x2={CX + 200} y2={CY} stroke="#cbd5e1" strokeWidth="1" />
      <line x1={CX} y1={CY + 10} x2={CX} y2={CY - 175} stroke="#cbd5e1" strokeWidth="1" />

      {/* Projections (dashed) */}
      <line
        x1={CX + A.x}
        y1={CY + A.y}
        x2={CX + A.x}
        y2={CY}
        stroke="#3b82f6"
        strokeWidth="1"
        strokeDasharray="3 2"
        opacity="0.4"
      />
      <line
        x1={CX + B.x}
        y1={CY + B.y}
        x2={CX + B.x}
        y2={CY}
        stroke="#f97316"
        strokeWidth="1"
        strokeDasharray="3 2"
        opacity="0.4"
      />

      {/* Angle arc */}
      <path
        d={`M ${arcAx} ${arcAy} A ${arcR} ${arcR} 0 0 1 ${arcBx} ${arcBy}`}
        fill="none"
        stroke="#a855f7"
        strokeWidth="1.5"
      />

      {/* θ label */}
      <text
        x={CX + 62}
        y={CY - 22}
        fontSize="14"
        fill="#a855f7"
        fontStyle="italic"
        fontFamily="Georgia, serif"
      >
        θ
      </text>

      {/* Vector A */}
      <line
        x1={CX}
        y1={CY}
        x2={CX + A.x}
        y2={CY + A.y}
        stroke="#3b82f6"
        strokeWidth="2.5"
        markerEnd="url(#pd-arrow-a)"
      />
      <text x={CX + A.x + 8} y={CY + A.y + 4} fontSize="14" fontWeight="700" fill="#3b82f6" fontFamily="system-ui">
        A
      </text>

      {/* Vector B */}
      <line
        x1={CX}
        y1={CY}
        x2={CX + B.x}
        y2={CY + B.y}
        stroke="#f97316"
        strokeWidth="2.5"
        markerEnd="url(#pd-arrow-b)"
      />
      <text x={CX + B.x + 6} y={CY + B.y - 4} fontSize="14" fontWeight="700" fill="#f97316" fontFamily="system-ui">
        B
      </text>

      {/* Origin */}
      <circle cx={CX} cy={CY} r="4" fill="#1e293b" />
      <text x={CX - 12} y={CY + 14} fontSize="11" fill="#64748b" fontFamily="system-ui">
        O
      </text>

      {/* cos(θ) annotation */}
      <line
        x1={CX + B.x}
        y1={CY + B.y}
        x2={CX + B.x}
        y2={CY - 4}
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <text x={CX + 6} y={CY + B.y + 16} fontSize="10" fill="#64748b" fontFamily="system-ui">
        ‖B‖·cos(θ)
      </text>
    </svg>
  )
}
