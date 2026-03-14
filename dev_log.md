# Dev Logs
From newest to oldest

## running the bot
```bash
# register commands
bun run src/register.ts
# start the bot or something, use as entry point
bun run src/index.ts
# deploy
bun wrangler deploy
```
I'm not too sure in what order to write these commands at the moment. But hey, it's working now.

I have to deploy. Then go to Discord Dev Portal > App > General Information > Interactions Endpoint URL
then pasted the link from Cloudflare Dasboard > App. The link should be there.

example interactions endpoint url: `https://appname.username.workers.dev/`

## ngrok tunnel

Update: Since we are in a codespace instance, I do not see a point in using ngrok for local testing. See above for updated logs.

I may have lazily pasted the EXPORT to shell rather than setting them it up in config files. Note that ngrok authtoken does not work in the .env file

`export NGROK_AUTHTOKEN=authoken`

Future iterations should make an `ngrok.yml` by using `ngrok config edit`
```yml 
# ngrok.yml
version: 3
agent:
  authtoken: <your-authtoken>
```

## .env file

Apparently, I still need to have a .env file to handle stuff like registering via `bun run src/register` from this codespaces machine.

I am aware the documentations for this bot is specifically highlighting there is no need for a .env, however I cannot be bothered with manually copy-pasting everything every damn time. Hence I am simply going to make one and adding it to .gitignore

## Putting secrets in wrangler

The Discord Developer Documentation says to put secrets via `wrangler secret put [KEY]`

Since I am using bun, this is the sequence. Do them one at a time.

```bash
$ bun wrangler secret put DISCORD_TOKEN
$ bun wrangler secret put DISCORD_PUBLIC_KEY
$ bun wrangler secret put DISCORD_APPLICATION_ID
$ bun wrangler secret put DISCORD_TEST_GUILD_ID
```

This will prompt you for the values in the CLI. Just paste the correct information

The secrets are actually put in Cloudflare Dashboard > Workers and Pages > App Name > Settings > Variables and Secrets

## Discord CDN images on Cloudflare Worker Bot

Taken from [Discord Developer Documentation](https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers#creating-your-cloudflare-worker)

> WARN: When using Cloudflare Workers, your app won’t be able to access non-ephemeral CDN media. For example, trying to fetch an image like https://cdn.discordapp.com/attachments/1234/56789/my_image.png would result in a 403 error. Cloudflare Workers are still able to access ephemeral CDN media.

## deploying the app?

using `bun x wrangler deploy`, I was able to get the app deployed. Since I am on Codespaces, it required some manual splicing of links to get the goddamn thing to work. Would not recommend doing this on a beat-up iOS 16 iPad.

The bot did deploy with no issues and I was able to get it authenticated in cloudflare. Thank God for built-in template. Moreover

## Gemini Code Assist

I've installed the VS Code extension. I have Gemini Pro Subscription anyways and apparently, this VS Code extension doesn't use the API. Does that mean I get to abuse the subscription on this? 

I'm gonna fuck around and find out

## jules implementation of typescript

I let Jules work on the migration of the JavaScript to TypeScript. There were some errors

TypeScript catching this truncated/skipped part because Jules did not bother with 

```typescript
// tsconfig.json
{
  "compilerOptions": {
    [...]
    "allowImportingTsExtensions": true, --> This part was causing trouble
  }
  [...]
}
```

> **Error**: Option 'allowImportingTsExtensions' can only be used when either 'noEmit' or 'emitDeclarationOnly' is set.ts

The fix:

```typescript
{
  "compilerOptions": {
    [...]
    "allowImportingTsExtensions": true, --> This part was causing trouble
    "noEmit": true"
  }
  [...]
}
```

> **Error**: Cannot find type definition file for '@types/mocha'. The file is in the program because: Entry point of type library '@types/mocha' specified in compilerOptions.ts

For some reason, I could have sworn I had everything--the dependencies installed via bun in package.json. But just be safe, I made sure this bit existed in `package.json`
```json
}
    [...]
  "devDependencies": {
    "@cloudflare/workers-types": "^4.2024.0",
    "@eslint/js": "^9.1.1",
    "@types/chai": "^5.2.3",
    "@types/mocha": "^10.0.10" <-- added this line
    [...]
  }
}
```

Then, I manually ran `bun install -d @types/mocha`. But I'm pretty sure `bun install` or something like that would install the packages and automatically do this.


## bun x wrangler types produces files with problems in them

Apparently, by default, wrangler types include the Workers runtime definition. This causes redundant instances of the same properties found in the complete @cloudflare/worker-types

To stop the redundancy from happening, generate only the types for specific binding (ie Discord Keys) and leave the global Worker types to the installed package (as in package.json config)

Solution:
```
bun x wrangler types --include-runtime=false
```

## Codespaces was using outdated version of linux in its universal image that comes as default kitchen sink image

- switched to universal:5-linux

## Adding the template to the existing repository
We are using curl over clone because we are just interested in copying the current repository of the sample bot
```bash
curl -L https://github.com/discord/cloudflare-sample-app/archive/refs/heads/main.tar.gz | tar -xz --strip-components=1
```


## git switch vs git checkout
I used `git switch -c <branch>` to make the new branch `cloudflare-worker-app` because it is more clear on its intent. `git checkout` will be used more for managing branches and restoring files.

## Setting up codespacee 
> I would like to use bun for this project and have other dependencies in docker. 
> - That way, I don't have to run a PostCreateCommand every time I rebuild.
>   - Correction: PostCreateCommand would be better for codespace setup because it makes the bun commands readily available on the terminal. Hence, for now, we are going with PostCreateCommand. I can also have bun bundled on docker later.
> - I am keeping devcontainer as `image/universal:2` because the universal image is cached in GitHub servers and is actually very fast on rebuild.

Docker Daemon still works on universal image. Therefore, we do not need Docker in Docker build.

## Switch from npm and nodejs to bun

I've seen what bun can do and I think I'll stick to it despite the original repository structured for npm.