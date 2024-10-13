// controllers/employeeController.ts

import { Request, Response } from 'express';
import Employee from '../models/employeeModel'; // Adjust the path as necessary
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseUtil';
import { getVerifiedUser } from '../utils/jwt';


export const getProfileEmployee = async (req : Request, res : Response) => {
  try {
    const { error, user } = getVerifiedUser(req.header('Authorization'));

    if (error) {
      return sendErrorResponse(res, error, 403);      
    }

    const employee = await Employee.findById(user?.employeeJwt?._id).select('-password -isAdmin -__v');

    if (!employee) {
      return sendErrorResponse(res, 'Employee not found', 404);
    }

    return sendSuccessResponse(res, employee, 'Employee profile retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error retrieving employee profile');
  }
}
// GET route to retrieve all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().where('deleted_at').equals(null).select('-password -isAdmin -__v'); 
    return sendSuccessResponse(res, employees, 'Employees retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error retrieving employees');
  }
};

// PUT route to update an employee
export const updateProfile = async (req : Request, res : Response) => {
  try {
    const { error, user } = getVerifiedUser(req.header('Authorization'));

    if (error) {
      return sendErrorResponse(res, error, 403);      
    }

    const { username, password, id } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      { username, password, updatedBy: user?.employeeJwt?._id },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return sendErrorResponse(res, 'Employee not found', 404);
    }

    return sendSuccessResponse(res, employee, 'Employee updated successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error updating employee');
  }
};

// PATCH route to update an employee
export const updateEmployee = async (req : Request, res : Response) => {
  try {
    const { error, user } = getVerifiedUser(req.header('Authorization'));

    if (error) {
      return sendErrorResponse(res, error, 403);      
    }

    if(user?.employeeJwt?.isAdmin !== true) {
      return sendErrorResponse(res, 'Access denied. Admins only.', 403);
    }

    const { email, username, password, position, department, status, isAdmin , id} = req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      { email, username, password, position, department, status, isAdmin, updatedBy: user?.employeeJwt?._id },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return sendErrorResponse(res, 'Employee not found', 404);
    }

    return sendSuccessResponse(res, employee, 'Employee updated successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error updating employee');
  }
};

// PUT route to update an employee status
export const updateStatusEmployee = async (req : Request, res : Response) => {
  try {
    const { error, user } = getVerifiedUser(req.header('Authorization'));

    if (error) {
      return sendErrorResponse(res, error, 403);      
    }

    // Optional: Check for admin privileges, or any other role check
    if (user?.employeeJwt?.isAdmin !== true) {
      return sendErrorResponse(res, 'Access denied. Admins only.', 403);
    }
    
    const { status, id } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      { status, acceptedBy: user?.employeeJwt?._id, acceptedAt: new Date(), updatedBy: user?.employeeJwt?._id },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return sendErrorResponse(res, 'Employee not found', 404);
    }

    return sendSuccessResponse(res, employee, 'Employee status updated successfully');
  } catch (error: any) {
    return sendErrorResponse(res, error, 500);
  }
};

export const deleteEmployee = async (req : Request, res : Response) => {
  try {
    const { error, user } = getVerifiedUser(req.header('Authorization'));

    if (error) {
      return sendErrorResponse(res, error, 403);      
    }

    // Optional: Check for admin privileges, or any other role check
    if (user?.employeeJwt?.isAdmin !== true) {
      return sendErrorResponse(res, 'Access denied. Admins only.', 403);
    }

    const { id } = req.body;

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return sendErrorResponse(res, 'Employee not found', 404);
    }

    return sendSuccessResponse(res, null, 'Employee deleted successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error deleting employee');
  }
};

export const updateLeaveCount = async (req : Request, res : Response) => {  
  try {
    const { error, user } = getVerifiedUser(req.header('Authorization'));

    if (error) {
      return sendErrorResponse(res, error, 403);      
    }

    if(user?.employeeJwt?.isAdmin !== true) {
      return sendErrorResponse(res, 'Access denied. Admins only.', 403);
    }

    const { leaveCount, id } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      { leaveCount, updatedBy: user?.employeeJwt?._id },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return sendErrorResponse(res, 'Employee not found', 404);
    }

    return sendSuccessResponse(res, employee, 'Employee leave count updated successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error updating employee leave count');
  }
}