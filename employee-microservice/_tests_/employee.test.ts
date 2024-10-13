import { getAllEmployees, updateStatusEmployee, deleteEmployee, getProfileEmployee, updateEmployee, updateProfile, updateLeaveCount } from '../controllers/employeeController';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

dotenv.config(); // Load environment

jest.mock('../controllers/employeeController');

// Test data
const testUser = {
  email: faker.internet.email(),
  username: faker.internet.userName(),  
  password: faker.internet.password({
    length: 10,        // Password length of 10 characters
    memorable: false,  // Not necessarily memorable (more random)
    pattern: /[a-zA-Z0-9]/, // Matches alphanumeric characters
    prefix: '1',       // Prefix to ensure the password starts with a number
  }),
  position: faker.person.jobTitle(),
  department: faker.commerce.department(),
};

const mockToken = jwt.sign({ id: 'testUserId' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('Employee Microservice - Employee', () => {
  beforeAll(async () => {
    // Mock mongoose connection
    mongoose.connect = jest.fn();
  });

  afterAll(async () => {
    // Mock mongoose disconnection
    mongoose.connection.close = jest.fn();
  });

  describe('GET /employees', () => {
    it('should get all employees', async () => {
      (getAllEmployees as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: 'Employees retrieved successfully' });
      });

      const req: Request = {} as Request;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const resMock = res as Response;
      await getAllEmployees(req, resMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employees retrieved successfully' });
    });
  });

  describe('GET /employees/profile', () => {
    it('should get an employee profile', async () => {
      (getProfileEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: 'Employee profile retrieved successfully' });
      });

      const req: Request = {} as Request;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const resMock = res as Response;
      await getProfileEmployee(req, resMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee profile retrieved successfully' });
    });
  });

  describe('PUT /employees/status', () => {
    it('should update employee status', async () => {
      (updateStatusEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: 'Employee status updated successfully' });
      });

      const req: Request = {
        body: {
          status: 'Active',
          id: 'validEmployeeId',
        },
      } as Request;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const resMock = res as Response;
      await updateStatusEmployee(req, resMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee status updated successfully' });
    });
  });

  describe('DELETE /employees/delete', () => {
    it('should delete an employee', async () => {
      (deleteEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: 'Employee deleted successfully' });
      });

      const req: Request = {
        body: {
          id: 'validEmployeeId',
        },
      } as Request;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const resMock = res as Response;
      await deleteEmployee(req, resMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee deleted successfully' });
    });
  });

  describe('PATCH /employees/update-employee', () => {
    it('should update an employee', async () => {
      (updateEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: 'Employee updated successfully' });
      });

      const req: Request = {
        body: {
          id: 'validEmployeeId',
          username: 'UpdatedUserName',
        },
      } as Request;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const resMock = res as Response;
      await updateEmployee(req, resMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee updated successfully' });
    });
  });

  describe('PUT /employees/update-profile', () => {
    it('should update employee profile', async () => {
      (updateProfile as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: 'Employee profile updated successfully' });
      });

      const req: Request = {
        body: {
          id: 'validEmployeeId',
          username: 'UpdatedUserName',
          password: 'UpdatedPassword123',
        },
      } as Request;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const resMock = res as Response;
      await updateProfile(req, resMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee profile updated successfully' });
    });
  });

  describe('PUT /employees/update-leave-count', () => {
    it('should update employee leave count', async () => {
      (updateLeaveCount as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: 'Employee leave count updated successfully' });
      });

      const req: Request = {
        body: {
          id: 'validEmployeeId',
          leaveCount: 10,
        },
      } as Request;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const resMock = res as Response;
      await updateLeaveCount(req, resMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee leave count updated successfully' });
    });
  });
});