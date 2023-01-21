import sleep from '../../src/sleep';

/**
 * Pauses 10 ms to ensure that any RabbitMQ messages produced have had time to be consumed.
 *
 * @example
 * ```
 * const rabbitMqLoop = Container.get(RabbitMqLoop.token);
 * const queue = RabbitMqConnection.Queues.JunoLoop;
 * const fn = jest.fn();
 * await rabbitMqLoop.consume(queue, fn);
 * const rabbitMqConnection = Container.get(RabbitMqConnection.token);
 * rabbitMqConnection.channel.sendToQueue(queue, Buffer.from(''));
 * await reconcileRabbitMq();
 * expect(fn).toHaveBeenCalled();
 * ```
 */
export default async function reconcileRabbitMq(): Promise<void> {
  await sleep({ ms: 25 });
}
