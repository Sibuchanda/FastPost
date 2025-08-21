import express from 'express';
import dotenv from 'dotenv';
import { sendOptConsumer } from './consumer.js';
dotenv.config();
sendOptConsumer();
const app = express();
const PORT = process.env.PORT;
app.get("/", (req, res) => {
    res.send("This is main sevice");
});
app.listen(PORT, () => {
    console.log(`Listening to PORT : ${PORT}`);
});
