import { NextFunction, Response, Request } from 'express';
import HttpException from '../exceptions/HttpException';
import { decodeUserToken, verifyToken } from "../utils/jwt";
import { GenericError } from '../utils/const'
const _ = require("lodash");

export default async (req: Request, res: Response, next: NextFunction) => {
    const authorization = (req.headers && req.headers.authorization)
        || (req.cookies && (req.cookies.Authorization || req.cookies.token))

    const token: string = (authorization && authorization.replace("Bearer ", ""));
    if (!token) {
        return next(new HttpException(GenericError.WrongAuthentication.error));
    }

    const decodedUserInfo = decodeUserToken(token);
    if (_.isEmpty(decodedUserInfo)) {
        return next(new HttpException(GenericError.WrongAuthentication.error));
    } else {
        /**@ts-ignore */
        req.decodedUserInfo = decodedUserInfo
    }
    return next()
};