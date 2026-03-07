import { Command, Env } from '../types.js';
import { ApplicationCommandType, InteractionResponseType, APIApplicationCommandInteraction } from 'discord-api-types/v10';

const command: Command = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',
        type: ApplicationCommandType.ChatInput,
    },
    async execute(interaction: APIApplicationCommandInteraction, env: Env) {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: 'Pong!',
            },
        };
    },
};

export default command;
