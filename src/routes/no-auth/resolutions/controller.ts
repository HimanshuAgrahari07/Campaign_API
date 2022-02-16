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

export const getOne = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId);
    const id = parseInt(request.params.orgId);

    const responseFromDB = await Services.getOne(id).catch(err => next(new HttpException(err.message)));

    if (responseFromDB) {
        SuccessResponse(request, response, responseFromDB)
    }
}