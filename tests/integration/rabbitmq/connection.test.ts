import { setUp, tearDown } from '../hooks';
import { Container } from 'typedi';
import { RabbitMqConnection } from '../../../src/rabbitmq/connection';

beforeEach(setUp);

afterEach(tearDown);

describe('RabbitMqConnection', () => {
  describe('DefaultApi', () => {
    describe('setUp', () => {
      it('must set up the channel', async () => {
        const rabbitMqConnection = Container.get(RabbitMqConnection.token);
        expect(rabbitMqConnection.channel).not.toBeUndefined();
      });
    });

    describe('disconnect', () => {
      it('must disconnect', async () => {
        const rabbitMqConnection = Container.get(RabbitMqConnection.token);
        const isDisconnected = await rabbitMqConnection.disconnect();
        expect(isDisconnected).toBe(true);
        expect(rabbitMqConnection.channel).toBeUndefined();
      });
    });

    describe('isUp', () => {
      it('must return <false>', async () => {
        const rabbitMqConnection = Container.get(RabbitMqConnection.token);
        await rabbitMqConnection.disconnect();
        const isUp = await rabbitMqConnection.isUp();
        expect(isUp).toBe(false);
      });

      it('must return <true>', async () => {
        const rabbitMqConnection = Container.get(RabbitMqConnection.token);
        const isUp = await rabbitMqConnection.isUp();
        expect(isUp).toBe(true);
      });
    });
  });
});
