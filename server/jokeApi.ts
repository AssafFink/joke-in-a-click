import { GenerationTimeoutError, MissingApiKeyError, type GenerateJoke } from './generateJoke.js';

export const TOPIC_MAX_LENGTH = 100;
// Far more than 100 characters of JSON needs, even in UTF-8 Hebrew or emoji.
export const MAX_BODY_BYTES = 1024;

const GENERATION_MESSAGE = 'לא הצלחנו ליצור בדיחה כרגע. אפשר לנסות שוב.';

function json(status: number, body: unknown, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

function error(status: number, code: string, message: string, extraHeaders?: Record<string, string>): Response {
  return json(status, { error: code, message }, extraHeaders);
}

// Validates the request and returns the trimmed topic, or an error Response.
async function readTopic(request: Request): Promise<string | Response> {
  const tooLarge = () => error(413, 'PAYLOAD_TOO_LARGE', 'גוף הבקשה גדול מדי');
  const invalid = () => error(400, 'INVALID_REQUEST', 'בקשה לא תקינה');

  const declared = Number(request.headers.get('content-length'));
  if (declared > MAX_BODY_BYTES) return tooLarge();

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return tooLarge();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return invalid();
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return invalid();

  const topic = (body as { topic?: unknown }).topic;
  if (topic === undefined) return '';
  if (typeof topic !== 'string') return invalid();

  const trimmed = topic.trim();
  if (trimmed.length > TOPIC_MAX_LENGTH) {
    return error(400, 'INVALID_TOPIC', 'יש להזין נושא באורך של עד 100 תווים');
  }
  return trimmed;
}

export async function handleJokeRequest(request: Request, generate: GenerateJoke): Promise<Response> {
  if (request.method !== 'POST') {
    return error(405, 'METHOD_NOT_ALLOWED', 'יש לשלוח בקשת POST', { Allow: 'POST' });
  }

  const topic = await readTopic(request);
  if (topic instanceof Response) return topic;

  const started = Date.now();
  try {
    const joke = await generate(topic);
    return json(200, { joke });
  } catch (err) {
    // Log only non-sensitive metadata: never the topic, the joke or model output.
    const ms = Date.now() - started;
    if (err instanceof GenerationTimeoutError) {
      console.error(`[api/joke] GENERATION_TIMEOUT after ${ms}ms`);
      return error(504, 'GENERATION_TIMEOUT', GENERATION_MESSAGE);
    }
    if (err instanceof MissingApiKeyError) {
      console.error('[api/joke] OPENAI_API_KEY is missing');
      return error(503, 'GENERATION_FAILED', GENERATION_MESSAGE);
    }
    const name = err instanceof Error ? err.constructor.name : 'unknown';
    const status = (err as { status?: unknown })?.status;
    console.error(`[api/joke] GENERATION_FAILED (${name}${status ? ` ${status}` : ''}) after ${ms}ms`);
    return error(502, 'GENERATION_FAILED', GENERATION_MESSAGE);
  }
}
