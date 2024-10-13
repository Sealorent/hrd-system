// app/hooks/useLeaveData.ts
import { useEffect, useState } from 'react';
import http from '../utils/http';
import { useAuth } from '../context/AuthContext';
import ILeave  from '../interfaces/leaveInterface'; // Import the IEmployee interface


const useLeaveData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{ leaves: ILeave[], }>({ leaves: [], });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!user) return; //
    const fetchData = async () => {
      try {
        console.log('Fetching leaves...');
        console.log('User:', user);
        const response = await http.get('/leaves'); // Adjust the API endpoint as necessary
        console.log('Leaves:', response.data);

        if(user && user.id) {
          const leaves = response.data.filter((leave: ILeave) => leave._id !== user.id);
          setData({ 
            ...data,
            leaves
           });
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

export default useLeaveData;
