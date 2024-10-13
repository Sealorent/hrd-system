import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import {
  registerEmployee,
  loginEmployee,
} from './controllers/authController'; // Import the controller functions
import {
  getAllEmployees,
  updateStatusEmployee,
  deleteEmployee,
  updateEmployee,
  updateProfile,
  updateLeaveCount,
  getProfileEmployee,
} from './controllers/employeeController'; // Import the controller functions
import seedEmployees from './seeders/employeeSeeder';
import authMiddleware from './middlewares/authMiddleware'; // Import the middleware

dotenv.config(); // Load environment
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
  // Seed employees
  seedEmployees();
});

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Employee Microservice is running');
});

app.post('/auth/register', registerEmployee); // Register employee route
app.post('/auth/login', loginEmployee); // Login employee route
app.get('/employees', getAllEmployees); // Get all employees route

// Protected routes
app.put('/employees/status', authMiddleware, updateStatusEmployee); // Update employee status route
app.delete('/employees/delete', authMiddleware, deleteEmployee); // Delete employee route
app.patch('/employees/update-employee', authMiddleware, updateEmployee); // Update employee route
app.put('/employees/update-profile', authMiddleware, updateProfile); // Update employee profile route
app.put('/employees/update-leave-count', authMiddleware, updateLeaveCount); // Update employee status route
app.get('/employees/profile', authMiddleware, getProfileEmployee); // Get employee profile route

// Start the server
app.listen(port, () => {
  console.log(`Register Route:`);
  app._router.stack.forEach((route: any) => {
    if (route.route) {
      console.log('Route:', route.route.path + ' - Method:', route.route.stack[0].method);
    }
  });
  console.log(`Employee Microservice run on ${port}`);
});

export default app;


