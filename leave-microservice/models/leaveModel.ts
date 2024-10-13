// models/leaveModel.ts

import mongoose from 'mongoose';

// Define the leave schema with necessary fields
const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  approvedAt: {
    type: Date,
  },
  leaveType: {
    type: String,
    enum: ['Annual', 'Sick'],
    default: 'Annual',
  },
  reason : {
    type: String,
    required: true,
  },
  totalDays: {
    type: Number,
    required: true,
  },
  deleted_at: {
    type: Date,
    default: null,
  },  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
