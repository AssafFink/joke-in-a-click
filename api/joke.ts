import { handleJokeRequest } from '../server/jokeApi.js';
import { generateJoke } from '../server/generateJoke.js';

// POST /api/joke — wires the request handler to the real OpenAI generator.
export default {
  fetch: (request: Request) => handleJokeRequest(request, generateJoke),
};
