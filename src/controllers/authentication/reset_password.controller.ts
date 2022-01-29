import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError } from './../../utils/const';
import HttpException from './../../exceptions/HttpException';
import SignUpServices from './../../services/authentication/reset_password.services'
import SignUpUserDto from './../../dtos/signup.dto';

class ResetPasswordController {
    private services = new SignUpServices();

    SignUp = async (request: Request, response: Response, next: NextFunction) => {
        const body: SignUpUserDto = request.body;
        const responseFromDB = await this.services.addUser(body).catch(err => next(new HttpException({ ...GenericError.ServerError.error, message: err.message })));

        if (responseFromDB) {
            SuccessResponse(request, response, responseFromDB)
        }
    }
}

export default ResetPasswordController;