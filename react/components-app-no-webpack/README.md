# React Tutorial

This is the React comment box example from
[the React tutorial](http://facebook.github.io/react/docs/tutorial.html).

## To use

There are several simple server implementations included. They all serve static
files from `public/` and handle requests to `/api/comments` to fetch or add data.
Start a server with one of the following:

### Node

```sh
npm install
node server.js
```

And visit <http://localhost:3000/>. Try opening multiple tabs!

## Changing the port

You can change the port number by setting the `$PORT` environment variable
before invoking any of the scripts above, e.g.,

```sh
PORT=3001 node server.js
```

## Docker

Create the image

```
docker build -t ot/wisesmile-app-no-webpack .
```

Run the docker image

```
docker run -p 49160:3000 -d ot/wisesmile-app-no-webpack
```

Stop the docker image

```
docker stop <image id>
```
