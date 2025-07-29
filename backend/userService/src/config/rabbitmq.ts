import ampq from 'amqplib';

let channel: ampq.Channel

export const connectRabbitMQ = async()=>{
    try{
     const connection = await ampq.connect({
        protocol: "amqp",
        hostname: process.env.RabbitMQ_Host,
        port: 5672,
        username: process.env.RabbitMQ_Username,
        password: process.env.RabbitMQ_Password,
     });

     channel = await connection.createChannel();
     console.log("RabbitMQ connected successfully...");
    }catch(err){
        console.log("Error occured during RabbitMQ connection : ", err);
    }
}

export const publishToQueue = async(queueName: string, message: any)=>{
    if(!channel){
        console.log("RabbitMQ channel is not initialized!");
    }
    await channel.assertQueue(queueName, { durable: true});
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
        persistent: true,
    })
}
