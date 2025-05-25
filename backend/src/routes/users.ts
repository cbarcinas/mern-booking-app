import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { z } from 'zod';
import generateAuthToken from '../utils/generateAuthToken';

const router = express.Router();

// 🛡️ Define validation rules using Zod
// This schema ensures that all incoming user data is properly formatted
const registerSchema = z.object({
  name: z.string().min(3).max(30), // Name must be 3-30 characters
  email: z.string().min(3).max(200).email(), // Email must be valid and 3-200 chars
  password: z.string().min(6).max(200), // Password must be 6-200 characters
});

// 🧠 This creates a TypeScript type from the Zod schema automatically
type RegisterInput = z.infer<typeof registerSchema>;

// 📩 Handle POST requests to the /register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    // ✅ Validate request body using Zod
    const parseResult = registerSchema.safeParse(req.body);

    // ❌ If validation fails, return a 400 Bad Request with an error message
    if (!parseResult.success) {
      const errorMessage =
        parseResult.error.errors[0]?.message || 'Invalid input';
      res.status(400).send(errorMessage);
      return;
    }

    // ✅ If validation passes, destructure the validated data
    const { name, email, password }: RegisterInput = parseResult.data;

    // 🔍 Check if a user with this email already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).send('User already exists.');
      return;
    }

    // If the user is new, we hash their password before saving to db
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    // normally we would use req.body
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 💾 Save the user to the database
    user = await user.save();

    // 🔑 Generate a token (JWT) for auth
    const token = generateAuthToken(user.id);

    res.send(token);
  } catch (err) {
    // DO NOT directly return the error as it may contain
    // sensitive user information in the payload.
    // console.error('Registration error:', err);
    res.status(500).send('Server error.');
  }
});

export default router;
