# Setup Guide

This guide details how to start the newly transformed Serverless Webhook Bot from scratch.

## Wait, what changed in this version?

If you are new to coding, you might be used to bots that run on a computer (or a rented server like a VPS) 24/7. Those bots connect to Discord using "WebSockets" and wait patiently for messages. The library `discord.js` works this way.

This project has been rewritten to be **Serverless**. This means the code doesn't stay running all the time. Instead, we host the code on **Cloudflare Workers** (a massive network of super-fast servers around the world).
1. When a user types `/bladesroll`, Discord sends a single HTTP `POST` message (like a text message) directly to a specific URL on Cloudflare.
2. Cloudflare instantly wakes up our code.
3. Our code reads the message, rolls the dice, and replies with a JSON message.
4. The code goes back to sleep.

**Why is this better?**
- It's essentially **free** to host for most bots (Cloudflare gives you 100,000 requests per day for free).
- It's incredibly fast because the code runs on a Cloudflare server physically close to the user who sent the command (even in places like the Philippines).
- We don't have to manage or pay for a server that is running 24/7 doing nothing.

---

## 0. Ensure dependencies

```json
"dependencies": {
    "discord-api-types": "^0.37.x",
    "discord-interactions": "^4.x.x"
  },
"devDependencies": {
    "@cloudflare/workers-types": "^4.x.x",
    "wrangler": "^3.x.x"
  }
```

Run the following to install all dependencies:
```bash
npm install
```

## 1. Discord Developer Portal

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** and give your bot a name.
3. Navigate to the **General Information** tab.
   - Copy your **Application ID** (this is your Client ID).
   - Copy your **Public Key** (You will need this for Cloudflare so it can verify messages actually came from Discord).
4. In the sidebar, navigate to the **Bot** tab.
   - Click **Reset Token** and copy the resulting Token.
   - *Note: Since this is a serverless webhook bot, we don't strictly need Gateway Intents like Message Content anymore unless you plan to use an old-school WebSocket client later.*
5. To invite the bot to your server, go to **OAuth2 -> URL Generator**.
6. Select the `bot` and `applications.commands` scopes.
7. Under **Bot Permissions**, select the permissions you need (like Send Messages and Embed Links).
8. Copy the Generated URL, paste it into your browser, and authorize the bot into your desired server.

## 2. Setting up Cloudflare Workers

We use `Wrangler`, Cloudflare's command-line tool, to push our code to the internet.

1. In your terminal, authenticate Wrangler with your Cloudflare account:
   ```bash
   npx wrangler login
   ```
2. You need to tell Cloudflare your Discord Public Key and Application ID so the worker can securely verify requests. Run these commands and paste the values when prompted:
   ```bash
   npx wrangler secret put DISCORD_PUBLIC_KEY
   npx wrangler secret put DISCORD_APPLICATION_ID
   ```

## 3. Registering Commands to Discord

Before Discord knows what commands (like `/blades`) your bot has, you must register them.

Because we no longer use `dotenv`, you pass your credentials directly in the terminal just for this step:

```bash
# On Mac/Linux:
DISCORD_TOKEN="your_token_here" CLIENT_ID="your_app_id" GUILD_ID="your_server_id" npx ts-node src/deploy-commands.ts

# On Windows PowerShell:
$env:DISCORD_TOKEN="your_token_here"; $env:CLIENT_ID="your_app_id"; $env:GUILD_ID="your_server_id"; npx ts-node src/deploy-commands.ts
```
*Note: We register to a specific `GUILD_ID` (Server ID) because global commands can take an hour to update.*

## 4. Deploying the Bot

Deploy the code to Cloudflare's global edge network!

```bash
npx wrangler deploy
```

When this finishes, Wrangler will give you a URL (e.g., `https://project-bladebot.<your-username>.workers.dev`). **Copy this URL.**

## 5. Linking Discord to Cloudflare

The final step is telling Discord where to send the HTTP requests when someone uses your slash commands.

1. Go back to the [Discord Developer Portal](https://discord.com/developers/applications) and click your application.
2. On the **General Information** page, find the **Interactions Endpoint URL** field.
3. Paste the URL you got from Cloudflare in Step 4.
4. Click **Save Changes**.
   - *Behind the scenes: Discord instantly sends a "Ping" to your Cloudflare URL. Your code verifies the signature and replies with a "Pong". If successful, Discord saves the URL.*

You are done! Try typing `/bladesroll` in your Discord server.