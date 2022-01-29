import { Router } from 'express';
import RoutersI from '../../interfaces/router.interface';
import SignUpController from '../../controllers/authentication/signup.controller';
import SignUpUserDto from '../../dtos/signup.dto';
import validationMiddleware from '../../middlewares/validation.middleware'

class SignUp implements RoutersI {
    public router: Router;
    public path = '/signup';
    private controller = new SignUpController();
    private signUp = this.controller.SignUp;

    constructor() {
        this.router = Router()
        this.initRoute();
    }

    private initRoute() {
        this.router.post(this.path, validationMiddleware(SignUpUserDto, true), this.signUp);
    }
}

export default SignUp;