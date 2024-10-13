import mongoose from 'mongoose';
import Leave from '../models/leaveModel'; // Adjust the path as necessary
import bcrypt from 'bcrypt';


const seedLeave = async () => {
  try {
    await Leave.deleteMany({}); // Optional: Clear existing employees
     // Hash passwords before saving
    console.log('Leave Clear.');
  } catch (error) {
    console.error('Leave Clear:', error);
  }
};

export default seedLeave;
