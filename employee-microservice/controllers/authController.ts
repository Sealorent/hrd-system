// controllers/authController.ts

import { Request, Response } from 'express';
import Employee from '../models/employeeModel'; // Adjust the path as necessary
import { employeeSchema } from '../utils/validationSchemas';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseUtil';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register employee
export const registerEmployee = async (req: Request, res: Response) => {
    try {
        // Validate request body against the schema
        const validatedData = employeeSchema.parse(req.body);

        // Hash the password
        validatedData.password = await bcrypt.hash(validatedData.password, 10);

        // Create a new employee instance with validated data
        const newEmployee = new Employee({
            ...validatedData,
            password: validatedData.password,
        });

        // Save the employee to the database
        const savedEmployee = await newEmployee.save();
        sendSuccessResponse(res, savedEmployee, 'Employee registered successfully');
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return sendErrorResponse(res, error.errors.map(e => e.message).join(', '), 400);
        }
        sendErrorResponse(res, error.message || 'Error registering employee');
    }
};

// Login employee
export const loginEmployee = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // Find an employee with the provided email
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return sendErrorResponse(res, 'Invalid email', 401);
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return sendErrorResponse(res, 'Invalid password', 401);
        }

        // Create a JWT token
        const token = jwt.sign({ id: employee._id, email: employee.email }, JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        // Respond with employee data and token (excluding password)
        const { password: _, ...employeeData } = employee.toObject(); // Exclude the password field
        sendSuccessResponse(res, { employee: employeeData, token }, 'Login successful');
    } catch (error: any) {
        sendErrorResponse(res, error.message || 'Error logging in');
    }
};
