# build the container
   docker build -t paz/node-web-app-001 .

# Run
   docker run -p 49160:8080 paz/node-web-app-001

# Get container ID
   $ docker ps

# Print app output
   $ docker logs <container id>

# Example
   Running on http://localhost:49160/

# Remove docker image
   docker rmi -f <container id>

(article)https://nodejs.org/en/docs/guides/nodejs-docker-webapp
