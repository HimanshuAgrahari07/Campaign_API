import * as moment from 'moment';
import * as Services from './services'
import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError, uidConfig } from '../../../utils/const';
import { IUser, IHydrateUser, ICampaign } from '../../../interfaces/index'
import { generateUid } from '../../../utils/uidGenerator';
import HttpException from '../../../exceptions/HttpException';

import { getCampaignCountByOrgId, getUser } from '../../../database/DBQuery'
import hydratorCampaign from './../../../lib/hydrators/hydratorsCampaign'
import CampaignDto from './campaign.dto';

export const createOne = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const body: CampaignDto = request.body

    /**@ts-ignore */
    const hydratedUser: IHydrateUser = request.hydratedUser
    const organisation = hydratedUser.organisation

    const {
        campaignName,
        campaignDescription = '',
        campaignStatus,
        startDate,
        endDate,
        campaignFrequency,
        devices,
        contents
    } = body

    const organizationUid = organisation.uid
    const countOfCampaigns = await getCampaignCountByOrgId(orgId)
    const nextUid = generateUid(
        organizationUid,
        parseInt(countOfCampaigns),
        uidConfig.uid.campaign.prefix,
        uidConfig.uid.campaign.length
    )

    const params: ICampaign = {
        organisationId: orgId,
        campaignName,
        campaignDescription,
        campaignStatus,
        startDate,
        endDate,
        campaignFrequency,
        contents,
        devices,
        organisation,
        uid: nextUid
    }

    const createdCampaign = await Services.createNew(params).catch(err => {
        console.error(err)
        next(new HttpException(err.message))
    });
    const hydratedCampaign = await hydratorCampaign({ campaignRecord: createdCampaign, organizationRecord: organisation, uid: nextUid, contents, devices })

    if (hydratedCampaign) {
        SuccessResponse(request, response, hydratedCampaign)
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