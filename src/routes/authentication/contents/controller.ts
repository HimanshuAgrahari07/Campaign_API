import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError } from '../../../utils/const';
import HttpException from '../../../exceptions/HttpException';
import { createContent, getContentById } from '../../../database/DBQuery'
import { byteToMb } from '../../../utils/helper'
// @ts-ignore
import * as config from '../../../configuration';

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

        const responseFromDB = await createContent(contentsParams);
        const insertId = responseFromDB.insertId
        const data = await getContentById(insertId, orgId);

        if (responseFromDB) {
            SuccessResponse(request, response, data)
        }
    } catch (error) {
        next(new HttpException({ ...GenericError.ServerError.error, message: error.message }))
    }
}

import { getAllList } from './services';
export const getAll = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const allCampaigns = await getAllList(orgId)
    // const hydratedAllCampaign = await Promise.all(
    //     allCampaigns.map(async(campaign: any) => await hydratorCampaign({ campaignRecord: campaign, uid: campaign.uid, contents, devices }))
    // )
    if (allCampaigns) {
        SuccessResponse(request, response, allCampaigns)
    }
}