import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

// function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
//   try {
//     const status: number = error.status || 500;
//     const defaultMessage: string = 'Something went wrong';
//     console.error(`[${request.method}] ${request.path} >> StatusCode :: ${status}, Message: ${error.message || defaultMessage}`);
//     response
//       .status(status)
//       .send({
//         ...error,
//         message: error.errorCode == 'SERVER_ERROR' ? defaultMessage : error.message,
//       });
//   } catch (error) {
//     console.error(error.stack);
//     next(error);
//   }
// }

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number =
    err.statusCode === undefined ? 500 : err.statusCode;

  const errorEnum: any = err.validationErrors
    ? "VALIDATION_ERROR"
    : err.enum === undefined
    ? "SYSTEM_ERROR"
    : err.enum;

  const message: any =
    err.message === undefined ? "There was a system error" : err.message;

  // show stack for a thrown error
  const stack = err.wasThrown === false ? undefined : err;

  if (err.validationErrors) {
    console.error(err.validationErrors);
  }

  delete req.body.password;
  console.error({
    error: err,
    params: req.params,
    url: req.url,
    body: req.body,
    query: req.query,
    stack,
  });
  err.resBody && console.error(JSON.stringify(err.resBody));

  return res.status(statusCode).json({
    statusCode: statusCode,
    enum: errorEnum,
    message: message,
    validationErrors: err.validationErrors,
    stack: process.env.NODE_ENV !== "production" ? stack : undefined,
  });
};

export default errorMiddleware;
