import { Container } from 'typedi';
import { EnvVars, ProcessEnvVars } from '../../src/env-vars';

afterEach(() => Container.reset());

describe('EnvVars', () => {
  class ProcessEnvVarsApi {
    constructor(private readonly data: NodeJS.ProcessEnv = {}) {}

    getData(): NodeJS.ProcessEnv {
      return this.data;
    }
  }

  describe('getPort', () => {
    const defaultValue = 3_000;

    it('must return <3_000> when not set', () => {
      Container.set(ProcessEnvVars.token, new ProcessEnvVarsApi());
      expect(EnvVars.getPort()).toBe(defaultValue);
    });

    it("must return <3_000> when set with <''>", () => {
      Container.set(ProcessEnvVars.token, new ProcessEnvVarsApi({ PORT: '' }));
      expect(EnvVars.getPort()).toBe(defaultValue);
    });

    it('must return the set value', () => {
      const value = '9000';
      Container.set(ProcessEnvVars.token, new ProcessEnvVarsApi({ PORT: value }));
      expect(EnvVars.getPort()).toBe(Number(value));
    });
  });

  describe('getNodeEnv', () => {
    const defaultValue = 'test';

    it("must return <'test'> when not set", () => {
      Container.set(ProcessEnvVars.token, new ProcessEnvVarsApi());
      expect(EnvVars.getNodeEnv()).toBe(defaultValue);
    });

    it("must return <'test'> when set with <''>", () => {
      Container.set(ProcessEnvVars.token, new ProcessEnvVarsApi({ NODE_ENV: '' }));
      expect(EnvVars.getNodeEnv()).toBe(defaultValue);
    });

    it('must return the set value', () => {
      const value = 'dev';
      Container.set(ProcessEnvVars.token, new ProcessEnvVarsApi({ NODE_ENV: value }));
      expect(EnvVars.getNodeEnv()).toBe(value);
    });
  });

  describe('getRabbitMqUrl', () => {
    const defaultValue = 'amqp://guest:guest@localhost:5672';

    it('must return the default value when not set', () => {
      Container.set(ProcessEnvVars.token, new ProcessEnvVarsApi());
      expect(EnvVars.getRabbitMqUrl()).toBe(defaultValue);
    });

    it("must return the default value when set with <''>", () => {
      Container.set(ProcessEnvVars.token, new ProcessEnvVarsApi({ PORT: '' }));
      expect(EnvVars.getRabbitMqUrl()).toBe(defaultValue);
    });

    it('must return the set value', () => {
      const value = 'amqp://bob:password@localhost:8080';
      Container.set(ProcessEnvVars.token, new ProcessEnvVarsApi({ RABBITMQ_URL: value }));
      expect(EnvVars.getRabbitMqUrl()).toBe(value);
    });
  });
});
