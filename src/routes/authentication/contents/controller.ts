import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError } from '../../../utils/const';
import { upload } from './../../../utils/upload';

import HttpException from '../../../exceptions/HttpException';
export const createOne = async (request: any, response: Response, next: NextFunction) => {
    try {
        const orgId = parseInt(request.params.orgId)
        upload(request, response, next, 'contents').single('attachment')

        // call service to save file details to DB
        response.status(201).json({ message: 'success' })
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