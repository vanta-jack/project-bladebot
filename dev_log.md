# Dev Logs
From newest to oldest
## Adding the template to the existing repository

## Setting up codespacee 
> I would like to use bun for this project and have other dependencies in docker. 
> - That way, I don't have to run a PostCreateCommand every time I rebuild.
>   - Correction: PostCreateCommand would be better for codespace setup because it makes the bun commands readily available on the terminal. Hence, for now, we are going with PostCreateCommand. I can also have bun bundled on docker later.
> - I am keeping devcontainer as `image/universal:2` because the universal image is cached in GitHub servers and is actually very fast on rebuild.

Docker Daemon still works on universal image. Therefore, we do not need Docker in Docker build.