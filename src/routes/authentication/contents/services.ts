import { getContentsList, createCampaign, getAllCampaignByOrgId } from '../../../database/DBQuery'
import { ICampaign } from "interfaces";

export const createNew = async (params: ICampaign) => {
    return await createCampaign(params);
}

export const getAllList = async (organisationId: number) => {
    return await getAllCampaignByOrgId(organisationId);
}