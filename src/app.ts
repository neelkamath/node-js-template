import express, { Express } from 'express';
import { Container } from 'typedi';
import { ProcessEnvVars } from './env-vars';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { getLogger } from './telemetry/logger';
import cors from 'cors';
import healthRouter from './routes/health';
import metricsRouter from './routes/metrics';
import withSpan from './telemetry/tracer';

function setUpHttpLogging(app: Express): void {
  withSpan(
    { traceName: 'app', spanName: 'http-logging-setup' },
    { fn: setUpHttpLogging.name, path: __filename },
    () => {
      const logger = getLogger('Express.js');
      const handler = morgan('combined', {
        stream: { write: (message) => logger.notice(message) },
      });
      app.use(handler);
    },
  );
}

/** Registers the HTTP API routes. */
function setUpHttpApi(): void {
  app.use('/health', healthRouter);
  app.use('/metrics', metricsRouter);
}

Container.set(ProcessEnvVars.token, new ProcessEnvVars.DefaultApi());
const app = express();
app.use(bodyParser.json());
setUpHttpLogging(app); // Set up HTTP logging ASAP so that requests get logged.
app.use(cors());
setUpHttpApi();
export default app;
