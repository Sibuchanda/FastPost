import express from "express";
import {loginUser} from '../controlers/user.js';

const router = express.Router();

router.post("/login", loginUser)

export default router;