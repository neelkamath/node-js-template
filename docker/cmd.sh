#!/usr/bin/env sh

if [ "$GRAFANA_CLOUD_ENABLED" = 'true' ]
then
  printf 'Telemetry will be sent to the console as well as Grafana Cloud since the latter has been enabled.\n'
  ./agent-linux-amd64 -config.expand-env -config.file=agent.yaml &
  yarn start
else
  printf 'Telemetry will only be sent to the console since Grafana Cloud has been disabled.\n'
  yarn start
fi
