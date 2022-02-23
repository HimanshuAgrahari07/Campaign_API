import * as query from '../../database/DBQuery'
import * as queryCountry from '../../database/DBQueryCountry'

import { USERS_TABLE_NAME, ORGANIZATION_TABLE_NAME, COUNTRIES_TABLE_NAME } from '../../utils/const'
import { IUser, IHydrator, IHydrateUser } from '../../interfaces/index'


export default async ({ record, id }: IHydrator) => {
    if(!(record || id)) return null;

    if (!record) {
        const user = await query.getUser({ id });
        record = user[0];
    }

    if (!record) { return null; } // return if still no record

    /******** Get organisations */
    const organisationId = record.organisationId;
    const organization = await query.getOrganisation({ id: organisationId });

    //******** Get country */
    const countryId = record.countryId;
    const country = await queryCountry.getCountry({ id: countryId });

    // const outCountryDetails = _.pick(userDetails, Object.keys(new UserDto().country));
    const out: IHydrateUser = {
        ...record,
        organisation: organization[0],
        country: country[0]
    };

    delete out.password
    return out
};
