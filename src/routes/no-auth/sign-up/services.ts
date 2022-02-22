import * as crypto from "crypto";
import { Request, Response, NextFunction } from 'express';
import { checkUserEmail, checkUserPhone, checkIfOrganisationExits } from '../../../utils/userCreation'
import * as query from '../../../database/DBQuery'
import hydrateUser from '../../../lib/hydrators/hydratorsUser'

export const SignUp = async (body: any, next: NextFunction) => {
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
    try {
        await checkUserEmail({ email });
        await checkUserPhone({ phone: mobile });
        if (organisationId) {
            await checkIfOrganisationExits({ organisationId })
        }

        if(organisation) {
            await checkIfOrganisationExits({ organisationId: NaN, uid: organisation.uid })
        }
    } catch (err) {
        console.error(err)
        return next(err);
    }

    const hashedPw = crypto.createHash("sha256").update(password).digest("hex");
    const isNewUser = !!organisation

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
        await query.addNewUser({
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
        await query.addNewUser({
            email,
            firstName,
            lastName,
            mobile,
            countryId,
            password: hashedPw,
            organisationId: organisationId
        })
    }

    return await hydrateUser({ email, mobile })
    // TODO: Send password to user via email
}