import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../../../utils/const';
import * as emailHelper from '../../../utils/email'
import {
    createPasswordResetToken,
    decodePasswordResetToken,
    createUserToken
} from '../../../utils/jwt';
import { createError, ErrorType } from '../../../errors/createError';
const _ = require("lodash");


export const reset_password = async (request: Request, response: Response, next: NextFunction) => {
    const { email } = request.body;
    if (!email) next({
        message: 'Please enter your email address'
    })

    /**@ts-ignore */
    const { user } = request

    const {
        token
    } = createPasswordResetToken({ userInfo: { id: user.id, email } });

    emailHelper.sendResetPasswordEmail(email, token)
        .then(() => {
            response.status(200).json(SuccessResponse(request, response, {
                message: `An email has been sent to ${email} with further instructions.`
            }))
        })
        .catch(error => {
            next(error)
        })
}

export const reset_password_complete = async (request: Request, response: Response, next: NextFunction) => {
    const token = request.params.token;
    const userDetail = decodePasswordResetToken(token);

    if (_.isEmpty(userDetail)) {
        return next(createError(ErrorType.UNAUTHORIZED));
    }

    const userToken = createUserToken({ userInfo: userDetail });

    response.status(200).json(SuccessResponse(request, response, userToken))
}