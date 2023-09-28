# ritepay-node

The backend for the RitePay mobile application.

## Requirements

* Node.js v20+
* NPM (or alternative)

## Usage

1. Install all the NPM dependencies: `npm i`
2. Start the web server: `npm start`

## Architecture

`ritepay-node` uses the Node.js package [Express](https://expressjs.com) to power the web server for the API.

## Endpoints
All API endpoints are suffixed with `/api/v1`. For example, reach an endpoint with: `curl localhost:3000/api/v1/ping`.

### `/ping`
Sanity test endpoint, should return `pong`.
