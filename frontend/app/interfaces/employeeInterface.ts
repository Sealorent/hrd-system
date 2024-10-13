export default interface IEmployee {
    _id: string;
    username: string;
    email: string;
    position: string;
    department: string;
    acceptedBy: string;
    acceptedAt: Date;
    status: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    leaveQuota: number | null;
    leaveCount: number | null;
}