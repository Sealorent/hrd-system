// controllers/employeeController.ts

import { Request, Response } from 'express';
import Employee from '../models/employeeModel'; // Adjust the path as necessary

// GET route to retrieve all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).send('Error retrieving employees');
  }
};
