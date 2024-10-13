import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import {
  addLeave,
  changeStatusLeave,
  getAllLeave,
} from './controllers/leaveController'; // Import the controller functions
import authMiddleware from './middlewares/authMiddleware'; // Import the middleware
import seedLeave from './seeders/leaveSeeder';


dotenv.config(); // Load environment
const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
  seedLeave();
});

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Leave Microservice is running');
});

app.get('/leaves', getAllLeave); // Register employee route
app.put('/leaves/status', authMiddleware, changeStatusLeave); // Update employee status route
app.post('/leaves/add', authMiddleware, addLeave); // Add leave route

// Start the server
app.listen(port, () => {
  console.log(`Register Route:`);
  app._router.stack.forEach((route: any) => {
    if (route.route) {
      console.log('Route:', route.route.path + ' - Method:', route.route.stack[0].method);
    }
  });
  console.log(`Leave Microservice run on ${port}`);
});

export default app;


