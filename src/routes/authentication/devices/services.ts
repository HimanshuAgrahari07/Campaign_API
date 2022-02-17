import * as query from '../../../database/DBQuery'
import hydratorsContentsWithOrgs from '../../../lib/hydrators/hydratorsContentsWithOrgs';
import hydratorsContentLite from '../../../lib/hydrators/hydratorsContentLite';
import { IContentLite, IContent, IDevice, IDeviceLite, IDeviceNewRequest } from 'interfaces';
import * as fileHandling from './../../../utils/fileHandling';
import { createError, ErrorType } from '../../../errors/createError';
import { generateUid } from '../../../utils/uidGenerator';


export const createNew = async (params: IDeviceLite): Promise<number> => {
    const responseFromDB = await query.createDevice(params);
    const insertId = responseFromDB.insertId;
    return insertId
}

// export const getAllList = async (organisationId: number) => {
//     const contents = await query.getAllContentsListForAnOrganisation(organisationId)
//     return await hydratorsContentsWithOrgs({ organisationId, contents })
// }

// export const getOne = async (organisationId: number, contentId: number): Promise<IContentWithOrganisation> => {
//     const liteContents = await hydratorsContentLite({ contentIds: [contentId] })

//     if (liteContents.length === 0) return {} as IContentWithOrganisation

//     const hydratedContent = await hydratorsContentsWithOrgs({ organisationId, contents: liteContents })
//     return hydratedContent[0]
// }

// export const updateOne = async (contentId: number, params: {
//     organisationId: number;
//     contentName: string;
//     contentDescription: string;
//     fileType: string;
//     fileSize: number;
//     downloadUrl: string;
//     fileName: string;
//     filePath: string;
// }) => {
//     const responseFromDB = await query.updateContent(contentId, params);
//     if (responseFromDB.affectedRows !== 1) return {} as IContentWithOrganisation

//     const data = await query.getContentById(contentId, params.organisationId);
//     return data
// }

// export const deleteOne = async (contentId: number) => {
//     const contents = await query.getContentById(contentId);
//     if (contents.length === 0) throw createError(ErrorType.RESOURCE_NOT_FOUND)

//     const filePath = contents[0].filePath
//     await fileHandling.deleteFile(filePath)

//     const deleteResponseFromDB = await query.deleteContent(contentId);
//     return deleteResponseFromDB.affectedRows === 1 ? true : false;
// }

export const getCountOfDevicesInOrg = async (organisationId: number) => {
    const count = await query.getDevicesCountInOrg(organisationId)
    return count
}

export const getDeviceById = async (deviceId: number): Promise<IDeviceLite> => {
    const response = await query.getDeviceById(deviceId);

    return response[0];
}