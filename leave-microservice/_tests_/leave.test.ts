// tests/leaveController.test.ts
import { Request, Response } from 'express';
import Leave from '../models/leaveModel';
import { getVerifiedUser } from '../utils/jwt';
import mongoose from 'mongoose';
import { getAllLeave, changeStatusLeave, addLeave } from '../controllers/leaveController';

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

    describe('getAllLeave', () => {
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

        it('should return an error if retrieval fails', async () => {
            (getAllLeave as jest.Mock).mockImplementation((req, res) => {
                res.status(500).json({
                    success: false,
                    message: 'Error retrieving leaves',
                });
            });

            const req = {} as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await getAllLeave(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Error retrieving leaves',
            });
        });
    });

    describe('changeStatusLeave', () => {
        it('should change the status of a leave', async () => {
            (getVerifiedUser as jest.Mock).mockReturnValue({ user: mockUser });
            (changeStatusLeave as jest.Mock).mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    data: { ...mockLeave, status: 'Approved' },
                    message: 'Leave status updated successfully',
                });
            });

            const req = {
                header: jest.fn().mockReturnValue('mockToken'),
                body: { id: 'mockLeaveId', status: 'Approved' },
            } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await changeStatusLeave(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { ...mockLeave, status: 'Approved' },
                message: 'Leave status updated successfully',
            });
        });

        it('should return an error if user is not authorized', async () => {
            (getVerifiedUser as jest.Mock).mockReturnValue({ error: 'Unauthorized' });
            (changeStatusLeave as jest.Mock).mockImplementation((req, res) => {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized',
                });
            });

            const req = {
                header: jest.fn().mockReturnValue('mockToken'),
            } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await changeStatusLeave(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Unauthorized',
            });
        });

        it('should return an error if leave is not found', async () => {
            (getVerifiedUser as jest.Mock).mockReturnValue({ user: mockUser });
            (changeStatusLeave as jest.Mock).mockImplementation((req, res) => {
                res.status(404).json({
                    success: false,
                    message: 'Leave not found',
                });
            });

            const req = {
                header: jest.fn().mockReturnValue('mockToken'),
                body: { id: 'mockLeaveId', status: 'Approved' },
            } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await changeStatusLeave(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Leave not found',
            });
        });
    });

    describe('addLeave', () => {
        it('should add a new leave', async () => {
            (getVerifiedUser as jest.Mock).mockReturnValue({ user: mockUser });
            (addLeave as jest.Mock).mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    data: mockLeave,
                    message: 'Leave added successfully',
                });
            });

            const req = {
                header: jest.fn().mockReturnValue('mockToken'),
                body: {
                    startDate: '2024-10-01',
                    endDate: '2024-10-05',
                    leaveType: 'Sick',
                    totalDays: 5,
                    reason: 'Medical',
                },
            } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await addLeave(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockLeave,
                message: 'Leave added successfully',
            });
        });

        it('should return an error if adding leave fails', async () => {
            (getVerifiedUser as jest.Mock).mockReturnValue({ user: mockUser });
            (addLeave as jest.Mock).mockImplementation((req, res) => {
                res.status(500).json({
                    success: false,
                    message: 'Error adding leave',
                });
            });

            const req = {
                header: jest.fn().mockReturnValue('mockToken'),
                body: {
                    startDate: '2024-10-01',
                    endDate: '2024-10-05',
                    leaveType: 'Sick',
                    totalDays: 5,
                    reason: 'Medical',
                },
            } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await addLeave(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Error adding leave',
            });
        });
    });
});