// Thrown when fetch itself fails (no response from the server at all).
export class NetworkError extends Error {}

// Client for POST /api/joke. Throws on any failure; the UI shows its own copy, not the server message.
export async function requestJoke(topic: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch('/api/joke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
  } catch {
    throw new NetworkError('Joke request did not reach the server');
  }
  if (!res.ok) throw new Error(`Joke request failed: ${res.status}`);

  const data: unknown = await res.json();
  const joke = (data as { joke?: unknown } | null)?.joke;
  if (typeof joke !== 'string' || joke.trim() === '') throw new Error('Invalid joke response');
  return joke;
}
