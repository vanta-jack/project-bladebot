# Dev Logs
From newest to oldest
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