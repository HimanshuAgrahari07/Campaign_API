import runQuery from './Database'
import { getWhereQuery, getUpdateSetQueryString } from './queryHelper'
import { COUNTRIES_TABLE_NAME } from '../utils/const'

export const getCountry = async (params: any): Promise<any[]> => {
    const where = getWhereQuery(params)

    if (!where) return []
    return runQuery(`SELECT * FROM ${COUNTRIES_TABLE_NAME} WHERE ${where}`)
}