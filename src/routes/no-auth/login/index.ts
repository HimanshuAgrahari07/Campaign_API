import { Router, NextFunction, Request, Response } from 'express';
import SignInDto from '../../../dtos/signin.dto';
import validationMiddleware from '../../../middleware/validation.middleware'
import * as controller from './controller';

const router = Router();


// helper function
router.post("",validationMiddleware(SignInDto, true), controller.signIn)

export default router;