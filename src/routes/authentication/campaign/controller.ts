import * as moment from 'moment';
import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError } from '../../../utils/const';
import { IUser, IHydrateUser, ICampaign } from '../../../interfaces/index'

import HttpException from '../../../exceptions/HttpException';
import * as Services from './services'

import { getCampaignCountByOrgId, getUser } from '../../../database/DBQuery'
import hydratorCampaign from './../../../lib/hydrators/hydratorsCampaign'
import CampaignDto from './campaign.dto';

function generateCampaignUid(organizationUid: string, countOfCampaigns: any) {
    let maxNumSize = 3
    // countOfCampaigns is the count of existing campaign, hence + 1 for next
    countOfCampaigns = (countOfCampaigns + 1).toString();
    while (countOfCampaigns.length < maxNumSize) countOfCampaigns = "0" + countOfCampaigns;
    return `${organizationUid}-C${countOfCampaigns}`;
}

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
    const nextUid = generateCampaignUid(organizationUid, countOfCampaigns)

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