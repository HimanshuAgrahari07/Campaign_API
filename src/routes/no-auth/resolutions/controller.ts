import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../../../utils/const';
import HttpException from '../../../exceptions/HttpException';
import * as Services from './services'

export const getAll = async (request: Request, response: Response, next: NextFunction) => {
    const responseFromDB = await Services.getAllResolutions().catch(err => next(new HttpException(err.message)));

    if (responseFromDB) {
        SuccessResponse(request, response, responseFromDB)
    }
}
