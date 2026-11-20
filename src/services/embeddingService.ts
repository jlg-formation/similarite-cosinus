import type { EngineConfig, HttpLog } from "../types";

let logCounter = 0;

export async function fetchEmbeddings(
  texts: string[],
  config: EngineConfig,
  onLog: (entry: HttpLog) => void,
): Promise<number[][]> {
  if (config.type === "lmstudio") {
    return fetchLMStudioEmbeddings(texts, config, onLog);
  }
  return fetchOpenAIEmbeddings(texts, config, onLog);
}

async function fetchLMStudioEmbeddings(
  texts: string[],
  config: EngineConfig,
  onLog: (entry: HttpLog) => void,
): Promise<number[][]> {
  const base = config.lmstudioUrl.replace(/\/$/, "");
  const url = `${base}/v1/embeddings`;
  const body = {
    model: config.lmstudioModel || "text-embedding-nomic-embed-text-v1.5",
    input: texts,
  };

  const id = ++logCounter;
  const timestamp = new Date().toISOString();
  const engine = `LMStudio @ ${base}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    onLog({ id, timestamp, engine, request: { url, method: "POST", body }, error });
    throw new Error(
      `Impossible de joindre LMStudio (${base}). Vérifiez que le serveur est démarré et que CORS est activé.\n${error}`,
    );
  }

  const data: unknown = await response.json();

  if (!response.ok) {
    const error = `HTTP ${response.status} ${response.statusText}`;
    onLog({ id, timestamp, engine, request: { url, method: "POST", body }, response: data, error });
    throw new Error(`LMStudio a répondu avec une erreur : ${error}`);
  }

  onLog({ id, timestamp, engine, request: { url, method: "POST", body }, response: data });

  return orderEmbeddings(data, texts.length);
}

async function fetchOpenAIEmbeddings(
  texts: string[],
  config: EngineConfig,
  onLog: (entry: HttpLog) => void,
): Promise<number[][]> {
  const url = "https://api.openai.com/v1/embeddings";
  const body = {
    model: config.openaiModel,
    input: texts,
    ...(config.openaiDimensions ? { dimensions: config.openaiDimensions } : {}),
  };

  const id = ++logCounter;
  const timestamp = new Date().toISOString();
  const engine = `OpenAI / ${config.openaiModel}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openaiKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    onLog({ id, timestamp, engine, request: { url, method: "POST", body }, error });
    throw new Error(`Erreur réseau lors de l'appel à OpenAI.\n${error}`);
  }

  const data: unknown = await response.json();

  if (!response.ok) {
    const errObj = data as { error?: { message?: string } };
    const msg = errObj?.error?.message ?? `HTTP ${response.status}`;
    onLog({
      id,
      timestamp,
      engine,
      request: { url, method: "POST", body },
      response: data,
      error: msg,
    });
    throw new Error(`OpenAI a répondu avec une erreur : ${msg}`);
  }

  onLog({ id, timestamp, engine, request: { url, method: "POST", body }, response: data });

  return orderEmbeddings(data, texts.length);
}

// Réordonne par `index` : l'ordre de réponse n'est pas garanti.
function orderEmbeddings(data: unknown, count: number): number[][] {
  const items = (data as { data?: { index: number; embedding: number[] }[] }).data ?? [];
  const out: (number[] | undefined)[] = Array(count);
  for (const item of items) {
    if (item.index < count) out[item.index] = item.embedding;
  }
  if (out.some((v) => v === undefined)) {
    throw new Error(`Embeddings incomplets : ${items.length} reçu(s), ${count} attendu(s).`);
  }
  return out as number[][];
}
