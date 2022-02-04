import { Request, Response, NextFunction, Router } from 'express';

enum status {
    SUCCESS = 'SUCCESS',
    FAIL = 'FAIL',
    BLOCKED = 'BLOCKED',
}

export const GenericError = {
    BadRequest: {
        error: {
            status: 400,
            message: 'Request has wrong format',
            statusText: status.FAIL,
            errorCode: 'BAD_REQUEST',
        }
    },
    ServerError: {
        error: {
            status: 500,
            message: 'Something went wrong',
            statusText: status.FAIL,
            errorCode: 'SERVER_ERROR',
        }
    },
    NotFoundError: {
        error: {
            status: 404,
            message: 'Requested resource not found',
            statusText: status.FAIL,
            errorCode: 'NOT_FOUND',
        }
    },
    WrongAuthentication: {
        error: {
            status: 401,
            message: 'Wrong authentication token',
            statusText: status.BLOCKED,
            errorCode: 'BLOCKED',
        }
    },
    AuthenticationTokenMissing: {
        error: {
            status: 401,
            message: 'Authentication token missing',
            statusText: status.BLOCKED,
            errorCode: 'BLOCKED',
        }
    },
}

export const SuccessResponse = (request: Request, response: Response, data? : any) => {
    response.status(200).json({
        status: 200,
        message: 'Request completed successfully',
        statusText: status.SUCCESS,
        data: data
    })
}

export const RESOLUTIONS_TABLE_NAME = 'resolutions';
export const COUNTRIES_TABLE_NAME = 'countries';
export const USERS_TABLE_NAME = 'users';
export const ORGANIZATION_TABLE_NAME = 'organisations';
export const CONTENT_TABLE_NAME = 'contents';
export const CAMPAIGN_TABLE_NAME = 'campaigns';
export const DEVICES_TABLE_NAME = 'devices';