import { Command, Env } from '../types.js';
import {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    InteractionResponseType,
    APIApplicationCommandInteraction,
    APIApplicationCommandInteractionDataIntegerOption,
    APIApplicationCommandInteractionDataBooleanOption
} from 'discord-api-types/v10';
import crypto from 'node:crypto';

// Pure function for core logic: easily testable without discord mocks
export function parseInputs(options: any[] | undefined) {
    let dots = 0;
    let push_yourself = false;
    let devils_bargain = false;
    let assist = false;

    if (options) {
        const dotsOpt = options.find(o => o.name === 'dots') as APIApplicationCommandInteractionDataIntegerOption | undefined;
        const pushOpt = options.find(o => o.name === 'push_yourself') as APIApplicationCommandInteractionDataBooleanOption | undefined;
        const devilOpt = options.find(o => o.name === 'devils_bargain') as APIApplicationCommandInteractionDataBooleanOption | undefined;
        const assistOpt = options.find(o => o.name === 'assist') as APIApplicationCommandInteractionDataBooleanOption | undefined;

    if (dotsOpt) dots = Number(dotsOpt.value);
    if (pushOpt) push_yourself = Boolean(pushOpt.value);
    if (devilOpt) devils_bargain = Boolean(devilOpt.value);
    if (assistOpt) assist = Boolean(assistOpt.value);
    }

    let diceCount = dots;
    if (push_yourself) diceCount += 1;
    if (devils_bargain) diceCount += 1;
    if (assist) diceCount += 1;

    return { dots, push_yourself, devils_bargain, assist, diceCount };
}

// Pure function for core logic: easily testable without discord mocks
export function rollDice({ diceCount }: { diceCount: number }) {
    let rolls: number[] = [];
    let rollZero = false;

    if (diceCount === 0) {
        rollZero = true;
        // Roll 2 dice, take lower. Using crypto for better randomness
        rolls = [crypto.randomInt(1, 7), crypto.randomInt(1, 7)];
    } else {
        // Roll normal
        for (let i = 0; i < diceCount; i++) {
            rolls.push(crypto.randomInt(1, 7));
        }
    }

    let resultTitle = '';

    // We can safely non-null assert `rolls[0]` and `rolls[1]` here
    // because we explicitly pushed to or populated the array above.
    let highest = 0;
    if (rollZero) {
        highest = rolls[0]! <= rolls[1]! ? rolls[0]! : rolls[1]!;
    } else {
        for(let i=0; i<rolls.length; i++) {
            if(rolls[i]! > highest) highest = rolls[i]!;
        }
    }

    let sixesCount = rolls.filter(r => r === 6).length;

    if (!rollZero && highest === 6 && sixesCount >= 2) {
        resultTitle = 'critical';
    } else if (highest === 6) {
        resultTitle = 'success';
    } else if (highest === 4 || highest === 5) {
        resultTitle = 'partial';
    } else {
        resultTitle = 'fail';
    }

    return { rolls, rollZero, highest, sixesCount, resultTitle };
}

// Pure function for building embed structure
export function buildEmbed({ rolls, resultTitle, push_yourself, devils_bargain, assist }: { rolls: number[], resultTitle: string, push_yourself: boolean, devils_bargain: boolean, assist: boolean }) {
    let embedColor = 0x2b2d31;

    // Assigning colors based on outcome
    if (resultTitle === 'critical') embedColor = 0x8a2be2; // Violet
    else if (resultTitle === 'success') embedColor = 0x00ff00; // Green
    else if (resultTitle === 'partial') embedColor = 0xffff00; // Yellow
    else if (resultTitle === 'fail') embedColor = 0xff0000; // Red

    let description = `[${rolls.join(', ')}] **${resultTitle}**\n`;

    if (push_yourself) {
        description += 'You pushed yourself... Mark 2 stress\n';
    }
    if (devils_bargain) {
        description += 'You took a Devil\'s Bargain!\n';
    }
    if (assist) {
        description += 'Your ally helped you... Remind them to mark 1 stress\n';
    }

    return {
        color: embedColor,
        title: `Blades in the Dark Roll`,
        description: description
    };
}

const command: Command = {
    data: {
        name: 'blades',
        description: 'Rolls dice for Blades in the Dark',
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'dots',
                description: 'Your dots in the specific action (0-4)',
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: 0,
                max_value: 4
            },
            {
                name: 'push_yourself',
                description: '+1 bonus die if you push yourself, but take 2 stress',
                type: ApplicationCommandOptionType.Boolean,
                required: false
            },
            {
                name: 'devils_bargain',
                description: "+1 bonus die if you take the devil's bargain",
                type: ApplicationCommandOptionType.Boolean,
                required: false
            },
            {
                name: 'assist',
                description: '+1 bonus die if another player agrees to assist you, but they take 1 stress',
                type: ApplicationCommandOptionType.Boolean,
                required: false
            }
        ]
    },
    async execute(interaction: APIApplicationCommandInteraction, env: Env) {
        // Safe access to options: interaction.data might not have options if none are required/provided
        const options = 'options' in interaction.data ? interaction.data.options : undefined;

        const { dots, push_yourself, devils_bargain, assist, diceCount } = parseInputs(options);

        if (push_yourself && devils_bargain) {
            return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: 'You cannot use both Push Yourself and a Devil\'s Bargain simultaneously!',
                    flags: 64 // Ephemeral flag
                }
            };
        }

        const { rolls, resultTitle } = rollDice({ diceCount });

        const embedData = buildEmbed({ rolls, resultTitle, push_yourself, devils_bargain, assist });

        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                embeds: [embedData]
            }
        };
    },
};

export default command;
