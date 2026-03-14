/**
 * Minimal entrypoint: delegate all logic to `src/commands.ts`.
 */

import { handleRequest } from './commands';

type Env = {
  DISCORD_APPLICATION_ID: string;
  DISCORD_PUBLIC_KEY: string;
  [key: string]: string | undefined;
};

const server = {
  fetch: (request: Request, env: Env) => handleRequest(request, env),
};

export default server;
