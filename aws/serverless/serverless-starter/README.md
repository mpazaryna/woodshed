# Simple HTTP Endpoint Example

This example demonstrates how to setup a simple HTTP GET endpoint. Once you ping it, it will reply with the current time. While the internal function is name `currentTime` the HTTP endpoint is exposed as `ping`.

## Invoke the function locally

```bash
serverless invoke local --function currentTime
```

## Deploy

In order to deploy the endpoint, simply run:

```bash
serverless deploy
```

## Usage

You can now invoke the Lambda directly and even see the resulting log via

```bash
serverless invoke --function currentTime --log
```

or as send an HTTP request directly to the endpoint using a tool like curl

```bash
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/ping
```

## Unit Testing with Jest

https://www.serverless.com/blog/unit-testing-nodejs-serverless-jest

```bash
yarn test
```
