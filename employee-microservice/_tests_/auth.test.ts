import { registerEmployee, loginEmployee } from '../controllers/authController'; // Mocking controllers
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { de, faker } from '@faker-js/faker';
import { Request, Response } from 'express';

dotenv.config(); // Load environment

jest.mock('../controllers/authController');
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

describe('Employee Microservice - Auth', () => {
  beforeAll(async () => {
    // Mock mongoose connection
    mongoose.connect = jest.fn();
  });

  afterAll(async () => {
    // Mock mongoose disconnection
    mongoose.connection.close = jest.fn();
  });

  describe('POST /auth/register', () => {
    it('should register a new employee', async () => {
      (registerEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: 'Employee registered successfully' });
      });

      const req : Request = {
        body: {
          ...testUser,
        }
      } as Request;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const resMock = res as Response;
      await registerEmployee(req, resMock);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee registered successfully' });
    });
  });

  describe('POST /auth/login', () => {
    it('should login an employee', async () => {
      (loginEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: 'Employee logged in successfully' });
      });

      const req : Request = {
        body: {
          email: testUser.email,
          password: testUser.password,
        }
      } as Request;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const resMock = res as Response;
      await loginEmployee(req, resMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee logged in successfully' });
    });
  });

});