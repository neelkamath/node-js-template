FROM rabbitmq:3.11.5-management
RUN apt-get update && apt-get install -y wget
RUN wget https://github.com/noxdafox/rabbitmq-message-deduplication/releases/download/0.5.4/elixir-1.12.2.ez -O plugins/elixir-1.12.2.ez
RUN wget https://github.com/noxdafox/rabbitmq-message-deduplication/releases/download/0.5.4/rabbitmq_message_deduplication-0.5.4.ez -O plugins/rabbitmq_message_deduplication-0.5.4.ez
RUN rabbitmq-plugins enable rabbitmq_message_deduplication
