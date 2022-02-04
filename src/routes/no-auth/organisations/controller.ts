import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../../../utils/const';
import HttpException from '../../../exceptions/HttpException';
import * as Services from './services'

export const getOne = async (request: Request, response: Response, next: NextFunction) => {
    const id = Number(request.params.orgId)
    const responseFromDB = await Services.getOne(id).catch(err => next(new HttpException(err.message)));

    if (responseFromDB) {
        SuccessResponse(request, response, responseFromDB)
    }
}
