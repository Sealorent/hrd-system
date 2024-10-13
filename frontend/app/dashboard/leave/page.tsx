"use client";

import { useAuth } from "@/app/context/AuthContext";
import useLeaveData from "@/app/hooks/leaveHook";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { countDays } from "@/app/utils/count";
import http from "@/app/utils/http";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toIndonesianDate } from "@/app/utils/date";
import useProfileData from "@/app/hooks/profileHook";
import { z } from "zod"; // Import Zod for validation
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Define a Zod schema for your form
const leaveRequestSchema = z
  .object({
    startDate: z
      .string()
      .min(1, { message: "Start date is required." })
      .refine((date) => new Date(date) > new Date(), {
        message: "Start date must be greater than today.",
      }),
    endDate: z
      .string()
      .min(1, { message: "End date is required." }),
    leaveType: z
      .string()
      .min(1, { message: "Leave type is required." }),
    reason: z
      .string()
      .min(1, { message: "Reason is required." }),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (new Date(endDate) < new Date(startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be greater than or equal to start date.",
        path: ["endDate"],
      });
    }
  });

// Define types for form errors
type FormErrors = {
  startDate?: string;
  endDate?: string;
  leaveType?: string;
  reason?: string;
  submit?: string;
};

export default function LeavePage() {
  const { user } = useAuth();
  const { data, error, loading } = useLeaveData();
  const { data: profileData, error: profileError, loading: profileLoading } = useProfileData();
  const [filter, setFilter] = useState("");
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({}); // Use the defined type for form errors
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });

  const validateForm = () => {
    try {
      leaveRequestSchema.parse(form); // This will throw if validation fails
      setFormErrors({}); // Clear any previous errors
      return true;
    } catch (error: any) {
      const zodErrors = error.errors.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setFormErrors(zodErrors); // Set form errors
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setForm({
      ...form,
      leaveType: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const totalDays = countDays(form.startDate, form.endDate);
      await http.post("/leaves/add", {
        ...form,
        totalDays,
      });
      setForm({
        startDate: "",
        endDate: "",
        leaveType: "",
        reason: "",
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorDialog({ open: true, message: err.message });
    }
  };

  return (
    <div className="space-y-4">
      {errorDialog.open && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorDialog.message}</AlertDescription>
        </Alert>
      )}

      <AlertDialog open={success} onOpenChange={setSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              Your leave request has been submitted successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => window.location.reload()}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Leave Balance</CardTitle>
          <CardDescription>Your current leave balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(profileData.employee?.leaveQuota ?? 0) - (profileData.employee?.leaveCount ?? 0)} days
          </div>
          <p className="text-sm text-muted-foreground">Annual leave remaining from {profileData.employee?.leaveQuota ?? 0} Quota Leave</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Request Leave</CardTitle>
            <CardDescription>Submit a new leave request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleInputChange}
                />
                {formErrors.startDate && <p className="text-red-500 text-sm">{formErrors.startDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleInputChange}
                />
                {formErrors.endDate && <p className="text-red-500 text-sm">{formErrors.endDate}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger id="leave-type">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual">Annual Leave</SelectItem>
                  <SelectItem value="Sick">Sick Leave</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.leaveType && <p className="text-red-500 text-sm">{formErrors.leaveType}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="Brief description of your leave request"
                value={form.reason}
                onChange={handleInputChange}
              />
              {formErrors.reason && <p className="text-red-500 text-sm">{formErrors.reason}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit Request</Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>My Request Leave</CardTitle>
          <CardDescription>Overview of Request</CardDescription>
          <Input
            placeholder="Filter leave requests"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading leave requests...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Total Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date From to</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.leaves.length > 0 ? (
                  data.leaves
                    .filter((leave) =>
                      leave.leaveType.toLowerCase().includes(filter.toLowerCase())
                    )
                    .map((leave) => (
                      <TableRow key={leave._id}>
                        <TableCell>{leave.leaveType}</TableCell>
                        <TableCell>{leave.totalDays}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>
                          {toIndonesianDate(leave.startDate)} - {toIndonesianDate(leave.endDate)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={leave.status === "Pending" ? "secondary" : leave.status === "Approved" ? "default" : "destructive"}
                          >
                            {leave.status}
                          </Badge>
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
  );
}
