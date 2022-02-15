import { Router, NextFunction, Request, Response } from 'express';
import * as controller from './controller';

const router = Router();


// helper function
router.get("/download/:filePath", controller.download)

export default router;