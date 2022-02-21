import * as Services from './services'
import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError, uidConfig } from '../../../utils/const';
import { IUser, IHydrateUser, ICampaign, ICampaignBasics } from '../../../interfaces/index'
import { generateUid } from '../../../utils/uidGenerator';
import hydratorCampaign from './../../../lib/hydrators/hydratorsCampaign'
import { createError, ErrorType } from '../../../errors/createError';

export const createOne = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const body: ICampaignBasics = request.body

    /**@ts-ignore */
    const hydratedUser: IHydrateUser = request.hydratedUser
    const organizationRecord = hydratedUser.organisation
    const organizationUid = organizationRecord.uid
    const countOfCampaigns = await Services.getCampaignCountByOrgId(orgId)
    const uid = generateUid(
        organizationUid,
        countOfCampaigns,
        uidConfig.uid.campaign.prefix,
        uidConfig.uid.campaign.length
    )

    const createdCampaignId = await Services.createNew(orgId, uid, body)
        .catch(err => next(err))

    if (!createdCampaignId) return

    const hydratedCampaign = await hydratorCampaign({
        campaignId: createdCampaignId,
        organizationRecord,
        uid,
        contentsList: body.contents,
        devicesList: body.devices
    })

    if (hydratedCampaign) {
        SuccessResponse(request, response, hydratedCampaign)
    }
}

export const getAll = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const allCampaigns = await Services.getAllList(orgId)
    // const hydratedAllCampaign = await Promise.all(
    //     allCampaigns.map(async(campaign: any) => await hydratorCampaign({ campaignRecord: campaign, uid: campaign.uid, contents, devices }))
    // )
    if (allCampaigns) {
        SuccessResponse(request, response, allCampaigns)
    }
}

export const getOne = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const campaignId = parseInt(request.params.id);

    const campaign = await Services.getById(campaignId, orgId)
    if (campaign.length === 0) {
        return next(createError(ErrorType.RESOURCE_NOT_FOUND))
    }
    const hydratedAllCampaign = await Promise.all(
        campaign.map(async (campaign: any) => await hydratorCampaign({ campaignRecord: campaign }))
    )
    if (hydratedAllCampaign.length > 0) {
        SuccessResponse(request, response, hydratedAllCampaign)
    }
}

export const updateOne = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const campaignId = parseInt(request.params.id)
    const body: ICampaignBasics = request.body

    /**@ts-ignore */
    const hydratedUser: IHydrateUser = request.hydratedUser
    const organizationRecord = hydratedUser.organisation

    const successfullyUpdated = await Services.updateOne(campaignId, {
        organisationId: orgId,
        ...body
    })
        .catch(err => next(err))

    if (!successfullyUpdated) return

    const hydratedCampaign = await hydratorCampaign({
        campaignId,
        organizationRecord
    })

    if (hydratedCampaign) {
        SuccessResponse(request, response, [hydratedCampaign])
    }
}

export async function deleteOne(request: Request, response: Response, next: NextFunction) {
    const orgId = parseInt(request.params.orgId)
    const campaignId = parseInt(request.params.id)
    
    const successfullyDeleted = await Services.deleteOne(campaignId, orgId).catch(err => next(err))
    if(successfullyDeleted) {
        SuccessResponse(request, response, [{
            message: 'Campaign successfully deleted'
        }])
    }
}
