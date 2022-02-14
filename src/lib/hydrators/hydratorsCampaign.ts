const _ = require("lodash");
import { RequireAtLeastOne } from '../../interfaces';
import { getCampaignByAnyColumn, getCampaignById, getContentsList, getDeviceByList, getOrganisationById } from '../../database/DBQuery'

type IUidOrCampaignId = RequireAtLeastOne<{
    campaignRecord?: any,
    organizationRecord?: any,
    uid?: string;
    campaignId?: number;
    devices?: number[];
    contents?: number[];
}, 'uid' | 'campaignId' | 'campaignRecord'>

export default async ({ campaignRecord, organizationRecord, uid, campaignId, devices, contents }: IUidOrCampaignId) => {
    if (!(
        campaignRecord
        || campaignId
        || uid
    )) return;

    let campaign;
    let organizationDetails;
    if (!(campaignRecord && (typeof campaignRecord === 'object' || Array.isArray(campaignRecord)))) {
        campaign = await getCampaignByAnyColumn({
            id: campaignId,
            uid
        }, 'OR')
    } else {
        campaign = campaignRecord
    }
    
    if (!(organizationRecord && (typeof organizationRecord === 'object' || Array.isArray(organizationRecord)))) {
        const organizationId = campaignRecord && campaignRecord.organisationId
        organizationDetails = await getOrganisationById(organizationId)
        console.log(`organizationRecord >>>`, organizationRecord)

    } else {
        organizationDetails = organizationRecord
    }

    console.log(`organizationDetails >>>`, organizationDetails)
    console.log(`campaign >>>`, campaign)

    if (!campaign.length) {
        throw new Error(`Campaign doesn't exist`)
    };

    const contentsList = await getContentsList(contents, campaign[0].organisationId)
    const devicesList = await getDeviceByList(devices, campaign[0].organisationId)
    const out = {
        ...campaign[0],
        contents: contentsList,
        devices: devicesList,
        organisation: organizationDetails
    }
    console.log(`out >>>`, out)

    return out
};

