import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { EngineConfig, ComputeResult, HttpLog } from '../types'
import { fetchEmbeddings } from '../services/embeddingService'
import { cosineSimilarity } from '../utils/cosineSimilarity'

const LS_KEY = 'cosine-sim-engine-config'

const DEFAULT_CONFIG: EngineConfig = {
  type: 'lmstudio',
  lmstudioUrl: 'http://localhost:1234',
  lmstudioModel: '',
  openaiKey: '',
  openaiModel: 'text-embedding-3-small',
  openaiDimensions: null,
}

function loadConfig(): EngineConfig {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return DEFAULT_CONFIG
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_CONFIG
  }
}

interface AppState {
  config: EngineConfig
  setConfig: (c: EngineConfig) => void
  text1: string
  setText1: (v: string) => void
  text2: string
  setText2: (v: string) => void
  result: ComputeResult | null
  loading: boolean
  error: string | null
  logs: HttpLog[]
  clearLogs: () => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean | ((p: boolean) => boolean)) => void
  handleCalculate: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<EngineConfig>(loadConfig)
  const [text1, setText1] = useState('Le chat dort sur le canapé.')
  const [text2, setText2] = useState('Le félin sommeille sur le sofa.')
  const [result, setResult] = useState<ComputeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<HttpLog[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(config))
  }, [config])

  const handleCalculate = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [v1, v2] = await fetchEmbeddings([text1, text2], config, (entry) =>
        setLogs((prev) => [...prev, entry]),
      )
      const score = cosineSimilarity(v1, v2)
      setResult({ score, vector1: v1, vector2: v2 })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [text1, text2, config])

  return (
    <AppContext.Provider
      value={{
        config,
        setConfig: setConfigState,
        text1,
        setText1,
        text2,
        setText2,
        result,
        loading,
        error,
        logs,
        clearLogs: () => setLogs([]),
        sidebarOpen,
        setSidebarOpen,
        handleCalculate,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
