import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import {
  AWW_COMMAND,
  handleAwwCommand,
  INVITE_COMMAND,
  handleInviteCommand,
} from './commands/index.ts';

class JsonResponse extends Response {
  constructor(body: unknown, init?: ResponseInit) {
    const jsonBody = JSON.stringify(body);
    const headers = {
      'content-type': 'application/json;charset=UTF-8',
      ...(init && (init.headers as Record<string, string>)),
    } as HeadersInit;
    super(jsonBody, { ...init, headers });
  }
}

export type Env = {
  DISCORD_APPLICATION_ID: string;
  DISCORD_PUBLIC_KEY: string;
  [key: string]: string | undefined;
};

const router = AutoRouter();

router.get('/', (request: Request, env: Env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

// Main webhook route for Discord interactions
router.post('/', async (request: Request, env: Env) => {
  const { isValid, interaction } = await verifyDiscordRequest(request, env);
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    return new JsonResponse({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const data = interaction.data as { name?: string } | undefined;
    switch (String(data?.name || '').toLowerCase()) {
      case AWW_COMMAND.name.toLowerCase():
        return new JsonResponse(await handleAwwCommand());
      case INVITE_COMMAND.name.toLowerCase():
        return new JsonResponse(handleInviteCommand(env.DISCORD_APPLICATION_ID));
      default:
        return new JsonResponse({ error: 'Unknown Command' }, { status: 400 });
    }
  }

  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});

router.all('*', () => new Response('Not Found.', { status: 404 }));

export const discordAuth = {
  verifyKey,
};

export async function verifyDiscordRequest(
  request: Request,
  env: Env,
): Promise<{ isValid: boolean; interaction?: Record<string, unknown> }> {
  const signature = request.headers.get('x-signature-ed25519') || '';
  const timestamp = request.headers.get('x-signature-timestamp') || '';
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await discordAuth.verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  try {
    return { interaction: JSON.parse(body), isValid: true };
  } catch {
    return { isValid: false };
  }
}

export async function handleRequest(request: Request, env: Env) {
  return router.fetch(request, env);
}
