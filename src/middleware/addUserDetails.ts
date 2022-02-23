import { NextFunction, Response, Request } from 'express';
import hydrateUser from '../lib/hydrators/hydratorsUser'
import { getUser } from '../database/DBQuery';
import { createError, ErrorType } from '../errors/createError';

export default async (req: Request, res: Response, next: NextFunction) => {
    /** @ts-ignore */
    const { decodedUserInfo = {} } = req;
    console.log('[[decodedUserInfo]] >>>> ', decodedUserInfo)
    const email = decodedUserInfo.email || req.body.email

    let record: any;

    const userDetails = await getUser({ email })
    if (!userDetails.length) next(createError(ErrorType.WRONG_CREDENTIALS))

    record = userDetails[0];

    // hydrate user
    const hydratedUser = await hydrateUser({
        record
    });

    // attach user and roles
    /**@ts-ignore */
    req.user = record;

    /**@ts-ignore */
    req.hydratedUser = hydratedUser;

    return next();
};