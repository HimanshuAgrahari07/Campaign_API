import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  try {
    const status: number = error.status || 500;
    const defaultMessage: string = 'Something went wrong';
    console.error(`[${request.method}] ${request.path} >> StatusCode :: ${status}, Message: ${error.message || defaultMessage}`);
    response
      .status(status)
      .send({
        ...error,
        message: error.errorCode == 'SERVER_ERROR' ? defaultMessage : error.message,
      });
  } catch (error) {
    console.error(error.stack);
    next(error);
  }
}

export default errorMiddleware;
