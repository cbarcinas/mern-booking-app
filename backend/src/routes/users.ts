import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import  User  from '../models/user';
import { z } from 'zod';

const router = express.Router();


const registerSchema = z.object({
  name: z.string().min(3).max(30), 
  email: z.string().min(3).max(200).email(), 
  password: z.string().min(6).max(200), 
});


type RegisterInput = z.infer<typeof registerSchema>;


router.post('/', async (req: Request, res: Response) => {
  try {

    const parseResult = registerSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors[0]?.message || 'Invalid input';
      return res.status(400).send(errorMessage);
    }

 
    const { name, email, password }: RegisterInput = parseResult.data;


    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send('User already exists.');
    }

   
    const salt = await  .genSalt(8); 
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });


    await user.save();

    const token = generateAuthToken(user);

  
    res.send(token);

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Server error.');
  }
});

// 📦 Export the router so it can be used in the main app
export default router;