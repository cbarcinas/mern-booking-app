import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { z } from 'zod';

const router = express.Router();

// 🛡️ Define validation rules using Zod
// This schema ensures that all incoming user data is correctly formatted
const registerSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6).max(200),
});

export default router;
