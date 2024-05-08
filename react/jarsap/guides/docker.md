Docker
======

Docker provide:

* Complete freedom from complex production deployments.
* Bundling an entire runtime environment into one package, including the application platform and all its dependencies.
* Makes it easier to port and run applications more reliably across all instances and environments.

After reading this guide, you will know:

* What's in the docker file.
* How to create, run, stop and deploy the image.

Suggestions:

* Always use docker.

--------------------------------------------------------------------------------

Dockerfile
----------

```bash
FROM node:5.0
MAINTAINER tribou

# Prepare app directory
RUN mkdir -p /usr/src/app
ADD . /usr/src/app

# Install dependencies
WORKDIR /usr/src/app
RUN npm install

# Build the app
RUN npm build

# Expose the app port
EXPOSE 8000

# Start the app
CMD npm start
```

Create the image
----------------

```bash
$ docker build -t wisesmile/jarsap .
```

Run the image
-------------

```bash
$ docker run -p 49160:3000 -d wisesmile/jarsap
```

Stop the image
--------------

```bash
$ docker stop <image id>
```

Push to docker hub
------------------

```bash
$ docker tag <image id> wisesmile/jarsap:latest
```

### References

* [jarsap on docker hub](https://hub.docker.com/r/wisesmile/jarsap/)
* [SungardAS blog post](http://blog.sungardas.com/2016/07/containers-the-next-evolution-in-virtualization/)
