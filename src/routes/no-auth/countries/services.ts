import runQuery from '../../../database/Database'
import { COUNTRIES_TABLE_NAME } from '../../../utils/const'

export const getAll = async () => {
    const query = `Select * from ${COUNTRIES_TABLE_NAME}`;
    return await runQuery(query)
}