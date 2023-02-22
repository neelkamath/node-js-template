import supertest from 'supertest';
import { Container } from 'typedi';
import { Db } from '../../../src/db/db';
import { RabbitMqConnection } from '../../../src/rabbitmq/connection';
import { ProcessEnvVars } from '../../../src/env-vars';
import app from '../../../src/app';

afterEach(() => Container.reset());

describe('HTTP GET /health', () => {
  const setUpUnhealthyTest = () => {
    class MockProcessEnvVars {
      getData() {
        return {};
      }
    }

    class MockDb {
      isUp() {
        return false;
      }
    }

    class MockRabbitMqConnection {
      isUp() {
        return true;
      }
    }

    Container.set(ProcessEnvVars.token, new MockProcessEnvVars());
    Container.set(Db.token, new MockDb());
    Container.set(RabbitMqConnection.token, new MockRabbitMqConnection());
  };

  it('must state that the server is unhealthy', async () => {
    setUpUnhealthyTest();
    const { status, body } = await supertest(app).get('/health');
    expect(status).toBe(500);
    expect(body).toStrictEqual({ isPostgresUp: false, isRabbitMqUp: true });
  });

  const setUpHealthyTest = () => {
    class MockProcessEnvVars {
      getData() {
        return {};
      }
    }

    class MockDb {
      isUp() {
        return true;
      }
    }

    class MockRabbitMqConnection {
      isUp() {
        return true;
      }
    }

    Container.set(ProcessEnvVars.token, new MockProcessEnvVars());
    Container.set(Db.token, new MockDb());
    Container.set(RabbitMqConnection.token, new MockRabbitMqConnection());
  };

  it('must state that the server is healthy', async () => {
    setUpHealthyTest();
    const { status, body } = await supertest(app).get('/health');
    expect(status).toBe(200);
    expect(body).toStrictEqual({ isPostgresUp: true, isRabbitMqUp: true });
  });
});
