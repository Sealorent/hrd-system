// models/employeeModel.ts

import mongoose from 'mongoose';

// Define the employee schema with necessary fields
const employeeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensures username is unique
  },
  password: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  acceptedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  leaveQuota: {
    type: Number,
    default: 12,
  },
  leaveCount: {
    type: Number,
    default: 0,
  },
  deletedAt: {
    type: Date,
  },
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
