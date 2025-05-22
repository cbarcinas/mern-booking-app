import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { z } from 'zod';

const router = express.Router();

// 🛡️ Define validation rules using Zod
// This schema ensures that all incoming user data is properly formatted
const registerSchema = z.object({
  name: z.string().min(3).max(30), // Name must be 3-30 characters
  email: z.string().min(3).max(200).email(), // Email must be valid and 3-200 chars
  password: z.string().min(6).max(200), // Password must be 6-200 characters
});

export default router;
