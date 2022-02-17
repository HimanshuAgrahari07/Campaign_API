const _ = require("lodash");
import { ICampaign, IContentLite, IDevice, IDeviceLite, IOrganisation, RequireAtLeastOne } from '../../interfaces';
import * as query from '../../database/DBQuery'
import { createError, ErrorType } from '../../errors/createError';

type IUidOrCampaignId = RequireAtLeastOne<{
    campaignRecord?: ICampaign,
    organizationRecord?: IOrganisation,
    uid?: string;
    campaignId?: number;
    devicesList?: number[];
    contentsList?: number[];
}, 'uid' | 'campaignId' | 'campaignRecord'>

export default async ({ campaignRecord, uid, campaignId, organizationRecord, devicesList: devices, contentsList: contents }: IUidOrCampaignId) => {
    if (!(
        campaignRecord
        || campaignId
        || uid
    )) return;

    let campaign: ICampaign;
    let organizationDetail: IOrganisation;
    let contentsList: IContentLite[] = [];
    let devicesList: IDeviceLite[] = [];

    if (campaignRecord) {
        campaign = campaignRecord
    } else if (campaignId) {
        const campaigns = await query.getCampaignById(campaignId) // returns array of campaign even if it is only one
        campaign = campaigns[0];
    } else if (uid) {
        const campaigns = await query.getCampaignByAnyColumn({ uid }) // returns array of campaign even if it is only one
        campaign = campaigns[0];
    } else {
        throw createError(ErrorType.RESOURCE_NOT_FOUND)
    }

    if(organizationRecord) {
        organizationDetail = organizationRecord
    } else if (campaign.organisationId) {
        const organizations = await query.getOrganisationById(campaign.organisationId) // returns array of organisation even if it is only one
        organizationDetail = organizations[0];
    } else if(!organizationDetail) {
        return;
    }

    const organisationId = campaign.organisationId || organizationDetail.id;

    // TODO: refactor this
    if(devices && devices.length > 0) {
        devicesList = await query.getDeviceByList(devices, organisationId)
    } else {
        devices = await query.getDevicesListForCampaign(campaign.id)
        devicesList = await query.getDeviceByList(devices, organisationId)
    }

    if(contents && contents.length > 0) {
        contentsList = await query.getContentsList(contents)
    } else {
        contents = await query.getContentListForCampaign(campaign.id)
        contentsList = await query.getContentsList(contents)
    }

    const out = {
        ...campaign,
        contents: contentsList,
        devices: devicesList,
        organisation: organizationDetail
    }

    return out
};

