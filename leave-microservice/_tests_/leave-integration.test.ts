// import request from 'supertest';
// import mongoose from 'mongoose';
// import app from '../index';
// import Leave from '../models/leaveModel';
// import { getVerifiedUser } from '../utils/jwt';
// import * as authMiddleware from '../middlewares/authMiddleware';

// jest.mock('../models/leaveModel');
// jest.mock('../utils/jwt');
// jest.mock('../config/db', () => jest.fn());
// jest.mock('../seeders/leaveSeeder', () => jest.fn());

// // Mock the auth middleware
// jest.mock('../middlewares/authMiddleware', () => ({
//   __esModule: true,
//   default: jest.fn((req, res, next) => next()),
// }));

// const mockLeave = {
//   _id: 'mockLeaveId',
//   employeeId: 'mockEmployeeId',
//   startDate: '2024-10-01',
//   endDate: '2024-10-05',
//   leaveType: 'Sick',
//   totalDays: 5,
//   reason: 'Medical',
//   status: 'Pending',
//   updatedBy: 'mockEmployeeId',
// };

// const mockUser = {
//   employeeJwt: {
//     _id: 'mockEmployeeId',
//     isAdmin: true,
//   },
// };

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe('Leave Microservice', () => {
//   let server: any;

//   beforeAll(async () => {
//     server = app.listen(0);
//   });

//   afterAll(async () => {
//     await server.close();
//     await mongoose.disconnect();
//   });

//   describe('GET /leaves', () => {
//     it('should retrieve all leaves', async () => {
//       (Leave.find as jest.Mock).mockReturnValue({
//         where: jest.fn().mockReturnValue({
//           equals: jest.fn().mockReturnValue({
//             select: jest.fn().mockResolvedValue([mockLeave]),
//           }),
//         }),
//       });

//       const response = await request(server).get('/leaves');

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data).toEqual([mockLeave]);
//       expect(response.body.message).toBe('Employees retrieved successfully');
//     });

//     it('should return an error if retrieving leaves fails', async () => {
//       (Leave.find as jest.Mock).mockImplementation(() => {
//         throw new Error('Error retrieving leaves');
//       });

//       const response = await request(server).get('/leaves');

//       expect(response.status).toBe(500);
//       expect(response.body.success).toBe(false);
//       expect(response.body.message).toBe('Error retrieving employees');
//     });
//   });

//   describe('POST /leaves/add', () => {
//     it('should add a new leave', async () => {
//       (getVerifiedUser as jest.Mock).mockReturnValue({ user: mockUser });
//       (Leave.prototype.save as jest.Mock).mockResolvedValue(mockLeave);

//       const response = await request(server)
//         .post('/leaves/add')
//         .set('Authorization', 'Bearer mockToken')
//         .send({
//           startDate: '2024-10-01',
//           endDate: '2024-10-05',
//           leaveType: 'Sick',
//           reason: 'Medical',
//           totalDays: 5,
//         });

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data).toEqual(mockLeave);
//       expect(response.body.message).toBe('Leave added successfully');
//     });

//     it('should return an error if adding leave fails', async () => {
//       (getVerifiedUser as jest.Mock).mockReturnValue({ user: mockUser });
//       (Leave.prototype.save as jest.Mock).mockRejectedValue(new Error('Error adding leave'));

//       const response = await request(server)
//         .post('/leaves/add')
//         .set('Authorization', 'Bearer mockToken')
//         .send({
//           startDate: '2024-10-01',
//           endDate: '2024-10-05',
//           leaveType: 'Sick',
//           reason: 'Medical',
//           totalDays: 5,
//         });

//       expect(response.status).toBe(500);
//       expect(response.body.success).toBe(false);
//       expect(response.body.message).toBe('Error adding leave');
//     });

//     it('should return an error if user is not authenticated', async () => {
//       (authMiddleware.default as jest.Mock).mockImplementation((req, res, next) => {
//         res.status(403).json({ success: false, message: 'Unauthorized' });
//       });

//       const response = await request(server)
//         .post('/leaves/add')
//         .set('Authorization', 'Bearer invalidToken')
//         .send({
//           startDate: '2024-10-01',
//           endDate: '2024-10-05',
//           leaveType: 'Sick',
//           reason: 'Medical',
//           totalDays: 5,
//         });

//       expect(response.status).toBe(403);
//       expect(response.body.success).toBe(false);
//       expect(response.body.message).toBe('Unauthorized');
//     });
//   });

//   describe('PUT /leaves/status', () => {
//     it('should change leave status', async () => {
//       (getVerifiedUser as jest.Mock).mockReturnValue({ user: mockUser });
//       (Leave.findByIdAndUpdate as jest.Mock).mockResolvedValue({
//         ...mockLeave,
//         status: 'Approved',
//       });

//       const response = await request(server)
//         .put('/leaves/status')
//         .set('Authorization', 'Bearer mockToken')
//         .send({
//           id: 'mockLeaveId',
//           status: 'Approved',
//         });

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data.status).toBe('Approved');
//       expect(response.body.message).toBe('Leave status updated successfully');
//     });

//     it('should return an error if leave is not found', async () => {
//       (getVerifiedUser as jest.Mock).mockReturnValue({ user: mockUser });
//       (Leave.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

//       const response = await request(server)
//         .put('/leaves/status')
//         .set('Authorization', 'Bearer mockToken')
//         .send({
//           id: 'invalidLeaveId',
//           status: 'Approved',
//         });

//       expect(response.status).toBe(403);
//       expect(response.body.success).toBe(false);
//       expect(response.body.message).toBe('Unauthorized');
//     });

//     it('should return an error if user is not authenticated', async () => {
//       (authMiddleware.default as jest.Mock).mockImplementation((req, res, next) => {
//         res.status(403).json({ success: false, message: 'Unauthorized' });
//       });

//       const response = await request(server)
//         .put('/leaves/status')
//         .set('Authorization', 'Bearer invalidToken')
//         .send({
//           id: 'mockLeaveId',
//           status: 'Approved',
//         });

//       expect(response.status).toBe(403);
//       expect(response.body.success).toBe(false);
//       expect(response.body.message).toBe('Unauthorized');
//     });

//     it('should return an error if user is not an admin', async () => {
//       (getVerifiedUser as jest.Mock).mockReturnValue({ 
//         user: { 
//           employeeJwt: { 
//             _id: 'mockEmployeeId', 
//             isAdmin: false 
//           } 
//         } 
//       });

//       const response = await request(server)
//         .put('/leaves/status')
//         .set('Authorization', 'Bearer mockToken')
//         .send({
//           id: 'mockLeaveId',
//           status: 'Approved',
//         });

//       expect(response.status).toBe(403);
//       expect(response.body.success).toBe(false);
//       expect(response.body.message).toBe('Unauthorized');
//     });
//   });
// });