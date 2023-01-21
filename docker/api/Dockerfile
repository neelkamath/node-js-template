FROM node:16 AS api
WORKDIR /app
COPY . .
RUN corepack enable
RUN yarn
RUN yarn build

FROM alpine:3 AS grafana-agent
WORKDIR /app
RUN wget https://github.com/grafana/agent/releases/download/v0.28.0/agent-linux-amd64.zip
RUN unzip agent-linux-amd64.zip
RUN chmod a+x agent-linux-amd64

FROM node:16
WORKDIR /app
COPY --from=api /app/dist/ dist
COPY --from=api /app/node_modules/ node_modules
COPY --from=api /app/package.json .
COPY --from=api /app/prisma prisma
COPY agent.yaml .
COPY --from=grafana-agent /app/agent-linux-amd64 .
COPY docker/cmd.sh .
ENV PORT=3000 NODE_ENV=prod
EXPOSE $PORT
HEALTHCHECK \
    CMD curl -f http://localhost:$PORT/health
CMD sh cmd.sh
