import { describe, expect, it } from 'vitest';
import { handleJokeRequest, MAX_BODY_BYTES } from './jokeApi.js';
import { GenerationTimeoutError, type GenerateJoke } from './generateJoke.js';

// Fake generator: records topics it was called with, never calls OpenAI.
function fakeGenerate(result: () => Promise<string> = async () => 'בדיחה') {
  const calls: string[] = [];
  const generate: GenerateJoke = (topic) => {
    calls.push(topic);
    return result();
  };
  return { generate, calls };
}

function post(body: string): Request {
  return new Request('http://localhost/api/joke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

describe('POST /api/joke validation', () => {
  it('rejects methods other than POST with 405', async () => {
    const { generate, calls } = fakeGenerate();
    const res = await handleJokeRequest(new Request('http://localhost/api/joke'), generate);
    expect(res.status).toBe(405);
    expect(res.headers.get('Allow')).toBe('POST');
    expect((await res.json()).error).toBe('METHOD_NOT_ALLOWED');
    expect(calls).toHaveLength(0);
  });

  it('rejects invalid JSON with 400', async () => {
    const { generate, calls } = fakeGenerate();
    const res = await handleJokeRequest(post('{oops'), generate);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('INVALID_REQUEST');
    expect(calls).toHaveLength(0);
  });

  it('rejects a non-string topic with 400', async () => {
    const { generate } = fakeGenerate();
    const res = await handleJokeRequest(post(JSON.stringify({ topic: 123 })), generate);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('INVALID_REQUEST');
  });

  it('treats an empty or missing topic as a general joke', async () => {
    const { generate, calls } = fakeGenerate();
    const empty = await handleJokeRequest(post(JSON.stringify({ topic: '' })), generate);
    const missing = await handleJokeRequest(post('{}'), generate);
    expect(empty.status).toBe(200);
    expect(missing.status).toBe(200);
    expect(calls).toEqual(['', '']);
  });

  it('treats a whitespace-only topic as empty', async () => {
    const { generate, calls } = fakeGenerate();
    const res = await handleJokeRequest(post(JSON.stringify({ topic: '   ' })), generate);
    expect(res.status).toBe(200);
    expect(calls).toEqual(['']);
  });

  it('accepts a 100-character topic', async () => {
    const { generate, calls } = fakeGenerate();
    const topic = 'א'.repeat(100);
    const res = await handleJokeRequest(post(JSON.stringify({ topic })), generate);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ joke: 'בדיחה' });
    expect(calls).toEqual([topic]);
  });

  it('rejects a 101-character topic with 400', async () => {
    const { generate, calls } = fakeGenerate();
    const res = await handleJokeRequest(post(JSON.stringify({ topic: 'a'.repeat(101) })), generate);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('INVALID_TOPIC');
    expect(calls).toHaveLength(0);
  });

  it('rejects a body larger than the limit with 413', async () => {
    const { generate, calls } = fakeGenerate();
    const res = await handleJokeRequest(post(JSON.stringify({ topic: 'x'.repeat(MAX_BODY_BYTES) })), generate);
    expect(res.status).toBe(413);
    expect((await res.json()).error).toBe('PAYLOAD_TOO_LARGE');
    expect(calls).toHaveLength(0);
  });
});

describe('POST /api/joke generation failures', () => {
  it('returns 504 on timeout', async () => {
    const { generate } = fakeGenerate(() => Promise.reject(new GenerationTimeoutError()));
    const res = await handleJokeRequest(post('{}'), generate);
    expect(res.status).toBe(504);
    expect((await res.json()).error).toBe('GENERATION_TIMEOUT');
  });

  it('returns 502 on any other failure', async () => {
    const { generate } = fakeGenerate(() => Promise.reject(new Error('boom')));
    const res = await handleJokeRequest(post('{}'), generate);
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe('GENERATION_FAILED');
  });
});

describe('POST /api/joke caching', () => {
  it('marks success and error responses as no-store', async () => {
    const { generate } = fakeGenerate();
    const ok = await handleJokeRequest(post('{}'), generate);
    const bad = await handleJokeRequest(post('{oops'), generate);
    expect(ok.headers.get('Cache-Control')).toBe('no-store');
    expect(bad.headers.get('Cache-Control')).toBe('no-store');
  });
});
