import { Container } from 'typedi';
import { ProcessEnvVars } from './env-vars';
import prismaToken from './db/prisma-token';
import { PrismaClient } from '@prisma/client';
import { Db } from './db/db';
import { RabbitMqConnection } from './rabbitmq/connection';
import fetchToken from './fetch-token';
import fetch from 'node-fetch';

export default function injectDependencies(): void {
  Container.set(ProcessEnvVars.token, new ProcessEnvVars.DefaultApi());
  Container.set(fetchToken, fetch);
  injectDbDependencies();
  injectRabbitMqDependencies();
}

function injectDbDependencies(): void {
  Container.set(prismaToken, new PrismaClient());
  Container.set(Db.token, new Db.DefaultApi());
}

function injectRabbitMqDependencies(): void {
  Container.set(RabbitMqConnection.token, new RabbitMqConnection.DefaultApi());
}
