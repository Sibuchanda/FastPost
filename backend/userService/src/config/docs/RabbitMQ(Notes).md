## 1. What is RabbitMQ?
RabbitMQ is an open-source message broker that implements the Advanced Message Queuing Protocol (AMQP). It acts as a middle layer for communication between different services or components in a distributed system, enabling asynchronous, decoupled communication via messaging.


## 2. Why do we use RabbitMQ?
RabbitMQ is used to:
- Enable asynchronous communication between services.
- Improve scalability by decoupling components.
- Handle background jobs (e.g., sending emails, processing images).
- Ensure reliable delivery of messages.
- Implement event-driven architectures in microservices-based systems.
- Provide load buffering when consumers are slower than producers.


## 3. How does RabbitMQ work?
RabbitMQ works on a producer-consumer model.
- `Producer`: Sends messages to a RabbitMQ exchange.
- `Exchange`: Routes messages to appropriate queues based on bindings and routing keys.
- `Queue`: Stores messages until they are picked up by a consumer.
- `Consumer`: Retrieves messages from the queue and processes them.

Messages flow :
`Producer → Exchange → Queue → Consumer`


## 4. What is the workflow of RabbitMQ?
`Connection`: Producer connects to RabbitMQ using the AMQP protocol.

`Queue Declaration`: The producer or consumer declares the queue (if it doesn't exist).

`Message Sending`: The producer sends a message to an exchange.

`Routing`: The exchange routes the message to the correct queue.

`Storage`: The message stays in the queue until a consumer picks it up.

`Consumption`: The consumer receives the message and processes it.

`Acknowledgment`: The consumer sends an acknowledgment (ack) to RabbitMQ.

`Message Removal`: RabbitMQ deletes the message after a successful ack.


## 5. What protocol does RabbitMQ use?
RabbitMQ primarily uses the `AMQP (Advanced Message Queuing Protocol)`.

- AMQP is a binary, application-level protocol designed for message-oriented middleware.

RabbitMQ also supports other protocols via plugins, such as:

  - MQTT
  - STOMP
  - HTTP (via Web-STOMP plugin)



## 6. What format of data does RabbitMQ accept?
RabbitMQ does not enforce a specific format.

It accepts `binary data (Buffer)`.

Common practice:

- Convert your message (usually a JSON object) to a string using JSON.stringify().

- Convert the string to a Buffer before sending to RabbitMQ.


## 7. What are the components of RabbitMQ?
`Producer`: Sends messages to an exchange.

`Exchange`: Receives messages and routes them to queues.

`Queue`: Stores messages until they are consumed.

`Binding`: Link between an exchange and a queue, often with a routing key.

`Consumer`: Receives messages from a queue.

`Channel`: Virtual connection inside a TCP connection; used for sending/receiving messages.

`Connection`: A real TCP connection between the application and RabbitMQ broker.

## 8. Types of Exchanges in RabbitMQ
`Direct Exchange`: Routes messages based on exact routing key match.

`Topic Exchange`: Routes based on pattern matching (e.g., log.*).

`Fanout Exchange`: Broadcasts messages to all queues bound to it.

`Headers Exchange`: Routes based on message headers instead of routing keys.

## 9. Advantages of RabbitMQ
- Asynchronous Processing: Allows tasks to run in background.

- Loose Coupling: Services operate independently.

- Scalable: Easy to add more consumers or workers.

- Reliable Delivery: Supports message durability and acknowledgment.

- Retry Mechanism: Messages can be re-queued if not acknowledged.

- Supports Multiple Protocols: AMQP, STOMP, MQTT, etc.

- Flexible Routing: Multiple exchange types support complex message flows.

- Message Acknowledgment: Prevents data loss.

## 10. Disadvantages of RabbitMQ
- Additional Complexity: Adds another infrastructure component to manage.

- Resource Usage: RabbitMQ server requires memory and CPU resources.

- Message Size Limitations: Not ideal for large binary data or video/audio files.


## 11. Common Use Cases of RabbitMQ
- Sending emails or notifications asynchronously

- Background job processing (e.g., image resizing, payment processing)

- Logging and monitoring pipelines

- Microservices communication (event-driven)

- Task queues for worker services

- Delayed job execution (with plugins)

- Load leveling / traffic buffering

## 12. Does RabbitMQ use HTTP or WebSocket?
No, RabbitMQ uses AMQP, not HTTP or WebSocket.However, it can support WebSockets or HTTP via plugins like:
`rabbitmq_web_stomp` or
`rabbitmq_web_mqtt`

These allow web-based apps (like browsers) to interact with RabbitMQ over WebSocket.




## 13. What happens if RabbitMQ crashes?
If queues and messages are marked durable/persistent, they will survive restarts. If not, all in-memory messages are lost.
Best practice is to always use:

`durable: true` for queues

`persistent: true` for messages

## 14. What is a dead-letter queue (DLQ)?
A Dead-Letter Queue is a queue where unprocessed or failed messages are routed. Reasons for failure:

- Message was rejected (nack'd)

- TTL expired

- Queue overflow

- DLQs help with debugging and retry strategies.

## 15. How does RabbitMQ handle retries?
By default, RabbitMQ does not retry failed messages automatically.

You can implement retries using:

- Dead-letter exchanges with TTL and retry queues

- Custom logic in the consumer to requeue messages

## 16. What are some alternatives to RabbitMQ?
- Apache Kafka – Event streaming, log-based architecture

- Amazon SQS – Fully managed queue service

- Redis Pub/Sub – Lightweight in-memory pub/sub

- NATS – Lightweight messaging system for microservices

- ZeroMQ – Low-level messaging library