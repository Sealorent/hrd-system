// utils/jwtUtils.ts

import jwt from 'jsonwebtoken';

// Define a secret or public key for verification
const SECRET_KEY = process.env.JWT_SECRET || 'secret'; // Replace with your secret key or public key


// Function to decode a JWT without verification
export const decodeToken = (token: string) => {
  try {
    return jwt.decode(token) as { [key: string]: any }; // Adjust type as necessary
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null; // Return null or handle error as needed
  }
};

// Function to verify a JWT
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { [key: string]: any }; // Adjust type as necessary
    return decoded; // Return the decoded token payload
  } catch (error) {
    console.error('Failed to verify token:', error);
    return null; // Return null or handle error as needed
  }
};

// Function to check if the token is expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true; // Token is invalid or doesn't have an expiration time
  }
  
  // Check if the current time is greater than the expiration time
  return Date.now() >= decoded.exp * 1000; // Convert exp to milliseconds
};

// Function to extract user data from the decoded token
export const getUserFromToken = (token: string) => {
  const decoded = decodeToken(token);
//   console.log('jwt.ts: getUserFromToken', decoded);
  if (decoded && decoded.employeeJwt) {
    return {
        id: decoded.employeeJwt._id, // Adjust based on your JWT payload structure
        username: decoded.employeeJwt.username,
        email: decoded.employeeJwt.email,
        position: decoded.employeeJwt.position,
        department: decoded.employeeJwt.department,
        isAdmin: decoded.employeeJwt.isAdmin,
        status: decoded.employeeJwt.status,
        createdAt: decoded.employeeJwt.createdAt,
        updatedAt: decoded.employeeJwt.updatedAt,
        updatedBy: decoded.employeeJwt.updatedBy,
        acceptedBy: decoded.employeeJwt.acceptedBy,
        acceptedAt: decoded.employeeJwt.acceptedAt,
        leaveQuota: decoded.employeeJwt.leaveQuota,
        leaveCount: decoded.employeeJwt.leaveCount,
    };
  }
  return null; // Return null if decoding fails
};
