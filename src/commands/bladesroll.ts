import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

function parseInputs(interaction: ChatInputCommandInteraction) {
    const dots = interaction.options.getInteger('dots') ?? 0;
    const push_yourself = interaction.options.getBoolean('push_yourself') ?? false;
    const devils_bargain = interaction.options.getBoolean('devils_bargain') ?? false;
    const assist = interaction.options.getBoolean('assist') ?? false;

    let diceCount = dots;
    if (push_yourself) diceCount += 1;
    if (devils_bargain) diceCount += 1;
    if (assist) diceCount += 1;

    return { dots, push_yourself, devils_bargain, assist, diceCount };
}

function rollDice({ diceCount }: { diceCount: number }) {
    let rolls: number[] = [];
    let rollZero = false;

    if (diceCount === 0) {
        rollZero = true;
        // Roll 2 dice, take lower
        rolls = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    } else {
        // Roll normal
        for (let i = 0; i < diceCount; i++) {
            rolls.push(Math.floor(Math.random() * 6) + 1);
        }
    }

    let resultTitle = '';
    let highest = 0;

    if (rollZero) {
        highest = Math.min(...rolls);
    } else {
        highest = Math.max(...rolls);
    }

    let sixesCount = rolls.filter(r => r === 6).length;

    if (!rollZero && highest === 6 && sixesCount >= 2) {
        resultTitle = 'Critical Success';
    } else if (highest === 6) {
        resultTitle = 'Success';
    } else if (highest === 4 || highest === 5) {
        resultTitle = 'Partial Success';
    } else {
        resultTitle = 'Fail';
    }

    return { rolls, rollZero, highest, sixesCount, resultTitle };
}

function buildEmbed({ rolls, resultTitle, push_yourself, devils_bargain, assist }: { rolls: number[], resultTitle: string, push_yourself: boolean, devils_bargain: boolean, assist: boolean }) {
    const embedColor = 0x2b2d31; // dark grey typical discord embed color, easily adjustable.
    let description = `[${rolls.join(', ')}] **${resultTitle}**\n`;

    if (push_yourself) {
        description += 'You pushed yourself! Remember to mark 2 stress\n';
    }
    if (devils_bargain) {
        description += 'You took a Devil\'s Bargain!\n';
    }
    if (assist) {
        description += 'Your teammate helped you! Remind them to mark 1 stress\n';
    }

    const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`Blades in the Dark Roll`)
        .setDescription(description);

    return embed;
}

const command = {
    data: new SlashCommandBuilder()
        .setName('bladesroll')
        .setDescription('Rolls dice for Blades in the Dark')
        .addIntegerOption(option =>
            option.setName('dots')
                .setDescription('The dots of a character in a specific action (0-4)')
                .setMinValue(0)
                .setMaxValue(4)
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('push_yourself')
                .setDescription('+1 bonus die, acknowledge player pushing themselves')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('devils_bargain')
                .setDescription('+1 bonus die, acknowledge the player took the devils bargain')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('assist')
                .setDescription('+1 bonus die, acknowledge player is being assisted')
                .setRequired(false)),
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const { dots, push_yourself, devils_bargain, assist, diceCount } = parseInputs(interaction);

        if (push_yourself && devils_bargain) {
            await interaction.reply({ content: 'You cannot use both Push Yourself and a Devil\'s Bargain simultaneously!', ephemeral: true });
            return;
        }

        const { rolls, resultTitle } = rollDice({ diceCount });

        const embed = buildEmbed({ rolls, resultTitle, push_yourself, devils_bargain, assist });

        await interaction.reply({ embeds: [embed] });
    },
};

export default command;
