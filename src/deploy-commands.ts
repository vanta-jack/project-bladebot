import fs from 'node:fs';
import path from 'node:path';

// Since this is run via ts-node, we can use standard __dirname
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

const commandsPayload: any[] = [];

// Dynamic imports are asynchronous
async function loadCommands() {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        // We use import() instead of require()
        const module = await import(`file://${filePath}`);
        const command = module.default;

        if (command && command.data) {
             commandsPayload.push(command.data);
        }
    }

    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;

    if (!token || !clientId || !guildId) {
        console.error('Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID in your environment variables.');
        process.exit(1);
    }

    console.log(`Started refreshing ${commandsPayload.length} application (/) commands using raw fetch.`);

    const url = `https://discord.com/api/v10/applications/${clientId}/guilds/${guildId}/commands`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${token}`
            },
            body: JSON.stringify(commandsPayload)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Discord API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json() as any[];
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
}

loadCommands();