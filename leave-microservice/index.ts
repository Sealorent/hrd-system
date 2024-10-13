import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import {
  addLeave,
  changeStatusLeave,
  getAllLeave,
} from './controllers/leaveController';
import authMiddleware from './middlewares/authMiddleware';
import seedLeave from './seeders/leaveSeeder';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Leave Microservice is running');
});

app.get('/leaves', getAllLeave);
app.put('/leaves/status', authMiddleware, changeStatusLeave);
app.post('/leaves/add', authMiddleware, addLeave);

export const startServer = async () => {
  try {
    await connectDB();
    await seedLeave();
    
    app.listen(port, () => {
      console.log(`Register Route:`);
      app._router.stack.forEach((route: any) => {
        if (route.route) {
          console.log('Route:', route.route.path + ' - Method:', route.route.stack[0].method);
        }
      });
      console.log(`Leave Microservice running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

export default app;