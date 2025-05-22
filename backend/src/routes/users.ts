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

// 🧠 This creates a TypeScript type from the Zod schema automatically
type RegisterInput = z.infer<typeof registerSchema>;

router.post("/register", async (req: Request, res: Response) => {
    try{
        // ✅ Validate the request body using Zod
        const parseResult = registerSchema.safeParse(req.body);

        // ❌ If validation fails, return a 400 Bad Request with an error message
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors[0]?.message || 'Invalid input';
      return res.status(400).send(errorMessage);
    }

    }


})

export default router;
