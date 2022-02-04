const _ = require("lodash");

import runQuery from '../../database/Database'
import { USERS_TABLE_NAME, ORGANIZATION_TABLE_NAME, COUNTRIES_TABLE_NAME } from '../../utils/const'
import { IUser, IHydrateUser } from '../../interfaces/index'
import { IHydrateUserParameters } from '../../interfaces';

export default async (params: IHydrateUserParameters) => {
    const validValues = Object.entries(params).filter(e => e[0])
    const where = validValues.map(e => `${e[0]}='${e[1]}'`).join(' OR ')

    const userDetails = await runQuery(`SELECT * 
                                    FROM ${USERS_TABLE_NAME || 'users'}
                                    WHERE ${where};`);
    const userDetail: any = userDetails[0];


    /******** Get organisations */

    const organisationId = userDetail.organisationId;
    const organization = await runQuery(`SELECT * 
                                    FROM ${ORGANIZATION_TABLE_NAME || 'organisations'}
                                    WHERE id = '${organisationId}';`);
    // const outOrganisationDetails = _.pick(userDetails, []);
    //******** Get country */
    const countryId = userDetail.countryId;
    const country = await runQuery(`SELECT * 
                                    FROM ${COUNTRIES_TABLE_NAME || 'countries'}
                                    WHERE id = '${countryId}';`);

    // const outCountryDetails = _.pick(userDetails, Object.keys(new UserDto().country));
    const out: IHydrateUser = {
        ...userDetail,
        organisation: organization[0],
        country: country[0]
    };

    delete out.password
    return out
};
