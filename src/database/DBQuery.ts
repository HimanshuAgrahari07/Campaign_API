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

    const partialStr = contentIdArray.filter(Boolean).join('\', ')
    const query = `SELECT *
                   FROM ${CONTENT_TABLE_NAME}
                   WHERE id in ('${partialStr}')
                   AND organisationId = '${organisationId}'
                   ;`;
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

// export const createNewCampaign = async () {
//     `INSERT INTO contents
//     (   
//         organisationId,
//         contentName,
//         contentDescription,
//         fileType,
//         fileSize,
//         downloadUrl,
//         streamUrl,
//         fileName,
//         filePath,
//         createdAt,
//         updatedAt
//     )
//     VALUES
//     (   
//         28,
//         'Test'
//     );
//     `
// }

// CAMPAIGNS
import { CAMPAIGN_TABLE_NAME } from '../utils/const'
import { getLocalStrTime } from '../utils/helper'
/**
 * 
 * @param param0 Object of type @ICampaign
 * @returns true if success
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
    campaignFrequency
}: ICampaign) => {
    // const {
    //     organisationId,
    //     campaignName,
    //     campaignDescription,
    //     uid,
    //     campaignStatus,
    //     startDate,
    //     endDate,
    //     campaignFrequency
    // } = params

    // if (! (
    //     organisationId
    //     && campaignName
    //     && campaignDescription
    //     && uid
    //     && campaignStatus
    //     && startDate
    //     && endDate
    //     && campaignFrequency 
    // )) return; // if none provided, return

    const query = `INSERT INTO campaigns
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
                        'STR_TO_DATE("${getLocalStrTime(startDate)}", "%d/%m/%Y, %k:%i:%s")',
                        'STR_TO_DATE("${getLocalStrTime(endDate)}", "%d/%m/%Y, %k:%i:%s")',
                        '${campaignFrequency}'
                    );
    `;

    console.log(`query >>>`, query)
    const response = await runQuery(query)
    console.log(`response >> `, response)
    if (response.length) {
        return getCampaignByAnyColumn({
            uid,
            organisationId
        }, 'AND')
    }

    return false;
}

export const getCampaignById = async (campaignId: number) => {
    if (!(campaignId)) return; // if none provided, return

    const where = getWhereQuery({ id: campaignId })

    const query = `SELECT *
                   FROM ${CAMPAIGN_TABLE_NAME}
                   WHERE ${where}
                   ;`
    return await runQuery(query)
}

export const getCampaignByAnyColumn = async (columnNameValuePairObj: {}, joinBy?: 'AND' | 'OR') => {
    const where = getWhereQuery(columnNameValuePairObj, joinBy || 'AND')

    const query = `SELECT *
                   FROM ${CAMPAIGN_TABLE_NAME}
                   WHERE ${where}
                   ;`
    const response = await runQuery(query)
    return response
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
                   WHERE id in ('${partialStr}')
                   AND organisationId = '${organisationId}'
                   ;`;
    return await runQuery(query)
}