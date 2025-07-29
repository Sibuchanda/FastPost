import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import User from "../model/User.js";
import { generateToken } from "../config/generateToken.js";
export const loginUser = TryCatch(async (req, res) => {
    const { email } = req.body;
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        res.status(429).json({
            message: "Too many requests. Please wait before requesting for a new OTP"
        });
        return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, {
        EX: 300,
    });
    //Setting the rateLimit so that user can't send email contineouslly
    await redisClient.set(rateLimitKey, "true", {
        EX: 60,
    });
    const message = {
        to: email,
        subject: "Your OTP verification code",
        body: `Dear ${email}, Your 6 digit OTP is : ${otp}. It is valid for 5 minutes`
    };
    await publishToQueue("send-otp", message);
    res.status(200).json({
        message: "OTP sent to your mail successfully"
    });
});
export const verifyUser = TryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body;
    if (!email || !enteredOtp) {
        res.status(400).json({
            message: "Email and OTP required!",
        });
        return;
    }
    const otpKey = `otp:${email}`;
    const storedOTP = await redisClient.get(otpKey);
    if (!storedOTP || storedOTP !== enteredOtp) {
        res.status(400).json({
            message: "Invalid or expired OTP",
        });
        return;
    }
    await redisClient.del(otpKey);
    let user = await User.findOne({ email });
    if (!user) {
        const name = email.slice(0, 8);
        user = await User.create({ name, email });
    }
    const token = generateToken(user);
    res.json({
        message: "User Vrified",
        user,
        token,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
