docker build -t wisesmile:react-docker-app .
docker run -it -p 3000:3000 wisesmile:react-docker-app

docker rmi [OPTIONS] IMAGE [IMAGE...]
docker rmi -f b02b9d617511
