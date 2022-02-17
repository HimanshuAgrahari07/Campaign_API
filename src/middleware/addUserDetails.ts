import { NextFunction, Response, Request } from 'express';
import HttpException from '../exceptions/HttpException';
import { GenericError } from '../utils/const'
import hydrateUser from '../lib/hydrators/hydratorsUser'
import { getUser } from '../database/DBQuery';

export default async (req: Request, res: Response, next: NextFunction) => {
    /** @ts-ignore */
    const { decodedUserInfo } = req;
    console.log('[[decodedUserInfo]] >>>> ', decodedUserInfo)
    const { email } = decodedUserInfo;
    
    let record: any;

    try {
        const userDetails = await getUser({ email })

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