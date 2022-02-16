export const generateUid = (
    organizationUid: string,
    existingCount: number = 0,
    prefixIdentifier: string = '0',
    maxNumSize: number = 3,
): string => {
    // countOfCampaigns is the count of existing campaign, hence + 1 for next
    let existingCountOfDevicesStringFormat = (existingCount + 1).toString();
    while (existingCountOfDevicesStringFormat.length < maxNumSize) existingCountOfDevicesStringFormat = "0" + existingCountOfDevicesStringFormat;
    return `${organizationUid}-${prefixIdentifier}${existingCountOfDevicesStringFormat}`;
}