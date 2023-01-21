# Node.js Template

This repo is a template for a Node.js application. You can browse through the repo to see which technologies are used, and how they're used. Here are some technologies that you might want to replace with others:

- There's a [PR template](.github/pull_request_template.md). It contains a line `I have updated the architecture docs if necessary.`. It's assumed that there's a separate GitHub repo for the system's design, and this is what it means to by "architecture docs".
- RabbitMQ is used as the message broker even though RocketMQ is better because there are no hosted RocketMQ solutions.
- Prisma is used as the DB library, but it'd be better to use a different one because Prisma is an ORM, and ORMs are bad.
- This application is a REST API, but it'd be better to use GraphQL.
- AWS is used for the cloud, but it'd be better to use GCP.
- Yarn is used as the package manager but npm is better.
- Postgres is used as the DB but CockroachDB is better.

## Installation

Here are the guides for running this microservice using:

- [Docker Compose](docs/docker-compose.md) (recommended for local development)
- [Cloud](docs/cloud.md) (recommended for production)

## Usage

- Here's the latest version's [documentation](https://neelkamath.github.io/node-js-template/).
- [Changelog](docs/CHANGELOG.md)
- [Observability](docs/grafana-cloud.md)

## [Contributing](docs/CONTRIBUTING.md)

## Credits

[`dockerize`](docker/dockerize) was taken from [jwilder](https://github.com/jwilder/dockerize).
