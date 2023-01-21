# Running the Server Using Docker Compose

This is the recommended method to run the server locally.

## Installation

1. Sign up for a Grafana Cloud [account](https://grafana.com/auth/sign-up/create-user) if you'd like to [observe](grafana-cloud.md) the system using Grafana Cloud.
2. Install [Docker](https://docs.docker.com/get-docker/).
3. Clone the repo using one of the following methods:

   - SSH:

     ```shell
     git clone git@github.com:neelkamath/node-js-template.git
     ```

   - HTTPS:

     ```shell
     git clone https://github.com/neelkamath/node-js-template.git
     ```

4. Change the directory:

   ```shell
   cd node-js-template
   ```

5. If you're not using Windows, run:

   ```shell
   chmod +x docker/dockerize
   ```

6. Set up the environment variables:
   1. Create a file named `.env`.
   2. Copy-paste the contents of [`.example.env`](.example.env) into it.
   3. Set the [environment variables](docs/env.md).

## Usage

1. Start the server on `http://localhost:3000`:

   ```shell
   docker compose --profile prod -f docker/docker-compose.yml up --build -d
   ```

2. Shut down once you're done:

   ```shell
   docker compose --profile prod -f docker/docker-compose.yml down
   ```
