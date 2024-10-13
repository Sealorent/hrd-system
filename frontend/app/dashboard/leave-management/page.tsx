// app/dashboard/leave-management/page.tsx

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon } from 'lucide-react'
import useLeaveData from '@/app/hooks/leaveHook'
import { toIndonesianDate } from '@/app/utils/date'
import useLeaveRequestData from '@/app/hooks/leaveRequestHook'
import http from '@/app/utils/http'
import { LeaveTypeEnum } from '@/app/enums/leaveTypeEnum'


export default function LeaveManagementPage() {
  const { data, error, loading } = useLeaveRequestData(); // Use the custom hook


  const handleLeaveAction = async (
    id: string, 
    totalDay : number, 
    idUser : string,  
    leaveType: LeaveTypeEnum,
    action: 'Approved' | 'Rejected'
  ) => {
    try {
      await http.put(`/leaves/status`, { 
        status: action,
        id: id 
      });

      if(action === 'Approved' && leaveType === LeaveTypeEnum.ANNUAL) {
        await http.put(`/employees/update-leave-count`, {
          id: idUser,
          leaveCount: totalDay
        })
      }

      window.location.reload();
    } catch (error) {
      console.error('Failed to update leave:', error);
    }
   
  }

  return (
    <div className="container mx-auto py-2">
        <Card>
          <CardHeader>
            <CardTitle>Leave Management</CardTitle>
            <CardDescription>Manage employee leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Username</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Total Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date From to</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.requestLeaves.map((leave) => (
                  <TableRow key={leave._id}>
                    <TableCell>{leave.employee?.username}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.totalDays}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>{toIndonesianDate(leave.startDate)} - {toIndonesianDate(leave.endDate)}</TableCell>
                    <TableCell>
                      <Badge variant={leave.status === 'Pending' ? 'outline' : leave.status === 'Approved' ? 'default' : 'destructive'}>
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {leave.status === 'Pending' && (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleLeaveAction(leave._id, leave.totalDays, leave.employeeId, leave.leaveType, 'Approved')}>
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleLeaveAction(leave._id, leave.totalDays, leave.employeeId, leave.leaveType, 'Rejected')}>
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  )
}