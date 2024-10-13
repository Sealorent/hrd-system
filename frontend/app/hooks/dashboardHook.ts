// app/hooks/useDashboardData.ts
import { useEffect, useState } from 'react';
import http from '../utils/http';

const useDashboardData = () => {
  const [data, setData] = useState({
    totalEmployees: 0,
    openPositions: 0,
    pendingLeaveRequests: 0,
    activeProjects: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await http.get('/employees'); // Adjust the API endpoint as necessary

        // count the total number of employees
        const totalEmployees = response.data.length;
        setData((prevData) => ({ ...prevData, totalEmployees }));   
        // Assuming the API returns an object with the required structure
        
      } catch (error: any) {
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  return { data, error, loading };
};

export default useDashboardData;
