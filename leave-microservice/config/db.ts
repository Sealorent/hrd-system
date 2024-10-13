// config/db.ts

import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/leave-db'; // Set your MongoDB URI

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
