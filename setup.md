# Setup Guide

This guide details how to start the bot from scratch.

## 1. Discord Developer Portal

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** and give your bot a name.
3. In the sidebar, navigate to the **Bot** tab.
4. Under **Privileged Gateway Intents**, turn on:
   - **Presence Intent**
   - **Server Members Intent**
   - **Message Content Intent** (required to read messages properly)
   *Note: Save your changes.*
5. Under the **Bot** tab, click **Reset Token** and copy the resulting Token. You will need this for the `.env` file.
6. Navigate to the **General Information** tab and copy your **Application ID** (this is your Client ID).
7. To invite the bot to your server, go to **OAuth2 -> URL Generator**.
8. Select the `bot` and `applications.commands` scopes.
9. Under **Bot Permissions**, select the following permissions (some of these are selected for future-proofing):
   - Read Messages/View Channels
   - Send Messages
   - Send Messages in Threads
   - Create Public Threads
   - Create Private Threads
   - Embed Links
   - Attach Files
   - Add Reactions
   - Use External Emojis
   - Use External Stickers
   - Mention @everyone, @here, and All Roles
   - Manage Messages
   - Manage Threads
   - Read Message History
   - Use Application Commands
10. Copy the Generated URL, paste it into your browser, and authorize the bot into your desired server.

## 2. Environment Variables

Create a file named `.env` in the root directory of the bot. Add the following variables:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=the_server_id_here
```

*To get the GUILD_ID, right-click your server icon in Discord (with Developer Mode enabled in Settings -> Advanced) and click "Copy Server ID".*

## 3. Running the Bot

1. Ensure you have Node.js installed.
2. Run `npm install` to install all dependencies.
3. Register the slash commands to your guild by running:
   ```bash
   npx ts-node src/deploy-commands.ts
   ```
4. Start the bot by running:
   ```bash
   npx ts-node src/index.ts
   ```
5. If successful, you will see a message in the console indicating the bot is ready. You can now use `/ping` and `/bladesroll` in your server.