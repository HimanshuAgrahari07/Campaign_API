import runQuery from '../../../database/Database'
import { COUNTRIES_TABLE_NAME } from '../../../utils/const'
import { getUser, getOrganisation, getOrganisationById } from '../../../database/DBQuery'

export const getOne = async (id: number) => {
    return await getOrganisationById(id)
}