import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, GenericError, uidConfig } from '../../../utils/const';
import HttpException from '../../../exceptions/HttpException';
import * as services from './services'
// @ts-ignore
import * as config from '../../../configuration';
import { errorEnums, createError, ErrorType } from '../../../errors/createError';
import { IDeviceNewRequest, IDeviceLite, IOrganisation, IHydrateUser } from '../../../interfaces';
import { generateUid } from '../../../utils/uidGenerator';
import hydratorsDevice from '../../../lib/hydrators/hydratorsDevice';

export const createOne = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orgId = parseInt(request.params.orgId)
        const requestBody = request.body as IDeviceNewRequest
        /**@ts-ignore */
        const hydratedUser: IHydrateUser = request.hydratedUser
        const organisation: IOrganisation = hydratedUser.organisation
        const countOfDevices = await services.getCountOfDevicesInOrg(orgId)

        const generatedUid = generateUid(
            organisation.uid,
            countOfDevices,
            uidConfig.uid.devices.prefix,
            uidConfig.uid.devices.length
        )

        const contentsParams: IDeviceLite = {
            ...requestBody,
            uid: generatedUid,
            organisationId: orgId,
        }

        const insertId = await services.createNew(contentsParams);
        const insertedRecord = await services.getDeviceById(insertId, orgId);

        if (insertedRecord) {
            SuccessResponse(request, response, insertedRecord)
        }
    } catch (error) {
        next(new HttpException({ ...GenericError.ServerError.error, message: error.message }))
    }
}

export const getAll = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId)
    const devicesList = await services.getDevicesList(orgId)
    
    if(devicesList.length === 0) {
        return next(createError({...ErrorType.RESOURCE_NOT_FOUND, message: `No devices found for organisation with id ${orgId}`}))
    }

    const hydrateDevicesList = await Promise.all(devicesList.map(async (device) => hydratorsDevice({
        deviceId: device.id,
    }))).catch(error => next(error))

    if (hydrateDevicesList && hydrateDevicesList.length) {
        SuccessResponse(request, response, hydrateDevicesList)
    }
}

export const getOne = async (request: Request, response: Response, next: NextFunction) => {
    const orgId = parseInt(request.params.orgId);
    const deviceId = parseInt(request.params.id);
    const device = await services.getDeviceById(deviceId, orgId)

    const hydrateDevice = await hydratorsDevice({
        deviceDetail: device
    }).catch(error => next(error))

    if (hydrateDevice) {
        SuccessResponse(request, response, hydrateDevice)
    }
}

export const updateOne = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orgId = parseInt(request.params.orgId)
        const contentId = parseInt(request.params.id)

        const requestBody = request.body as IDeviceNewRequest

        const data = await services.updateOne(contentId, orgId, requestBody).catch(error => next(error));

        if (data) {
            SuccessResponse(request, response, data)
        }
    } catch (error) {
        next(new HttpException({ ...GenericError.ServerError.error, message: error.message }))
    }
}

export const deleteOne = async (request: any, response: Response, next: NextFunction) => {
    try {
        const orgId = parseInt(request.params.orgId)
        const deviceId = parseInt(request.params.id)

        const data = await services.deleteDevice(deviceId, orgId)
        if (data) {
            SuccessResponse(request, response, { message: 'Device deleted successfully' })
        }
    } catch (error) {
        next(error)
    }
}