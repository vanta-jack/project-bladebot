import { APIApplicationCommandInteraction, APIInteractionResponse, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';

export interface Env {
    DISCORD_PUBLIC_KEY: string;
    DISCORD_APPLICATION_ID: string;
}

export interface Command {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    execute: (interaction: APIApplicationCommandInteraction, env: Env) => APIInteractionResponse | Promise<APIInteractionResponse>;
}
