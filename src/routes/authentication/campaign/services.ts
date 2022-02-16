import * as query from '../../../database/DBQuery'
import { ICampaign } from "interfaces";
import { createError, ErrorType } from '../../../errors/createError';

export const createNew = async (params: ICampaign): Promise<number> => {
    // check if devices and contents exists
    const deviceCheckResults = await query.checkIfDevicesExists(params.devices)

    if (!deviceCheckResults.allExists) {
        throw createError({...ErrorType.RESOURCE_NOT_FOUND, message: deviceCheckResults.message})
    }

    const contentCheckResults = await query.checkIfContentsExists(params.contents)
    if(!contentCheckResults.allExists) {
        throw createError({...ErrorType.RESOURCE_NOT_FOUND, message: contentCheckResults.message})
    }
    
    return await query.createCampaign(params);
}

export const getAllList = async (organisationId: number) => {
    return await query.getAllCampaignByOrgId(organisationId);
}

export const getCampaignCountByOrgId = async (organisationId: number) => {
    return await query.getCampaignCountByOrgId(organisationId)
} 