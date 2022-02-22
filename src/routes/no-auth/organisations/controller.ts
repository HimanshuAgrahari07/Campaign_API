import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../../../utils/const';
import HttpException from '../../../exceptions/HttpException';
import * as Services from './services'

export const getOne = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const uid = request.params.uid

    const responseFromDB = await Services.getOne(orgId, uid).catch(err => next(err));

    if (responseFromDB) {
        SuccessResponse(request, response, responseFromDB)
    }
}
