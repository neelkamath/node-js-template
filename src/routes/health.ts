import express from 'express';

import { Container } from 'typedi';
import { Db } from '../db/db';
import { getLogger } from '../telemetry/logger';
import { RabbitMqConnection } from '../rabbitmq/connection';
import { SpanStatusCode } from '@opentelemetry/api';
import withSpan from '../telemetry/tracer';

type Health = {
  readonly isPostgresUp: boolean;
  readonly isRabbitMqUp: boolean;
};

const router = express.Router().get('/', async (_, res) => {
  await withSpan({ traceName: 'health-router', spanName: 'router' }, { path: __filename }, async () => {
    const health: Health = { isPostgresUp: await isPostgresUp(), isRabbitMqUp: await isRabbitMqUp() };
    getLogger(__filename).debug(`Health: ${JSON.stringify(health)}`);
    res.status(health.isPostgresUp && health.isRabbitMqUp ? 200 : 500).send(health);
  });
});

/** @returns Whether Postgres is functioning as expected. */
async function isPostgresUp(): Promise<boolean> {
  return await withSpan(
    { traceName: 'health-router', spanName: 'postgres-health-checker' },
    { fn: isPostgresUp.name, path: __filename },
    async (span) => {
      const db = Container.get(Db.token);
      try {
        return await db.isUp();
      } catch (err) {
        getLogger(__filename).critical(`Failed to query Postgres: ${err}`);
        // @ts-ignore: TS2345: Argument of type 'unknown' is not assignable to parameter of type 'Exception'.
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Failed to query Postgres.' });
        return false;
      }
    },
  );
}

/** @returns Whether RabbitMQ is functioning as expected. */
async function isRabbitMqUp(): Promise<boolean> {
  return await withSpan(
    { traceName: 'health-router', spanName: 'rabbit-mq-health-checker' },
    { fn: isRabbitMqUp.name, path: __filename },
    async (span) => {
      const rabbitMqConnection = Container.get(RabbitMqConnection.token);
      try {
        return await rabbitMqConnection.isUp();
      } catch (err) {
        getLogger(__filename).critical(`Failed to query RabbitMQ: ${err}`);
        // @ts-ignore: TS2345: Argument of type 'unknown' is not assignable to parameter of type 'Exception'.
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Failed to query.' });
        return false;
      }
    },
  );
}

export default router;
