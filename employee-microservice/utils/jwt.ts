// utils/jwt.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secret'; // Replace with your secret key

// Function to verify token and extract user
export const getVerifiedUser = (authHeader: string | undefined) => {
  // Check if the Authorization header is provided and valid
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Access denied. No token provided.' };
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const verifiedToken = jwt.verify(token, SECRET_KEY) as { [key: string]: any };
    if(!verifiedToken || !verifiedToken.employeeJwt) {
      return { error: 'Invalid token.' };
    }
    return { user: verifiedToken }; // Return the verified token payload
  } catch (error) {
    return { error: 'Invalid token.' }; // Return an error if the token is invalid
  }
};
