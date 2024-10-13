import { LeaveTypeEnum } from '../enums/leaveTypeEnum';
import IEmployee from './employeeInterface';

export default interface ILeave {
    _id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    status: string;
    leaveType: LeaveTypeEnum;
    reason: string;
    totalDays: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    employee?: IEmployee | null;
}