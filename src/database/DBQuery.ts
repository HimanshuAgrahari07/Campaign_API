import runQuery from './Database'
import { ICampaign, IOrganisation } from '../interfaces/index'

// joins default values using AND
const getWhereQuery = (valuesObject: any, joinBy?: 'AND' | 'OR') => {
    const requiredData = Object.entries(valuesObject).filter(e => e[1])
    const where = requiredData.map(e => `${e[0]}='${e[1]}'`).join(` ${joinBy || 'AND'} `)
    console.log('where >>> ', where)
    return where
}

// User
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

// Organisation
import { ORGANIZATION_TABLE_NAME } from '../utils/const'

export const insertNewOrganisation = async (param: IOrganisation) => {
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

export const getOrganisationById = async (id: number) => {
    if (!id) return; // if none provided, return

    const where = getWhereQuery({ id }, 'OR')

    const query = `SELECT *
                   FROM ${ORGANIZATION_TABLE_NAME}
                   WHERE ${where}`;
    return await runQuery(query)
}

// Contents
import { CONTENT_TABLE_NAME } from '../utils/const'
/**
 * 
 * @param contentId campaigns id for which we want to query
 * @param organisationId Orgs id for which we want to query campaign
 * @returns contents details for the given campaigns id within an orgs
 */
export const getContentById = async (contentId: number, organisationId: number) => {
    if (!(contentId && organisationId)) return; // if none provided, return

    const where = getWhereQuery({ id: contentId }, 'OR')

    const query = `SELECT *
                   FROM ${CONTENT_TABLE_NAME}
                   WHERE ${where}
                   AND organisationId = '${organisationId}'
                   ;`
    return await runQuery(query)
}

/**
 * 
 * @param contentIdArray Array of campaigns id for which we want to query. Ex [1,3]
 * @param organisationId Orgs id for which we want to query campaign
 * @returns List of contents
 */
export const getContentsList = async (contentIdArray: number[], organisationId: number) => {
    if (!(contentIdArray.length && organisationId)) return; // if none provided, return

    // const partialStr = contentIdArray.filter(Boolean).join('\', ')
    const partialStr = contentIdArray.filter(Boolean)
    console.log('partialStr >>> ', partialStr)
    const query = `SELECT *
                   FROM ${CONTENT_TABLE_NAME}
                   WHERE id in (${contentIdArray})
                   AND organisationId = '${organisationId}'
                   ;`;
    console.log('query >>> ', query)
    return await runQuery(query)
}

/**
 * 
 * @param organisationId Orgs id for which we want to query campaign
 * @returns List of contents
 */
export const getAllContentsListForAnOrganisation = async (organisationId: number) => {
    if (!organisationId) return; // if none provided, return

    const query = `SELECT *
                   FROM ${CONTENT_TABLE_NAME}
                   WHERE organisationId = '${organisationId}'
                   ;`;
    return await runQuery(query)
}

// CAMPAIGNS
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
}: ICampaign) => {
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
    // await insertCampaignToDevice()
    if (response.affectedRows === 0) throw new Error('Campaign creation failed');
    if (response.affectedRows === 1) {
        const createdCampaigns = await getCampaignByAnyColumn({
            uid,
            organisationId
        }, 'AND')

        const createdCampaign = createdCampaigns[0]
        const createdCampaignId = createdCampaign.id;

        await Promise.all(devices.map(deviceId => insertCampaignToDevice(createdCampaignId, deviceId)))
        await Promise.all(contents.map(contentId => insertCampaignToContents(createdCampaignId, contentId)))
        
        return [createdCampaign]
    }

    return []
}

export const getCampaignById = async (campaignId: number) => {
    if (!(campaignId)) return; // if none provided, return
    return getCampaignByAnyColumn({ id: campaignId }, 'AND')
}

export const getCampaignByAnyColumn = async (columnNameValuePairObj: {}, joinBy?: 'AND' | 'OR') => {
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

export const getCampaignCountByOrgId = async (organisationId: number) => {
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
export const getDeviceById = async (deviceId: number, organisationId: number) => {
    if (!(deviceId && organisationId)) return;

    const where = getWhereQuery({ id: deviceId, organisationId })

    const query = `SELECT *
                   FROM ${DEVICES_TABLE_NAME}
                   WHERE ${where}
                   ;`
    return await runQuery(query)
}

export const getDeviceByList = async (deviceIdArray: number[], organisationId: number) => {
    if (!(deviceIdArray.length && organisationId)) return;

    const partialStr = deviceIdArray.filter(Boolean).join('\', ')
    const query = `SELECT *
                   FROM ${DEVICES_TABLE_NAME}
                   WHERE id in (${deviceIdArray})
                   AND organisationId = '${organisationId}'
                   ;`;
    console.log('query >>> ', query)
    return await runQuery(query)
}

/**
 * ****************************************************************
 *                          Campaign To DEVICES
 * ****************************************************************
 */
import { CAMPAIGN_TO_DEVICES } from '../utils/const'
const insertCampaignToDevice = async (campaignId: number, deviceId: number) => {
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
