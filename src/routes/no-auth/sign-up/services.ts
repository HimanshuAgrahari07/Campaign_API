import * as crypto from "crypto";
import { Request, Response, NextFunction } from 'express';
import { checkUserEmail, checkUserPhone, checkIfOrganisationExits } from '../../../utils/userCreation'
import * as query from '../../../database/DBQuery'
import hydrateUser from '../../../lib/hydrators/hydratorsUser'
import { createError, ErrorType } from "../../../errors/createError";
import { getHashedPassword } from "../../../utils/helper";

export const SignUp = async (body: any) => {
    const {
        email,
        firstName,
        lastName,
        mobile,
        countryId,
        organisationId,
        organisation,
        password = 'Change123',
    } = body

    // validate
    // check for duplicate email, phone
    await checkUserEmail({ email });
    await checkUserPhone({ phone: mobile });
    if (organisationId) {
        await checkIfOrganisationExits({ organisationId })
    }

    if (organisation) {
        await checkIfOrganisationExits({ organisationId: NaN, uid: organisation.uid })
    }

    const hashedPw = getHashedPassword(password);
    const isNewUser = !!organisation

    let responseFromDB;

    if (isNewUser) {
        // create new orgs
        const response = await query.createNewOrganisation({
            name: organisation && organisation.name,
            uid: organisation && organisation.uid
        })

        const insertId = response.insertId
        // get orgs for the identifier
        const organisationList = await query.getOrganisationById(insertId)

        // new user with new organization
        responseFromDB = await query.addNewUser({
            email,
            firstName,
            lastName,
            mobile,
            countryId,
            password: hashedPw,
            organisationId: organisationList[0].id
        })
    } else {
        // old user
        responseFromDB = await query.addNewUser({
            email,
            firstName,
            lastName,
            mobile,
            countryId,
            password: hashedPw,
            organisationId: organisationId
        })
    }

    if (responseFromDB.affectedRows !== 1) {
        return createError({
            statusCode: 500,
            message: 'Failed to create user',
            errorEnum: ''
        })
    }

    return await hydrateUser({ id: responseFromDB.insertId })

    // TODO: Send password to user via email
}