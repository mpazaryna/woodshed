# Getting Started with Create React App and Docker

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Docker build

docker build -t wisesmile/cra-docker .
docker build -t wisesmile/cra-docker:1.0.0 .

## Docker run

docker run --name cra-docker -p 4680:80 -d wisesmile/cra-docker
docker run -p 8080:80 wisesmile/cra-docker

## Access the url

http://localhost:4680/

## Docker Hub

https://hub.docker.com/u/wisesmile
