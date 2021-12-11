# API Proxy Example

## Docker Workflow

```sh
docker build -t mpaz/weather-api-proxy .
docker run -p 49160:8080 -d paz/weather-api-proxy
docker exec -it <container id> /bin/bash
docker ps
```

curl -i localhost:49160

In the example above, Docker mapped the 8080 port inside of the container to the port 49160 on your machine.
