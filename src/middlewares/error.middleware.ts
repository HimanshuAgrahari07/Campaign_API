import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    console.log(`[${request.method}] ${request.path} >> StatusCode :: ${status}, Message: ${message}`);
    
    response
      .status(status)
      .send(error);
  } catch (error) {
    next(error);
  }
}

export default errorMiddleware;
