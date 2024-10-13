// tests/leaveController.test.ts
import { Request, Response } from 'express';
import Leave from '../models/leaveModel';
import { getVerifiedUser } from '../utils/jwt';
import mongoose from 'mongoose';
import { getAllLeave } from '../controllers/leaveController';

jest.mock('../models/leaveModel');
jest.mock('../utils/jwt');
jest.mock('../controllers/leaveController');


const mockLeave = {
  _id: 'mockLeaveId',
  employeeId: 'mockEmployeeId',
  startDate: '2024-10-01',
  endDate: '2024-10-05',
  leaveType: 'Sick',
  totalDays: 5,
  reason: 'Medical',
  status: 'Pending',
  updatedBy: 'mockEmployeeId',
};

const mockUser = {
  employeeJwt: {
    _id: 'mockEmployeeId',
    isAdmin: true,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Leave Controller', () => {
    beforeAll(async () => {
        mongoose.connect = jest.fn();
    });

    afterAll(async () => {
        // Mock mongoose disconnection
        mongoose.connection.close = jest.fn();
    });

    describe('getAllLeaves', () => {
        it('should retrieve all leaves', async () => {
            (getAllLeave as jest.Mock).mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    data: [mockLeave],
                    message: 'Leaves retrieved successfully',
                });
              });

            const req = {} as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await getAllLeave(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: [mockLeave],
                message: 'Leaves retrieved successfully',
            });
        });
    });
});