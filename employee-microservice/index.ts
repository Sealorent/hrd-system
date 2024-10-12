import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import {
  registerEmployee,
  loginEmployee,
} from './controllers/authController'; // Import the controller functions
import {
  getAllEmployees,
} from './controllers/employeeController'; // Import the controller functions

dotenv.config(); // Load environment
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Employee Microservice is running');
});

app.post('/auth/register', registerEmployee); // Register employee route
app.post('/auth/login', loginEmployee); // Login employee route
app.get('/employees', getAllEmployees); // Get all employees route

// Start the server
app.listen(port, () => {
  console.log(`Register Route:`);
  app._router.stack.forEach((route: any) => {
    if (route.route) {
      console.log(route.route.path);
    }
  });
  console.log(`Employee Microservice run on ${port}`);
});


