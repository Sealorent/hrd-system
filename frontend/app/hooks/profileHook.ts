// app/hooks/useEmployeeData.ts
import { useEffect, useState } from 'react';
import http from '../utils/http';
import { useAuth } from '../context/AuthContext';
import IEmployee  from '../interfaces/employeeInterface'; // Import the IEmployee interface


const useProfileData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{ employee: IEmployee | null }>({ employee : null });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!user) return; //
    const fetchData = async () => {
      try {
        const response = await http.get('/employees/profile'); // Adjust the API endpoint as necessary
        console.log('Profile:', response.data);
        setData({ employee: response.data || null });
      } catch (error: any) {
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false); // End loading
      }
    };
  
    fetchData();
  }, [user]); 

  return { data, error, loading };
};

export default useProfileData;
