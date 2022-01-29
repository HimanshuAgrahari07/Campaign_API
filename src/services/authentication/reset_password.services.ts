import SignUpUserDto from './../../dtos/signup.dto';
import runQuery from './../../database/Database'
import { USERS_TABLE_NAME, ORGANIZATION_TABLE_NAME } from './../../utils/const'

class ResetPasswordServices {
    constructor() {
    }

    private query = async (query: string, parameters?: any[]): Promise<any> => {
        return await runQuery(query, parameters)
    }

    addUser = async (body: SignUpUserDto) => {
        const keys = Object.keys(body)
        let query;

        console.log(keys)

        const isNewUser = keys.includes('organisation')

        console.log('isNewUser ===> ', isNewUser)
        if (isNewUser) {
            // new user with new organization
            query = `BEGIN;
            INSERT IGNORE INTO ${USERS_TABLE_NAME} (
                email,
                firstName,
                lastName,
                mobile,
                countryId,
                password
            )
            VALUES(
                "${body.email}",
                "${body.firstName}",
                "${body.lastName}",
                "${body.mobile}",
                "${body.countryId}",
                "${body.password || 'Change123'}"
            );

            INSERT IGNORE INTO ${ORGANIZATION_TABLE_NAME} (
                name,
                uid
            )
            VALUES(
                "${body.organisation.name}",
                "${body.organisation.uid}"
            );

            COMMIT;`

            return await this.query(query)
        } else {
            // old user
            query = `BEGIN;
            INSERT IGNORE INTO ${USERS_TABLE_NAME} (
                firstName,
                lastName,
                email,
                password,
                countryId,
                mobile,
                organisationId,
                role
            )
            VALUES(
                "${body.firstName}",
                "${body.lastName}",
                "${body.email}",
                "${body.password || 'Change123'}"
                "${body.countryId}",
                "${body.mobile}",
                "${body.organisationId}",
                "${body.role}"
            );
            COMMIT;`

            return await this.query(query)
        }
    }
}

export default ResetPasswordServices;