/**
 * Minimal entrypoint: delegate all logic to `src/server.ts`.
 */

import { handleRequest, Env } from './server.ts';

const server = {
  fetch: (request: Request, env: Env) => handleRequest(request, env),
};

export default server;
