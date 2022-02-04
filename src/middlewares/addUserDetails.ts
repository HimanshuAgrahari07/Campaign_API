import { NextFunction, Response, Request } from 'express';
import HttpException from '../exceptions/HttpException';
import { decodeUserToken } from "../utils/jwt";
import { GenericError } from '../utils/const'
import { USERS_TABLE_NAME } from '../utils/const'
import runQuery from '../database/Database'
import hydrateUser from '../lib/hydrators/hydratorsUser'

export default async (req: Request, res: Response, next: NextFunction) => {
    /** @ts-ignore */
    const { decodedUserInfo } = req;
    console.log('[[decodedUserInfo]] >>>> ', decodedUserInfo)
    
    let record: any;

    try {
        const validValues = Object.entries(decodedUserInfo).filter(e => e[0])
        const where = validValues.map(e => `${e[0]}='${e[1]}'`).join(' OR ')
        const query = `SELECT * 
                    FROM ${USERS_TABLE_NAME || 'users'}
                    WHERE ${where};`

        const userDetails = await runQuery(query);

        if (!userDetails.length) throw new Error(`No user exists with given token`)

        record = userDetails[0];
    } catch (err) {
        // invalid token or user not found
        return next(new HttpException(GenericError.WrongAuthentication.error));
    }

    // hydrate user
    const hydratedUser = await hydrateUser({
        id: record.id,
        email: record.email,
        mobile: record.mobile,
    });

    // attach user and roles
    /**@ts-ignore */
    req.user = record;

    /**@ts-ignore */
    req.hydratedUser = hydratedUser;

    return next();
};