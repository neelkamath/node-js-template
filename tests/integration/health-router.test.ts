import { setUp, tearDown } from './hooks';
import supertest from 'supertest';
import app from '../../src/app';

beforeEach(setUp);

afterEach(tearDown);

describe('HTTP GET /health', () => {
  it('must respond with the health check', async () => {
    const { status, body } = await supertest(app).get('/health');
    expect(status).toBe(200);
    expect(body).toStrictEqual({ isPostgresUp: true, isRabbitMqUp: true });
  });
});
