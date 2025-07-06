import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import {createClient} from "redis";

import userRoutes from './routes/user.js';
import connectRabbitMQ from './config/rabbitmq.js'

dotenv.config();

//Database Connection
connectDB();

//RabbitMQ connection
connectRabbitMQ();

//Redis Connection
export const redisClient = createClient({
    url: process.env.REDIS_URI,
});

redisClient.connect().then(()=>{
    console.log("Redis Connected Successfully...");
}).catch((err)=>{
  console.log(err);
})

const app = express();
const PORT = process.env.PORT;


app.use("api/v1", userRoutes);

app.listen(PORT, ()=>{
    console.log(`Listening to PORT : ${PORT}`)
});