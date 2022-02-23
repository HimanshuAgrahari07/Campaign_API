import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError } from '../../../utils/const';
import SignInDto from '../../../dtos/signin.dto';
import { createUserToken } from '../../../utils/jwt'
import { createError, ErrorType } from '../../../errors/createError';
import * as Services from './services'
import { getHashedPassword } from '../../../utils/helper'
import hydratorUser from '../../../lib/hydrators/hydratorsUser'


export const signIn = async (request: Request, response: Response, next: NextFunction) => {
    const body: SignInDto = request.body;
    const { password, email } = body;

    /**@ts-ignore */
    let { user, hydratedUser } = request;

    if (!user) {
        user = await Services.getUser({ email });
    }

    const hashedPwd = getHashedPassword(password);

    if (user) {
        const isPasswordCorrect = user.password === hashedPwd;
        if (!isPasswordCorrect) {
            return next(createError(ErrorType.WRONG_CREDENTIAL));
        }
    }

    if (!hydratedUser) {
        hydratedUser = await hydratorUser({ record: user });
    }

    // now we can send the response
    const {
        token,
        tokenExpires,
        refreshToken,
        refreshTokenExpires,
    } = createUserToken({ userInfo: { id: user.id, email: user.email } });

    const out = { ...hydratedUser, token, tokenExpires, refreshToken, refreshTokenExpires };

    SuccessResponse(request, response, out)
}