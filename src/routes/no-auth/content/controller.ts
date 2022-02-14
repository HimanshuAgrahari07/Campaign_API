import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError } from '../../../utils/const';
import { download } from '../../../utils/download'

import HttpException from '../../../exceptions/HttpException';
import * as Services from './services'
import { createError, ErrorType } from './../../../errors/createError'
//@ts-ignore
import * as config from '../../../configuration';

export const downloadFile = async (request: Request, response: Response, next: NextFunction) => {
    const fileName = request.params.filePath;

    const folderPath = config.filesConfig.contents.path;
    const filePath = folderPath + fileName

    console.log(`filePath: ${filePath}`);

    response.download(filePath, fileName, (err) => {
        if (err) {
            next(createError(ErrorType.RESOURCE_NOT_FOUND))
        }
    })
}