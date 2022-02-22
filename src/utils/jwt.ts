import * as moment from "moment";
import { IToken } from "interfaces";

/**@ts-ignore */
import * as config from "../configuration";
const jwt = require('jsonwebtoken');

export const createUserToken = ({ userInfo }: any) => {
    const exp = moment().add(config.jwt.user.expiration, "second").valueOf();

    const token = jwt.sign({
        sub: JSON.stringify(userInfo),
        iat: Date.now(),
        exp,
    }, config.jwt.user.secret);

    const refreshExp = moment()
        .add(config.jwt.user.refreshExpiration, "second")
        .valueOf();

    const refreshToken = jwt.sign(
        {
            sub: JSON.stringify(userInfo),
            iat: Date.now(),
            exp,
        },
        config.jwt.user.refreshSecret,
    );

    return {
        token,
        tokenExpires: exp,
        expiresIn: exp - moment().valueOf(),
        refreshToken,
        refreshTokenExpires: refreshExp,
        refreshTokenExpiresIn: refreshExp - moment().valueOf(),
    };
};
export const verifyToken = ({ token }: IToken) => {
    const verifiedAndDecodedToken = jwt.verify(token, config.jwt.user.secret);

    if (Date.now() >= verifiedAndDecodedToken.exp) {
        return false
    }

    return true
};

export const decodeUserToken = ({ token }: IToken) => {
    const decoded = jwt.decode(token, config.jwt.user.secret);
    const userInfo = JSON.parse(decoded.sub);
    return userInfo;
};

export const createPasswordResetToken = ({ userInfo }: any) => {
    const exp = moment()
        .add(config.jwt.forgotPassword.expiration, "second")
        .valueOf();

    const token = jwt.encode(
        {
            sub: JSON.stringify(userInfo),
            iat: Date.now(),
            exp,
        },
        config.jwt.forgotPassword.secret
    );

    return {
        token,
        tokenExpires: exp,
        expiresIn: exp - moment().valueOf(),
    };
};

export const decodePasswordResetToken = ({ token }: IToken) => {
    const decoded = jwt.decode(token, config.jwt.forgotPassword.secret);
    const userInfo = JSON.parse(decoded.sub);
    return userInfo;
};

export const createVerifyEmailToken = ({ userInfo }: any) => {
    const exp = moment()
        .add(config.jwt.verifyEmail.expiration, "second")
        .valueOf();

    const token = jwt.encode(
        {
            sub: JSON.stringify(userInfo),
            iat: Date.now(),
            exp,
        },
        config.jwt.verifyEmail.secret
    );

    return {
        token,
        tokenExpires: exp,
        expiresIn: exp - moment().valueOf(),
    };
};

export const decodeVerifyEmailToken = ({ token }: IToken) => {
    const decoded = jwt.decode(token, config.jwt.verifyEmail.secret);
    const userInfo = JSON.parse(decoded.sub);
    return userInfo;
};
