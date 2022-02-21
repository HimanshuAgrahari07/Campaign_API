const _ = require("lodash");

import { DEVICES_TABLE_NAME } from '../../utils/const'
import * as query from '../../database/DBQuery'
import { IDeviceLite, IDevice, RequireAtLeastOne } from './../../interfaces';
import hydratorsCampaign from './hydratorsCampaign'
export default async ({
    deviceId,
    deviceDetail
}: RequireAtLeastOne<{
    deviceId?: number,
    deviceDetail?: IDeviceLite
}, 'deviceId' | 'deviceDetail'>): Promise<IDevice> => {
    if (deviceId) {
        const response = await query.getDeviceById(deviceId);
        deviceDetail = response[0];
    }

    if(!deviceDetail) return;
    
    const organisationId = deviceDetail.organisationId
    const organisation = await query.getOrganisationById(organisationId);

    const resolutionId = deviceDetail.resolutionId
    const deviceResolution = await query.getResolutionsById(resolutionId);

    const deviceToCampaignList = await query.geCampaignListForDevice(deviceDetail.id);
    const hydratedCampaignList = await Promise.all(deviceToCampaignList.map(async (campaignId) => hydratorsCampaign({
        campaignId
    })));

    const out: IDevice = {
        ...deviceDetail,
        deviceResolution: deviceResolution[0],
        organisation: organisation[0],
        campaigns: hydratedCampaignList
    }

    return out
};
