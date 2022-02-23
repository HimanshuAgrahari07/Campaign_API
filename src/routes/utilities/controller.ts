import { Request, Response, NextFunction } from 'express';

export const runHealthCheck = async (req: Request, res: Response, next: NextFunction) => {
  return res.json({ status: "alive" });
};

export const testSystemError = async (req: Request, res: Response, next: NextFunction) => {
  throw new Error("This is a test error");
};