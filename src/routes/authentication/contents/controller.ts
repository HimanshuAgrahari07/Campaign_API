import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError } from '../../../utils/const';
import HttpException from '../../../exceptions/HttpException';
import * as services from './services'
// @ts-ignore
import * as config from '../../../configuration';
import { errorEnums } from '../../../errors/createError';

export const createOne = async (request: any, response: Response, next: NextFunction) => {
    try {
        const orgId = parseInt(request.params.orgId)
        const { contentName, contentDescription } = request.body;
        const file = request.file;

        const contentsParams = {
            organisationId: orgId,
            contentName,
            contentDescription,
            fileType: file.mimetype,
            // fileSize: byteToMb(file.size),
            fileSize: file.size,
            downloadUrl: `${config.baseUrl}/content/download/${file.filename}`,
            fileName: file.filename,
            filePath: file.path
        }

        const data = await services.createNew(contentsParams);

        if (data) {
            SuccessResponse(request, response, data)
        }
    } catch (error) {
        next(new HttpException({ ...GenericError.ServerError.error, message: error.message }))
    }
}

export const getAll = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const allContents = await services.getAllList(orgId)

    if (allContents) {
        SuccessResponse(request, response, allContents)
    }
}

export const getOne = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const contentId = parseInt(request.params.id)
    const content = await services.getOne(orgId, contentId)

    if (content) {
        SuccessResponse(request, response, content)
    }
}

export const updateOne = async (request: any, response: Response, next: NextFunction) => {
    try {
        const orgId = parseInt(request.params.orgId)
        const contentId = parseInt(request.params.id)

        const { contentName, contentDescription } = request.body;
        const file = request.file;

        const contentsParams = {
            organisationId: orgId,
            contentName,
            contentDescription,
            fileType: file.mimetype,
            fileSize: file.size,
            downloadUrl: `${config.baseUrl}/content/download/${file.filename}`,
            fileName: file.filename,
            filePath: file.path
        }

        const data = await services.updateOne(contentId, contentsParams);

        if (data) {
            SuccessResponse(request, response, data)
        }
    } catch (error) {
        next(new HttpException({ ...GenericError.ServerError.error, message: error.message }))
    }
}

export const deleteOne = async (request: any, response: Response, next: NextFunction) => {
    try {
        const orgId = parseInt(request.params.orgId)
        const contentId = parseInt(request.params.id)

        const data = await services.deleteOne(contentId)
        if (data) {
            SuccessResponse(request, response, data)
        }
    } catch (error) {
        if(error.enum == errorEnums.RESOURCE_NOT_FOUND) {
            next(error)
        } else {
            next(new HttpException({ ...GenericError.ServerError.error, message: error.message }))
        }
    }
}