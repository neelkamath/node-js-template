import amqplib from 'amqplib';
import { EnvVars } from '../env-vars';
import { getLogger } from '../telemetry/logger';
import { Token } from 'typedi';
import { RabbitMqError } from './error';
import { SpanStatusCode } from '@opentelemetry/api';
import withSpan from '../telemetry/tracer';

export namespace RabbitMqConnection {
  /**
   * Must be retrieved from the {@link Container}, and not instantiated directly.
   * @see {@link setUp}
   */
  export class DefaultApi {
    private connection: amqplib.Connection | undefined;
    private _channel: amqplib.Channel | undefined;

    /** Assumes that {@link setUp} has finished executing. */
    get channel(): amqplib.Channel {
      return this._channel!;
    }

    /*
    This isn't in the <constructor> because it's a long-running process, and clients must be able to <await> the setup.
     */
    /**
     * Must be called before accessing the {@link channel} for the first time. Safe to call multiple times.
     * @throws {@link RabbitMqError}
     */
    async setUp(): Promise<void> {
      await this.setUpConnection();
      await this.setUpChannel();
    }

    /**
     * Assigns {@link connection}.
     * @throws {@link RabbitMqError}
     */
    private async setUpConnection(): Promise<void> {
      const spanBuilder = { fn: this.setUpConnection.name, path: __filename, ns: DefaultApi.name };
      await withSpan({ traceName: 'rabbit-mq-connection', spanName: 'connection-setup' }, spanBuilder, async (span) => {
        const logger = getLogger(__filename);
        try {
          this.connection = await amqplib.connect(EnvVars.getRabbitMqUrl());
        } catch (err) {
          logger.critical(`Failed to connect: ${err}`);
          // @ts-ignore: TS2345: Argument of type 'unknown' is not assignable to parameter of type 'Exception'.
          span.recordException(err);
          span.setStatus({ code: SpanStatusCode.ERROR, message: 'Failed to connect.' });
          throw new RabbitMqError(err);
        }
        this.connection.on('error', async (err) => {
          await withSpan(
            { traceName: 'rabbit-mq-connection', spanName: 'on-error-callback' },
            spanBuilder,
            async (nestedSpan) => {
              logger.critical(`Disconnecting due to a connection error: ${err}`);
              nestedSpan.recordException(err);
              nestedSpan.setStatus({
                code: SpanStatusCode.ERROR,
                message: 'Disconnecting due to a connection error.',
              });
              await this.disconnect();
            },
          );
        });
      });
    }

    /**
     * Assigns {@link _channel}.
     * @throws {@link RabbitMqError}
     */
    private async setUpChannel(): Promise<void> {
      const traceName = 'rabbit-mq-connection';
      const spanBuilder = { fn: this.setUpChannel.name, ns: DefaultApi.name, path: __filename };
      await withSpan({ traceName, spanName: 'channel-setup' }, spanBuilder, async (span) => {
        const logger = getLogger(__filename);
        try {
          this._channel = await this.connection!.createChannel();
        } catch (err) {
          logger.critical(`Disconnecting due to channel creation failing: ${err}`);
          // @ts-ignore: TS2345: Argument of type 'unknown' is not assignable to parameter of type 'Exception'.
          span.recordException(err);
          span.setStatus({ code: SpanStatusCode.ERROR, message: 'Disconnecting due to channel creation failing.' });
          await this.disconnect();
          throw new RabbitMqError(err);
        }
        this.channel.on('error', async (err) => {
          await withSpan({ traceName, spanName: 'on-error-callback' }, spanBuilder, async (nestedSpan) => {
            logger.critical(`Disconnecting due to a channel error: ${err}`);
            nestedSpan.recordException(err);
            nestedSpan.setStatus({ code: SpanStatusCode.ERROR, message: 'Disconnecting due to a channel error.' });
            await this.disconnect();
            nestedSpan.end();
          });
        });
      });
    }

    /**
     * Safe to call multiple times.
     * @returns `false` only if the connection failed to close.
     */
    async disconnect(): Promise<boolean> {
      const isClosed = await this.closeChannel();
      if (!isClosed) return false;
      return await this.closeConnection();
    }

    /**
     * Safe to call multiple times.
     * @returns `false` only if the {@link _channel} failed to close.
     */
    private async closeChannel(): Promise<boolean> {
      return withSpan(
        { traceName: 'rabbit-mq-connection', spanName: 'channel-closer' },
        { fn: this.closeChannel.name, path: __filename, ns: DefaultApi.name },
        async (span) => {
          try {
            await this._channel?.close();
          } catch (err) {
            getLogger(__filename).error(`Failed to close channel: ${err}`);
            // @ts-ignore: TS2345: Argument of type 'unknown' is not assignable to parameter of type 'Exception'.
            span.recordException(err);
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Failed to close channel.' });
            return false;
          }
          this._channel = undefined;
          return true;
        },
      );
    }

    /**
     * Safe to call multiple times.
     * @returns `false` only if the {@link connection} failed to close.
     */
    private async closeConnection(): Promise<boolean> {
      return await withSpan(
        { traceName: 'rabbit-mq-connection', spanName: 'connection-closer' },
        { fn: this.closeConnection.name, path: __filename, ns: DefaultApi.name },
        async (span) => {
          try {
            await this.connection?.close();
          } catch (err) {
            getLogger(__filename).error(`Failed to close connection: ${err}`);
            // @ts-ignore: TS2345: Argument of type 'unknown' is not assignable to parameter of type 'Exception'.
            span.recordException(err);
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Failed to close connection.' });
            return false;
          }
          this.connection = undefined;
          return true;
        },
      );
    }

    /** @returns Whether RabbitMQ is working as expected. Doesn't require {@link setUp} to have been called. */
    async isUp(): Promise<boolean> {
      return await withSpan(
        { traceName: 'rabbit-mq-connection', spanName: 'health-checker' },
        { fn: this.isUp.name, path: __filename, ns: DefaultApi.name },
        async (span) => {
          if (this._channel === undefined) return false;
          try {
            this.channel.eventNames(); // Execute an arbitrary command to check that the connection works.
          } catch (err) {
            getLogger(__filename).critical(`Failed to check if RabbitMQ is up: ${err}`);
            // @ts-ignore: TS2345: Argument of type 'unknown' is not assignable to parameter of type 'Exception'.
            span.recordException(err);
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Failed to check if RabbitMQ is up.' });
            return false;
          }
          return true;
        },
      );
    }
  }

  export const token = new Token<DefaultApi>('RabbitMqConnection');
}
