import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import User from "../model/User.js";
import { generateToken } from "../config/generateToken.js";
import crypto from "crypto";
import axios from "axios";
import { z } from "zod";
// Validating User Schema using Zod library
export const signupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z
        .string()
        .min(3, { message: "Username should be at least 3 characters long" })
        .max(35, { message: "Username should be maximum 35 characters long" }),
    password: z
        .string()
        .min(8, { message: "Password should be at least 8 characters long" })
        .max(25, { message: "Password should be maximum 25 characters long" }),
});
// Validating User Schema using Zod library
export const resetPassSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password should be at least 8 characters long" }).max(25, { message: "Password should be maximum 25 characters long" }),
});
// -- SignUp ---
export const signupUser = TryCatch(async (req, res) => {
    const { name, email, password, gender, captcha } = req.body;
    if (!name || !email || !password || !gender || !captcha) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    const validation = signupSchema.safeParse({ email, name, password });
    //   console.log(validation);
    if (!validation.success) {
        const error = validation.error.issues[0]?.message || "Invalid input";
        res.status(400).json({ message: error });
        return;
    }
    //Verifying CAPTCHA token
    try {
        const googleRes = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`);
        if (!googleRes.data.success) {
            res.status(400).json({ message: "CAPTCHA verification failed" });
            return;
        }
    }
    catch (err) {
        console.error("CAPTCHA verification error:", err);
        res.status(500).json({ message: "Error verifying CAPTCHA" });
        return;
    }
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        res.status(429).json({
            message: "Too many requests. Please wait before requesting for a new OTP",
        });
        return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a interger between 100000 to 999999
    const otpKey = `signup:otp:${email}`;
    const userData = JSON.stringify({ name, email, password, gender });
    await redisClient.set(otpKey, JSON.stringify({ otp, userData }), { EX: 300 });
    await redisClient.set(rateLimitKey, "true", { EX: 60 });
    const message = {
        to: email,
        subject: "Your OTP verification code",
        body: `Dear ${name}, Your 6 digit OTP is : ${otp}. It is valid for 5 minutes`,
    };
    await publishToQueue("send-otp", message);
    res.status(200).json({ message: "OTP sent to your mail successfully" });
});
//----- Verify User ------
export const verifySignupUser = TryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body;
    if (!email || !enteredOtp) {
        res.status(400).json({ message: "OTP required!" });
        return;
    }
    const otpKey = `signup:otp:${email}`;
    const storedData = await redisClient.get(otpKey);
    if (!storedData) {
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
    }
    const { otp, userData } = JSON.parse(storedData);
    if (otp !== enteredOtp) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
    }
    const { name, password, gender } = JSON.parse(userData);
    let user = await User.findOne({ email });
    if (user) {
        res.status(400).json({ message: "User already exists" });
        return;
    }
    const saltValue = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
        .createHash("sha256")
        .update(saltValue + password)
        .digest("hex");
    user = await User.create({
        name,
        email,
        password: hashedPassword,
        gender,
        saltValue,
    });
    await redisClient.del(otpKey);
    res.status(201).json({ message: "User registered successfully." });
});
// -----Login User ------
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email and Password required!" });
        return;
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({ message: "User not found, please signup" });
        return;
    }
    const hashedInputPassword = crypto
        .createHash("sha256")
        .update(user.saltValue + password)
        .digest("hex");
    if (hashedInputPassword !== user.password) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
    }
    const token = generateToken(user);
    res.status(200).json({
        message: "Signin successful",
        user,
        token,
    });
});
//---Resend OTP----
export const resendOTP = TryCatch(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email is required!" });
        return;
    }
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        res.status(429).json({
            message: "Too many requests. Please wait before requesting a new OTP",
        });
        return;
    }
    const otpKey = `signup:otp:${email}`;
    const storedData = await redisClient.get(otpKey);
    if (!storedData) {
        res.status(400).json({
            message: "Session expired. Please restart signup process.",
        });
        return;
    }
    let userData;
    try {
        const parsed = JSON.parse(storedData);
        userData = parsed.userData;
    }
    catch (err) {
        res.status(500).json({ message: "Error parsing stored user data" });
        return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // It will generate a 6 digit OTP from range 100000 to 999999
    await redisClient.set(otpKey, JSON.stringify({ otp, userData }), { EX: 300 } // OTP valid for 5 minutes
    );
    await redisClient.set(rateLimitKey, "true", { EX: 60 });
    const parsedUser = JSON.parse(userData);
    const name = parsedUser?.name || "User";
    const message = {
        to: email,
        subject: "Your new OTP verification code",
        body: `Dear ${name}, Your new 6 digit OTP is: ${otp}. It is valid for 5 minutes`,
    };
    await publishToQueue("send-otp", message);
    res.status(200).json({ message: "New OTP sent to your email successfully" });
});
// Resend OTP for Forgot Password 
export const resendForgotOTP = TryCatch(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email is required!" });
        return;
    }
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        res.status(429).json({
            message: "Too many requests. Please wait before requesting a new OTP",
        });
        return;
    }
    const otpKey = `forgot:otp:${email}`;
    const exists = await redisClient.get(otpKey);
    if (!exists) {
        res.status(400).json({
            message: "Session expired. Please restart forgot password process.",
        });
        return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.set(otpKey, otp, { EX: 300 });
    await redisClient.set(rateLimitKey, "true", { EX: 60 });
    const message = {
        to: email,
        subject: "Your new OTP for password reset",
        body: `Dear User, Your new 6 digit OTP is: ${otp}. It is valid for 5 minutes.`,
    };
    await publishToQueue("send-otp", message);
    res.status(200).json({ message: "New OTP sent to your email successfully" });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
export const updateName = TryCatch(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        res.status(404).json({
            message: "Please Login",
        });
        return;
    }
    user.name = req.body.name;
    await user.save();
    const token = generateToken(user);
    res.json({
        message: "User updated",
        user,
        token,
    });
});
export const getAllUsers = TryCatch(async (req, res) => {
    const users = await User.find();
    res.json(users);
});
export const getAUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});
export const forgotPassword = TryCatch(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const rateLimitKey = `otp:ratelimit:forgot:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        res.status(429).json({
            message: "Too many requests. Please wait before requesting a new OTP",
        });
        return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `forgot:otp:${email}`;
    await redisClient.set(otpKey, JSON.stringify({ otp }), { EX: 300 });
    await redisClient.set(rateLimitKey, "true", { EX: 60 });
    const message = {
        to: email,
        subject: "Your Password Reset OTP",
        body: `Your OTP for resetting password is: ${otp}. It is valid for 5 minutes.`,
    };
    await publishToQueue("send-otp", message);
    res.status(200).json({ message: "OTP sent to your email successfully" });
});
export const verifyForgotOTP = TryCatch(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        res.status(400).json({ message: "Email and OTP required" });
        return;
    }
    const otpKey = `forgot:otp:${email}`;
    const storedOTP = await redisClient.get(otpKey);
    if (!storedOTP) {
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
    }
    if (storedOTP !== otp) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
    }
    await redisClient.del(otpKey);
    const verifiedKey = `forgot:verified:${email}`;
    await redisClient.set(verifiedKey, "true", { EX: 600 });
    res.status(200).json({ message: "OTP verified. You can now reset password" });
});
export const resetPassword = TryCatch(async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    const validation = resetPassSchema.safeParse({ email, password });
    if (!validation.success) {
        const error = validation.error.issues[0]?.message || "Invalid input";
        res.status(400).json({ message: error });
        return;
    }
    const resetKey = `forgot:verified:${email}`;
    const canReset = await redisClient.get(resetKey);
    if (!canReset) {
        res.status(400).json({ message: "OTP not verified or session expired" });
        return;
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const saltValue = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.createHash("sha256").update(saltValue + password).digest("hex");
    user.password = hashedPassword;
    user.saltValue = saltValue;
    await user.save();
    await redisClient.del(resetKey);
    res.status(200).json({ message: "Password reset successful" });
});
