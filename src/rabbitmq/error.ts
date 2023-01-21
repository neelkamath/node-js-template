/** The RabbitMQ operation failed. For example, RabbitMQ was down, or the queue didn't exist. */
export class RabbitMqError extends Error {
  constructor(readonly error?: any) {
    super();
  }
}
