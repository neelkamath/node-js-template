# Running the Server in the Cloud

This is the recommended method to run the server in the cloud. For example, you might use this method if you're running it in production.

## Installation

1. Sign up for a Grafana Cloud [account](https://grafana.com/auth/sign-up/create-user) if you'd like to [observe](grafana-cloud.md) the system using Grafana Cloud.
2. Edit Grafana Agent's [configuration](../agent.yaml) if required.
3. Set up [PostgreSQL 14.4](https://www.postgresql.org/). For example, [GCP SQL](https://cloud.google.com/sql/docs/postgres/), [AWS RDS](https://aws.amazon.com/rds/postgresql/). It's recommended to allocate 0.25 vCPU, 0.5 GB of memory, and 5 GB of storage.
4. Set up [RabbitMQ 3.11](https://rabbitmq.com/), and install the [RabbitMQ Delayed Message Plugin](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange). For example, [Stackhero for RabbitMQ](https://www.stackhero.io/en/services/RabbitMQ/benefits). It's recommended to allocate 0.25 vCPU, 2.5 GB of memory, and 1 GB of storage.
5. Set up the server:

   1. Clone the repo using one of the following methods:

      - SSH:

        ```shell
        git clone git@github.com:neelkamath/node-js-template.git
        ```

      - HTTPS:

        ```shell
        git clone https://github.com/neelkamath/node-js-template.git
        ```

   2. Change the directory:

      ```shell
      cd node-js-template
      ```

   3. Build the Docker image:

      ```shell
      docker build -f docker/node-js-template/Dockerfile .
      ```

   4. Run the Docker image on port 3,000 (this can be overridden using the `PORT` environment variable). For example, [GCP Run](https://cloud.google.com/run/), [AWS Fargate](https://aws.amazon.com/fargate/). It's recommended to allocate 2 vCPU, and 4 GiB of memory. Any number of instances can be run.
   5. Set the [environment variables](env.md).
   6. Connect to PostgreSQL and RabbitMQ.
