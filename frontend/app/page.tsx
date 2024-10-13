"use client"; // Add this to ensure it's a Client Component

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard'); // Redirect to dashboard if logged in
    } else {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, router]);

  return <div>Loading...</div>; // Show loading while redirecting
};

export default HomePage;
