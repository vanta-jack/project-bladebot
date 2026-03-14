# Dev Logs
From newest to oldest

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