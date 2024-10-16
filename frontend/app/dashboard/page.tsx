"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import http from "../utils/http";
import useDashboardData from "../hooks/dashboardHook";
import useLeaveData from "../hooks/leaveHook";
import { useAuth } from "../context/AuthContext";
import useLeaveRequestData from "../hooks/leaveRequestHook";

export default function DashboardPage() {
    const { data, error, loading } = useDashboardData(); // Use the custom hook
    const { data : leavesData, error: errorLeaveData, loading : loadingLeaveData } = useLeaveRequestData(); // Use the custom hook
    const { user } = useAuth();
    const [totalRequests, setTotalRequests] = useState(0);  
    const [totalRequestsUser, setTotalRequestsUser] = useState(0);

    useEffect(() => {
        if (leavesData) {
            // filter out the user's own leave requests
            const filteredLeavesUser = leavesData.requestLeaves.filter((leave) => leave.employeeId !== user.id && leave.status === 'Pending');
            const filteredLeaves = leavesData.requestLeaves.filter((leave) => leave.status !== 'Accepted');
            setTotalRequestsUser(filteredLeavesUser.length);
            setTotalRequests(filteredLeaves.length);
        }
    }, [leavesData]);

    
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
            >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{data.totalEmployees}</div>
            {/* <p className="text-xs text-muted-foreground">+180 from last month</p> */}
            </CardContent>
        </Card>
        {user.isAdmin === true && (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
            >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
            </svg>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            {/* <p className="text-xs text-muted-foreground">+2 since yesterday</p> */}
            </CardContent>
        </Card>
        
        )}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Pending Leave Requests</CardTitle>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
            >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
            </svg>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{ totalRequestsUser }</div>
            {/* <p className="text-xs text-muted-foreground">+2 since yesterday</p> */}
            </CardContent>
        </Card>
        
        
        </div>
    )
}