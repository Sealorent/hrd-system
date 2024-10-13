// app/hooks/useLeaveData.ts
import { useEffect, useState } from 'react';
import http from '../utils/http';
import { useAuth } from '../context/AuthContext';
import ILeave from '../interfaces/leaveInterface';
import IEmployee from '../interfaces/employeeInterface'; 

const useLeaveRequestData = () => {
  const { user } = useAuth();

  // State for storing leave data
  const [data, setData] = useState<{ requestLeaves: ILeave[] }>({
    requestLeaves: [],
  });

  // State for storing all employee data
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  // Error and loading states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        console.log('Fetching employees...');
        // Step 1: Fetch all employees
        const employeeResponse = await http.get('/employees'); // Assuming this is your endpoint for fetching all employees
        const fetchedEmployees: IEmployee[] = employeeResponse.data;

        console.log('Employees:', fetchedEmployees);

        // Step 2: Set employees data
        setEmployees(fetchedEmployees);

        console.log('Fetching leaves...');
        // Step 3: Fetch all leave requests
        const leaveResponse = await http.get('/leaves');
        const fetchedLeaves: ILeave[] = leaveResponse.data;

        console.log('Leaves:', fetchedLeaves);

        // Step 4: Map leave requests to corresponding employee data
        const requestLeaves = fetchedLeaves.map(leave => ({
          ...leave,
          employee: fetchedEmployees.find(emp => emp._id === leave.employeeId) || null, // Attach corresponding employee
        }));

        console.log('Request Leaves:', requestLeaves);
        // Step 5: Set the mapped leave requests with employee data
        setData({ requestLeaves });

      } catch (error: any) {
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, error, loading };
};

export default useLeaveRequestData;
