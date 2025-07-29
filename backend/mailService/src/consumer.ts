import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


export const sendOptConsumer = async () =>{
    try{
      const connection = await amqp.connect({
        protocol: "amqp",
        hostname: process.env.RabbitMQ_Host,
        port: 5672,
        username: process.env.RabbitMQ_Username,
        password: process.env.RabbitMQ_Password,
     });

     const channel = await connection.createChannel();
     const queueName = "send-otp";
     await channel.assertQueue(queueName, {durable: true});
     console.log("Mail service for Consumer is started. Listening for OTP");
     channel.consume(queueName, async(msg)=>{
         if(msg){
            try{
              const {to, subject, body} = JSON.parse(msg.content.toString());
              const transporter = nodemailer.createTransport({
                host:"smtp.gmail.com",
                port:465,
                auth:{
                    user: process.env.USER,
                    pass: process.env.PASSWORD,
                }
              });
              await transporter.sendMail({
                from: "Char Application",
                to,
                subject,
                text: body
              })
              console.log(`OTP messaage send to : ${to}`);
              channel.ack(msg);
            }catch(err){
                console.log("Failed to send OTP : ", err);
            }
         }
     })

    }catch(err){
        console.log("Failed to start RabbitMQ consumer:",err);
    }
}