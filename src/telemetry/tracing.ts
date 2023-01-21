import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'node-js-template',
      [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
    }),
  ),
});
sdk.start();
