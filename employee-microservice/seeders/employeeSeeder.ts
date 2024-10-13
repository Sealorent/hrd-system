import mongoose from 'mongoose';
import Employee from '../models/employeeModel'; // Adjust the path as necessary
import bcrypt from 'bcrypt';
import { stat } from 'fs';

const employeesData = [
  {
    email: 'hr.manager@example.com',
    username: 'hrmanager',
    password: 'password123', // Remember to hash this in a production environment
    position: 'HR Manager',
    department: 'Human Resources',
    acceptedBy: null,
    acceptedAt: new Date(),
    isAdmin: true,
    status: 'Accepted',
    updatedBy: null,  
  },
];

const seedEmployees = async () => {
  try {
    await Employee.deleteMany({}); // Optional: Clear existing employees
     // Hash passwords before saving
    const hashedEmployeesData = await Promise.all(employeesData.map(async (employee) => {
        const hashedPassword = await bcrypt.hash(employee.password, 10);
        return {
            ...employee,
            password: hashedPassword, // Replace the plain password with the hashed one
        };
    }));
    await Employee.insertMany(hashedEmployeesData); // Insert the array of employee data
    console.log('Employee data seeded successfully.');
  } catch (error) {
    console.error('Error seeding employees:', error);
  }
};

export default seedEmployees;
