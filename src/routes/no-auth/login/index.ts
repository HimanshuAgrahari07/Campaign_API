import { Router, NextFunction, Request, Response } from 'express';
import SignInDto from '../../../dtos/signin.dto';
import validationMiddleware from '../../../middleware/validation.middleware'
import * as controller from './controller';
import addUserDetails from "../../../middleware/addUserDetails"

const router = Router();


// helper function
router.post(
    "",
    validationMiddleware(SignInDto, true),
    addUserDetails,
    controller.signIn
)

export default router;