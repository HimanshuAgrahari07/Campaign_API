import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../../../utils/const';
import * as Services from './services'

export const signUp = async (request: Request, response: Response, next: NextFunction) => {
    const responseFromDB = await Services.SignUp(request.body).catch(err => next(err));

    if (responseFromDB) {
        SuccessResponse(request, response, responseFromDB)
    }
}