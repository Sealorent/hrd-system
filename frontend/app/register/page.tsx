'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { Department, departmentPositions } from '../enums/departementEnum'; // Adjust the import path as necessary
import PasswordInput from '@/components/password-input'
import { z } from 'zod'

export default function Component() {
  const { register } = useAuth();
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [department, setDepartment] = useState<Department | ''>('')
  const [position, setPosition] = useState('')
  const [availablePositions, setAvailablePositions] = useState<string[]>([])
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (department) {
      setAvailablePositions(departmentPositions[department as Department])
      setPosition('')
    } else {
      setAvailablePositions([])
      setPosition('')
    }
  }, [department])

  const schema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
    department: z.nativeEnum(Department, { errorMap: () => ({ message: 'Department is required' }) }).nullable().refine((value) => value !== null, {
      message: 'Department is required',
    }),
    position: z.string().min(1, 'Position is required'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessages({})
    setSuccess(false)

    const formData = {
      username,
      email,
      password,
      confirmPassword,
      department,
      position,
    }

    const validationResult = schema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrorMessages(fieldErrors);
      return;
    }

    try {
      await register(email, username, password, position, department)
      setSuccess(true)
    } catch (error: any) {
      setErrorMessages({ general: error instanceof Error ? error.message : "An error occurred during registration" })
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Registration Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your account has been created successfully. Please wait for the HR manager to accept your account before you can access all features.
              </AlertDescription>
            </Alert>
            <div className="text-center mt-4">
              <Link href="/login" className="text-primary hover:underline">
                Return to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">HR Development Registration</CardTitle>
          <CardDescription className="text-center">Create a new account to access HR services</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessages.general && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessages.general}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
              {errorMessages.username && <p className="text-red-500 text-sm">{errorMessages.username}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              {errorMessages.email && <p className="text-red-500 text-sm">{errorMessages.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={(value) => setDepartment(value as Department)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Department).map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorMessages.department && <p className="text-red-500 text-sm">{errorMessages.department}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select value={position} onValueChange={setPosition} disabled={!department}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {availablePositions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorMessages.position && <p className="text-red-500 text-sm">{errorMessages.position}</p>}
            </div>
            <div className="space-y-2">
                <PasswordInput
                  id="password"
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  required
                />
              {errorMessages.password && <p className="text-red-500 text-sm">{errorMessages.password}</p>}
            </div>
            <div className="space-y-2">
                <PasswordInput
                  id="confirmPassword"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  required
                />
              {errorMessages.confirmPassword && <p className="text-red-500 text-sm">{errorMessages.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Log in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}