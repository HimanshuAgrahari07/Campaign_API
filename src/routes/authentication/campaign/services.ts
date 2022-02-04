import { getContentsList, createCampaign } from '../../../database/DBQuery'
import { ICampaign } from "interfaces";

export const createNew = async (params: ICampaign) => {
    const response = await createCampaign(params);
    return response;
}