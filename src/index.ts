import { verifyKey } from 'discord-interactions';
import { InteractionType, APIInteraction, InteractionResponseType } from 'discord-api-types/v10';
import { Env } from './types.js';

import ping from './commands/ping.js';
import bladesroll from './commands/bladesroll.js';

const commands = [ping, bladesroll];

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // 1. Only allow POST requests
        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        // 2. Extract Discord signature headers
        const signature = request.headers.get('x-signature-ed25519');
        const timestamp = request.headers.get('x-signature-timestamp');

        if (!signature || !timestamp || !env.DISCORD_PUBLIC_KEY) {
            return new Response('Bad request signature', { status: 401 });
        }

        // 3. Clone the request to read the body text for verification
        const bodyText = await request.clone().text();

        // 4. Verify the ed25519 signature
        const isValidRequest = verifyKey(
            bodyText,
            signature,
            timestamp,
            env.DISCORD_PUBLIC_KEY
        );

        if (!isValidRequest) {
            return new Response('Bad request signature', { status: 401 });
        }

        // 5. Parse the validated JSON body
        const interaction = await request.json() as APIInteraction;

        // 6. Handle Discord's initial PING (required for setup)
        if (interaction.type === InteractionType.Ping) {
            return Response.json({ type: InteractionResponseType.Pong });
        }

        // 7. Handle Application Commands (Slash Commands)
        if (interaction.type === InteractionType.ApplicationCommand) {
            const commandName = interaction.data.name;

            // Find the matching command handler
            const command = commands.find(c => c.data.name === commandName);

            if (!command) {
                console.error(`Command ${commandName} not found.`);
                return new Response('Command not found', { status: 400 });
            }

            try {
                // Execute the command logic and return the JSON response
                // We cast interaction here because we checked the type above
                const responsePayload = await command.execute(interaction as any, env);
                return Response.json(responsePayload);
            } catch (error) {
                console.error('Error executing command:', error);
                return Response.json({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: 'There was an error while executing this command!',
                        flags: 64 // Ephemeral
                    }
                });
            }
        }

        // Catch-all for other interaction types
        return new Response('Unknown interaction type', { status: 400 });
    }
};
