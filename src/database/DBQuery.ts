import runQuery from './Database'
import { ICampaign, ICampaignBasics, IOrganisation, RequireAtLeastOne } from '../interfaces/index'
import { createError, ErrorType } from '../errors/createError'
import * as helper from './queryHelper'
import { getWhereQuery, getUpdateSetQueryString } from './queryHelper'


/**
 * ****************************************************************
 *                          USERS
 * ****************************************************************
 */
import { USERS_TABLE_NAME } from '../utils/const'
export const getUser = async (params: any) => {

    const where = getWhereQuery(params, 'AND')

    const query = `SELECT *
                   FROM ${USERS_TABLE_NAME}
                   WHERE ${where}`;

    return await runQuery(query)
}

export const addNewUser = async({
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
}) => {
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

export const updateUser = async (userId: number, params: {
    email?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    countryId?: number;
    organisationId?: number;
    role?: string;
    confirmed?: 0 | 1;
    password?: string;
}) => {
    const queryString = getUpdateSetQueryString(params)

    const query = `UPDATE ${USERS_TABLE_NAME}
                    SET ${queryString}
                    WHERE id = ${userId};`;

    return await runQuery(query)
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

export const getOrganisation = async (param: RequireAtLeastOne<IOrganisation, 'name' | 'id' | 'uid'>) => {
    const { name, uid, id } = param
    if (!(name || uid || id)) return; // if none provided, return

    const where = getWhereQuery(param, 'AND')

    const query = `SELECT *
                   FROM ${ORGANIZATION_TABLE_NAME}
                   WHERE ${where}`;
    return await runQuery(query)
}

export const getOrganisationById = async (organisationId: number, uid?: string): Promise<IOrganisation[]> => {

    const where = getWhereQuery({ id: organisationId, uid: uid }, 'AND')

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
    const queryString = getUpdateSetQueryString(params)

    const query = `UPDATE ${CONTENT_TABLE_NAME}
                    SET ${queryString}
                    WHERE id = ${contentId};`;

    return await runQuery(query)
}

export const deleteContent = async (contentId: number): Promise<boolean> => {

    const query = `DELETE FROM ${CONTENT_TABLE_NAME}
                    WHERE id = ${contentId};`;

    const deleteResponseFromDB = await runQuery(query)
    return deleteResponseFromDB.affectedRows === 1 ? true : false;

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

export const createCampaign = async (organisationId: number, uid: string, params: ICampaignBasics): Promise<number> => {
    const {
        campaignName,
        campaignDescription = '',
        campaignStatus,
        startDate,
        endDate,
        campaignFrequency,
        devices,
        contents
    } = params

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
    if (response.affectedRows === 1) {
        const createdCampaignId = response.insertId;

        await Promise.all(devices.map(deviceId => insertCampaignToDevice(createdCampaignId, deviceId)))
        await Promise.all(contents.map(contentId => insertCampaignToContents(createdCampaignId, contentId)))

        return createdCampaignId
    }

    return NaN
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

export const updateCampaign = async (campaignId: number, params: ICampaignBasics): Promise<boolean> => {
    const { devices, contents, ...rest } = params;
    const queryString = getUpdateSetQueryString(rest)

    const query = `UPDATE ${CAMPAIGN_TABLE_NAME}
                    SET ${queryString}
                    WHERE id = ${campaignId};`;

    const response = await runQuery(query)

    // update campaign to devices and contents table
    if (response.affectedRows === 1) {
        const existingDevices = await getDevicesListForCampaign(campaignId);
        const toBeInsertedNewDevices = devices.filter(device => !existingDevices.includes(device))
        const toBeDeletedOldDevices = existingDevices.filter(device => !devices.includes(device))

        if (toBeInsertedNewDevices.length > 0) await Promise.all(toBeInsertedNewDevices.map(deviceId => insertCampaignToDevice(campaignId, deviceId)))
        if (toBeDeletedOldDevices.length > 0) await Promise.all(toBeDeletedOldDevices.map(deviceId => deleteCampaignDeviceMapping(campaignId, deviceId)))


        const existingContents = await getContentListForCampaign(campaignId);
        const toBeInsertedNewContents = contents.filter(content => !existingContents.includes(content))
        const toBeDeletedOldContents = existingContents.filter(content => !contents.includes(content))


        if (toBeInsertedNewContents.length > 0) await Promise.all(contents.map(contentId => insertCampaignToContents(campaignId, contentId)))
        if (toBeDeletedOldContents.length > 0) await Promise.all(contents.map(contentId => deleteCampaignContentMapping(campaignId, contentId)))
    }

    return true
}

export const checkIfCampaignExists = async (campaignId: number, organisationId: number): Promise<boolean> => {
    const query = `
    SELECT EXISTS (
        SELECT * FROM ${CAMPAIGN_TABLE_NAME}
        WHERE id = ${campaignId}
        AND organisationId = '${organisationId}'
    )
    AS 'exists';`

    const response = await runQuery(query)
    return response[0].exists === 1
}

export async function deleteCampaign(campaignId: number, orgId: number) {
    const query = `
                    DELETE FROM ${CAMPAIGN_TABLE_NAME}
                    WHERE 
                        id              = ${campaignId}
                    AND organisationId  = ${orgId}
                    ;`;


    const response = await runQuery(query)

    // update campaign to devices and contents table
    if (response.affectedRows === 1) {
        const existingDevices = await getDevicesListForCampaign(campaignId);
        if (existingDevices.length > 0) await Promise.all(existingDevices.map(deviceId => deleteCampaignDeviceMapping(campaignId, deviceId)))

        const existingContents = await getContentListForCampaign(campaignId);
        if (existingContents.length > 0) await Promise.all(existingContents.map(contentId => deleteCampaignContentMapping(campaignId, contentId)))
    }

    return response;
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

    // 1st row of query i.e uid is different from others, no preceding comma
    // TODO: below query is buggy, write a loop to generate query
    const query = `INSERT INTO ${DEVICES_TABLE_NAME}
    (
        ${uid ? 'uid' : ''}
        ${deviceName ? ', deviceName' : ''}
        ${deviceModel ? ', deviceModel' : ''}
        ${deviceBrand ? ', deviceBrand' : ''}
        ${deviceSize ? ', deviceSize' : ''}
        ${deviceLocation ? ', deviceLocation' : ''}
        ${deviceStatus ? ', deviceStatus' : ''}
        ${playingCampaign ? ', playingCampaign' : ''}
        ${activeCampaigns ? ', activeCampaigns' : ''}
        ${organisationId ? ', organisationId' : ''}
        ${resolutionId ? ', resolutionId' : ''}
    )
    VALUES
        (
            ${uid ? `  '${uid}'` : ''}
        ${deviceName ? `, '${deviceName}'` : ''}
        ${deviceModel ? `, '${deviceModel}'` : ''}
        ${deviceBrand ? `, '${deviceBrand}'` : ''}
        ${deviceSize ? `, '${deviceSize}'` : ''}
        ${deviceLocation ? `, '${deviceLocation}'` : ''}
        ${deviceStatus ? `, '${deviceStatus}'` : ''}
        ${playingCampaign ? `, '${playingCampaign}'` : ''}
        ${activeCampaigns ? `, '${activeCampaigns}'` : ''}
        ${organisationId ? `, '${organisationId}'` : ''}
        ${resolutionId ? `, '${resolutionId}'` : ''}
    );
`
    return await runQuery(query)
}

export const getDeviceById = async (deviceId: number, organisationId?: number): Promise<IDeviceLite[]> => {
    if (!(deviceId)) return;

    const where = getWhereQuery({ id: deviceId, organisationId })

    const query = `SELECT *
    FROM ${DEVICES_TABLE_NAME}
                   WHERE ${where}
    ; `
    return await runQuery(query)
}

export const getDevicesByOganisationId = async (organisationId: number): Promise<IDeviceLite[]> => {
    if (!(organisationId)) return;

    const where = getWhereQuery({ organisationId })

    const query = `SELECT *
    FROM ${DEVICES_TABLE_NAME}
                   WHERE ${where}
; `
    return await runQuery(query)
}

export const getDeviceByList = async (deviceIdArray: number[], organisationId: number): Promise<IDeviceLite[]> => {
    if (!(deviceIdArray.length && organisationId)) return;

    const query = `SELECT *
    FROM ${DEVICES_TABLE_NAME}
                   WHERE id in (${deviceIdArray})
                   AND organisationId = '${organisationId}'
    ; `;
    return await runQuery(query)
}

export const getDevicesCountInOrg = async (organisationId: number): Promise<number> => {
    const where = getWhereQuery({ organisationId })
    const query = `SELECT COUNT(*) as count
                   FROM ${DEVICES_TABLE_NAME}
                   WHERE ${where}
; `

    const response = await runQuery(query)
    return response[0].count
}

const checkIfADeviceExists = async (deviceId: number): Promise<boolean> => {
    if (!(deviceId)) return;

    const query = `SELECT EXISTS(
    SELECT * FROM ${DEVICES_TABLE_NAME}
                        WHERE id = ${deviceId}
)
                    AS 'exists'; `

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

    const exists = await Promise.all(deviceIds.map(deviceId => checkIfADeviceExists(deviceId)))
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

export const updateDevice = async (deviceId: number, params: IDeviceNewRequest) => {
    const queryString = getUpdateSetQueryString(params)

    const query = `UPDATE ${DEVICES_TABLE_NAME}
                    SET ${queryString}
                    WHERE id = ${deviceId};`;

    return await runQuery(query)
}

export const deleteDevice = async (deviceId: number, organisationId: number) => {
    const query = `
    DELETE FROM ${DEVICES_TABLE_NAME}
    WHERE
        id = ${deviceId}
    AND organisationId = ${organisationId}
    ; `;

    return await runQuery(query)
}

/**
 * ****************************************************************
 *                          Campaign To DEVICES
 * ****************************************************************
 */
import { CAMPAIGN_TO_DEVICES } from '../utils/const'
/**
 * A ---> Campaign id
 * B ---> Device id
 */

export const insertCampaignToDevice = async (campaignId: number, deviceId: number) => {
    if (!(deviceId && campaignId)) return;
    const query = `INSERT INTO ${CAMPAIGN_TO_DEVICES}
(
    A,
    B
)
VALUES
    (
        '${campaignId}',
        '${deviceId}'
    ); `
    return await runQuery(query)
}

export const getDevicesListForCampaign = async (campaignId: number): Promise<number[]> => {
    if (!(campaignId)) return;

    const query = `SELECT B
                   FROM ${CAMPAIGN_TO_DEVICES}
                   WHERE A = '${campaignId}'
    ; `
    const response = await runQuery(query)
    return response.map((row: { B: number }) => row.B)
}

export const geCampaignListForDevice = async (deviceId: number): Promise<number[]> => {
    if (!(deviceId)) return;

    const query = `SELECT A
                   FROM ${CAMPAIGN_TO_DEVICES}
                   WHERE B = '${deviceId}'
    ; `
    const response = await runQuery(query)
    return response.map((row: { A: number }) => row.A)
}

export const deleteCampaignDeviceMapping = async (campaignId: number, deviceId: number): Promise<boolean> => {
    const query = `DELETE FROM ${CAMPAIGN_TO_DEVICES}
WHERE
A = ${campaignId}
                    AND B = ${deviceId}
; `;

    const deleteResponseFromDB = await runQuery(query)
    return deleteResponseFromDB.affectedRows === 1 ? true : false;
}

/**
 * ****************************************************************
 *                          Campaign To CONTENTS
 * ****************************************************************
 */
import { CAMPAIGN_TO_CONTENTS } from '../utils/const'
/**
 * A ---> Campaign id
 * B ---> Device id
 */

const insertCampaignToContents = async (campaignId: number, contentsId: number) => {
    if (!(contentsId && campaignId)) return;
    const query = `INSERT INTO ${CAMPAIGN_TO_CONTENTS}
(
    A,
    B
)
VALUES
    (
        '${campaignId}',
        '${contentsId}'
    ); `
    return await runQuery(query)
}

export const getContentListForCampaign = async (campaignId: number): Promise<number[]> => {
    if (!(campaignId)) return;

    const query = `SELECT B
                   FROM ${CAMPAIGN_TO_CONTENTS}
                   WHERE A = '${campaignId}'
    ; `
    const response = await runQuery(query)
    return response.map((row: { B: number }) => row.B)
}

export const geCampaignListForContent = async (contentId: number): Promise<number[]> => {
    if (!(contentId)) return;

    const query = `SELECT A
                   FROM ${CAMPAIGN_TO_CONTENTS}
                   WHERE B = '${contentId}'
    ; `
    const response = await runQuery(query)
    return response.map((row: { A: number }) => row.A)
}

export const updateContentForCampaign = async (campaignId: number, contentId: number) => {
    const queryCheckIfAlreadyExists = `SELECT EXISTS(
        SELECT * FROM ${CAMPAIGN_TO_CONTENTS}
                                            WHERE
                                                A = ${campaignId}
                                            AND B = ${contentId}
    )
                                        AS 'exists'; `

    const response = await runQuery(queryCheckIfAlreadyExists)
    if (response[0].exists === 1) {
        return; // no need to update
    }

    const query = `UPDATE ${CAMPAIGN_TO_CONTENTS}
                    SET B = '${contentId}'
WHERE
A = ${campaignId}
                    AND B = ${contentId}; `;

    return await runQuery(query)
}

export const deleteCampaignContentMapping = async (campaignId: number, contentId: number): Promise<boolean> => {
    const query = `DELETE FROM ${CAMPAIGN_TO_CONTENTS}
WHERE
A = ${campaignId}
                    AND B = ${contentId}
; `;

    const deleteResponseFromDB = await runQuery(query)
    return deleteResponseFromDB.affectedRows === 1 ? true : false;
}


/**
 * ****************************************************************
 *                          DEVICE RESOLUTIONS
 * ****************************************************************
 */
import { RESOLUTIONS_TABLE_NAME } from '../utils/const'
import { IDeviceResolution } from '../interfaces/index'

export const getResolutionsById = async (id: number | number[]): Promise<IDeviceResolution[]> => {
    const isArray = Array.isArray(id);

    if (!(isArray || id)) return; // returns even if id = 0

    const query = `SELECT *
    FROM ${RESOLUTIONS_TABLE_NAME}
                    ${isArray ? `WHERE id in (${id})` : ''}
                    ${id && !isArray ? `WHERE id = '${id}'` : ''}
; `;
    return await runQuery(query)
}

export const getAllResolutions = async () => {
    const query = `SELECT *
    FROM ${RESOLUTIONS_TABLE_NAME}; `;

    return await runQuery(query)
}
