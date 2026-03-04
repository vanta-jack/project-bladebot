import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export interface Event {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => void | Promise<void>;
}
