// tests/employee.test.ts
import request from 'supertest';
import app from '../index'; // Import your express app
import connectDB from '../config/db';
import mongoose from 'mongoose';


// Mock the database connection and seeding
jest.mock('../config/db', () => ({
    __esModule: true,           // This ensures the mock works with both named and default exports
    default: jest.fn().mockResolvedValue(true),  // Mock default export for connectDB
}));

describe('Employee Microservice API', () => {
  // Setup and teardown hooks
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 for the root route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Employee Microservice is running');
  });

  it('should register a new employee', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test Employee',
        email: 'test@employee.com',
        password: 'password123',
        position: 'Developer',
      });
    expect(res.statusCode).toEqual(201); // Assuming 201 for creation
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing employee', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@employee.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get all employees (protected route)', async () => {
    const token = 'Bearer valid_jwt_token'; // Replace with actual token for test
    const res = await request(app)
      .get('/employees')
      .set('Authorization', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should update an employee status (protected route)', async () => {
    const token = 'Bearer valid_jwt_token'; // Replace with actual token for test
    const res = await request(app)
      .put('/employees/123/status')
      .set('Authorization', token)
      .send({
        status: 'active',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'active');
  });

  it('should delete an employee (protected route)', async () => {
    const token = 'Bearer valid_jwt_token'; // Replace with actual token for test
    const res = await request(app)
      .delete('/employees/123')
      .set('Authorization', token);
    expect(res.statusCode).toEqual(200);
  });
});
