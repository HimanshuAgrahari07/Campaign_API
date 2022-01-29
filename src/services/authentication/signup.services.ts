import { SignUpUserHydratedDto } from './../../dtos/signup.dto';
import OrganisationDto from './../../dtos/organization.dto'
import runQuery from './../../database/Database'
import { USERS_TABLE_NAME, ORGANIZATION_TABLE_NAME } from './../../utils/const'

class SignUpServices {
    constructor() {
    }

    addUser = async (body: SignUpUserHydratedDto) => {
        const keys = Object.keys(body)
        console.log(keys)
        const DEFAULT_PASSWORD = 'change123'
        const isNewUser = keys.includes('organisation')

        async function addNewUserToDB(object: SignUpUserHydratedDto) {
            const queryString = `INSERT IGNORE INTO ${USERS_TABLE_NAME} (
                email,
                firstName,
                lastName,
                mobile,
                countryId,
                password
            )
            VALUES(
                "${object.email}",
                "${object.firstName}",
                "${object.lastName}",
                "${object.mobile}",
                "${object.countryId}",
                "${DEFAULT_PASSWORD || 'Change123'}"
            );`

            return await runQuery(queryString)
        }

        async function addNewOrgsToDB(object: OrganisationDto) {
            const queryString = `INSERT IGNORE INTO ${ORGANIZATION_TABLE_NAME} (
                name,
                uid
            )
            VALUES(
                "${object.name}",
                "${object.uid}"
            );`

            return await runQuery(queryString)
        }

        async function addNewUserToExistingOrgs(object: SignUpUserHydratedDto) {
            const queryString = `INSERT IGNORE INTO ${USERS_TABLE_NAME} (
                firstName,
                lastName,
                email,
                password,
                countryId,
                mobile,
                organisationId
            )
            VALUES(
                "${body.firstName}",
                "${body.lastName}",
                "${body.email}",
                "${DEFAULT_PASSWORD || 'Change123'}"
                "${body.countryId}",
                "${body.mobile}",
                "${body.organisationId}"
            );`

            console.log(queryString)

            return await runQuery(queryString)
        }

        console.log('isNewUser ===> ', isNewUser)
        if (isNewUser) {
            // new user with new organization
            console.log(await addNewUserToDB(body))
            console.log(await addNewOrgsToDB(body.organisation))
            return true
        } else {
            // old user
            await addNewUserToExistingOrgs(body)
            return true
        }
        // TODO: Send password to user via email
    }
}

export default SignUpServices;