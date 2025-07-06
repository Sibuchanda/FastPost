import ampq from 'amqplib';
let channel;
const connectRabbitMQ = async () => {
    try {
        const connection = await ampq.connect({
            protocol: "amqp",
            hostname: process.env.RabbitMQ_Host,
            port: 5672,
            username: process.env.RabbitMQ_Username,
            password: process.env.RabbitMQ_Password,
        });
        channel = await connection.createChannel();
        console.log("RabbitMQ connected successfully...");
    }
    catch (err) {
        console.log("Error occured during RabbitMQ connection : ", err);
    }
};
export default connectRabbitMQ;
