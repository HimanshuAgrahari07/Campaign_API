import * as query from '../../../database/DBQuery'
import { ICampaign, ICampaignBasics } from "./../../../interfaces";
import { createError, ErrorType } from '../../../errors/createError';

export const createNew = async (organisationId: number, uid: string, params: ICampaignBasics): Promise<number> => {
    // check if devices and contents exists
    const deviceCheckResults = await query.checkIfDevicesExists(params.devices)

    if (!deviceCheckResults.allExists) {
        throw createError({ ...ErrorType.RESOURCE_NOT_FOUND, message: deviceCheckResults.message })
    }

    const contentCheckResults = await query.checkIfContentsExists(params.contents)
    if (!contentCheckResults.allExists) {
        throw createError({ ...ErrorType.RESOURCE_NOT_FOUND, message: contentCheckResults.message })
    }

    return await query.createCampaign(organisationId, uid, params);
}

export const getAllList = async (organisationId: number) => {
    return await query.getAllCampaignByOrgId(organisationId);
}

export const getCampaignCountByOrgId = async (organisationId: number) => {
    return await query.getCampaignCountByOrgId(organisationId)
}

export const getById = async (campaignId: number, organisationId: number) => {
    return await query.getCampaignById(campaignId, organisationId)
}

interface updateParams extends ICampaignBasics {
    organisationId: number;
};

export const updateOne = async (campaignId: number, params: updateParams): Promise<boolean> => {
    const doesCampaignExists = await query.checkIfCampaignExists(campaignId, params.organisationId)
    if (!doesCampaignExists) {
        throw createError(ErrorType.RESOURCE_NOT_FOUND)
    }

    // check if devices and contents exists
    const deviceCheckResults = await query.checkIfDevicesExists(params.devices)

    if (!deviceCheckResults.allExists) {
        throw createError({ ...ErrorType.RESOURCE_NOT_FOUND, message: deviceCheckResults.message })
    }

    const contentCheckResults = await query.checkIfContentsExists(params.contents)
    if (!contentCheckResults.allExists) {
        throw createError({ ...ErrorType.RESOURCE_NOT_FOUND, message: contentCheckResults.message })
    }

    return await query.updateCampaign(campaignId, params);
}

export async function deleteOne(campaignId: number, orgId: number) {
    const deleteResponseFromDB = await query.deleteCampaign(campaignId, orgId)

    if(deleteResponseFromDB.affectedRows === 0) {
        throw createError(ErrorType.RESOURCE_NOT_FOUND)
    }

    return true
}
