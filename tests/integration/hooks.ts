import { Container } from 'typedi';
import prismaToken from '../../src/db/prisma-token';
import injectDependencies from '../../src/dependency-injector';
import { RabbitMqConnection } from '../../src/rabbitmq/connection';

async function wipeDb(): Promise<void> {
  /*
  Wipe tables. For example:
    const prisma = Container.get(prismaToken);
    await prisma.lastProcessedBlock.deleteMany();
   */
}

/**
 * - Injects the {@link Container} with every production dependency.
 * - We wipe the DB here because the local DB may have been populated during manual testing.
 *
 * Must be used in every {@link beforeEach} (and there must be a {@link beforeEach} for every test).
 */
export async function setUp(): Promise<void> {
  injectDependencies();
  await Promise.all([wipeDb()]);
}

/**
 * Disconnects from the DB, disconnects from RabbitMQ after deleting each queue and exchange, and calls
 * {@link Container.reset}. We don't wipe the DB here because we wipe it in {@link setUp}, and it doesn't matter if the
 * local DB is populated while testing manually later on.
 *
 * Must be used in every {@link afterEach} (and there must be an {@link afterEach} for every test).
 */
export async function tearDown(): Promise<void> {
  const prisma = Container.get(prismaToken);
  await prisma.$disconnect();
  await tearDownRabbitMq();
  Container.reset();
}

/** Disconnects from RabbitMQ after deleting each queue. */
async function tearDownRabbitMq(): Promise<void> {
  const rabbitMqConnection = Container.get(RabbitMqConnection.token);
  const isUp = await rabbitMqConnection.isUp();
  if (!isUp) return; // The test had disconnected.
  // Delete queues. For example: await rabbitMqConnection.channel.deleteQueue(RabbitMqConnection.Queues.Msgs);
  await rabbitMqConnection.disconnect();
}
