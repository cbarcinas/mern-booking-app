import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import registerRouter from './routes/users';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/register', registerRouter);

app.get('/api/test', async (req: Request, res: Response) => {
  res.json({ message: 'hello from endpoint' });
});

app.listen(5000, () => {
  console.log('server running on localhost:5000');
});
