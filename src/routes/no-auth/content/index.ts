import { Router, NextFunction, Request, Response } from 'express';
import SignInDto from '../../../dtos/signin.dto';
import validationMiddleware from '../../../middlewares/validation.middleware'
import * as controller from './controller';

const router = Router();


// helper function
router.get("/download/:filePath", controller.downloadFile)

export default router;