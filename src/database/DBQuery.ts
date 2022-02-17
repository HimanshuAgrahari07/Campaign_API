import runQuery from './Database'
import { ICampaign, IDevice, IOrganisation } from '../interfaces/index'

// joins default values using AND
const getWhereQuery = (valuesObject: any, joinBy?: 'AND' | 'OR') => {
    const requiredData = Object.entries(valuesObject).filter(e => e[1])
    const where = requiredData.map(e => `${e[0]}='${e[1]}'`).join(` ${joinBy || 'AND'} `)
    console.log('where >>> ', where)
    return where
}


/**
 * ****************************************************************
 *                          USERS
 * ****************************************************************
 */
import { USERS_TABLE_NAME } from '../utils/const'
export const getUser = async ({ userId, email, mobile }: { userId?: number, email?: string, mobile?: string }) => {
    if (!(userId || email || mobile)) return; // if none provided, return

    const where = getWhereQuery({ userId, email, mobile }, 'OR')

    const query = `SELECT *
                   FROM ${USERS_TABLE_NAME}
                   WHERE ${where}`;

    return await runQuery(query)
}

export async function addNewUser({
    email,
    firstName,
    lastName,
    mobile,
    countryId,
    password,
    organisationId,
    role
}: {
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    countryId: number;
    password: string;
    organisationId: number;
    role?: 'USER' | 'ADMIN';
}) {
    const queryString = `INSERT IGNORE INTO ${USERS_TABLE_NAME} (
        firstName,
        lastName,
        email,
        password,
        countryId,
        mobile,
        organisationId,
        role,
        updatedAt
    )
    VALUES(
        "${firstName}",
        "${lastName}",
        "${email}",
        "${password}",
        "${countryId}",
        "${mobile}",
        "${organisationId}",
        "${role || 'USER'}",
        ""
    );`

    return await runQuery(queryString)
}



/**
 * ****************************************************************
 *                          ORGANISATIONS
 * ****************************************************************
 */
import { ORGANIZATION_TABLE_NAME } from '../utils/const'

export const createNewOrganisation = async (param: IOrganisation) => {
    const { name, uid } = param
    if (!(name || uid)) return; // if none provided, return

    const queryString = `INSERT IGNORE INTO ${ORGANIZATION_TABLE_NAME} (
        name,
        uid
    )
    VALUES(
        "${name}",
        "${uid}"
    );`

    return await runQuery(queryString)
}

export const getOrganisation = async (param: IOrganisation) => {
    const { name, uid, id } = param
    if (!(name || uid || id)) return; // if none provided, return

    const where = getWhereQuery(param, 'OR')

    const query = `SELECT *
                   FROM ${ORGANIZATION_TABLE_NAME}
                   WHERE ${where}`;
    return await runQuery(query)
}

export const getOrganisationById = async (id: number): Promise<IOrganisation[]> => {
    if (!id) return; // if none provided, return

    const where = getWhereQuery({ id }, 'OR')

    const query = `SELECT *
                   FROM ${ORGANIZATION_TABLE_NAME}
                   WHERE ${where}`;
    return await runQuery(query)
}




/**
 * ****************************************************************
 *                          CONTENTS
 * ****************************************************************
 */
import { CONTENT_TABLE_NAME } from '../utils/const'
import { IContentLite, IBasicContent } from '../interfaces/index'

export const createContent = async ({
    organisationId,
    contentName,
    contentDescription,
    fileType,
    fileSize,
    downloadUrl,
    fileName,
    filePath,
}: IBasicContent) => {

    const query = `INSERT INTO ${CONTENT_TABLE_NAME}
    (
        organisationId,
        contentName,
        contentDescription,
        fileType,
        fileSize,
        downloadUrl,
        fileName,
        filePath
    )
    VALUES
    (
        '${organisationId}',
        '${contentName}',
        '${contentDescription}',
        '${fileType}',
        '${fileSize}',
        '${downloadUrl}',
        '${fileName}',
        '${filePath}'
    );
    `
    return await runQuery(query)
}

/**
 * 
 * @param contentId contents id for which we want to query
 * @param organisationId? Orgs id for which we want to query contents
 * @returns contents details for the given contents id within an orgs
 * 
 * Even if it returns single row, it will return array of one row
 */
export const getContentById = async (contentId: number, organisationId?: number): Promise<IContentLite[]> => {
    if (!(contentId)) return; // return

    const where = getWhereQuery({ id: contentId, organisationId }, 'AND')

    const query = `SELECT *
                   FROM ${CONTENT_TABLE_NAME}
                   WHERE ${where}
                   ;`
    return await runQuery(query)
}

/**
 * 
 * @param contentIdArray Array of contents id for which we want to query. Ex [1,3]
 * @param organisationId Orgs id for which we want to query contents
 * @returns List of contents
 */
export const getContentsList = async (contentIdArray: number[], organisationId?: number): Promise<IContentLite[]> => {
    if (!(contentIdArray.length)) return; // if none provided, return

    const query = `SELECT *
                   FROM ${CONTENT_TABLE_NAME}
                   WHERE id in (${contentIdArray})
                   ${organisationId ? `AND organisationId = '${organisationId}'` : ''}
                   ;`;

    return await runQuery(query)
}

/**
 * 
 * @param organisationId Orgs id for which we want to query contents
 * @returns List of contents
 */
export const getAllContentsListForAnOrganisation = async (organisationId: number): Promise<IContentLite[]> => {
    if (!organisationId) return; // if none provided, return

    const query = `SELECT *
                   FROM ${CONTENT_TABLE_NAME}
                   WHERE organisationId = '${organisationId}'
                   ;`;
    return await runQuery(query)
}

export const updateContent = async (contentId: number, params: IBasicContent) => {
    const requiredData = Object.entries(params).filter(e => e[1])
    const queryString = requiredData.map(e => `${e[0]}='${e[1]}'`).join(', ')

    const query = `UPDATE ${CONTENT_TABLE_NAME}
                    SET ${queryString}
                    WHERE id = ${contentId};`;

    return await runQuery(query)
}

export const deleteContent = async (contentId: number) => {

    const query = `DELETE FROM ${CONTENT_TABLE_NAME}
                    WHERE id = ${contentId};`;

    return await runQuery(query)
}


export const checkIfContentExists = async (contentId: number): Promise<boolean> => {
    if (!(contentId)) return;

    const query = `SELECT EXISTS (
                        SELECT * FROM ${CONTENT_TABLE_NAME}
                        WHERE id = ${contentId}
                    )
                    AS 'exists';`

    const response = await runQuery(query)
    return response[0].exists === 1
}

// export const checkIfContentsExists = async (deviceIds: number[]): Promise<{
//     allExists: boolean,
//     message: string
// }> => {
//     if (!(deviceIds.length)) return;

//     const testResults = await Promise.all(deviceIds.map(deviceId => checkIfContentExists(deviceId)))
//     // const doesAllExists = testResults.every((result, index) => result === true)
//     const indexOfMissingDevices = testResults.map(element => element === false)
//     const missingDevices = deviceIds.filter((_, index) => indexOfMissingDevices[index] === true)
//     const missingDevicesLength = missingDevices.length;
//     const message = missingDevicesLength === 0 ? 'All devices exist' : `${missingDevicesLength} devices do not exist`
//     const concatMissingDevices = missingDevices.join(', ')
//     const allExists = missingDevicesLength === 0

//     return {
//         allExists,
//         message: `${message} - (${concatMissingDevices})`
//     }
// }

export const checkIfContentsExists = async (deviceIds: number[]): Promise<{
    allExists: boolean,
    message: string
}> => {
    if (!(deviceIds.length)) return {
        allExists: false,
        message: 'No contents provided'
    }

    const exists = await Promise.all(deviceIds.map(deviceId => checkIfContentExists(deviceId)))
    const allExists = exists.every(exists => exists === true)

    if (!allExists) return {
        allExists,
        message: 'One or more contents do not exist'
    }

    return {
        allExists,
        message: ''
    }
}


/**
 * ****************************************************************
 *                          CAMPAIGNS
 * ****************************************************************
 */
import { CAMPAIGN_TABLE_NAME } from '../utils/const'
/**
 * 
 * @param param0 Object of type @ICampaign
 * @returns array of campaigns created
 * @throws error if not success
 */
export const createCampaign = async ({
    organisationId,
    campaignName,
    campaignDescription = '',
    uid,
    campaignStatus,
    startDate,
    endDate,
    campaignFrequency,
    devices,
    contents
}: ICampaign): Promise<number> => {
    if (!(organisationId && campaignName && uid && campaignStatus && startDate && endDate && campaignFrequency)) return; // if none provided, return


    const createNewCampaignQuery = `INSERT INTO ${CAMPAIGN_TABLE_NAME}
    (
        organisationId,
        campaignName,
        campaignDescription,
        uid,
        campaignStatus,
        startDate,
        endDate,
        campaignFrequency
    )
    VALUES
    (
        '${organisationId}',
        '${campaignName}',
        '${campaignDescription}',
        '${uid}',
        '${campaignStatus}',
        DATE_FORMAT(STR_TO_DATE('${startDate}','%Y-%m-%dT%H:%i:%s.000Z'),'%Y-%m-%d %H:%i:%s'),
        DATE_FORMAT(STR_TO_DATE('${endDate}','%Y-%m-%dT%H:%i:%s.000Z'),'%Y-%m-%d %H:%i:%s'),
        '${campaignFrequency}'
    );
    `
    const response = await runQuery(createNewCampaignQuery)
    // update campaign to devices table
    if (response.affectedRows === 0) throw new Error('Campaign creation failed');
    if (response.affectedRows === 1) {
        const createdCampaignId = response.insertId;

        await Promise.all(devices.map(deviceId => insertCampaignToDevice(createdCampaignId, deviceId)))
        await Promise.all(contents.map(contentId => insertCampaignToContents(createdCampaignId, contentId)))

        return createdCampaignId
    }

    return null
}

export const getCampaignById = async (campaignId: number, organisationId?: number): Promise<ICampaign[]> => {
    if (!(campaignId)) return; // if none provided, return
    return getCampaignByAnyColumn({ id: campaignId, organisationId }, 'AND')
}

export const getCampaignByAnyColumn = async (columnNameValuePairObj: {}, joinBy?: 'AND' | 'OR'): Promise<ICampaign[]> => {
    const where = getWhereQuery(columnNameValuePairObj, joinBy || 'AND')

    const query = `SELECT *
                   FROM ${CAMPAIGN_TABLE_NAME}
                   WHERE ${where}
                   ;`
    return await runQuery(query)
}

export const getAllCampaignByOrgId = async (organisationId: number) => {
    if (!(organisationId)) return; // if none provided, return

    return await getCampaignByAnyColumn({ organisationId }, 'AND')
}

export const getCampaignCountByOrgId = async (organisationId: number): Promise<number> => {
    const where = getWhereQuery({ organisationId })
    const query = `SELECT count(*) as count
                   FROM ${CAMPAIGN_TABLE_NAME}
                   WHERE ${where}
                   ;`

    const response = await runQuery(query)
    return response[0].count
}

/**
 * ****************************************************************
 *                          DEVICES
 * ****************************************************************
 */
import { DEVICES_TABLE_NAME } from '../utils/const'
import { IDeviceNewRequest, IDeviceLite } from '../interfaces/index'

export const createDevice = async (params: IDeviceLite) => {
    const {
        uid,
        deviceName,
        deviceModel,
        deviceBrand,
        deviceSize,
        deviceLocation,
        deviceStatus,
        playingCampaign,
        activeCampaigns,
        organisationId,
        resolutionId,
    } = params

    const query = `INSERT INTO ${DEVICES_TABLE_NAME}
    (
        uid,
        deviceName,
        deviceModel,
        deviceBrand,
        deviceSize,
        deviceLocation,
        deviceStatus
        ${playingCampaign ? ', playingCampaign' : ''}
        ${activeCampaigns ? ', activeCampaigns' : ''}
        ${organisationId ? ', organisationId' : ''}
        ${resolutionId ? ', resolutionId' : ''}
    )
    VALUES
    (
        '${uid}',
        '${deviceName}',
        '${deviceModel}',
        '${deviceBrand}',
        '${deviceSize}',
        '${deviceLocation}',
        '${deviceStatus}'
        ${playingCampaign ? `, '${playingCampaign}'` : ''}
        ${activeCampaigns ? `, '${activeCampaigns}'` : ''}
        ${organisationId ? `, '${organisationId}'` : ''}
        ${resolutionId ? `, '${resolutionId}'` : ''}
    );
    `
    return await runQuery(query)
}

export const getDeviceById = async (deviceId: number): Promise<IDeviceLite[]> => {
    if (!(deviceId)) return;

    const where = getWhereQuery({ id: deviceId })

    const query = `SELECT *
                   FROM ${DEVICES_TABLE_NAME}
                   WHERE ${where}
                   ;`
    return await runQuery(query)
}

export const getDeviceByList = async (deviceIdArray: number[], organisationId: number): Promise<IDeviceLite[]> => {
    if (!(deviceIdArray.length && organisationId)) return;

    const query = `SELECT *
                   FROM ${DEVICES_TABLE_NAME}
                   WHERE id in (${deviceIdArray})
                   AND organisationId = '${organisationId}'
                   ;`;
    return await runQuery(query)
}

export const getDevicesCountInOrg = async (organisationId: number): Promise<number> => {
    const where = getWhereQuery({ organisationId })
    const query = `SELECT COUNT(*) as count
                   FROM ${DEVICES_TABLE_NAME}
                   WHERE ${where}
                   ;`

    const response = await runQuery(query)
    return response[0].count
}

const checkIfDeviceExists = async (deviceId: number): Promise<boolean> => {
    if (!(deviceId)) return;

    const query = `SELECT EXISTS (
                        SELECT * FROM ${DEVICES_TABLE_NAME}
                        WHERE id = ${deviceId}
                    )
                    AS 'exists';`

    const response = await runQuery(query)
    return response[0].exists === 1
}

export const checkIfDevicesExists = async (deviceIds: number[]): Promise<{
    allExists: boolean,
    message: string
}> => {
    if (!(deviceIds.length)) return {
        allExists: false,
        message: 'No devices provided'
    }

    const exists = await Promise.all(deviceIds.map(deviceId => checkIfDeviceExists(deviceId)))
    const allExists = exists.every(exists => exists === true)

    if (!allExists) return {
        allExists,
        message: 'One or more devices do not exist'
    }

    return {
        allExists,
        message: ''
    }
}


/**
 * ****************************************************************
 *                          Campaign To DEVICES
 * ****************************************************************
 */
import { CAMPAIGN_TO_DEVICES } from '../utils/const'
export const insertCampaignToDevice = async (campaignId: number, deviceId: number) => {
    if (!(deviceId && campaignId)) return;

    /**
     * A ---> Campaign id
     * B ---> Device id
     */
    const query = `INSERT INTO ${CAMPAIGN_TO_DEVICES}
                    (
                        A,
                        B
                    )
                    VALUES
                    (
                        '${campaignId}',
                        '${deviceId}'
                    );`
    return await runQuery(query)
}

export const getDevicesListForCampaign = async (campaignId: number): Promise<number[]> => {
    if (!(campaignId)) return;

    const query = `SELECT B
                   FROM ${CAMPAIGN_TO_DEVICES}
                   WHERE A = '${campaignId}'
                   ;`
    const response = await runQuery(query)
    return response.map((row: { B: number }) => row.B)
}

export const geCampaignListForDevice = async (deviceId: number): Promise<number[]> => {
    if (!(deviceId)) return;

    const query = `SELECT A
                   FROM ${CAMPAIGN_TO_DEVICES}
                   WHERE B = '${deviceId}'
                   ;`
    const response = await runQuery(query)
    return response.map((row: { A: number }) => row.A)
}

/**
 * ****************************************************************
 *                          Campaign To CONTENTS
 * ****************************************************************
 */
import { CAMPAIGN_TO_CONTENTS } from '../utils/const'
const insertCampaignToContents = async (campaignId: number, contentsId: number) => {
    if (!(contentsId && campaignId)) return;

    /**
     * A ---> Campaign id
     * B ---> Device id
     */
    const query = `INSERT INTO ${CAMPAIGN_TO_CONTENTS}
                     (
                         A,
                         B
                     )
                     VALUES
                     (
                         '${campaignId}',
                         '${contentsId}'
                     );`
    return await runQuery(query)
}

export const getContentListForCampaign = async(campaignId: number): Promise<number[]> => {
    if (!(campaignId)) return;

    const query = `SELECT B
                   FROM ${CAMPAIGN_TO_CONTENTS}
                   WHERE A = '${campaignId}'
                   ;`
    const response = await runQuery(query)
    return response.map((row: { B: number }) => row.B)
}

export const geCampaignListForContent = async(contentId: number): Promise<number[]> => {
    if (!(contentId)) return;

    const query = `SELECT A
                   FROM ${CAMPAIGN_TO_CONTENTS}
                   WHERE B = '${contentId}'
                   ;`
    const response = await runQuery(query)
    return response.map((row: { A: number }) => row.A)
}


/**
 * ****************************************************************
 *                          DEVICE RESOLUTIONS
 * ****************************************************************
 */
import { RESOLUTIONS_TABLE_NAME } from '../utils/const'
import devices from 'routes/authentication/devices'

export const getResolutionsById = async (id: number | number[]) => {
    const isArray = Array.isArray(id);

    if (!(isArray || id)) return; // returns even if id = 0

    const query = `SELECT *
                    FROM ${RESOLUTIONS_TABLE_NAME}
                    ${isArray ? `WHERE id in (${id})` : ''}
                    ${id && !isArray ? `WHERE id = '${id}'` : ''}
                    ;`;
    return await runQuery(query)
}

export const getAllResolutions = async () => {
    const query = `SELECT *
                    FROM ${RESOLUTIONS_TABLE_NAME};`;

    return await runQuery(query)
}