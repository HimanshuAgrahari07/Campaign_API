import { NextFunction, Response } from 'express';
import HttpException from 'exceptions/HttpException';
import * as jwt from 'jsonwebtoken'
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithNewUser from '../interfaces/users/requestWithNewUser.interface';
import { GenericError } from '../utils/const'
import runQuery from '../database/Database'

async function authMiddleware(request: RequestWithNewUser, response: Response, next: NextFunction) {
    const cookies = request.cookies;

    if (cookies && cookies.Authorization) {
        console.log(`[[cookies]] :: >> ${cookies.Authorization}`);
        const secret = process.env.JWT_SECRET;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const id = verificationResponse._id;
            const query = `SELECT EXISTS(SELECT 1 FROM users WHERE id = '${id}');`
            const user = await runQuery(query);
            if (user) {
                console.log(`[[PARSED_USER_FROM JWT]] :: >> ${user}`);
                request.user = user;
                next();
            } else {
                next(new HttpException(GenericError.WrongAuthentication.error));
            }
        } catch (error) {
            next(new HttpException(GenericError.WrongAuthentication.error));
        }
    } else {
        next(new HttpException(GenericError.AuthenticationTokenMissing.error));
    }
}

export default authMiddleware;
