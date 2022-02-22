// libs
import { createError } from "../errors/createError";
import { getUser, getOrganisation, getOrganisationById } from '../database/DBQuery'


export const getUserIfExists = async ({ id, email, phone }: { id?: number, email?: string, phone?: string }) => {
    // skip if email is null
    if (!(id || email || phone)) {
        console.info('None of these provided', JSON.stringify({ id, email, phone }))
    }; // if none provided, return

    return await getUser({ userId: id, email, mobile: phone })
};

export const checkUserEmail = async ({ email }: { email: string }) => {
    // skip if email is null
    if (!email) return;

    const userList = await getUserIfExists({ email })

    if (userList.length) {
        throw createError({
            statusCode: 400,
            errorEnum: "EMAIL_TAKEN",
            message: `The email ${email} is already in use.`,
        });
    }
};

export const checkUserPhone = async ({ phone }: { phone: string }) => {
    // skip if phone is null
    if (!phone) return;

    const userList = await getUserIfExists({ phone })

    if (userList.length) {
        throw createError({
            statusCode: 400,
            errorEnum: "PHONE_NUMBER_TAKEN",
            message: `The phone number ${phone} is already in use.`,
        });
    }
};

export const checkIfOrganisationExits = async ({ organisationId, uid }: { organisationId: number, uid?: string }) => {
    if (organisationId) {
        const organisation = await getOrganisationById(organisationId)

        if (!organisation.length) {
            throw createError({
                statusCode: 400,
                errorEnum: "ORGANISATION_NOT_REGISTERED",
                message: `The organisation doesn't exist with id: ${organisationId}`,
            });
        }
    }

    if (uid) {
        const organisation = await getOrganisationById(NaN, uid)

        if (organisation.length) {
            throw createError({
                statusCode: 400,
                errorEnum: "ORGANISATION_ALREADY_REGISTERED",
                message: `The organisation already exist with uid: ${uid}`,
            });
        }
    }
};