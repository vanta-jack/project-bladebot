# Dev Logs

> I would like to use bun for this project and have other dependencies in docker. 
> - That way, I don't have to run a PostCreateCommand every time I rebuild.
> - I am keeping devcontainer as `image/universal:2` because the universal image is cached in GitHub servers and is actually very fast on rebuild.

Docker Daemon still works on universal image. Therefore, we do not need Docker in Docker build.