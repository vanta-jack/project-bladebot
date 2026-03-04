# Bot Creation Guide

This guide outlines exactly what was done to build this Discord bot from scratch, so you can replicate it yourself in the future.

## 1. Initialization and Packages
First, the Node.js project was initialized and the required packages were installed:

```bash
npm init -y
npm install discord.js dotenv
npm install --save-dev typescript ts-node @types/node
npx tsc --init
```

The `node_modules` folder was added to `.gitignore` to prevent committing dependencies to version control. In the `tsconfig.json`, `verbatimModuleSyntax` was disabled (or set properly) to allow standard imports.

## 2. Directory Structure
A clean directory structure was created to separate responsibilities:

```
src/
├── commands/
│   ├── ping.ts
│   └── bladesroll.ts
├── events/
│   ├── ready.ts
│   └── interactionCreate.ts
├── deploy-commands.ts
├── index.ts
└── types.ts
```

## 3. Typings (`src/types.ts`)
We defined basic TypeScript interfaces for the Commands and Events, allowing standard properties like `data` (a `SlashCommandBuilder`) and an `execute` function.

## 4. Main Entrypoint (`src/index.ts`)
The `index.ts` file was written to:
1. Load environment variables using `dotenv`.
2. Initialize the `Client` with required intents (`Guilds`, `GuildMessages`, `MessageContent`).
3. Dynamically read all command files from `src/commands` and add them to a `Collection`.
4. Dynamically read all event files from `src/events` and attach them to the client.
5. Log in using `process.env.DISCORD_TOKEN`.

## 5. Command Deployment (`src/deploy-commands.ts`)
To register slash commands to Discord, `deploy-commands.ts` was created. It uses the `REST` module from `discord.js` to push the command JSON data directly to a specific server (Guild) for instant updates during development.

## 6. Events (`src/events/`)
- `ready.ts`: Listens for the client to be ready and logs the bot tag.
- `interactionCreate.ts`: Listens for incoming interactions. If it's a Chat Input Command, it retrieves the command from the collection and executes it, handling errors gracefully.

## 7. Commands (`src/commands/`)
- **ping.ts**: A basic boilerplate command returning "Pong!".
- **bladesroll.ts**: This implements the Blades in the Dark mechanics:
  - Takes `dots` (0-4), and booleans for `push_yourself`, `devils_bargain`, and `assist`.
  - Calculates the total dice count based on these booleans.
  - Generates random rolls between 1-6.
  - If 0 dice are rolled, rolls 2 dice and takes the lowest. Otherwise, takes the highest.
  - Evaluates Critical Success (two 6s), Success (highest 6), Partial Success (highest 4 or 5), or Fail (highest 1-3).
  - Returns a nicely formatted Discord embed with the result.

By keeping these separate, you can easily add new files to `src/commands/` or `src/events/` and the bot will load them automatically upon restart!