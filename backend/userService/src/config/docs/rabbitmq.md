## connectRabbitMQ

`connectRabbitMQ` is an asynchronous function that establishes a connection to a RabbitMQ server using the `amqplib` library. It also creates a channel for sending messages.

- Parameters
  - None

- Returns
  - `Promise<void>` : Resolves when the connection and channel are successfully established. Logs an error if connection fails.

---

## publishToQueue

`publishToQueue` is an asynchronous function that sends a message to a specific RabbitMQ queue. It ensures the queue is declared before sending the message.

- Parameters
  - `queueName`: `string` – The name of the queue to which the message will be published.
  - `message`: `any` – The message content that will be sent to the queue. It is converted to a JSON string.

- Returns
  - `Promise<void>` : Resolves when the message is successfully published to the queue.


### NOTES
-   ```durable: true``` --> The Queue will not be lost if RabbitMQ restarts. The queue metadata is stored on disk.
- ```persistent: true``` – This tells RabbitMQ to store the message on disk, not just in memory. This ensures the message won’t be lost if RabbitMQ crashes.

- `In what format do we send it ???` : 
Technically, RabbitMQ expects a `buffer (binary data)`. So, in code, we usually Convert the `JSON object` to a `string` using `JSON.stringify()`
, Then convert that `string` to a `Buffer`
Example : `Buffer.from(JSON.stringify(message))`