// app/hooks/useEmployeeData.ts
import { useEffect, useState } from 'react';
import http from '../utils/http';
import { useAuth } from '../context/AuthContext';
import IEmployee  from '../interfaces/employeeInterface'; // Import the IEmployee interface


const useEmployeeData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{ employees: IEmployee[] }>({ employees: [] });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!user) return; //
    const fetchData = async () => {
      try {
        console.log('Fetching employees...');
        console.log('User:', user);
        const response = await http.get('/employees'); // Adjust the API endpoint as necessary
        
        // Ensure that the `user` is available before filtering
        if (user && user.id) {
          const employees = response.data.filter((employee: IEmployee) => employee._id !== user.id);
          setData({ employees: employees || [] });
        } else {
          console.log('User not found');
          // If `user` is not available, don't filter
          setData({ employees: response.data || [] });
        }
        
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

export default useEmployeeData;
