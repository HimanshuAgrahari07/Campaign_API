import { NextFunction, Response, Request } from 'express';
import HttpException from '../exceptions/HttpException';
import { decodeUserToken, verifyToken } from "../utils/jwt";
import { GenericError } from '../utils/const'

export default async (req: Request, res: Response, next: NextFunction) => {
    const authorization = (req.headers && req.headers.authorization)
        || (req.cookies && (req.cookies.Authorization || req.cookies.token))

    const token: string = (authorization && authorization.replace("Bearer ", ""));
    if (!token) {
        return next(new HttpException(GenericError.WrongAuthentication.error));
    }

    const isValidToken = verifyToken({ token })
    
    if (!isValidToken) {
        return next(new HttpException(GenericError.WrongAuthentication.error));
    } else {
        const decodedUserInfo = decodeUserToken({ token });
        /**@ts-ignore */
        req.decodedUserInfo = decodedUserInfo

        return next()
    }
};