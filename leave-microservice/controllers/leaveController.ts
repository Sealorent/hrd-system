// controllers/employeeController.ts

import { Request, Response } from 'express';
import Leave from '../models/leaveModel'; // Adjust the path as necessary
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseUtil';
import { getVerifiedUser } from '../utils/jwt';

// GET route to retrieve all employees
export const getAllLeave = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find().where('deleted_at').equals(null).select('-__v'); 
    return sendSuccessResponse(res, leaves, 'Leaves retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error retrieving leaves');
  }
};

export const changeStatusLeave = async (req: Request, res: Response) => {
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

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status, acceptedBy: user?.employeeJwt?._id, acceptedAt: new Date(), updatedBy: user?.employeeJwt?._id },
      { new: true, runValidators: true }
    );

    if (!leave) {
      return sendErrorResponse(res, 'Leave not found', 404);
    }

    return sendSuccessResponse(res, leave, 'Leave status updated successfully');
  } catch (error: any) {
    return sendErrorResponse(res, error, 500);
  }
}

export const addLeave = async (req: Request, res: Response) => {
  try {
    const { error, user } = getVerifiedUser(req.header('Authorization'));
    const { startDate, endDate, leaveType, reason, totalDays } = req.body;

    if (error) {
      return sendErrorResponse(res, error, 403);      
    }

    const leave = new Leave({
      employeeId: user?.employeeJwt?._id,
      startDate,
      endDate,
      leaveType,
      totalDays,
      reason,
      updatedBy: user?.employeeJwt?._id,
    });

    await leave.save();

    return sendSuccessResponse(res, leave, 'Leave added successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error adding leave');
  }
}
