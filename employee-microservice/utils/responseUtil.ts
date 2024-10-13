// utils/responseUtils.ts

import { Response as ExpressResponse } from 'express';

interface SuccessResponse {
  success: boolean;
  data?: any;
  message?: string;
}

interface ErrorResponse {
  success: boolean;
  error: string;
}

const sendSuccessResponse = (res: ExpressResponse, data: any, message: string = 'Request successful') => {
  const response: SuccessResponse = {
    success: true,
    data,
    message,
  };
  res.status(200).json(response);
};

const sendErrorResponse = (res: ExpressResponse, error: string, statusCode: number = 500) => {
  const response: ErrorResponse = {
    success: false,
    error,
  };
  res.status(statusCode).json(response);
};

export { sendSuccessResponse, sendErrorResponse };
