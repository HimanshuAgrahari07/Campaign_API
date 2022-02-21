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

export const getCountOfDevicesInOrg = async (organisationId: number) => {
    const count = await query.getDevicesCountInOrg(organisationId)
    return count
}

export const getDeviceById = async (deviceId: number, organisationId: number): Promise<IDeviceLite> => {
    const response = await query.getDeviceById(deviceId, organisationId);

    return response[0];
}

export const getDevicesList = async (organisationId: number) => {
    const deviceLists = await query.getDevicesByOganisationId(organisationId)
    // return await hydratorsContentsWithOrgs({ organisationId, contents })
    return deviceLists
}