'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useEmployeeData from '@/app/hooks/employeeHook';
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon } from 'lucide-react';
import http from '@/app/utils/http';
import { StatusEmployee } from '@/app/enums/statusEmployeeEnum';

export default function EmployeeManagementPage() {
    const { data, error, loading } = useEmployeeData(); // Use the custom hook
    console.log('data', data);
    const [filter, setFilter] = useState(''); // State for filtering

    // Handle leave action (approve or reject)
    
    const handleActivationAccount = async (id: string, action: 'Accepted' | 'Rejected') => {
        try {
            await http.put(`/employees/status`, { status: action , id : id });
            window.location.reload();
        } catch (error) {
            console.error('Failed to activate account:', error);
        }
    };


    // Filter employees based on the filter state
    const filteredEmployees = data.employees.filter((employee) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
            employee.username.toLowerCase().includes(lowerCaseFilter) ||
            employee.email.toLowerCase().includes(lowerCaseFilter) ||
            employee.department.toLowerCase().includes(lowerCaseFilter) ||
            employee.position.toLowerCase().includes(lowerCaseFilter)
        );
    });

    return (
        <div className="container mx-auto py-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>Overview of Employees</CardDescription>
                <Input
                  placeholder="Filter employees by name, email, department, or position"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="mt-2"
                />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>Loading employees...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <TableRow key={employee._id}>
                            <TableCell>{employee.username}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell>
                              <Badge
                                variant={employee.status === 'Pending' ? 'secondary' : employee.status === 'Accepted' ? 'default' : 'destructive'}
                              >
                                {employee.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                                {employee.status === 'Pending' && (
                                    <div className="flex space-x-2">
                                    <Button size="sm" onClick={() => handleActivationAccount(employee._id, StatusEmployee.Accepted)}>
                                        <CheckIcon className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleActivationAccount(employee._id, StatusEmployee.Rejected)}>
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                    </div>
                                )}
                                </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10">
                            No data found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      );
}
