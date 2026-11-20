export type EngineType = "lmstudio" | "openai";

export type OpenAIModel =
  | "text-embedding-ada-002"
  | "text-embedding-3-small"
  | "text-embedding-3-large";

export interface EngineConfig {
  type: EngineType;
  lmstudioUrl: string;
  lmstudioModel: string;
  openaiKey: string;
  openaiModel: OpenAIModel;
  openaiDimensions: number | null;
}

export const OPENAI_MAX_DIMENSIONS: Record<OpenAIModel, number | null> = {
  "text-embedding-ada-002": null,
  "text-embedding-3-small": 1536,
  "text-embedding-3-large": 3072,
};

export interface HttpLog {
  id: number;
  timestamp: string;
  engine: string;
  request: {
    url: string;
    method: string;
    body: unknown;
  };
  response?: unknown;
  error?: string;
}

export interface ComputeResult {
  score: number;
  vector1: number[];
  vector2: number[];
}
