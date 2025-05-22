import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
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

// 🧠 This creates a TypeScript type from the Zod schema automatically
type RegisterInput = z.infer<typeof registerSchema>;

router.post('/register', async (req: Request, res: Response) => {
  try {
    // ✅ Validate request body using Zod
    const parseResult = registerSchema.safeParse(req.body);

    // ❌ If validation fails, return a 400 Bad Request with an error message
    if (!parseResult.success) {
      const errorMessage =
        parseResult.error.errors[0]?.message || 'Invalid input';
      return res.status(400).send(errorMessage);
    }

    // ✅ If validation passes, destructure the validated data
    const { name, email, password }: RegisterInput = parseResult.data;

    // 🔍 Check if a user with this email already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send('User already exists.');
    }

    // 🔐 If the user is new, we hash their password before saving
    const salt = await bcrypt.genSalt(8); // Generate salt (used to make hashes stronger)
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // 📝 Create a new user with the hashed password
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 💾 Save the user to the database
    await user.save();
  } catch (err) {}
});

export default router;
