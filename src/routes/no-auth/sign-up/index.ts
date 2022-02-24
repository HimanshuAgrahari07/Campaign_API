import { Router, NextFunction, Request, Response } from 'express';
import * as controller from './controller';
const router = Router();


// helper function
import validationMiddleware from '../../../middleware/validation.middleware';
import {
    SignUpUserWithNewOrgDto,
    SignUpUserWithExistingOrgDto
} from '../../../dtos/signup.dto';


function _validationMiddleware(request: Request, response: Response, next: NextFunction) {
    if (request.body.organisation && !request.body.organisationId) {
        validationMiddleware(SignUpUserWithNewOrgDto)
    } else {
        validationMiddleware(SignUpUserWithExistingOrgDto)
    }

    next();
}

router.post("", _validationMiddleware, controller.signUp)

export default router;
