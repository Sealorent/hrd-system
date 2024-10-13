// utils/validationSchemas.ts

import { z } from 'zod';

// Define the Zod schema for employee registration
export const employeeSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  position: z.string().min(1, 'Position is required'),
  department: z.string().min(1, 'Department is required'),
});
