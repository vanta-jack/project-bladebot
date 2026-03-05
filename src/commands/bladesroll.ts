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

/* 
TODO: Make embedColor a variable that changes depending on the outcome!
    - Critical Success: Violet      crit-color: #hex-value
    - Full Success: Green           success-color: #hex-value
    - Partial Success: Yellow       partial-color: #hex-value
    - Fail: Red                     fail-color: #hex-value
where "outcome-color" is the variable name and mapped to specific variables
*/
function buildEmbed({ rolls, resultTitle, push_yourself, devils_bargain, assist }: { rolls: number[], resultTitle: string, push_yourself: boolean, devils_bargain: boolean, assist: boolean }) {
    const embedColor = 0x2b2d31; // TODO: Make 
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

    const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`Blades in the Dark Roll`)
        .setDescription(description);

    return embed;
}

const command = {
    data: new SlashCommandBuilder()
        .setName('blades')
        .setDescription('Rolls dice for Blades in the Dark')
        .addIntegerOption(option =>
            option.setName('dots')
                .setDescription('Your dots in the specific action (0-4)')
                .setMinValue(0)
                .setMaxValue(4)
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('push_yourself')
                .setDescription('+1 bonus die if you push yourself, but take 2 stress')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('devils_bargain')
                .setDescription("+1 bonus die if you take the devil's bargain")
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('assist')
                .setDescription('+1 bonus die if another player agrees to assist you, but they take 1 stress')
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
