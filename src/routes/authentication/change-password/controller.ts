import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../../../utils/const';
import * as Services from './services'
import { getHashedPassword } from '../../../utils/helper'
import hydratorUser from '../../../lib/hydrators/hydratorsUser'
import { createError, ErrorType } from '../../../errors/createError';

function isValidPassword(oldPassword: string, newPassword: string): boolean {
    if (!(oldPassword && newPassword)) return false; // falsy value

    // any more tests like pattern etc?

    return true
}
export const update = async (request: Request, response: Response, next: NextFunction) => {
    const { oldPassword, newPassword, userId } = request.body;

    // sanity check of passwords
    if (!isValidPassword(oldPassword, newPassword)) {
        return next(createError({
            statusCode: 403,
            errorEnum: 'MISSING_PASSWORD',
            message: "Both old and new passwords must be provided.",
        }))
    }

    const oldHashedPwd = getHashedPassword(oldPassword);

    /**@ts-ignore */
    // let { user, hydratedUser } = request;

    const user = await Services.getUser({ id: userId, password: oldHashedPwd })
        .catch(error => next(createError({
            statusCode: 500,
            errorEnum: 'SERVER_ERROR',
            message: "Something went wrong while updating the password.",
        })))

    if (!user) {
        return next(createError(ErrorType.WRONG_CREDENTIALS))
    }

    if (user) {
        // encrypt and update password
        const newHashedPwd = getHashedPassword(newPassword)
        const responseFromDB = await Services.update(userId, newHashedPwd).catch(err => next(err));

        if (!responseFromDB) {
            return next(createError(ErrorType.UPDATE_FAILED))
        }

        delete user.password;

        SuccessResponse(request, response, user)
    }
}
