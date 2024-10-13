// app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
    const { user } = useAuth(); // Get the user from the context
    const [form, setForm] = useState({
        username: user?.username || '',
        email: user?.email || '',
        department: user?.department || '',
        position: user?.position || ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        if (user) {
            setForm({ // Set form state when user data is available
                username: user.username,
                email: user.email,
                department: user.department,
                position: user.position
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value // Update corresponding field in form state
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        setLoading(true); // Start loading
        try {
            // Logic to save the updated profile data (e.g., API call)
            console.log('Updated Profile:', form);
            // You can implement an API call here to update the user's profile
            setSuccess(true);
        } catch (error: any) {
            setError(error instanceof Error ? error.message : "An error occurred during the update");
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert variant="default" className="mb-4">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                            Your profile has been updated successfully.
                        </AlertDescription>
                    </Alert>
                )}
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-4">
                            <Label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                readOnly // Prevent editing
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</Label>
                            <Input
                                id="department"
                                name="department"
                                value={form.department}
                                readOnly // Prevent editing
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</Label>
                            <Input
                                id="position"
                                name="position"
                                value={form.position}
                                readOnly // Prevent editing
                            />
                        </div>
                        {/* <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Profile'}
                        </Button> */}
                    </form>
                ) : (
                    <p>No user information available. Please log in.</p>
                )}
            </CardContent>
        </Card>
    );
}
