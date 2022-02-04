const _ = require("lodash");
import { getCampaignByAnyColumn, getCampaignById, getContentsList, getDeviceByList } from '../../database/DBQuery'

export default async (uid: string, campaignId?: number, devices?: number[], contents?: number[]) => {
    if (!(
        campaignId
        || uid
    )) return;

    const campaign = await getCampaignByAnyColumn({
        id: campaignId,
        uid
    }, 'OR')

    if (!campaign.length) {
        throw new Error(`Campaign doesn't exist`)
    };

    const contentsList = await getContentsList(contents, campaign.organisationId)
    const devicesList = await getDeviceByList(devices, campaign.organisationId)

    const out = {
        ...campaign,
        contents: contentsList,
        devices: devicesList
    }

    return out
};

