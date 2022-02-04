import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError } from '../../../utils/const';
import SignInDto from '../../../dtos/signin.dto';
import { createUserToken } from '../../../utils/jwt'
import { createError, ErrorType } from '../../../errors/createError';

import HttpException from '../../../exceptions/HttpException';
import * as Services from './services'

export const signIn = async (request: Request, response: Response, next: NextFunction) => {
    const body: SignInDto = request.body;

    const responseFromDB = await Services.SignIn(body)
        .catch(err => {
            const userNotFound = err.name === 'USER_NO_EXIST';
            if (userNotFound) return next(createError(ErrorType.WRONG_CREDENTIAL))
            return next(new HttpException({...GenericError.ServerError.error, message: err.message}))
        });

    if (responseFromDB) {
        if (responseFromDB) {
            const {
                token,
                tokenExpires,
                refreshToken,
                refreshTokenExpires,
            } = createUserToken({ userInfo: { id: responseFromDB.id, email: responseFromDB.email } });

            const out = { ...responseFromDB, token, tokenExpires, refreshToken, refreshTokenExpires };

            SuccessResponse(request, response, out)
        } else {
            response.status(500).json({ message: 'Something went wrong' })
        }
    }
}