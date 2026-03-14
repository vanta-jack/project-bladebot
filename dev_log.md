# Dev Logs
From newest to oldest

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