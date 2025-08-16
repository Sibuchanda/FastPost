## sendOtpConsumer

`sendOtpConsumer` is an asynchronous function that connects to a RabbitMQ queue named `"send-otp"`, listens for OTP messages, and sends them via email using the `nodemailer` library.

- Parameters
  - None

- Returns
  - `Promise<void>` : Resolves when the consumer successfully connects and starts listening for messages. Logs errors if connection, consumption, or email sending fails.

---

### NOTES
- **RabbitMQ Connection**:
  - Uses `amqplib` to connect to RabbitMQ with configuration from environment variables:
    - `RabbitMQ_Host`
    - `RabbitMQ_Username`
    - `RabbitMQ_Password`
  - `port: 5672` → Default AMQP port.

- **Queue Declaration**:
  - `channel.assertQueue(queueName, { durable: true })`  
    Ensures the `"send-otp"` queue exists and is durable, meaning it will survive RabbitMQ restarts.

- **Consuming Messages**:
  - `channel.consume(queueName, async (msg) => { ... })` listens for messages from the queue.
  - Messages are expected to be JSON containing:
    ```json
    {
      "to": "recipient@example.com",
      "subject": "Email subject",
      "body": "Email text body"
    }
    ```

- **Email Sending**:
  - Uses `nodemailer.createTransport` with:
    - Host: `"smtp.gmail.com"`
    - Port: `465` (SSL)
    - Authentication from:
      - `USER` (email address)
      - `PASSWORD` (email password or app password)
  - Sends plain text emails (`text: body`) with `"Char Application"` as sender.

- **Acknowledging Messages**:
  - `channel.ack(msg)` → Confirms successful processing so the message is removed from the queue.

- **Error Handling**:
  - If sending fails, logs `"Failed to send OTP"` with the error.
  - If RabbitMQ connection fails, logs `"Failed to start RabbitMQ consumer"`.
