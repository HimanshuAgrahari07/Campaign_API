import { Router, NextFunction, Request, Response } from 'express';
import RoutersI from '../../interfaces/router.interface';
import SignUpController from '../../controllers/authentication/signup.controller';
import validationMiddleware from '../../middlewares/validation.middleware';

import {
    SignUpUserWithNewOrgDto,
    SignUpUserWithExistingOrgDto
} from '../../dtos/signup.dto';

class SignUp implements RoutersI {
    public router: Router;
    public path = '/signup';
    private controller = new SignUpController();
    private signUp = this.controller.SignUp;

    constructor() {
        this.router = Router()
        this.initRoute();
    }

    private _validationMiddleware(request: Request, response: Response, next: NextFunction) {
        if (request.body.organisation && !request.body.organisationId) {
            validationMiddleware(SignUpUserWithNewOrgDto, false)
        } else {
            validationMiddleware(SignUpUserWithExistingOrgDto, false)
        }

        next();
    }

    private initRoute() {
        this.router.post(this.path, this._validationMiddleware, this.signUp);
    }
}

export default SignUp;